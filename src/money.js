// An amount in the studio's own currency ({ code, locale } from Settings). Mirrors format() in public/js/studio-settings.js.
export function formatMoney(amount, currency) {
  const n = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(n);
  } catch (e) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  }
}
