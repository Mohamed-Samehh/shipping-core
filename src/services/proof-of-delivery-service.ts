import { ProofOfDelivery, parseProofOfDelivery, ProofOfDeliverySchema } from '../domain/proof-of-delivery';
import { ProofOfDeliveryRepository } from '../repositories/proof-of-delivery-repository';
import { AuditService } from './audit-service';
import { Clock } from '../lib/clock';
import { IdGenerator } from '../lib/id';
import { ConflictError, NotFoundError } from '../errors';
import { parse } from '../lib/validate';

export interface CreateProofOfDeliveryInput {
  [key: string]: unknown;
  actor: string;
}

export interface UpdateProofOfDeliveryInput {
  id: string;
  [key: string]: unknown;
  actor: string;
}

export class ProofOfDeliveryService {
  constructor(
    private readonly repository: ProofOfDeliveryRepository,
    private readonly clock: Clock,
    private readonly ids: IdGenerator,
    private readonly audit: AuditService,
  ) {}

  create(input: CreateProofOfDeliveryInput): ProofOfDelivery {
    const { actor: _actor, ...rest } = input;
    const now = this.clock.now();
    const candidate = {
      ...rest,
      id: this.ids.next('pod'),
      createdAt: now,
      updatedAt: now,
    };
    const entity = parse(ProofOfDeliverySchema, candidate);
    this.repository.store(entity);
    this.audit.record({
      actor: input.actor,
      action: 'proof_of_delivery.create',
      entityKind: 'proof-of-delivery',
      entityId: entity.id,
      after: { ...entity },
    });
    return entity;
  }

  update(input: UpdateProofOfDeliveryInput): ProofOfDelivery {
    const { id, actor: _actor, ...patch } = input;
    const before = this.repository.get(id);
    const candidate = { ...before, ...patch, updatedAt: this.clock.now() };
    const next = parse(ProofOfDeliverySchema, candidate);
    this.repository.store(next);
    this.audit.record({
      actor: input.actor,
      action: 'proof_of_delivery.update',
      entityKind: 'proof-of-delivery',
      entityId: next.id,
      before: { ...before },
      after: { ...next },
    });
    return next;
  }

  get(id: string): ProofOfDelivery {
    return this.repository.get(id);
  }

  tryGet(id: string): ProofOfDelivery | undefined {
    return this.repository.tryGet(id);
  }

  list(): ProofOfDelivery[] {
    return this.repository.listAll();
  }

  remove(id: string, actor: string): void {
    const before = this.repository.tryGet(id);
    if (!before) {
      throw new NotFoundError('PROOF_OF_DELIVERY_NOT_FOUND', 'proof-of-delivery ' + id + ' not found');
    }
    this.repository.remove(id);
    this.audit.record({
      actor,
      action: 'proof_of_delivery.remove',
      entityKind: 'proof-of-delivery',
      entityId: id,
      before: { ...before },
    });
  }

}

export { NotFoundError, ConflictError };
