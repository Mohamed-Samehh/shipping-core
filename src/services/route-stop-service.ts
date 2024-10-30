import { RouteStop, parseRouteStop, RouteStopSchema } from '../domain/route-stop';
import { RouteStopRepository } from '../repositories/route-stop-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateRouteStopInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateRouteStopInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class RouteStopService {
  constructor(
    private readonly repository: RouteStopRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateRouteStopInput): RouteStop {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('rs'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(RouteStopSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'route_stop.create',
      entityKind: 'route-stop',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateRouteStopInput): RouteStop {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(RouteStopSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'route_stop.update',
      entityKind: 'route-stop',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): RouteStop {
    return this.repository.get(id);
  }

  tryGet(id: string): RouteStop | undefined {
    return this.repository.tryGet(id);
  }

  list(): RouteStop[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('ROUTE_STOP_NOT_FOUND', 'route-stop ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'route_stop.remove',
      entityKind: 'route-stop',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
