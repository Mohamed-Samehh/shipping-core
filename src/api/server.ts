// Re-export bundle for callers that want a one-liner. Production wiring lives
// elsewhere; this is what the integration tests instantiate.

import { Router } from './router';
import { registerRoutes } from './routes';
import { Fixture } from '../../tests/fixtures';
import { ApiKeyLookup, StaticApiKeyLookup } from './auth';

export interface ApiServerOptions {
  readonly fixture: Fixture;
  readonly apiKeys?: Record<string, { customerId: string }>;
}

export function createServer(options: ApiServerOptions): Router {
  const router = new Router();
  const lookup: ApiKeyLookup = new StaticApiKeyLookup(options.apiKeys ?? {});
  registerRoutes(router, options.fixture, lookup);
  return router;
}
