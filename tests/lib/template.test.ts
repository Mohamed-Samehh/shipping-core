import { render, extractVariables } from '../../src/lib/template';

describe('template renderer', () => {
  test('substitutes {{var}}', () => {
    expect(render('hi {{name}}', { name: 'Ana' })).toBe('hi Ana');
  });

  test('resolves nested keys', () => {
    expect(render('{{a.b.c}}', { a: { b: { c: 'x' } } })).toBe('x');
  });

  test('missing var renders as empty string', () => {
    expect(render('{{x}}', {})).toBe('');
  });

  test('strict mode throws on missing var', () => {
    expect(() => render('{{x}}', {}, { strict: true })).toThrow();
  });

  test('extractVariables returns sorted unique names', () => {
    expect(extractVariables('{{a}} {{b}} {{a}}')).toEqual(['a', 'b']);
  });

  test('renders numbers as strings', () => {
    expect(render('{{n}}', { n: 42 })).toBe('42');
  });
});
