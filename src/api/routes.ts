// Wires up all api routes. Keeping the wiring in one file makes it easy to
// see the full surface of the api without grepping for `router.get(...)`.

import { Router } from './router';
import { ping, listShipments, getShipment, createShipment } from './handlers';
import { authenticate, ApiKeyLookup } from './auth';
import { Fixture } from '../../tests/fixtures';

export function registerRoutes(router: Router, fixture: Fixture, lookup: ApiKeyLookup): void {
  router.get('/v1/ping', () => ping());

  router.get('/v1/shipments', (req) => {
    const authed = authenticate(req, lookup);
    return listShipments(authed, fixture.services);
  });

  router.get('/v1/shipments/:id', (req) => {
    const authed = authenticate(req, lookup);
    return getShipment(authed, fixture.services);
  });

  router.post('/v1/shipments', (req) => {
    const authed = authenticate(req, lookup);
    return createShipment(authed as never, fixture.services);
  });
}
