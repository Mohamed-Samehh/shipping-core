import { ExceptionCode, parseExceptionCode, ExceptionCodeSchema } from '../domain/exception-code';
import { ExceptionCodeRepository } from '../repositories/exception-code-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateExceptionCodeInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateExceptionCodeInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ExceptionCodeService {
  constructor(
    private readonly repository: ExceptionCodeRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateExceptionCodeInput): ExceptionCode {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('ec'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ExceptionCodeSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'exception_code.create',
      entityKind: 'exception-code',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateExceptionCodeInput): ExceptionCode {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ExceptionCodeSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'exception_code.update',
      entityKind: 'exception-code',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): ExceptionCode {
    return this.repository.get(id);
  }

  tryGet(id: string): ExceptionCode | undefined {
    return this.repository.tryGet(id);
  }

  list(): ExceptionCode[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('EXCEPTION_CODE_NOT_FOUND', 'exception-code ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'exception_code.remove',
      entityKind: 'exception-code',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
