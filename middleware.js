import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/about',
    '/contact',
    '/products(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/forgot-password(.*)',
    '/reset-password(.*)',
    '/api/webhooks/clerk(.*)',
  ],
});

export const config = {
  matcher: '/((?!_next).*)',
};
