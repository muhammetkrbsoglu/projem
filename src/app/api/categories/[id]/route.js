import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request, { params }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, groupId } = await request.json();
  if (!name) {
    return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
  }

  try {
    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        ...(groupId ? { group: { connect: { id: groupId } } } : {}),
      },
      include: { group: true },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
