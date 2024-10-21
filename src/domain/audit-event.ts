// Audit log entry. Service code emits one of these for every observable
// state mutation so support tooling can reconstruct the timeline.

import { z } from '../lib/validate';

export const AuditEventSchema = z.object({
  id: z.string().min(1),
  actor: z.string().min(1).max(120),
  action: z.string().min(1).max(120),
  entityKind: z.string().min(1).max(40),
  entityId: z.string().min(1),
  customerId: z.string().min(1).optional(),
  shipmentId: z.string().min(1).optional(),
  before: z.record(z.unknown()).optional(),
  after: z.record(z.unknown()).optional(),
  metadata: z.record(z.string()).default({}),
  recordedAt: z.number().int().nonnegative(),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

export function parseAuditEvent(value: unknown): AuditEvent {
  return AuditEventSchema.parse(value);
}

export function isMutation(event: AuditEvent): boolean {
  return event.before !== undefined || event.after !== undefined;
}
