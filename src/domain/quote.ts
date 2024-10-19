// External-facing shipping quote -- the durable receipt of a rate-shopping
// session that customers can pay against.

import { z } from '../lib/validate';

export const QuoteStatus = z.enum(['open', 'accepted', 'declined', 'expired']);
export type QuoteStatusValue = z.infer<typeof QuoteStatus>;

export const QuoteSchema = z.object({
  id: z.string().min(1),
  customerId: z.string().min(1),
  rateRequestId: z.string().min(1),
  shipmentId: z.string().min(1).optional(),
  selectedRateId: z.string().min(1).optional(),
  status: QuoteStatus.default('open'),
  amount: z.bigint().optional(),
  currency: z.string().length(3).optional(),
  expiresAt: z.number().int().nonnegative(),
  acceptedAt: z.number().int().nonnegative().optional(),
  declinedAt: z.number().int().nonnegative().optional(),
  metadata: z.record(z.string()).default({}),
  createdAt: z.number().int().nonnegative(),
  updatedAt: z.number().int().nonnegative(),
});

export type Quote = z.infer<typeof QuoteSchema>;

export function parseQuote(value: unknown): Quote {
  return QuoteSchema.parse(value);
}

export function isQuoteOpen(quote: Quote): boolean {
  return quote.status === 'open';
}

export function isQuoteExpired(quote: Quote, nowMs: number): boolean {
  return quote.expiresAt <= nowMs;
}
