import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Login required' },
        { status: 401 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        categories: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Not found', details: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
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

    const updates = await request.json();
    
    // Validate updates
    const validationErrors = [];
    if ('price' in updates && (typeof updates.price !== 'number' || updates.price < 0)) {
      validationErrors.push('Price must be a non-negative number');
    }
    if ('stock' in updates && (typeof updates.stock !== 'number' || updates.stock < 0)) {
      validationErrors.push('Stock must be a non-negative number');
    }
    if ('name' in updates && !updates.name?.trim()) {
      validationErrors.push('Product name cannot be empty');
    }
    
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...updates,
        ...(updates.name && { name: updates.name.trim() })
      },
      include: {
        categories: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Not found', details: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
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

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Not found', details: 'Product not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
