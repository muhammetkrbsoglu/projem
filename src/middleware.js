// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public route'lar
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/about",
  "/contact",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  if (
    isAdminRoute(req) &&
    (await auth()).sessionClaims?.publicMetadata?.role !== "admin"
  ) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute(req)) {
    // Giriş yapmamışsa ve public olmayan bir route’a gelmişse
    if (!userId && !isPublicRoute(req)) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Admin sayfaları (/admin/*) kontrolü
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const isAdmin = sessionClaims?.publicMetadata?.role === "admin";
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",  // _next ve statik dosyalar hariç
    "/(api|trpc)(.*)",         // API ve TRPC için
  ],
};