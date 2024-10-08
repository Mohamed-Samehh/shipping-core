// Wraps Intl.NumberFormat and Intl.DateTimeFormat for the display layer.
// Currency math stays on `Money`; this module just formats it for invoices,
// tracking emails and shipping labels.

import { Money } from './money';
import { currencyInfo } from './currency';

export function formatNumber(value: number, locale = 'en-US',
  options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatMoney(value: Money, locale = 'en-US'): string {
  const info = currencyInfo(value.currency);
  const factor = 10 ** info.minorUnits;
  const display = Number(value.amount) / factor;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: info.code,
    minimumFractionDigits: info.minorUnits,
    maximumFractionDigits: info.minorUnits,
  }).format(display);
}

export function formatDate(ms: number, locale = 'en-US',
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(ms));
}

export function formatDateTime(ms: number, locale = 'en-US'): string {
  return formatDate(ms, locale, { dateStyle: 'medium', timeStyle: 'short' });
}

export function formatRange(startMs: number, endMs: number, locale = 'en-US'): string {
  const fmt = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  if ('formatRange' in fmt) {
    return (fmt as Intl.DateTimeFormat & { formatRange(s: Date, e: Date): string })
      .formatRange(new Date(startMs), new Date(endMs));
  }
  return `${formatDate(startMs, locale)} - ${formatDate(endMs, locale)}`;
}
