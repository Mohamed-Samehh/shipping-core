import { SignatureRecord } from '../domain/signature-record';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class SignatureRecordRepository extends MemoryStore<SignatureRecord> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('shipment', (e) => e.shipmentId);
  }

  protected override entityName(): string {
    return 'signature record';
  }

  findByShipment(value: string): SignatureRecord[] {
    return this.findByIndex('shipment', value);
  }
}
