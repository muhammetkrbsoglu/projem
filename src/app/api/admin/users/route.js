import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id, role } = await request.json();
  if (!id || !role) {
    return NextResponse.json({ error: 'User id and role are required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });

    await clerkClient.users.updateUserMetadata(user.clerkId, {
      publicMetadata: { role, isAdmin: role === 'admin' }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
