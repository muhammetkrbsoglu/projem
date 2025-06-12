import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

// GET: List all products
export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const products = await prisma.product.findMany({ include: { categories: true } });
  return NextResponse.json({ products });
}

// POST: Add a product
export async function POST(request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const data = await request.json();
  const product = await prisma.product.create({ data });
  return NextResponse.json({ product });
}

// PATCH: Edit a product
export async function PATCH(request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id, ...data } = await request.json();
  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ product });
}

// DELETE: Delete a product
export async function DELETE(request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const { id } = await request.json();
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
