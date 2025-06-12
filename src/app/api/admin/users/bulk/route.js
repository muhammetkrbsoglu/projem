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

export async function POST(request) {
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

    const { userIds, action } = await request.json();
    
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'Invalid user IDs' }, { status: 400 });
    }

    if (!['suspend', 'activate', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Get users from database to get their Clerk IDs
    const dbUsers = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, clerkId: true },
    });

    if (action === 'delete') {
      // Delete users from Clerk
      await Promise.all(
        dbUsers.map(user => 
          clerkClient.users.deleteUser(user.clerkId).catch(err => 
            console.error(`Failed to delete Clerk user ${user.clerkId}:`, err)
          )
        )
      );

      // Delete users from our database
      await prisma.user.deleteMany({
        where: { id: { in: userIds } },
      });
    } else {
      // Update user status in Clerk
      await Promise.all(
        dbUsers.map(user =>
          clerkClient.users.updateUser(user.clerkId, {
            publicMetadata: {
              status: action === 'suspend' ? 'suspended' : 'active',
            },
          }).catch(err =>
            console.error(`Failed to update Clerk user ${user.clerkId}:`, err)
          )
        )
      );

      // Update status in our database
      await prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: { status: action === 'suspend' ? 'suspended' : 'active' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in bulk user action:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
