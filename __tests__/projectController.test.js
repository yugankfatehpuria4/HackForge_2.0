/**
 * @jest-environment node
 */

// These mirror the hardening added to backend/controllers/projectController.js.
const SORTABLE_FIELDS = ['createdAt', 'updatedAt', 'title', 'framework', 'isFavorite'];
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('project query hardening', () => {
  it('escapes regex metacharacters from the search box', () => {
    // Regression: an unbalanced "(" reached `new RegExp()` and threw a 500.
    expect(() => new RegExp(escapeRegex('todo ('), 'i')).not.toThrow();
    expect(() => new RegExp(escapeRegex('a+b*c['), 'i')).not.toThrow();
  });

  it('matches the literal text rather than treating it as a pattern', () => {
    const re = new RegExp(escapeRegex('a.b'), 'i');
    expect(re.test('a.b')).toBe(true);
    expect(re.test('axb')).toBe(false);
  });

  it('only allows whitelisted sort fields', () => {
    const resolve = (field) =>
      SORTABLE_FIELDS.includes(field) ? field : 'createdAt';

    expect(resolve('title')).toBe('title');
    expect(resolve('generatedCode')).toBe('createdAt');
    expect(resolve(undefined)).toBe('createdAt');
  });

  it('clamps pagination into a safe range', () => {
    const page = (v) => Math.max(1, parseInt(v, 10) || 1);
    const limit = (v) => Math.min(100, Math.max(1, parseInt(v, 10) || 10));

    expect(page('-5')).toBe(1);
    expect(page('0')).toBe(1);
    expect(page('3')).toBe(3);
    expect(limit('100000')).toBe(100);
    expect(limit('-1')).toBe(1);
  });
});
