// Thin glue between the api router and the service layer. Each handler is a
// pure function of (request, services) so unit tests can exercise them
// directly without booting Express.

import { ApiRequest, ApiResponse } from './router';
import { AuthenticatedRequest } from './auth';
import { Fixture } from '../../tests/fixtures';

export function ping(): ApiResponse {
  return { status: 200, body: { ok: true } };
}

export function listShipments(request: AuthenticatedRequest, services: Fixture['services']): ApiResponse {
  const shipments = services.shipmentService.list().filter((s) => s.customerId === request.customerId);
  return { status: 200, body: { shipments } };
}

export function getShipment(request: AuthenticatedRequest, services: Fixture['services']): ApiResponse {
  const id = request.params.id as string;
  const shipment = services.shipmentService.get(id);
  if (shipment.customerId !== request.customerId) {
    return { status: 404, body: { code: 'SHIPMENT_NOT_FOUND', message: 'not found' } };
  }
  return { status: 200, body: { shipment } };
}

export interface CreateShipmentBody {
  fromAddressId: string;
  toAddressId: string;
  reference?: string;
}

export function createShipment(request: ApiRequest<CreateShipmentBody> & { customerId: string },
  services: Fixture['services']): ApiResponse {
  const shipment = services.shipmentService.create({
    customerId: request.customerId,
    fromAddressId: request.body.fromAddressId,
    toAddressId: request.body.toAddressId,
    reference: request.body.reference,
    actor: 'api',
  });
  return { status: 201, body: { shipment } };
}
