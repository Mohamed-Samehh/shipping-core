import { DispatchSlot, parseDispatchSlot, DispatchSlotSchema } from '../domain/dispatch-slot';
import { DispatchSlotRepository } from '../repositories/dispatch-slot-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateDispatchSlotInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateDispatchSlotInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class DispatchSlotService {
  constructor(
    private readonly repository: DispatchSlotRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateDispatchSlotInput): DispatchSlot {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('ds'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(DispatchSlotSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'dispatch_slot.create',
      entityKind: 'dispatch-slot',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateDispatchSlotInput): DispatchSlot {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(DispatchSlotSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'dispatch_slot.update',
      entityKind: 'dispatch-slot',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): DispatchSlot {
    return this.repository.get(id);
  }

  tryGet(id: string): DispatchSlot | undefined {
    return this.repository.tryGet(id);
  }

  list(): DispatchSlot[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('DISPATCH_SLOT_NOT_FOUND', 'dispatch-slot ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'dispatch_slot.remove',
      entityKind: 'dispatch-slot',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
