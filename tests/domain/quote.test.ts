import { parseQuote, isQuoteOpen, isQuoteExpired } from '../../src/domain/quote';

const base = {
  id: 'qt_1', customerId: 'cu1', rateRequestId: 'rr1',
  status: 'open' as const, expiresAt: 1000,
  metadata: {}, createdAt: 0, updatedAt: 0,
};

describe('Quote schema', () => {
  test('parseQuote accepts a valid record', () => {
    expect(parseQuote(base).status).toBe('open');
  });

  test('isQuoteOpen only for open', () => {
    expect(isQuoteOpen(parseQuote(base))).toBe(true);
    expect(isQuoteOpen(parseQuote({ ...base, status: 'accepted' }))).toBe(false);
  });

  test('isQuoteExpired vs nowMs', () => {
    expect(isQuoteExpired(parseQuote(base), 500)).toBe(false);
    expect(isQuoteExpired(parseQuote(base), 1500)).toBe(true);
  });

  test('rejects unknown status', () => {
    expect(() => parseQuote({ ...base, status: 'pending' as never })).toThrow();
  });
});
