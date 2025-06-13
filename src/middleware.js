// middleware.js
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Oturum gerektirmeyen (public) yollar
const publicRoutes = createRouteMatcher([
  '/',                    // anasayfa
  '/sign-in(.*)',         // giriş
  '/sign-up(.*)',         // kayıt
  '/login(.*)',           // alternatif giriş
  '/register(.*)',        // alternatif kayıt
  '/about',               // hakkımızda
  '/contact',             // iletişim
  '/products(.*)',        // ürün listeleri
  '/api/webhooks/clerk(.*)',  // Clerk webhook’ları
  '/api/categories(.*)',  // kategori API
  '/api/products(.*)',    // ürün API
]);

export default clerkMiddleware(async (auth, req) => {
  // Public rotaysa, doğrudan geçiş
  if (publicRoutes(req)) {
    return NextResponse.next();
  }

  // Diğer tüm rotalar için giriş kontrolü
  await auth.protect();

  return NextResponse.next();
});

export const config = {
  matcher: [
    // _next içindekiler, statik dosyalar ve uzantılı dosyalar hariç
    '/((?!_next/static|_next/image|favicon\\.ico|.+\\..+).*)',
    // API ve TRPC rotaları da bu middleware’den geçecek
    '/(api|trpc)(.*)'
  ]
};
