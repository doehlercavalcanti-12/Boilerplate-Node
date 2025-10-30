import { sanitizeInput, preventParameterPollution } from '../../../src/utils/sanitizer.js';

describe('sanitizeInput', () => {
  it('removes script tags', () => {
    const result = sanitizeInput({ message: '<script>alert(1)</script>Hello' });
    expect(result.message).toBe('Hello');
  });

  it('keeps non-string values untouched', () => {
    const payload = { count: 1, nested: { ok: true } };
    const result = sanitizeInput<typeof payload>(payload);
    expect(result.count).toBe(1);
    expect(result.nested.ok).toBe(true);
  });
});

describe('preventParameterPollution', () => {
  it('takes first value when array provided', () => {
    const result = preventParameterPollution({ tag: ['a', 'b'], limit: 10 } as Record<string, unknown>);
    expect(result.tag).toBe('a');
    expect(result.limit).toBe(10);
  });
});
