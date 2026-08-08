'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';
import { apiUrl } from './api';

/**
 * fetch wrapper that attaches the caller's Clerk session token.
 *
 * This is a hook rather than a plain function because the token comes from
 * Clerk's `useAuth()`. The Express API lives on a different origin, so Clerk's
 * session cookie is not sent automatically — the token has to travel in an
 * Authorization header, which is what `@clerk/express` reads on the other side.
 *
 * `getToken()` resolves to null for signed-out visitors. That is deliberate,
 * not an error: /api/generate accepts anonymous callers, and the routes that do
 * require a user answer 401 on their own.
 */
export function useApi() {
  const { getToken } = useAuth();

  const apiFetch = useCallback(
    async (path: string, init: RequestInit = {}): Promise<Response> => {
      const token = await getToken();

      return fetch(apiUrl(path), {
        ...init,
        headers: {
          ...(init.body ? { 'Content-Type': 'application/json' } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...init.headers,
        },
      });
    },
    [getToken]
  );

  return { apiFetch };
}
