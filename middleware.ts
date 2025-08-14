import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    // Your middleware logic here
    return NextResponse.next();
  } catch (error) {
    // Only log to Sentry if it's configured
    if (process.env.SENTRY_DSN) {
      // Import Sentry only when needed
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.captureException(error);
      });
    } else {
      console.error('Middleware error:', error);
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Add your matchers here
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};