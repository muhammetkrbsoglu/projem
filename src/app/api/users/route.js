import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  // This route is no longer needed - only return 404
  return NextResponse.json(
    { error: 'Not Found' },
    { status: 404 }
  );
}

export async function PATCH(request) {
  // This route is no longer needed - only return 404 
  return NextResponse.json(
    { error: 'Not Found' },
    { status: 404 }
  );
}
