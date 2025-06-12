import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// GET: List all orders
export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const orders = await prisma.order.findMany({ include: { user: true, products: true } });
  return NextResponse.json({ orders });
}

// DELETE: Delete an order
export async function DELETE(request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  await prisma.order.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
