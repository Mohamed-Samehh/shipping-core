import { TrackingEvent, parseTrackingEvent, TrackingEventSchema } from '../domain/tracking-event';
import { TrackingEventRepository } from '../repositories/tracking-event-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateTrackingEventInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateTrackingEventInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class TrackingEventService {
  constructor(
    private readonly repository: TrackingEventRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateTrackingEventInput): TrackingEvent {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('trk'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(TrackingEventSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'tracking_event.create',
      entityKind: 'tracking-event',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateTrackingEventInput): TrackingEvent {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(TrackingEventSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'tracking_event.update',
      entityKind: 'tracking-event',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): TrackingEvent {
    return this.repository.get(id);
  }

  tryGet(id: string): TrackingEvent | undefined {
    return this.repository.tryGet(id);
  }

  list(): TrackingEvent[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('TRACKING_EVENT_NOT_FOUND', 'tracking-event ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'tracking_event.remove',
      entityKind: 'tracking-event',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
