const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const TOKEN_TTL = '7d';

// Falls back to a random secret generated once at process start when
// JWT_SECRET is unset, so auth works locally without extra setup — the same
// "degrade with a warning" pattern the rest of the backend already uses for
// Mongo/Redis/Grok. This is a dev convenience only: it invalidates every
// token on restart and must never be relied on in production, where
// JWT_SECRET is required.
let devSecret = null;
function getSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  if (!devSecret) {
    devSecret = crypto.randomBytes(48).toString('hex');
    console.warn(
      '⚠️  JWT_SECRET not set — using a random secret for this process only. ' +
        'Existing tokens will stop working on restart. Set JWT_SECRET in backend/.env before deploying.'
    );
  }
  return devSecret;
}

function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, getSecret(), { expiresIn: TOKEN_TTL });
}

/** Returns the decoded payload, or null if the token is missing/invalid/expired. */
function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, getSecret());
  } catch (error) {
    return null;
  }
}

module.exports = { signToken, verifyToken };
