/**
 * Keeps the CRM's browser-side datasets (studio settings and prices, tips, closing
 * checklists, aftercare dispatches, macros, before/after pairs, client photos...) in the
 * studio database via /api/app-data, so they survive a cleared browser and are shared
 * by every computer in the studio.
 *
 * Loaded first, before any app script: it copies the server's values into localStorage
 * (synchronously, so the app reads them on start-up), then mirrors every later write back.
 * Values that exist only in this browser (from before this sync existed) are uploaded once.
 * ponytail: last write wins per key; per-record merging if two desks edit the same list at once.
 */
(function () {
  'use strict';

  var SYNCED = /^(studio_(ba_pairs|scheduled_reports|portal_pinned_notes|tip_records|sanitization_logs|aftercare_dispatches|messenger_macros|before_after_gallery|vat_config|remote_sync_config)|poli_(studio_profile|studio_logo|benchmark_studio_rates_v1|tattoo_estimate_draft)|client_photo_[A-Za-z0-9_]+)$/;
  var proto = Storage.prototype;
  var setItem = proto.setItem, removeItem = proto.removeItem;

  function send(method, key, value) {
    try {
      fetch('/api/app-data/' + encodeURIComponent(key), {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'PUT' ? JSON.stringify({ value: value }) : undefined,
        keepalive: method !== 'PUT' || value.length < 60000
      }).catch(function () {});
    } catch (e) {}
  }

  // 1. Pull the studio's saved values before the app starts reading them.
  var server = null;
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/app-data', false);
    xhr.send();
    if (xhr.status === 200) server = JSON.parse(xhr.responseText);
  } catch (e) {}

  if (server && typeof server === 'object') {
    Object.keys(server).forEach(function (k) {
      if (SYNCED.test(k)) { try { setItem.call(localStorage, k, server[k]); } catch (e) {} }
    });
    // Upload anything only this browser has.
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (SYNCED.test(k) && !(k in server)) send('PUT', k, localStorage.getItem(k));
    }
  }

  // 2. Mirror every later change.
  proto.setItem = function (key, value) {
    setItem.call(this, key, value);
    if (this === localStorage && SYNCED.test(key)) send('PUT', key, String(value));
  };
  proto.removeItem = function (key) {
    removeItem.call(this, key);
    if (this === localStorage && SYNCED.test(key)) send('DELETE', key);
  };
})();
