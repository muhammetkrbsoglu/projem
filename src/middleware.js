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

const isAdminRoute = createRouteMatcher('/admin(.*)');

export default clerkMiddleware(async (auth, req) => {
  // Public route ise devam et
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  const { sessionClaims } = auth();

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = sessionClaims?.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: '/:path*',
};
