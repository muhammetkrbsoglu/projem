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

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await isAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get counts
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
    ]);

    // Get total revenue
    const revenue = await prisma.order.aggregate({
      where: {
        status: 'completed',
      },
      _sum: {
        total: true,
      },
    });
    const totalRevenue = revenue._sum.total || 0;

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Get recent users
    const recentDbUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        clerkId: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Get Clerk data for recent users
    const clerkUsers = await clerkClient.users.getUserList({
      userId: recentDbUsers.map(u => u.clerkId),
    });

    const recentUsers = recentDbUsers.map(dbUser => {
      const clerkUser = clerkUsers.find(cu => cu.id === dbUser.clerkId);
      return {
        ...dbUser,
        imageUrl: clerkUser?.imageUrl,
      };
    });

    // Get sales data for the chart (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
        status: 'completed',
      },
      _sum: {
        total: true,
      },
    });

    const formattedSalesData = salesData.map(data => ({
      date: data.createdAt.toISOString().split('T')[0],
      amount: data._sum.total || 0,
    }));

    return NextResponse.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      recentOrders,
      recentUsers,
      salesData: formattedSalesData,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/dashboard:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
