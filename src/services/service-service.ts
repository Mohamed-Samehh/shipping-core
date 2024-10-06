import { Service, parseService, ServiceSchema } from '../domain/service';
import { ServiceRepository } from '../repositories/service-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateServiceInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateServiceInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ServiceService {
  constructor(
    private readonly repository: ServiceRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateServiceInput): Service {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('svc'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ServiceSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'service.create',
      entityKind: 'service',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateServiceInput): Service {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ServiceSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'service.update',
      entityKind: 'service',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Service {
    return this.repository.get(id);
  }

  tryGet(id: string): Service | undefined {
    return this.repository.tryGet(id);
  }

  list(): Service[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('SERVICE_NOT_FOUND', 'service ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'service.remove',
      entityKind: 'service',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
