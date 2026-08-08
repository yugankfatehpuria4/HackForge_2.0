/**
 * @jest-environment node
 */

// Clerk owns token verification now, so there is nothing left to unit test
// about signing or decoding. What still matters — and what these cover — is the
// contract the rest of the API depends on: requireAuth blocks anonymous
// callers, optionalAuth never does, and req.userId comes from the verified
// session rather than anything the client sent.

jest.mock('@clerk/express', () => ({ getAuth: jest.fn() }));

const { getAuth } = require('@clerk/express');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => jest.clearAllMocks());

describe('requireAuth', () => {
  it('passes through and sets req.userId for a signed-in caller', () => {
    getAuth.mockReturnValue({ userId: 'user_123' });
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe('user_123');
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects an anonymous caller with 401', () => {
    getAuth.mockReturnValue({ userId: null });
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    requireAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: 'UNAUTHENTICATED' })
    );
  });

  it('rejects rather than throwing when clerkMiddleware has not run', () => {
    getAuth.mockImplementation(() => {
      throw new Error('clerkMiddleware is required');
    });
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    expect(() => requireAuth(req, res, next)).not.toThrow();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('ignores a userId supplied by the client', () => {
    getAuth.mockReturnValue({ userId: 'user_real' });
    // A caller trying to act as someone else.
    const req = { body: { userId: 'user_victim' }, query: { userId: 'user_victim' } };
    const res = makeRes();

    requireAuth(req, res, jest.fn());

    expect(req.userId).toBe('user_real');
  });
});

describe('optionalAuth', () => {
  it('sets req.userId when signed in', () => {
    getAuth.mockReturnValue({ userId: 'user_abc' });
    const req = {};
    const next = jest.fn();

    optionalAuth(req, makeRes(), next);

    expect(req.userId).toBe('user_abc');
    expect(next).toHaveBeenCalled();
  });

  it('continues without a userId when signed out', () => {
    getAuth.mockReturnValue({ userId: null });
    const req = {};
    const res = makeRes();
    const next = jest.fn();

    optionalAuth(req, res, next);

    expect(req.userId).toBeUndefined();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('continues when getAuth throws', () => {
    getAuth.mockImplementation(() => {
      throw new Error('clerkMiddleware is required');
    });
    const req = {};
    const next = jest.fn();

    expect(() => optionalAuth(req, makeRes(), next)).not.toThrow();
    expect(next).toHaveBeenCalled();
  });
});
