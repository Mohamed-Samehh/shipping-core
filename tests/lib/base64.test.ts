import { toBase64, fromBase64, toBase64Url, fromBase64Url, isBase64, isBase64Url } from '../../src/lib/base64';

describe('base64', () => {
  test('encode / decode roundtrip', () => {
    expect(fromBase64(toBase64('hello'))).toBe('hello');
  });

  test('base64url variant', () => {
    expect(fromBase64Url(toBase64Url('a/b+c='))).toBe('a/b+c=');
  });

  test('isBase64 detects', () => {
    expect(isBase64('aGVsbG8=')).toBe(true);
    expect(isBase64('not base64!')).toBe(false);
  });

  test('isBase64Url detects', () => {
    expect(isBase64Url('aGVsbG8')).toBe(true);
    expect(isBase64Url('a/b+c')).toBe(false);
  });

  test('empty is not base64', () => {
    expect(isBase64('')).toBe(false);
  });
});
