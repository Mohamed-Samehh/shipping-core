import { Label, parseLabel, LabelSchema } from '../domain/label';
import { LabelRepository } from '../repositories/label-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateLabelInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateLabelInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class LabelService {
  constructor(
    private readonly repository: LabelRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateLabelInput): Label {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('lbl'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(LabelSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'label.create',
      entityKind: 'label',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateLabelInput): Label {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(LabelSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'label.update',
      entityKind: 'label',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Label {
    return this.repository.get(id);
  }

  tryGet(id: string): Label | undefined {
    return this.repository.tryGet(id);
  }

  list(): Label[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('LABEL_NOT_FOUND', 'label ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'label.remove',
      entityKind: 'label',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
