/**
 * @jest-environment node
 */
process.env.JWT_SECRET = 'test-secret-for-unit-tests';

const bcrypt = require('bcryptjs');
const { signToken, verifyToken } = require('../utils/jwt');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const mockRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('jwt', () => {
  it('round-trips the user id', () => {
    const token = signToken('507f1f77bcf86cd799439011');
    expect(verifyToken(token).sub).toBe('507f1f77bcf86cd799439011');
  });

  it('rejects a tampered token', () => {
    const token = signToken('user-a');
    // Flip the payload segment; the signature no longer matches.
    const [h, , s] = token.split('.');
    const forged = `${h}.${Buffer.from(JSON.stringify({ sub: 'user-b' })).toString('base64url')}.${s}`;
    expect(verifyToken(forged)).toBeNull();
  });

  it('rejects garbage and empty input', () => {
    expect(verifyToken('not-a-token')).toBeNull();
    expect(verifyToken('')).toBeNull();
    expect(verifyToken(undefined)).toBeNull();
  });

  it('rejects a token signed with a different secret', () => {
    const jwt = require('jsonwebtoken');
    expect(verifyToken(jwt.sign({ sub: 'x' }, 'some-other-secret'))).toBeNull();
  });

  it('rejects an expired token', () => {
    const jwt = require('jsonwebtoken');
    const expired = jwt.sign({ sub: 'x' }, process.env.JWT_SECRET, { expiresIn: -10 });
    expect(verifyToken(expired)).toBeNull();
  });
});

describe('requireAuth', () => {
  it('sets req.userId for a valid Bearer token', () => {
    const req = { headers: { authorization: `Bearer ${signToken('abc123')}` } };
    const res = mockRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe('abc123');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('401s with no header', () => {
    const res = mockRes();
    const next = jest.fn();

    requireAuth({ headers: {} }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json.mock.calls[0][0].error).toBe('UNAUTHENTICATED');
  });

  it('401s on a forged token instead of trusting it', () => {
    const res = mockRes();
    const next = jest.fn();

    requireAuth({ headers: { authorization: 'Bearer forged.token.here' } }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('ignores a non-Bearer scheme', () => {
    const res = mockRes();
    const next = jest.fn();

    requireAuth({ headers: { authorization: `Basic ${signToken('abc')}` } }, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('cannot be spoofed by a body/query userId', () => {
    // The whole point of the change: identity comes from the token only.
    const req = { headers: {}, body: { userId: 'victim' }, query: { userId: 'victim' } };
    const res = mockRes();

    requireAuth(req, res, jest.fn());

    expect(req.userId).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(401);
  });
});

describe('optionalAuth', () => {
  it('populates req.userId when signed in', () => {
    const req = { headers: { authorization: `Bearer ${signToken('u1')}` } };
    const next = jest.fn();

    optionalAuth(req, mockRes(), next);

    expect(req.userId).toBe('u1');
    expect(next).toHaveBeenCalled();
  });

  it('lets anonymous callers through with no userId', () => {
    const req = { headers: {} };
    const next = jest.fn();

    optionalAuth(req, mockRes(), next);

    expect(req.userId).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});

describe('password hashing', () => {
  it('does not store the plaintext and verifies correctly', async () => {
    const hash = await bcrypt.hash('correct horse battery', 10);

    expect(hash).not.toContain('correct horse battery');
    await expect(bcrypt.compare('correct horse battery', hash)).resolves.toBe(true);
    await expect(bcrypt.compare('wrong password', hash)).resolves.toBe(false);
  });

  it('salts — the same password hashes differently each time', async () => {
    const a = await bcrypt.hash('same-password', 10);
    const b = await bcrypt.hash('same-password', 10);
    expect(a).not.toBe(b);
  });
});
