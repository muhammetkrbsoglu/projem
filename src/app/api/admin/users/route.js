import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

async function isAdmin(userId) {
  try {
    const dbUser = await prisma.user.findFirst({
      where: { clerkId: userId },
    });
    return dbUser?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

async function getClerkUsers(userIds) {
  try {
    return await clerkClient.users.getUserList({
      userId: userIds,
    });
  } catch (error) {
    console.error('Error fetching Clerk users:', error);
    return [];
  }
}

// GET: List all users
export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const admin = await isAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get users from our database
    const dbUsers = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get additional user info from Clerk
    const clerkUsers = await getClerkUsers(dbUsers.map(user => user.clerkId));
    
    // Merge Clerk data with our database data
    const users = dbUsers.map(dbUser => {
      const clerkUser = clerkUsers.find(cu => cu.id === dbUser.clerkId);
      return {
        ...dbUser,
        imageUrl: clerkUser?.imageUrl,
        username: clerkUser?.username,
        lastSignInAt: clerkUser?.lastSignInAt,
        // Add any other Clerk user fields you want to expose
      };
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH: Update user role
export async function PATCH(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const admin = await isAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId: targetUserId, role } = await request.json();
    if (!targetUserId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prevent changing own role
    const adminUser = await prisma.user.findFirst({
      where: { clerkId: userId },
    });
    if (adminUser.id === targetUserId) {
      return NextResponse.json(
        { error: 'Cannot change your own role' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error in PATCH /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a user
export async function DELETE(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const admin = await isAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await request.json();

    // Don't allow deleting self
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (targetUser.clerkId === userId) {
      return NextResponse.json(
        { error: 'Cannot delete own account' },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
