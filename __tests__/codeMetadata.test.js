/**
 * @jest-environment node
 */

// These helpers used to live inside codeController.js, so only the auto-save
// path could reach them and they could not be tested directly. Now that they
// are a shared module, this imports the real implementation rather than a copy.
const { extractFramework, extractTags } = require('../backend/utils/codeMetadata');

describe('extractFramework', () => {
  it('detects the framework from the prompt', () => {
    expect(extractFramework('build a vue dashboard', '')).toBe('vue');
    expect(extractFramework('a django blog', '')).toBe('django');
    expect(extractFramework('a fastapi service', '')).toBe('fastapi');
  });

  it('falls back to the generated code when the prompt is vague', () => {
    expect(extractFramework('make me something', 'from flask import Flask')).toBe('flask');
    expect(extractFramework('an app', 'const app = express()')).toBe('express');
  });

  it('defaults to react rather than returning nothing', () => {
    expect(extractFramework('do the thing', 'x = 1')).toBe('react');
  });

  it('is case-insensitive', () => {
    expect(extractFramework('Build a VUE app', '')).toBe('vue');
  });
});

describe('extractTags', () => {
  it('derives tags from the prompt', () => {
    expect(extractTags('a login form with a database', '')).toEqual(
      expect.arrayContaining(['database', 'authentication', 'form'])
    );
  });

  it('derives tags from the generated code', () => {
    expect(extractTags('', 'fetch("/api/items")')).toContain('api');
  });

  it('returns an empty array when nothing matches', () => {
    expect(extractTags('zzz', 'zzz')).toEqual([]);
  });

  it('does not emit duplicates for one signal matching twice', () => {
    const tags = extractTags('an api that calls an api', 'fetch(...)');
    expect(tags.filter((t) => t === 'api')).toHaveLength(1);
  });
});
