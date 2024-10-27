import { ExportJob, parseExportJob, ExportJobSchema } from '../domain/export-job';
import { ExportJobRepository } from '../repositories/export-job-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateExportJobInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateExportJobInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ExportJobService {
  constructor(
    private readonly repository: ExportJobRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateExportJobInput): ExportJob {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('ej'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ExportJobSchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'export_job.create',
      entityKind: 'export-job',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateExportJobInput): ExportJob {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ExportJobSchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'export_job.update',
      entityKind: 'export-job',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): ExportJob {
    return this.repository.get(id);
  }

  tryGet(id: string): ExportJob | undefined {
    return this.repository.tryGet(id);
  }

  list(): ExportJob[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('EXPORT_JOB_NOT_FOUND', 'export-job ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'export_job.remove',
      entityKind: 'export-job',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
