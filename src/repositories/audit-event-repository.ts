import { AuditEvent } from '../domain/audit-event';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class AuditEventRepository extends MemoryStore<AuditEvent> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('entity', (e) => e.entityId);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('shipment', (e) => e.shipmentId);
  }

  protected override entityName(): string {
    return 'audit event';
  }

  findByEntity(value: string): AuditEvent[] {
    return this.findByIndex('entity', value);
  }

  findByCustomer(value: string): AuditEvent[] {
    return this.findByIndex('customer', value);
  }

  findByShipment(value: string): AuditEvent[] {
    return this.findByIndex('shipment', value);
  }
}
