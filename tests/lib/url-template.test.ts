import { expand, extractVariables, appendQuery } from '../../src/lib/url-template';

describe('url-template', () => {
  test('expand substitutes', () => {
    expect(expand('https://x.test/s/{id}', { id: 'abc' })).toBe('https://x.test/s/abc');
  });

  test('expand encodes spaces', () => {
    expect(expand('https://x.test/{q}', { q: 'a b' })).toBe('https://x.test/a%20b');
  });

  test('missing variables collapse to empty', () => {
    expect(expand('https://x.test/{a}/{b}', { a: 'x' })).toBe('https://x.test/x/');
  });

  test('extractVariables returns sorted names', () => {
    expect(extractVariables('https://x.test/{b}/{a}')).toEqual(['a', 'b']);
  });

  test('appendQuery adds new params', () => {
    expect(appendQuery('https://x.test/', { a: 1, b: 'c' })).toBe('https://x.test/?a=1&b=c');
  });
});
