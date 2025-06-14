import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

async function ensureAdmin() {
  const { userId } = auth();
  if (!userId) return { status: 401 };
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== 'admin') return { status: 403 };
  return { status: 200 };
}

export async function GET() {
  const check = await ensureAdmin();
  if (check.status !== 200)
    return NextResponse.json({ error: 'Unauthorized' }, { status: check.status });

  const items = await prisma.orderItem.findMany({
    where: { order: { status: 'completed' } },
    include: { product: { select: { name: true } } }
  });

  const stats = {};
  for (const item of items) {
    if (!stats[item.productId]) {
      stats[item.productId] = { name: item.product.name, revenue: 0, quantity: 0 };
    }
    stats[item.productId].revenue += item.price * item.quantity;
    stats[item.productId].quantity += item.quantity;
  }

  const topProducts = Object.values(stats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return NextResponse.json({ topProducts });
}
