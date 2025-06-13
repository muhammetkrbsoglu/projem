import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

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
  const messages = await prisma.message.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ messages });
}

export async function POST(request) {
  const check = await ensureAdmin();
  if (check.status !== 200) return NextResponse.json({ error: 'Unauthorized' }, { status: check.status });
  const { id, reply } = await request.json();
  const message = await prisma.message.findUnique({
    where: { id },
    include: { user: true }
  });
  if (!message) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (reply) {
    try {
      await sendEmail({
        to: message.user.email,
        subject: `Re: ${message.subject}`,
        text: reply
      });
      await prisma.message.update({ where: { id }, data: { status: 'answered' } });
    } catch (e) {
      return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
    }
  }
  return NextResponse.json({ success: true });
}
