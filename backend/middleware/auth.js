/**
 * Clerk-backed auth.
 *
 * The frontend runs on a different origin, so Clerk's session cookie is not
 * sent with API calls. The client attaches the session token as
 * `Authorization: Bearer <token>` (see frontend/lib/use-api.ts) and Clerk's
 * clerkMiddleware() — mounted once in server.js — verifies it and populates the
 * request's auth object.
 *
 * req.userId is set to the Clerk user id (`user_…`). Every controller reads
 * identity from here and never from the request body or query string, which is
 * what keeps one user from touching another user's projects.
 */

const { getAuth } = require('@clerk/express');

/** Reads the verified Clerk user id, or null when the caller is signed out. */
function clerkUserId(req) {
  try {
    return getAuth(req)?.userId || null;
  } catch (error) {
    // getAuth throws when clerkMiddleware() has not run for this request.
    console.warn('⚠️  getAuth failed — is clerkMiddleware mounted?', error.message);
    return null;
  }
}

/** Rejects the request with 401 unless a valid Clerk session is present. */
function requireAuth(req, res, next) {
  const userId = clerkUserId(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Sign in required.',
      error: 'UNAUTHENTICATED'
    });
  }

  req.userId = userId;
  next();
}

/** Populates req.userId when signed in; never blocks the request. */
function optionalAuth(req, res, next) {
  const userId = clerkUserId(req);
  if (userId) req.userId = userId;
  next();
}

module.exports = { requireAuth, optionalAuth };
