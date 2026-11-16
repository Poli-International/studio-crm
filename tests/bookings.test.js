import { describe, it, expect } from 'vitest';
import { findClash, toTimestamp } from '../src/bookings.js';
import { paymentError, paymentAmount } from '../src/payments.js';
import { studioDay } from '../src/studio-day.js';

const at = (h, m = 0) => `2031-03-01T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`;
const appt = (over) => ({ id: 1, client_name: 'A', staff_id: 2, staff_name: 'Jax', station: 'S1', datetime: at(10), duration_minutes: 60, status: 'scheduled', ...over });

describe('findClash', () => {
  const list = [appt()];
  it('overlapping time with the same artist or station clashes, artist first', () => {
    expect(findClash(appt({ id: 9, datetime: at(10, 30), station: 'S2' }), list).same).toBe('artist');
    expect(findClash(appt({ id: 9, datetime: at(10, 30), staff_id: 3, staff_name: 'Maya' }), list).same).toBe('station');
    expect(findClash(appt({ id: 9, datetime: at(10, 30) }), list).with.id).toBe(1);
  });
  it('touching ends is not a clash', () => {
    expect(findClash(appt({ id: 9, datetime: at(11) }), list)).toBeNull();
    expect(findClash(appt({ id: 9, datetime: at(9) }), list)).toBeNull();
  });
  it('a missing duration counts as 60 minutes', () => {
    expect(findClash(appt({ id: 9, datetime: at(10, 59), duration_minutes: undefined }), list)).not.toBeNull();
    expect(findClash(appt({ id: 9, datetime: at(9, 1), duration_minutes: undefined }), list)).not.toBeNull();
  });
  it('an artist with a name only is matched by name, trimmed, any case; no name never matches', () => {
    const named = [appt({ staff_id: null, staff_name: 'Guest Artist', station: '' })];
    expect(findClash(appt({ id: 9, staff_id: null, staff_name: ' guest artist ', station: '' }), named).same).toBe('artist');
    const none = [appt({ staff_id: null, staff_name: 'Unassigned Professional', station: '' })];
    expect(findClash(appt({ id: 9, staff_id: null, staff_name: 'Unassigned Professional', station: '' }), none)).toBeNull();
    expect(findClash(appt({ id: 9, staff_id: null, staff_name: '', station: '' }), [appt({ staff_id: null, staff_name: '', station: '' })])).toBeNull();
  });
  it('cancelled and no-show do not block; an appointment never clashes with itself', () => {
    expect(findClash(appt({ id: 9 }), [appt({ status: 'cancelled' })])).toBeNull();
    expect(findClash(appt({ id: 9 }), [appt({ status: 'no-show' })])).toBeNull();
    expect(findClash(appt(), list)).toBeNull();
  });
});

describe('toTimestamp', () => {
  it('gives a full timestamp, or null', () => {
    expect(toTimestamp('2031-03-01T10:00:00+00:00')).toBe(at(10));
    for (const x of [undefined, null, '', 'not-a-date']) expect(toTimestamp(x)).toBeNull();
  });
});

describe('paymentError', () => {
  const ok = { amount: 10, method: 'Cash' };
  it('wants an amount above 0, as a number or a numeric string', () => {
    expect(paymentError(ok)).toBeNull();
    expect(paymentAmount('45.50')).toBe(45.5);
    for (const amount of [0, -1, '', '12abc', null, undefined, Infinity, NaN, [5]]) expect(paymentError({ ...ok, amount }), String(amount)).not.toBeNull();
  });
  it('wants a method, and a type of payment or refund', () => {
    expect(paymentError({ ...ok, method: '  ' })).not.toBeNull();
    expect(paymentError({ amount: 10 })).not.toBeNull();
    expect(paymentError({ ...ok, type: 'refund' })).toBeNull();
    expect(paymentError({ ...ok, type: 'gift' })).not.toBeNull();
  });
});

describe('studioDay', () => {
  it('is the local day as YYYY-MM-DD', () => {
    expect(studioDay(new Date(2031, 2, 1, 0, 30))).toBe('2031-03-01');
    expect(studioDay()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
