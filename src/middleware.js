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

  const { sessionClaims, userId, redirectToSignIn } = await auth();

  // Giriş yapılmamışsa giriş sayfasına yönlendir
  if (!userId) {
    return redirectToSignIn();
  }

  // Admin route kontrolü
  if (isAdminRoute(req)) {
    const isAdmin = sessionClaims?.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: '/:path*',
};
