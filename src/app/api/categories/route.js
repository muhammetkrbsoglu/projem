import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        group: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Ensure we always return an array
    return NextResponse.json(Array.isArray(categories) ? categories : []);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json([], { status: 500 }); // Return empty array on error
  }
}

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, groupId } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        group: groupId
          ? {
              connect: { id: groupId },
            }
          : undefined,
      },
      include: {
        group: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
