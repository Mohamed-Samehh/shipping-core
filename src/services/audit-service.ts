// AuditService is the sole writer of the audit-event log. Every service
// records a hook through it for observable state changes.

import { AuditEvent } from '../domain/audit-event';
import { AuditEventRepository } from '../repositories/audit-event-repository';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';

export interface RecordAuditInput {
  actor: string;
  action: string;
  entityKind: string;
  entityId: string;
  customerId?: string;
  shipmentId?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, string>;
}

export class AuditService {
  constructor(
    private readonly repository: AuditEventRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
  ) {}

  record(input: RecordAuditInput): AuditEvent {
    const event: AuditEvent = {
      id: this.ids.next('audit'),
      actor: input.actor,
      action: input.action,
      entityKind: input.entityKind,
      entityId: input.entityId,
      ...(input.customerId !== undefined ? { customerId: input.customerId } : {}),
      ...(input.shipmentId !== undefined ? { shipmentId: input.shipmentId } : {}),
      ...(input.before !== undefined ? { before: input.before } : {}),
      ...(input.after !== undefined ? { after: input.after } : {}),
      metadata: input.metadata ?? {},
      recordedAt: this.clock.now(),
    };
    this.repository.store(event);
    return event;
  }

  recordMany(inputs: readonly RecordAuditInput[]): AuditEvent[] {
    return inputs.map((input) => this.record(input));
  }

  listForEntity(entityId: string): AuditEvent[] {
    return this.repository.findByEntity(entityId);
  }

  listForCustomer(customerId: string): AuditEvent[] {
    return this.repository.findByCustomer(customerId);
  }

  countByAction(action: string): number {
    return this.repository.listAll((e) => e.action === action).length;
  }
}
