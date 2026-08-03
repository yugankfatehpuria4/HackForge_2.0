import { API_URL, apiUrl } from '@/lib/api';

describe('lib/api', () => {
  it('falls back to the local backend when NEXT_PUBLIC_API_URL is unset', () => {
    // Regression: components previously inlined process.env directly, which
    // produced request URLs like "undefined/api/generate".
    expect(API_URL).toBeDefined();
    expect(API_URL).not.toContain('undefined');
    expect(API_URL).toMatch(/^https?:\/\//);
  });

  it('joins paths without duplicating slashes', () => {
    expect(apiUrl('/health')).toBe(`${API_URL}/health`);
    expect(apiUrl('health')).toBe(`${API_URL}/health`);
  });

  it('does not double up when the base URL has a trailing slash', () => {
    expect(apiUrl('/api/projects')).not.toContain('//api');
  });
});
