import { ExceptionCode } from '../domain/exception-code';
import { MemoryStore } from './memory-store';
import { Clock } from '../lib/clock';

export class ExceptionCodeRepository extends MemoryStore<ExceptionCode> {
  constructor(clock: Clock) {
    super(clock);
    this.addIndex('carrier', (e) => e.carrierId);
    this.addIndex('carrierCode', (e) => e.carrierCode);
  }

  protected override entityName(): string {
    return 'exception code';
  }

  findByCarrier(value: string): ExceptionCode[] {
    return this.findByIndex('carrier', value);
  }

  findByCarrierCode(value: string): ExceptionCode[] {
    return this.findByIndex('carrierCode', value);
  }
}
