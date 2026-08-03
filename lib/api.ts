/**
 * Single source of truth for the backend base URL.
 *
 * NEXT_PUBLIC_API_URL is inlined at build time. When it is missing the raw
 * `process.env.NEXT_PUBLIC_API_URL` expression evaluates to `undefined`, which
 * turned every request into a fetch of "undefined/api/...". Falling back to the
 * local backend keeps development working without a .env.local file.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

/** Build an absolute backend URL from a root-relative path. */
export function apiUrl(path: string): string {
  return `${API_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}
