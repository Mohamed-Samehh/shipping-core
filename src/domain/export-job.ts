// Async export job. Bulk shipment / tracking exports run as background jobs;
// this entity is the status / url pointer the UI polls.

import { z } from '../lib/validate';

export const ExportJobKind = z.enum(['shipments', 'manifests', 'tracking', 'rates', 'invoices']);
export type ExportJobKindValue = z.infer<typeof ExportJobKind>;

export const ExportJobStatus = z.enum(['queued', 'running', 'succeeded', 'failed', 'cancelled']);
export type ExportJobStatusValue = z.infer<typeof ExportJobStatus>;

export const ExportJobSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  kind: ExportJobKind,
  status: ExportJobStatus.default('queued'),
  rangeStart: z.number().int().nonnegative(),
  rangeEnd: z.number().int().nonnegative(),
  rowCount: z.number().int().nonnegative().optional(),
  resultUrl: z.string().url().optional(),
  errorMessage: z.string().max(280).optional(),
  startedAt: z.number().int().nonnegative().optional(),
  finishedAt: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
});

export type ExportJob = z.infer<typeof ExportJobSchema>;

export function parseExportJob(value: unknown): ExportJob {
  return ExportJobSchema.parse(value);
}

export function isExportTerminal(job: ExportJob): boolean {
  return job.status === 'succeeded' || job.status === 'failed' || job.status === 'cancelled';
}
