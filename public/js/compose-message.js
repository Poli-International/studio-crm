/**
 * The CRM does not send email, SMS or chat messages itself. When a server action prepares one
 * (aftercare email, reminder, purchase order, business reply...), its JSON response carries
 * `compose: { to_email, to_phone, subject, body, channel }`. This shows a small panel with
 * buttons that open the studio's own email, WhatsApp or LINE with the message filled in;
 * staff press send there. A click on the panel is a user gesture, so no popup blocker.
 */
(function () {
  'use strict';

  var nativeFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    return nativeFetch(input, init).then(function (res) {
      var method = (init && init.method) || 'GET';
      var url = typeof input === 'string' ? input : (input && input.url) || '';
      if (method !== 'GET' && url.indexOf('/api/') !== -1 && res.ok) {
        res.clone().json().then(function (data) {
          if (data && data.compose && data.compose.body) showCompose(data.compose);
        }).catch(function () {});
      }
      return res;
    });
  };

  function digits(phone) { return String(phone || '').replace(/[^\d]/g, ''); }

  function showCompose(c) {
    var old = document.getElementById('compose-message-panel');
    if (old) old.remove();
    var text = (c.subject ? c.subject + '\n\n' : '') + c.body;
    var t = encodeURIComponent(text);
    var links = [
      ['✉️ Email', 'mailto:' + encodeURIComponent(c.to_email || '') + '?subject=' + encodeURIComponent(c.subject || '') + '&body=' + encodeURIComponent(c.body)],
      ['💬 WhatsApp', 'https://wa.me/' + digits(c.to_phone) + '?text=' + t],
      ['🟢 LINE', 'https://line.me/R/share?text=' + t]
    ];
    var panel = document.createElement('div');
    panel.id = 'compose-message-panel';
    panel.style.cssText = 'position:fixed;right:20px;bottom:20px;z-index:2147483000;width:340px;max-width:calc(100vw - 40px);background:#0F172A;border:1px solid #38BDF8;border-radius:12px;padding:14px;color:#E2E8F0;box-shadow:0 12px 40px rgba(0,0,0,0.5);font-size:0.85rem;';
    var head = document.createElement('div');
    head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';
    head.innerHTML = '<strong>Message ready</strong>';
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = '×';
    close.setAttribute('aria-label', 'Close');
    close.style.cssText = 'background:none;border:none;color:#94A3B8;font-size:1.3rem;cursor:pointer;';
    close.onclick = function () { panel.remove(); };
    head.appendChild(close);
    panel.appendChild(head);
    var note = document.createElement('div');
    note.style.cssText = 'color:#94A3B8;margin-bottom:8px;';
    note.textContent = 'The CRM does not send messages. Open it in your own app and press send.';
    panel.appendChild(note);
    var who = document.createElement('div');
    who.setAttribute('data-no-phrase', '');
    who.style.cssText = 'margin-bottom:8px;word-break:break-all;';
    who.textContent = [c.to_email, c.to_phone].filter(Boolean).join(' · ');
    if (who.textContent) panel.appendChild(who);
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;';
    links.forEach(function (l) {
      var a = document.createElement('a');
      a.href = l[1];
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = l[0];
      a.style.cssText = 'padding:6px 10px;background:#1E293B;border:1px solid #334155;border-radius:6px;color:#38BDF8;text-decoration:none;font-weight:700;';
      row.appendChild(a);
    });
    var copy = document.createElement('button');
    copy.type = 'button';
    copy.textContent = '📋 Copy';
    copy.style.cssText = 'padding:6px 10px;background:#1E293B;border:1px solid #334155;border-radius:6px;color:#38BDF8;font-weight:700;cursor:pointer;';
    copy.onclick = function () {
      (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(function () {
        copy.textContent = '✅ Copied';
      }).catch(function () {});
    };
    row.appendChild(copy);
    panel.appendChild(row);
    document.body.appendChild(panel);
  }

  window.showComposeMessage = showCompose;
})();
