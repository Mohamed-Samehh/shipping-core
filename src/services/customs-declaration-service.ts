import { CustomsDeclaration, parseCustomsDeclaration, CustomsDeclarationSchema } from '../domain/customs-declaration';
import { CustomsDeclarationRepository } from '../repositories/customs-declaration-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateCustomsDeclarationInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateCustomsDeclarationInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class CustomsDeclarationService {
  constructor(
    private readonly repository: CustomsDeclarationRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateCustomsDeclarationInput): CustomsDeclaration {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('cd'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(CustomsDeclarationSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'customs_declaration.create',
      entityKind: 'customs-declaration',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateCustomsDeclarationInput): CustomsDeclaration {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(CustomsDeclarationSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'customs_declaration.update',
      entityKind: 'customs-declaration',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): CustomsDeclaration {
    return this.repository.get(id);
  }

  tryGet(id: string): CustomsDeclaration | undefined {
    return this.repository.tryGet(id);
  }

  list(): CustomsDeclaration[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('CUSTOMS_DECLARATION_NOT_FOUND', 'customs-declaration ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'customs_declaration.remove',
      entityKind: 'customs-declaration',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
