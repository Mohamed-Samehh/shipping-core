// Free-form tags attached to shipments / customers / accounts. Used to drive
// segmentation, automation rules and filtered exports.

import { z } from '../lib/validate';

export const TagSchema = z.object({
  id: z.string().min(1),
  entityKind: z.string().min(1).max(40),
  entityId: z.string().min(1),
  key: z.string().regex(/^[a-z][a-z0-9_-]{0,40}$/),
  value: z.string().max(120).optional(),
  createdAt: z.number().int().nonnegative(),
});

export type Tag = z.infer<typeof TagSchema>;

export function parseTag(value: unknown): Tag {
  return TagSchema.parse(value);
}

export function tagFingerprint(tag: Tag): string {
  return `${tag.entityKind}::${tag.entityId}::${tag.key}`;
}
