import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// POST: User creates an order
export async function POST(request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  // Example: { products: [productId1, productId2], ... }
  const order = await prisma.order.create({
    data: {
      userId,
      ...data,
    },
  });
  return NextResponse.json({ order });
}
