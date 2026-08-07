'use client';

import { apiUrl } from './api';

const TOKEN_KEY = 'hackforge_token';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * fetch wrapper that attaches the bearer token.
 *
 * A 401 means the token is missing, expired or invalid — drop it so the UI
 * stops pretending to be signed in.
 */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const token = getToken();

  const response = await fetch(apiUrl(path), {
    ...init,
    headers: {
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (response.status === 401) clearToken();

  return response;
}

async function submitCredentials(
  path: '/api/auth/login' | '/api/auth/register',
  body: Record<string, string>
): Promise<AuthUser> {
  let response: Response;

  try {
    response = await authFetch(path, { method: 'POST', body: JSON.stringify(body) });
  } catch {
    // fetch only rejects on a transport-level failure: backend down, DNS,
    // or a CORS rejection. The raw "Failed to fetch" tells a user nothing.
    throw new Error(
      'Cannot reach the server. Check that the backend is running and that FRONTEND_URL matches this site.'
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || 'Something went wrong. Please try again.');
  }

  setToken(data.token);
  return data.user;
}

export function login(email: string, password: string): Promise<AuthUser> {
  return submitCredentials('/api/auth/login', { email, password });
}

export function register(email: string, password: string, name: string): Promise<AuthUser> {
  return submitCredentials('/api/auth/register', { email, password, name });
}

export async function fetchMe(): Promise<AuthUser | null> {
  if (!getToken()) return null;

  try {
    const response = await authFetch('/api/auth/me');
    const data = await response.json().catch(() => null);
    return response.ok && data?.success ? data.user : null;
  } catch {
    return null;
  }
}
