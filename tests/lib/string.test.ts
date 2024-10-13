import { isBlank, leftPad, rightPad, truncate, camelCase, snakeCase, kebabCase, titleCase, slugify } from '../../src/lib/string';

describe('string helpers', () => {
  test('isBlank treats whitespace as blank', () => {
    expect(isBlank('   ')).toBe(true);
    expect(isBlank('a')).toBe(false);
  });

  test('leftPad / rightPad', () => {
    expect(leftPad('1', 3, '0')).toBe('001');
    expect(rightPad('1', 3, '0')).toBe('100');
  });

  test('leftPad rejects multi-char padding', () => {
    expect(() => leftPad('1', 3, 'xx')).toThrow();
  });

  test('truncate appends suffix', () => {
    expect(truncate('hello world', 8)).toBe('hello w\u2026');
    expect(truncate('hi', 8)).toBe('hi');
  });

  test('camelCase converts kebab/snake', () => {
    expect(camelCase('hello-world_foo')).toBe('helloWorldFoo');
  });

  test('snakeCase / kebabCase', () => {
    expect(snakeCase('HelloWorld')).toBe('hello_world');
    expect(kebabCase('HelloWorld')).toBe('hello-world');
  });

  test('titleCase capitalises words', () => {
    expect(titleCase('hello world')).toBe('Hello World');
  });

  test('slugify produces url-safe strings', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });
});
