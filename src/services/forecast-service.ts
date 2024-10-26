import { Forecast, parseForecast, ForecastSchema } from '../domain/forecast';
import { ForecastRepository } from '../repositories/forecast-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateForecastInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateForecastInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ForecastService {
  constructor(
    private readonly repository: ForecastRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateForecastInput): Forecast {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('fc'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ForecastSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'forecast.create',
      entityKind: 'forecast',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateForecastInput): Forecast {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ForecastSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'forecast.update',
      entityKind: 'forecast',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Forecast {
    return this.repository.get(id);
  }

  tryGet(id: string): Forecast | undefined {
    return this.repository.tryGet(id);
  }

  list(): Forecast[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('FORECAST_NOT_FOUND', 'forecast ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'forecast.remove',
      entityKind: 'forecast',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
