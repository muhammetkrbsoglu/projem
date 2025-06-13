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
  if (check.status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status: check.status });
  const groups = await prisma.categoryGroup.findMany();
  return NextResponse.json({ groups });
}

export async function POST(request) {
  const check = await ensureAdmin();
  if (check.status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status: check.status });
  const data = await request.json();
  const group = await prisma.categoryGroup.create({ data });
  return NextResponse.json({ group });
}

export async function PATCH(request) {
  const check = await ensureAdmin();
  if (check.status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status: check.status });
  const { id, ...data } = await request.json();
  const group = await prisma.categoryGroup.update({ where: { id }, data });
  return NextResponse.json({ group });
}

export async function DELETE(request) {
  const check = await ensureAdmin();
  if (check.status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status: check.status });
  const { id } = await request.json();
  await prisma.categoryGroup.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
