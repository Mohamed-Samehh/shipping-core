import { SignatureRecord, parseSignatureRecord, SignatureRecordSchema } from '../domain/signature-record';
import { SignatureRecordRepository } from '../repositories/signature-record-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateSignatureRecordInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateSignatureRecordInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class SignatureRecordService {
  constructor(
    private readonly repository: SignatureRecordRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateSignatureRecordInput): SignatureRecord {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('sg'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(SignatureRecordSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'signature_record.create',
      entityKind: 'signature-record',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateSignatureRecordInput): SignatureRecord {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(SignatureRecordSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'signature_record.update',
      entityKind: 'signature-record',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): SignatureRecord {
    return this.repository.get(id);
  }

  tryGet(id: string): SignatureRecord | undefined {
    return this.repository.tryGet(id);
  }

  list(): SignatureRecord[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('SIGNATURE_RECORD_NOT_FOUND', 'signature-record ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'signature_record.remove',
      entityKind: 'signature-record',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
