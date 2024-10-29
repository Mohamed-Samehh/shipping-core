import { Route, parseRoute, RouteSchema } from '../domain/route';
import { RouteRepository } from '../repositories/route-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateRouteInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateRouteInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class RouteService {
  constructor(
    private readonly repository: RouteRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateRouteInput): Route {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('rte'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(RouteSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'route.create',
      entityKind: 'route',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateRouteInput): Route {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(RouteSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'route.update',
      entityKind: 'route',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Route {
    return this.repository.get(id);
  }

  tryGet(id: string): Route | undefined {
    return this.repository.tryGet(id);
  }

  list(): Route[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('ROUTE_NOT_FOUND', 'route ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'route.remove',
      entityKind: 'route',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
