import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Login required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeOutOfStock = searchParams.get('includeOutOfStock') === 'true';
    const categoryId = searchParams.get('category');
    const search = searchParams.get('search');

    const where = {
      ...(categoryId && { categoryId }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(!includeOutOfStock && { stock: { gt: 0 } }),
    };    const products = await prisma.product.findMany({
      where,
      include: {
        categories: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
      metadata: {
        total: products.length
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Login required' },
        { status: 401 }
      );
    }    // All authenticated users can manage products
    if (!userId) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          details: 'Login required to manage products'
        },
        { status: 401 }
      );
    }

    const data = await request.json();    
    
    // Validate required fields
    const validationErrors = [];
    if (!data.name?.trim()) {
      validationErrors.push('Product name is required');
    }
    if (typeof data.price !== 'number' || data.price < 0) {
      validationErrors.push('Price must be a non-negative number');
    }
    if (typeof data.stock !== 'number' || data.stock < 0) {
      validationErrors.push('Stock must be a non-negative number');
    }
    if (!data.categoryId) {
      validationErrors.push('Category is required');
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: 'Invalid category', details: 'The specified category does not exist' },
        { status: 400 }
      );
    }

    const productData = {
      name: data.name.trim(),
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      photoUrl: data.photoUrl,
    };

    const product = await prisma.product.create({
      data: {
        ...productData,
        categories: {
          connect: [{ id: data.categoryId }]
        }
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
