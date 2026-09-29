// Re-export i18n from public/i18n.js for bundlers and testing modules
import '../public/i18n.js';
export default (typeof window !== 'undefined' && window.i18n) ? window.i18n : null;
