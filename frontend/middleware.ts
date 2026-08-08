import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

// The dashboard is the only page that is useless signed out — everything else,
// including /generate, stays open to anonymous visitors by design.
//
// A plain pathname check rather than Clerk's createRouteMatcher: that helper is
// deprecated in Core 3 and logs a warning on every request, and a single route
// prefix does not need a matcher library.
function isProtectedRoute(req: NextRequest): boolean {
  return req.nextUrl.pathname.startsWith('/dashboard');
}

export default clerkMiddleware(async (auth, req) => {
  if (!isProtectedRoute(req)) return;

  // redirectToSignIn rather than auth.protect(): protect() renders a 404 for
  // signed-out visitors here, which is indistinguishable from a broken link.
  // returnBackUrl sends them to the dashboard once they finish signing in.
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
};
