// A payment or a refund as the Money screen records it: the error to answer with, or null when it is good.
export const PAYMENT_TYPES = ['payment', 'refund'];

export const paymentAmount = (x) => {
  const n = typeof x === 'number' ? x : (typeof x === 'string' && x.trim() ? Number(x) : NaN);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function paymentError(b) {
  if (paymentAmount(b.amount) === null) return 'The amount must be a number above 0';
  if (typeof b.method !== 'string' || !b.method.trim()) return 'Say how it was paid';
  if (b.type !== undefined && !PAYMENT_TYPES.includes(b.type)) return 'The type must be payment or refund';
  return null;
}
