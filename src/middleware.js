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

export default clerkMiddleware(async (auth, req) => {
  // Public route ise devam et
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: '/:path*',

  const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  if (
    isAdminRoute(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "admin"
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  if (!userId && !isPublicRoute(req)) {
    // Add custom logic to run before redirecting
  }
})

};
