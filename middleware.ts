import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

// Protected routes that require authentication
const protectedRoutes = ["/dashboard"];
const adminRoutes = ["/admin"];

// Public routes that are always accessible
const publicRoutes = ["/", "/login"];

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // If user is authenticated and tries to access login, redirect to dashboard
    if (token && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Check if accessing protected route without authentication
    if (
      protectedRoutes.some((route) => pathname.startsWith(route)) &&
      !token
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if accessing admin route without authentication
    if (
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      !token
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // For protected routes, token must exist
        const isProtected = ["/dashboard"].some((route) =>
          req.nextUrl.pathname.startsWith(route)
        );

        if (isProtected) {
          return !!token;
        }

        // Public routes are always authorized
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
