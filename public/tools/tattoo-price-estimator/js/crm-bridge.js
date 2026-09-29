/**
 * Studio CRM bridge for the Tattoo Price Estimator.
 *
 * This file exists ONLY in the CRM's copy of the tool. The standalone build on
 * poliinternational.com does not load it.
 *
 * WHY THIS WAS REWRITTEN
 * The first version found the estimate by looking for cards labelled "Estimated
 * Time" and "Estimated Sessions". That worked against the old build, which was
 * English only and asked Gemini for a price.
 *
 * Both halves of that are now false. The tool computes locally, and it ships
 * seven languages with a selector in its header. An English label match breaks
 * the moment a studio owner picks Francais, and it breaks silently: the panel
 * simply never appears, which reads as "the CRM feature is gone" rather than as
 * a bug.
 *
 * HOW IT FINDS THE NUMBERS NOW
 * The tool exposes window.DICTIONARIES and window.getLanguage(). So instead of
 * guessing at rendered text, this asks the tool what a given key says in the
 * language currently on screen, turns that template into a regular expression
 * by replacing each {token} with a capture group, and matches it against the
 * page.
 *
 * `result.time_estimate` in English reads:
 *     "Estimated chair time: approximately {hoursLow} to {hoursHigh} hours"
 * and in French:
 *     "Temps de pique estime : environ {hoursLow} a {hoursHigh} heures"
 * One mechanism reads both, and any language added later, without this file
 * knowing a single word of it.
 *
 * The numbers themselves are safe to parse: they are raw JavaScript numbers
 * rendered by React, never locale-formatted, so a decimal point stays a point.
 *
 * WHAT IS STILL TRUE FROM THE FIRST VERSION
 * The tool estimates the WORK, the studio's settings decide the MONEY. The tool
 * returns an observed market range that knows nothing about this studio, so the
 * quote is built from estimatedHours priced at the owner's own rate, with their
 * own minimum, tax treatment and deposit rule. The tool's range stays on screen
 * as a market reference, labelled as one.
 *
 * Handshake: the CRM parent posts {type:'crm-host'} once the iframe loads.
 */
(function () {
  'use strict';

  if (window.self === window.top) return;      // not embedded, nothing to do

  var panel = null;
  var active = false;

  /* --------------------------------------------- the tool's own strings -- */

  // Ask the tool, not our own memory, what it currently says.
  function template(key) {
    try {
      var lang = (window.getLanguage && window.getLanguage()) || 'en';
      var dicts = window.DICTIONARIES || {};
      var d = dicts[lang] || dicts.en || {};
      return d[key] || (dicts.en && dicts.en[key]) || null;
    } catch (e) {
      return null;
    }
  }

  var escapeRe = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };

  // Turn "approximately {hoursLow} to {hoursHigh} hours" into a regex that
  // captures both numbers, in whatever language the template arrived in.
  function templateMatcher(key, tokens) {
    var tpl = template(key);
    if (!tpl) return null;
    var order = [];
    var pattern = '';
    var rest = tpl;
    var re = /\{(\w+)\}/g, m, last = 0;
    while ((m = re.exec(tpl))) {
      pattern += escapeRe(tpl.slice(last, m.index));
      if (tokens.indexOf(m[1]) >= 0) { pattern += '(-?[\\d.,]+)'; order.push(m[1]); }
      else { pattern += '.*?'; }                 // a token we do not need
      last = m.index + m[0].length;
    }
    pattern += escapeRe(tpl.slice(last));
    // Whitespace in the DOM will not match the template's single spaces.
    pattern = pattern.replace(/\\?\s+/g, '\\s+');
    try { return { re: new RegExp(pattern), order: order }; } catch (e) { return null; }
  }

  function readByTemplate(key, tokens) {
    var matcher = templateMatcher(key, tokens);
    if (!matcher) return null;
    var text = document.body ? document.body.textContent.replace(/\s+/g, ' ') : '';
    var m = text.match(matcher.re);
    if (!m) return null;
    var out = {};
    for (var i = 0; i < matcher.order.length; i++) {
      var raw = String(m[i + 1]).replace(/,/g, '');
      var n = parseFloat(raw);
      if (!isFinite(n)) return null;
      out[matcher.order[i]] = n;
    }
    return out;
  }

  /* ------------------------------------------------ reading the result --- */

  function readEstimate() {
    var hours = readByTemplate('result.time_estimate', ['hoursLow', 'hoursHigh']);
    if (!hours) return null;

    // Multi-session copy only renders for large pieces; one sitting otherwise.
    var sessions = readByTemplate('session.summary', ['count']);

    return {
      hoursLow: hours.hoursLow,
      hoursHigh: hours.hoursHigh,
      hours: (hours.hoursLow + hours.hoursHigh) / 2,
      sessions: sessions && sessions.count > 0 ? Math.round(sessions.count) : 1,
      language: (window.getLanguage && window.getLanguage()) || 'en'
    };
  }

  // The tool's own range, for the market-reference line. Rendered inline rather
  // than through a template, but currency symbols and digits do not translate.
  function readToolRange() {
    var el = document.getElementById('root');
    if (!el) return null;
    var m = el.textContent.replace(/\s+/g, ' ')
      .match(/([^\s\d]{1,3})\s?([\d.,]+)\s*[–—-]\s*([^\s\d]{1,3})\s?([\d.,]+)/);
    return m ? m[1] + m[2] + ' - ' + m[3] + m[4] : null;
  }

  function readRegion() {
    var el = document.getElementById('region-select-input');
    if (!el || el.selectedIndex < 0) return null;
    return el.options[el.selectedIndex].text.trim();
  }

  /* ------------------------------------------------------ the settings --- */

  function settings() {
    try {
      if (window.parent.StudioSettings) return window.parent.StudioSettings.get();
    } catch (e) { /* not same-origin, or not loaded */ }
    return null;
  }

  function money(amount) {
    try {
      if (window.parent.StudioSettings) return window.parent.StudioSettings.format(amount);
    } catch (e) { /* fall through */ }
    return Number(amount).toFixed(2);
  }

  /* ----------------------------------------------------- the arithmetic -- */

  // Unchanged in spirit from the first version: derive everything at the moment
  // it is shown, so a rate changed in Settings never leaves a stale figure.
  function quote(est, s) {
    var labour = est.hours * s.pricing.hourlyRate;
    var floored = labour < s.pricing.minimumCharge;
    var subtotal = floored ? s.pricing.minimumCharge : labour;

    var tax = 0, total = subtotal;
    if (s.tax.enabled && s.tax.ratePercent > 0) {
      var r = s.tax.ratePercent / 100;
      if (s.tax.pricesIncludeTax) tax = subtotal - (subtotal / (1 + r));
      else { tax = subtotal * r; total = subtotal + tax; }
    }

    var deposit = (s.deposit.mode === 'fixed')
      ? s.deposit.fixed
      : total * (s.deposit.percent / 100);

    return {
      hours: est.hours,
      hoursLow: est.hoursLow,
      hoursHigh: est.hoursHigh,
      sessions: est.sessions,
      rate: s.pricing.hourlyRate,
      labour: labour,
      floored: floored,
      subtotal: subtotal,
      tax: tax,
      taxIncluded: !!s.tax.pricesIncludeTax,
      total: total,
      deposit: deposit,
      balance: s.deposit.deductedFromBalance ? (total - deposit) : total,
      perSessionMinutes: Math.round((est.hours / est.sessions) * 60)
    };
  }

  /* ------------------------------------------------------------- the UI -- */

  function el(tag, css, text) {
    var n = document.createElement(tag);
    if (css) n.style.cssText = css;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  var ROW = 'display:flex;justify-content:space-between;gap:1rem;padding:6px 0;font-size:0.9rem;';

  function row(parent, label, value, strong) {
    var r = el('div', ROW + (strong ? 'font-weight:800;font-size:1rem;' : ''));
    r.appendChild(el('span', 'color:' + (strong ? '#F9FAFB' : '#9CA3AF') + ';', label));
    r.appendChild(el('span', 'color:' + (strong ? '#34D399' : '#E5E7EB') + ';font-variant-numeric:tabular-nums;', value));
    parent.appendChild(r);
  }

  function ensurePanel() {
    if (panel && panel.isConnected) return panel;
    var root = document.getElementById('root');
    if (!root || !root.parentNode) return null;
    panel = el('div', 'max-width:900px;margin:1.5rem auto 3rem;padding:1.5rem;' +
      'background:#111827;border:2px solid #F59E0B;border-radius:16px;' +
      'font-family:Roboto,system-ui,sans-serif;color:#E5E7EB;display:none;');
    panel.id = 'crm-studio-quote';
    root.parentNode.insertBefore(panel, root.nextSibling);
    return panel;
  }

  function render() {
    var p = ensurePanel();
    if (!p) return;

    var est = readEstimate();
    var s = settings();
    if (!est || !s) { p.style.display = 'none'; return; }

    var q = quote(est, s);
    p.innerHTML = '';
    p.style.display = 'block';

    var head = el('div', 'display:flex;align-items:baseline;gap:0.6rem;flex-wrap:wrap;margin-bottom:0.25rem;');
    head.appendChild(el('div', 'font-size:1.1rem;font-weight:900;color:#F59E0B;', 'Your Studio Quote'));
    if (s.sample) {
      head.appendChild(el('span', 'font-size:0.7rem;font-weight:700;color:#FDE68A;background:#78350F;' +
        'border:1px solid #B45309;border-radius:999px;padding:2px 8px;', 'SAMPLE RATES'));
    }
    p.appendChild(head);

    p.appendChild(el('div', 'font-size:0.78rem;color:#9CA3AF;line-height:1.5;margin-bottom:1rem;',
      s.sample
        ? 'Priced at the sample hourly rate, because your own rates have not been set yet. Open Settings and enter them, and this recalculates.'
        : 'The tool estimates how long the piece takes. Your Settings decide what it costs.'));

    var body = el('div', 'border-top:1px solid #374151;padding-top:0.75rem;');
    row(body, est.hoursLow + ' to ' + est.hoursHigh + ' hours at ' + money(q.rate) + '/hr',
      money(q.labour) + '  (mid ' + est.hours + 'h)');
    if (q.floored) row(body, 'Studio minimum applied', money(q.subtotal));
    if (q.tax > 0) row(body, 'Tax (' + s.tax.ratePercent + '%)' + (q.taxIncluded ? ', included' : ''), money(q.tax));
    row(body, 'Total', money(q.total), true);
    p.appendChild(body);

    var dep = el('div', 'border-top:1px solid #374151;margin-top:0.5rem;padding-top:0.75rem;');
    row(dep, 'Deposit to book' + (s.deposit.mode === 'percent' ? ' (' + s.deposit.percent + '%)' : ''), money(q.deposit));
    row(dep, s.deposit.deductedFromBalance ? 'Balance on the day' : 'Due on the day', money(q.balance));
    row(dep, 'Sittings', est.sessions + ' x ' + q.perSessionMinutes + ' min');
    p.appendChild(dep);

    var range = readToolRange();
    if (range) {
      var ref = el('div', 'margin-top:0.85rem;padding:0.6rem 0.75rem;background:#0F172A;' +
        'border-radius:8px;font-size:0.72rem;color:#6B7280;line-height:1.5;');
      ref.textContent = 'For reference, the tool shows ' + range + ' as an observed market range for ' +
        (readRegion() || 'this region') + '. It does not know your rates, so it is not your quote.';
      p.appendChild(ref);
    }

    var book = el('button', 'margin-top:1.1rem;width:100%;padding:0.8rem;background:#F59E0B;' +
      'color:#111827;border:none;border-radius:10px;font-weight:900;font-size:0.95rem;cursor:pointer;',
      'Book this in the CRM');
    book.type = 'button';
    book.addEventListener('click', function () { book_(q); });
    p.appendChild(book);
  }

  /* ---------------------------------------------------------- handoff ---- */

  function describe(q) {
    var region = readRegion();
    return 'Tattoo price estimate' + (region ? ' (' + region + ')' : '') + '.\n' +
      q.hoursLow + ' to ' + q.hoursHigh + ' hours over ' + q.sessions +
      ' sitting(s), priced at ' + money(q.rate) + '/hr.\n' +
      'Total ' + money(q.total) + ', deposit ' + money(q.deposit) + '.';
  }

  function set(doc, id, value) {
    var f = doc.getElementById(id);
    if (f) f.value = value;
  }

  function book_(q) {
    var parent = window.parent, doc;
    try { doc = parent.document; } catch (e) { return; }
    try {
      if (typeof parent.closeTattooPriceEstimatorModal === 'function') parent.closeTattooPriceEstimatorModal();
      if (typeof parent.openNewAppointmentModal === 'function') parent.openNewAppointmentModal();
      else return;
    } catch (e) { return; }

    set(doc, 'new-appt-service', 'Custom Tattoo');
    set(doc, 'new-appt-duration', Math.max(15, Math.round(q.perSessionMinutes / 15) * 15));
    set(doc, 'new-appt-price', q.total.toFixed(2));
    set(doc, 'new-appt-deposit', '0');           // nothing is paid yet
    set(doc, 'new-appt-notes', describe(q));

    var client = doc.getElementById('new-appt-client');
    if (client) client.focus();
  }

  /* ------------------------------------------------------------ wiring --- */

  function start() {
    if (active) return;
    active = true;
    render();

    var pending = null;
    var schedule = function () { clearTimeout(pending); pending = setTimeout(render, 150); };

    var root = document.getElementById('root');
    if (root) new MutationObserver(schedule).observe(root, { childList: true, subtree: true });

    // The language selector re-renders everything, which the observer catches.
    // The settings can change in the parent while this sits open, which it does not.
    try { window.parent.document.addEventListener('studio-settings-changed', render); } catch (e) {}
  }

  window.addEventListener('message', function (e) {
    if (e.origin !== window.location.origin) return;
    if (!e.data || e.data.type !== 'crm-host') return;
    start();
  });

  // Exposed so the checks can drive the pure parts directly rather than infer
  // them from rendered text.
  window.CrmPriceBridge = {
    quote: quote,
    readEstimate: readEstimate,
    templateMatcher: templateMatcher
  };
})();
