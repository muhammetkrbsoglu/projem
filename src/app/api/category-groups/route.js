import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await prisma.categoryGroup.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching category groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category groups' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.name?.trim()) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    // Check if a group with this name already exists
    const existingGroup = await prisma.categoryGroup.findFirst({
      where: {
        name: data.name.trim(),
      },
    });

    if (existingGroup) {
      return NextResponse.json(
        { error: 'A group with this name already exists' },
        { status: 400 }
      );
    }

    const group = await prisma.categoryGroup.create({
      data: {
        name: data.name.trim(),
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error creating category group:', error);
    return NextResponse.json(
      { error: 'Failed to create category group' },
      { status: 500 }
    );
  }
}
