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
// Bu middleware, Clerk ile kimlik doğrulama ve yetkilendirme işlemlerini yönetir.
// Public rotalar için erişime izin verir, diğer tüm rotalarda kullanıcıyı korur.
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const adminRoutes = createRouteMatcher([
  '/admin(.*)',
  '/api/admin/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Only allow admins on /admin and /api/admin/*
  const url = req.nextUrl.pathname;
  if (adminRoutes(req)) {
    await auth.protect(); // must be signed in
    const user = auth.user;
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return new Response('Forbidden', { status: 403 });
    }
  }
  return Response.next();
});

export const config = {
  matcher: ['/admin(.*)', '/api/admin/(.*)'],
};


// =============================================================
// File: pages/_app.js
// Wrap app with ClerkProvider and include the global Navbar
// =============================================================
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <Navbar />
      <Component {...pageProps} />
    </ClerkProvider>
  );
}


// =============================================================
// File: components/Navbar.js
// Show "Admin Panel" link if signed-in user is admin
// =============================================================
import Link from 'next/link';
import { useUser, useSignOut } from '@clerk/nextjs';

export default function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useSignOut();
  const isAdmin = isLoaded && isSignedIn && user.publicMetadata?.role === 'admin';

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link href="/">Home</Link> |{' '}
      <Link href="/products">Products</Link> |{' '}
      <Link href="/about">About</Link> |{' '}
      <Link href="/contact">Contact</Link> |{' '}
      {isSignedIn ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <>
          <Link href="/sign-in">Sign In</Link> |{' '}
          <Link href="/sign-up">Sign Up</Link>
        </>
      )}
      {isAdmin && (
        <> | <Link href="/admin">Admin Panel</Link></>
      )}
    </nav>
  );
}