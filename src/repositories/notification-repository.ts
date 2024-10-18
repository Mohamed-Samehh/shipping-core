import { Notification } from '../domain/notification';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class NotificationRepository extends MemoryStore<Notification> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('customer', (e) => e.customerId);
    this.addIndex('shipment', (e) => e.shipmentId);
    this.addIndex('status', (e) => e.status);
  }

  protected override entityName(): string {
    return 'notification';
  }

  findByCustomer(value: string): Notification[] {
    return this.findByIndex('customer', value);
  }

  findByShipment(value: string): Notification[] {
    return this.findByIndex('shipment', value);
  }

  findByStatus(value: string): Notification[] {
    return this.findByIndex('status', value);
  }
}
