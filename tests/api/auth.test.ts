import { authenticate, StaticApiKeyLookup } from '../../src/api/auth';
import { UnauthorizedError } from '../../src/errors';

const lookup = new StaticApiKeyLookup({ 'k1': { customerId: 'c1' } });

function req(headers: Record<string, string>) {
  return { method: 'GET' as const, path: '/x', headers, params: {}, query: {}, body: undefined };
}

describe('authenticate', () => {
  test('extracts customer id from header', () => {
    expect(authenticate(req({ 'x-helix-api-key': 'k1' }), lookup).customerId).toBe('c1');
  });

  test('missing header rejects', () => {
    expect(() => authenticate(req({}), lookup)).toThrow(UnauthorizedError);
  });

  test('unknown key rejects', () => {
    expect(() => authenticate(req({ 'x-helix-api-key': 'nope' }), lookup)).toThrow(UnauthorizedError);
  });

  test('accepts capitalised header', () => {
    expect(authenticate(req({ 'X-Helix-Api-Key': 'k1' }), lookup).customerId).toBe('c1');
  });

  test('StaticApiKeyLookup resolves table entries', () => {
    expect(lookup.resolve('k1')?.customerId).toBe('c1');
    expect(lookup.resolve('nope')).toBeUndefined();
  });
});
