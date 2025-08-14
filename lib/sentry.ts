import * as Sentry from '@sentry/nextjs';

// Only initialize Sentry if DSN is provided
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    debug: process.env.NODE_ENV === 'development',
  });
} else {
  console.warn('Sentry DSN not configured. Error tracking disabled.');
}

export { Sentry }; 