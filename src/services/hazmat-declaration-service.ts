import { HazmatDeclaration, parseHazmatDeclaration, HazmatDeclarationSchema } from '../domain/hazmat-declaration';
import { HazmatDeclarationRepository } from '../repositories/hazmat-declaration-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateHazmatDeclarationInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateHazmatDeclarationInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class HazmatDeclarationService {
  constructor(
    private readonly repository: HazmatDeclarationRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateHazmatDeclarationInput): HazmatDeclaration {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('hz'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(HazmatDeclarationSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'hazmat_declaration.create',
      entityKind: 'hazmat-declaration',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateHazmatDeclarationInput): HazmatDeclaration {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(HazmatDeclarationSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'hazmat_declaration.update',
      entityKind: 'hazmat-declaration',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): HazmatDeclaration {
    return this.repository.get(id);
  }

  tryGet(id: string): HazmatDeclaration | undefined {
    return this.repository.tryGet(id);
  }

  list(): HazmatDeclaration[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('HAZMAT_DECLARATION_NOT_FOUND', 'hazmat-declaration ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'hazmat_declaration.remove',
      entityKind: 'hazmat-declaration',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
