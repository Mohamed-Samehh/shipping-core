// API key authentication. The api accepts an `X-Helix-Api-Key` header that
// maps to a customerId via the supplied lookup.

import { ApiRequest } from './router';
import { UnauthorizedError } from '../errors';

export interface ApiKeyLookup {
  resolve(apiKey: string): { customerId: string } | undefined;
}

export class StaticApiKeyLookup implements ApiKeyLookup {
  constructor(private readonly table: Record<string, { customerId: string }>) {}
  resolve(apiKey: string): { customerId: string } | undefined {
    return this.table[apiKey];
  }
}

export interface AuthenticatedRequest<B = unknown> extends ApiRequest<B> {
  readonly customerId: string;
}

export function authenticate<B>(request: ApiRequest<B>, lookup: ApiKeyLookup): AuthenticatedRequest<B> {
  const key = request.headers['x-helix-api-key'] ?? request.headers['X-Helix-Api-Key'];
  if (!key) {
    throw new UnauthorizedError('AUTH_API_KEY_MISSING', 'X-Helix-Api-Key header required');
  }
  const claim = lookup.resolve(key);
  if (!claim) {
    throw new UnauthorizedError('AUTH_API_KEY_INVALID', 'invalid api key');
  }
  return { ...request, customerId: claim.customerId };
}
