import { PackageType, parsePackageType, PackageTypeSchema } from '../domain/package-type';
import { PackageTypeRepository } from '../repositories/package-type-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreatePackageTypeInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdatePackageTypeInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class PackageTypeService {
  constructor(
    private readonly repository: PackageTypeRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreatePackageTypeInput): PackageType {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('pt'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(PackageTypeSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'package_type.create',
      entityKind: 'package-type',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdatePackageTypeInput): PackageType {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(PackageTypeSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'package_type.update',
      entityKind: 'package-type',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): PackageType {
    return this.repository.get(id);
  }

  tryGet(id: string): PackageType | undefined {
    return this.repository.tryGet(id);
  }

  list(): PackageType[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('PACKAGE_TYPE_NOT_FOUND', 'package-type ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'package_type.remove',
      entityKind: 'package-type',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
