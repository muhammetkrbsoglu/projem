import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const { id } = params;
    const data = await request.json();

    // Validate required fields
    if (!data.name?.trim()) {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      );
    }

    // Check if a group with this name already exists (excluding the current group)
    const existingGroup = await prisma.categoryGroup.findFirst({
      where: {
        name: data.name.trim(),
        NOT: { id },
      },
    });

    if (existingGroup) {
      return NextResponse.json(
        { error: 'A group with this name already exists' },
        { status: 400 }
      );
    }

    const group = await prisma.categoryGroup.update({
      where: { id },
      data: {
        name: data.name.trim(),
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error updating category group:', error);
    return NextResponse.json(
      { error: 'Failed to update category group' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // First check if the group has any categories
    const group = await prisma.categoryGroup.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Category group not found' },
        { status: 404 }
      );
    }

    if (group.categories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete group that has categories' },
        { status: 400 }
      );
    }

    await prisma.categoryGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category group:', error);
    return NextResponse.json(
      { error: 'Failed to delete category group' },
      { status: 500 }
    );
  }
}
