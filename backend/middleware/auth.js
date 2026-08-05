const { verifyToken } = require('../utils/jwt');

function extractToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token ? token : null;
}

/** Rejects the request with 401 unless a valid token is present. */
function requireAuth(req, res, next) {
  const payload = verifyToken(extractToken(req));

  if (!payload) {
    return res.status(401).json({
      success: false,
      message: 'Sign in required.',
      error: 'UNAUTHENTICATED'
    });
  }

  req.userId = payload.sub;
  next();
}

/** Populates req.userId when a valid token is present; never blocks the request. */
function optionalAuth(req, res, next) {
  const payload = verifyToken(extractToken(req));
  if (payload) req.userId = payload.sub;
  next();
}

module.exports = { requireAuth, optionalAuth };
