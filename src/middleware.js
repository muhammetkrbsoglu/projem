import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Public route'ları tanımla
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

// Admin route'ları tanımla
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Eğer public route ise devam et
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  // Eğer admin route ise ve user admin değilse anasayfaya yönlendir
  if (isAdminRoute(req) && sessionClaims?.metadata?.role !== "admin") {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  // Eğer giriş yapmamışsa ve public route değilse buraya düşer
  if (!userId) {
    return redirectToSignIn();
  }

  return NextResponse.next();
});

export const config = {
  matcher: '/:path*',
};
