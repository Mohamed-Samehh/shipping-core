import { Notification, parseNotification, NotificationSchema } from '../domain/notification';
import { NotificationRepository } from '../repositories/notification-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateNotificationInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateNotificationInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class NotificationService {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateNotificationInput): Notification {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('nt'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(NotificationSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'notification.create',
      entityKind: 'notification',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateNotificationInput): Notification {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(NotificationSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'notification.update',
      entityKind: 'notification',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Notification {
    return this.repository.get(id);
  }

  tryGet(id: string): Notification | undefined {
    return this.repository.tryGet(id);
  }

  list(): Notification[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('NOTIFICATION_NOT_FOUND', 'notification ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'notification.remove',
      entityKind: 'notification',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
