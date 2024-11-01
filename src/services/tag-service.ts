import { Tag, parseTag, TagSchema } from '../domain/tag';
import { TagRepository } from '../repositories/tag-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateTagInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateTagInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class TagService {
  constructor(
    private readonly repository: TagRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateTagInput): Tag {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('tg'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(TagSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'tag.create',
      entityKind: 'tag',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateTagInput): Tag {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(TagSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'tag.update',
      entityKind: 'tag',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): Tag {
    return this.repository.get(id);
  }

  tryGet(id: string): Tag | undefined {
    return this.repository.tryGet(id);
  }

  list(): Tag[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('TAG_NOT_FOUND', 'tag ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'tag.remove',
      entityKind: 'tag',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
