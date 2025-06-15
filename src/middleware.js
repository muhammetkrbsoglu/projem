import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const publicRoutes = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/login(.*)',
  '/register(.*)',
  '/about',
  '/contact',
  '/products(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/categories(.*)',
  '/api/products(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (publicRoutes(req)) {
    return NextResponse.next();
  }


  return NextResponse.next();
});

export const config = {
  matcher: '/:path*',
};
