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

  const { sessionClaims } = auth();

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = sessionClaims?.publicMetadata?.isAdmin;
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: '/:path*',
};
