import { buildUrl, withQuery, parseQuery, isHttpUrl, trimLeadingSlash, trimTrailingSlash } from '../../src/lib/url';

describe('url helpers', () => {
  test('buildUrl joins segments with single slashes', () => {
    expect(buildUrl('https://api.example.com/', '/v1/', '/shipments'))
      .toBe('https://api.example.com/v1/shipments');
  });

  test('withQuery sets / overrides params', () => {
    expect(withQuery('https://x.test/?a=1', { a: '2', b: 'c' }))
      .toBe('https://x.test/?a=2&b=c');
  });

  test('withQuery undefined removes the key', () => {
    expect(withQuery('https://x.test/?a=1', { a: undefined }))
      .toBe('https://x.test/');
  });

  test('parseQuery extracts params', () => {
    expect(parseQuery('https://x.test/?a=1&b=2')).toEqual({ a: '1', b: '2' });
  });

  test('isHttpUrl detects http(s)', () => {
    expect(isHttpUrl('https://x.test')).toBe(true);
    expect(isHttpUrl('ftp://x')).toBe(false);
    expect(isHttpUrl('not a url')).toBe(false);
  });

  test('trim slash helpers', () => {
    expect(trimLeadingSlash('/a')).toBe('a');
    expect(trimTrailingSlash('a/')).toBe('a');
  });
});
