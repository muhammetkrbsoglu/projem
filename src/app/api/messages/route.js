import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Login required' },
        { status: 401 }
      );
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'User not found', details: 'User could not be retrieved' },
        { status: 404 }
      );
    }

    const { subject, message: content, productId } = await request.json();

    // Validate required fields
    const validationErrors = [];
    if (!content?.trim()) {
      validationErrors.push('Message content is required');
    }
    if (content?.length > 1000) {
      validationErrors.push('Message content must be less than 1000 characters');
    }
    if (subject?.length > 200) {
      validationErrors.push('Subject must be less than 200 characters');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // If productId is provided, verify it exists
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          {
            error: 'Invalid product',
            details: 'The specified product does not exist',
          },
          { status: 400 }
        );
      }
    }

    const newMessage = await prisma.message.create({
      data: {
        subject: subject?.trim() || 'No Subject',
        content: content.trim(),
        productId,
        userId: userId,
        status: 'unread',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', details: 'Login required' },
        { status: 401 }
      );
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'User not found', details: 'User could not be retrieved' },
        { status: 404 }
      );
    }

    // Users can only see their own messages
    const url = new URL(request.url);
    const where = {
      userId,
      ...(url.searchParams.get('status') && {
        status: url.searchParams.get('status'),
      }),
    };

    const messages = await prisma.message.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}