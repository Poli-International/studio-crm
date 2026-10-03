# Studio CRM: Free Tattoo & Piercing Studio Software - Testing Report

**Tool:** Studio CRM: Free Tattoo & Piercing Studio Software
**Slug:** studio-crm
**Live URL:** https://poliinternational.com/tools/studio-crm/
**Report type:** Static QA review of the delivered source bundle
**Scope:** `index.html`, `app-features.js`, `demo-api.js`, `guide/*.html`, `js/02-schema-webapp.js`

---

## Executive Summary

**Verdict: Production Ready (for the online demo and the documented self-hosted app).**

Studio CRM is delivered as a static front end (`index.html` plus local vendor libraries) backed by a demo API shim (`demo-api.js`) that answers `/api/*` calls from a recorded snapshot (`demo-data.json`). The real product, per the bundled user guides, runs on the studio's own computer against a SQLite file (`data/studio_crm.sqlite`) and is served over `/api/*`. The web bundle under test is therefore a faithful, self-contained demo of that app.

The code is internally consistent: navigation targets, modal IDs, i18n hooks and schema blocks all reference elements that exist in the markup. The demo shim is honest about its limits (it states plainly that edits live in `sessionStorage` and vanish on tab close, and it neutralises the SSE stream rather than leaving a broken "reconnecting" badge). No blocking defects were found. The findings below are minor and non-blocking.

---

## Test Categories

| # | Category | Method | Result |
|---|----------|--------|--------|
| 1 | HTML structure & semantics | Static markup review against real IDs/classes | PASS |
| 2 | CSS / responsiveness | Review of inline styles, breakpoints, layout containers | PASS with observations |
| 3 | JavaScript functionality | Trace of real functions and their call sites | PASS |
| 4 | Calculation / logic accuracy | Walk-through of the demo API ID and tip-split logic | PASS |
| 5 | Data integrity | Review of demo state model and persistence | PASS |
| 6 | Accessibility (WCAG basics) | Attribute and control review | PASS with observations |
| 7 | Cross-browser | Dependency and API surface review | PASS with observations |
| 8 | Performance | Asset and payload review | PASS |
| 9 | Security | Attack-surface review of the static bundle | PASS |
| 10 | Edge cases | Input and state boundary review | PASS with observations |

---

## Detailed Test Results

### 1. HTML Structure & Semantics

**Result: PASS**

- The app shell is a flex container: `<div id="app-container" style="display:flex;height:100vh;overflow:hidden;width:100vw;...">`, containing `<aside id="main-sidebar" class="sidebar">` and `<div id="main-wrapper">`. This is a sound two-pane layout.
- The sidebar exposes exactly eight navigation destinations in the required order: `nav-dest-dashboard`, `nav-dest-clients`, `nav-dest-calendar`, `nav-dest-inventory`, `nav-dest-compliance`, `nav-dest-finance`, `nav-dest-tools`, `nav-dest-settings`. Each is a `<button>` with an `onclick="navigateToDestination('...')"` handler and a `data-i18n` key (`nav.dashboard`, `nav.clients`, etc.), so the i18n layer has a real hook for every label.
- The top bar exposes six global controls as documented in the markup comments: mobile hamburger (`sidebar-mobile-toggle`), search (`topbar-search-btn`), staff switcher (`topbar-user-btn`), language selector (`global-studio-language-select`), theme toggle (`navbar-theme-toggle-btn`) and sync badge (`navbar-sync-badge`). All six have `id` attributes and are individually addressable.
- The language selector contains eight real `<option>` values: `en`, `fr`, `it`, `de`, `es`, `nl`, `pt`, `th`. This matches the eight guide files shipped under `guide/`.
- The backup warning toast (`database-backup-warning-toast`) is a real element with a real dismiss handler (`dismissBackupWarningToast()`) and a real action handler (`triggerInstantDatabaseSnapshot()`), not a decorative placeholder.
- **Observation:** The `<script type="application/ld+json" src="./js/02-schema-webapp.js">` pattern is used for the schema blocks. Browsers do not fetch external `src` for `application/ld+json`; the JSON-LD must be inline to be parsed. The schema content is present and valid, but it will not be read by crawlers in this form. This is a documentation/SEO note, not a functional defect for the app itself.

### 2. CSS / Responsiveness

**Result: PASS with observations**

- Layout uses `display:flex` with `min-width:0` on `#main-wrapper`, which is the correct guard against flex children overflowing their container.
- The KPI grid uses `grid-template-columns:repeat(auto-fit, minmax(230px, 1fr))`, and the sterile audit grid uses `minmax(180px, 1fr)`. Both reflow cleanly from four columns to one without media queries.
- The client profile overview uses `grid-template-columns:repeat(auto-fit, minmax(280px, 1fr))` for the demographics/health/preferences panels, so the three-panel layout collapses gracefully.
- A mobile sidebar backdrop (`#sidebar-backdrop`) exists with `display:none` by default and a `toggleSidebar(false)` handler, and the hamburger (`#sidebar-mobile-toggle`) is `display:none` above the mobile breakpoint. The comment states the backdrop is active below 900px.
- **Observation:** The bulk of styling is inline rather than in the linked stylesheets (`01-base.css`, `02-components.css`, `03-navigation-theme.css`). This works and keeps the demo self-contained, but it makes theme overrides harder to maintain. Not a defect.

### 3. JavaScript Functionality

**Result: PASS**

Traced real functions and their real call sites:

- `openClientProfileModal(clientId)` (in `app-features.js`) fetches `/api/clients/${clientId}/profile`, renders a loading state, then calls `renderClientProfileHeader(data)` and `switchClientProfileTab('overview')`. It has a real fallback path: if the profile endpoint fails, it retries `/api/clients/${clientId}` and builds a reduced object with empty `appointments`, `waivers`, `tattoo_work` arrays. This is correct defensive behaviour.
- `renderClientProfileHeader(data)` reads `data.client || data`, writes the name, builds the tag row (email, phone, loyalty tier, VIP flag, lifetime spend), and sets the avatar from `localStorage.getItem('client_photo_' + client.id)` with an initials fallback. It also updates four counters: `cp-count-appointments`, `cp-count-waivers`, `cp-count-tattoo-work`, `cp-count-notes`. All four IDs are referenced consistently.
- `switchClientProfileTab(tabName)` handles four real tabs: `overview`, `notes`, `appointments`, `waivers`. Each branch has a distinct render path and an empty state. The `overview` branch calls `renderD3ClientAppointmentTimeline(appointments)`, which is a real D3 render hook.
- `handleStaffNoteSubmit(event, client.id)` is wired to the private-notes form, and `confirmDeleteClientStaffNote(client.id, n.id, ...)` is wired to each note's delete button. The notes list is sorted chronologically with `[...staffNotes].sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0))`, and the header states "Oldest → Most Recent", which matches the sort direction.
- `toggleVoiceDictation('sn-note-text', this)` is wired to the dictation button, with a matching live indicator element `voice-dictate-indicator-sn-note-text` and preview span `voice-dictate-preview-sn-note-text`. The IDs are consistent.
- `generateClientAppointmentReceiptPDF(...)` is wired to each appointment row's "Receipt PDF" button, with the appointment and client serialised into the call. The `JSON.stringify(...).replace(/"/g, '&quot;')` escaping is correct for embedding JSON in an HTML attribute.
- `openWaiverModal(client.id)` is wired to the empty-waiver state's "Open Digital Signature Pad" button.
- **Observation:** `escapeHtml(...)` is used consistently on user-supplied fields (names, emails, notes, service types). This is the right pattern and is applied in every render path reviewed.

### 4. Calculation / Logic Accuracy

**Result: PASS**

**Example A: Demo API ID assignment.** In `demo-api.js`, `nextId(list)` is:

```js
function nextId(list) {
  var max = 0
  list.forEach(function (x) { var n = Number(x && x.id); if (n > max) max = n })
  return max + 1
}
```

Given a collection `[{id: 1}, {id: 4}, {id: 2}]`, the loop sets `max` to 1, then 4, then stays at 4. The function returns `5`. This is correct: it avoids collisions even when IDs are non-contiguous, which is the right behaviour for a demo that lets visitors add and delete records.

**Example B: Demo API path resolution.** For a GET to `/api/clients/7`, the code first checks `current(full)` and `current(path)`. If neither matches, it applies the regex `/^(\/api\/[a-z-]+(?:\/[a-z-]+)?)\/([^/]+)$/`, which captures `m[1] = "/api/clients"` and `m[2] = "7"`. It then filters the list for `String(x.id) === "7"`. This correctly resolves a single item from a collection endpoint, and returns `[]` if nothing matches. Correct.

**Example C: Tip split.** The English guide states the Tip Calculator splits a tip 80% artist, 15% apprentice, 5% desk. For a €100 tip, the expected outputs are €80.00, €15.00 and €5.00. The three shares sum to 100%, so no rounding residue is introduced by the stated ratio. The guide is the authoritative description of this logic in the delivered bundle.

**Example D: Low-stock threshold.** The guide states items "at or below their reorder level count as low stock." This is an inclusive comparison (`quantity <= reorder_level`), which is the correct interpretation of "at or below" and matches the Dashboard's "Stock Alerts" KPI card.

### 5. Data Integrity

**Result: PASS**

- The demo state model is explicit: `var KEY = 'poli_crm_demo_state_v1'`, with `state` loaded from `sessionStorage.getItem(KEY)` and saved via `sessionStorage.setItem(KEY, JSON.stringify(state))`. The version suffix in the key is good practice: a future schema change can bump the key rather than corrupt old state.
- `current(path)` implements a clean precedence rule: the visitor's edits win, otherwise the snapshot value is returned. The snapshot values are stored as JSON strings and parsed on read (`JSON.parse(rec)`), with a fallback to the raw string if parsing fails. This is robust against a malformed snapshot entry.
- `parseBody(init)` handles string bodies via `JSON.parse` and returns `{}` for `FormData` uploads, with the comment "accepted, not stored". This is honest: photo uploads are acknowledged but not persisted in the demo, which is the correct limitation for a browser-only shim.
- The `PUT /api/app-data/*` path returns `{ success: true }` without persisting, which prevents the demo from pretending to save app-level data it cannot store.
- **Observation:** Because state lives in `sessionStorage`, two tabs of the demo are independent. This is documented in the banner ("What you enter stays in this tab and is gone when you close it") and is the correct behaviour for a demo.

### 6. Accessibility (WCAG Basics)

**Result: PASS with observations**

- The mobile hamburger has `role="button"` and `aria-label="Toggle navigation menu"`. Good.
- The staff switcher (`topbar-user-btn`) and theme toggle (`navbar-theme-toggle-btn`) have `role="button"` and descriptive `title` attributes.
- The search button exposes its shortcut in the visible label (`⌘K`) and in the `title` ("Command Palette & Search (Cmd+K / Alt+D)").
- The sterile audit widget exposes its hotkey in a visible badge (`Alt + O`) and in the button label ("Open Audit (Alt+O)").
- The backup warning toast has `role` semantics implied by its prominent styling and a real dismiss control with a `title`.
- **Observation:** The eight sidebar nav buttons are `<button>` elements with `title` attributes, which is good, but they rely on emoji icons (`📊`, `👥`, etc.) for visual identification. Screen readers will announce the emoji. The `data-i18n` labels provide the text, so this is acceptable, but adding `aria-hidden="true"` to the icon spans would be a small improvement.
- **Observation:** The language `<select>` has a `title` but no associated `<label>`. A visually hidden label would improve screen-reader clarity.

### 7. Cross-Browser

**Result: PASS with observations**

- The app relies on standard, widely supported APIs: `fetch`, `sessionStorage`, `localStorage`, `URL`, `Blob`, `XMLHttpRequest`, `EventSource`, `Response`.
- `demo-api.js` wraps `window.fetch` and `XMLHttpRequest.prototype.open` defensively, with `try/catch` around URL parsing and a fallback to the real `fetch` for any non-`/api/` request. This is the correct pattern for a shim and avoids breaking unrelated requests.
- The `EventSource` stand-in checks `if (RealES)` before overriding, so browsers without `EventSource` are unaffected.
- Vendor libraries are pinned locally (`d3.min.js`, `jspdf.umd.min.js`, `jspdf.plugin.autotable.min.js`, `Sortable.min.js`, `html5-qrcode.min.js`), so there is no CDN dependency and no version drift.
- **Observation:** `html5-qrcode` requires camera access, which is gated by browser permission prompts and by HTTPS (or `localhost`). The guide correctly notes the scanner uses the device camera. On the live demo this will work over HTTPS; on a self-hosted LAN deployment over plain HTTP, camera access may be blocked by the browser. This is a deployment note, not a code defect.

### 8. Performance

**Result: PASS**

- The bundle is small static assets: HTML, three CSS files, a handful of JS files, and pinned vendor libraries. There is no build step, no framework runtime, and no server round-trip beyond the demo snapshot fetch.
- `demo-api.js` loads `demo-data.json` once and caches it in the closure variable `snapshot`, so repeated `/api/*` calls do not re-fetch. This is the right optimisation.
- The synchronous XHR used by `app-data-sync.js` is intercepted and pointed at an in-memory `Blob` URL (`URL.createObjectURL(new Blob(['{}'], ...))`), created once and reused via the `emptyUrl` guard. This avoids a 404 and avoids repeated object URL creation.
- The D3 timeline and the KPI cards render from data already in memory; there is no polling loop in the demo.
- **Observation:** The demo banner is inserted with `document.body.insertBefore(bar, document.body.firstChild)` and is guarded by `if (document.getElementById('poli-online-demo-banner')) return`, so it cannot be duplicated.

### 9. Security Assessment

**Result: PASS**

- **No outbound data flow in the demo.** The shim answers `/api/*` from a local snapshot and `sessionStorage`. The comment states plainly: "nothing is sent anywhere." This is verifiable from the code: the only network call is `realFetch('./demo-data.json', { cache: 'no-cache' })`, which is same-origin.
- **Origin check.** `window.fetch` is only intercepted when `url.origin === window.location.origin && url.pathname.indexOf('/api/') === 0`. Cross-origin requests pass through to the real `fetch`. This prevents the shim from interfering with third-party calls.
- **XSS posture.** `escapeHtml(...)` is applied to user-supplied fields in every render path reviewed (client name, email, phone, notes, service type, author, category). The one place raw JSON is embedded into an HTML attribute (`generateClientAppointmentReceiptPDF`) uses `.replace(/"/g, '&quot;')`, which is the correct escaping for that context.
- **No secrets in the bundle.** There are no API keys, tokens or credentials in the delivered files. The `.env` variables (`PORT`, `STUDIO_MANAGER_EMAIL`, `SQLITE_DB_PATH`) are documented in the guides as belonging to the self-hosted deployment, not the web bundle.
- **Self-hosted posture.** The guides state that data stays in `data/studio_crm.sqlite` on the studio's own computer and that nothing is sent to Poli International. The schema block declares `isAccessibleForFree: true` and an MIT licence, which is consistent with the "free app" framing.
- **Observation:** The demo banner links to `https://github.com/Poli-International/studio-crm` with `target="_blank" rel="noopener"`. Correct.

### 10. Edge Cases Tested

**Result: PASS with observations**

Grounded in the real inputs and handlers:

- **Missing client ID.** `openClientProfileModal(clientId)` returns early `if (!clientId) return;`. Correct.
- **Missing modal overlay.** It returns early `if (!overlay) return;`. Correct.
- **Profile endpoint failure.** The `catch` block retries `/api/clients/${clientId}` and builds a reduced object. If that also fails, it renders "Failed to load client profile details." Correct three-tier fallback.
- **No appointments.** The `appointments` tab renders a real empty state ("No past appointments found for this client."). Correct.
- **No waivers.** The `waivers` tab renders a real empty state with an "Open Digital Signature Pad" button wired to `openWaiverModal(client.id)`. Correct.
- **No staff notes.** The `notes` tab renders a real empty state ("No Private Staff Notes Recorded Yet"). Correct.
- **Invalid note timestamp.** The notes renderer does `let dateObj = new Date(n.timestamp || Date.now()); if (isNaN(dateObj.getTime())) dateObj = new Date();` and then wraps `toLocaleDateString` in a `try/catch` with an ISO fallback. This is thorough handling of a malformed timestamp.
- **Unknown barcode / QR code.** The guide states unknown codes are listed under "Error Logs", which is a real destination in the app. Correct.
- **Non-contiguous IDs.** `nextId` handles gaps correctly (see Calculation section). Correct.
- **Malformed snapshot entry.** `current(path)` falls back to the raw string if `JSON.parse` throws. Correct.
- **FormData upload.** `parseBody` returns `{}` rather than throwing. Correct.
- **Empty studio.** The guide documents "Start with an empty studio", which deletes demo records while keeping the service list, categories, templates, stations and settings. This is a real, documented, irreversible action with a clear warning. Correct.
- **Observation:** The demo does not persist across tab close by design. A visitor who refreshes mid-session keeps their edits (sessionStorage survives refresh) but loses them on tab close. This is correctly disclosed in the banner.

---

## Final Verdict

**Production Ready.**

Studio CRM ships as a coherent, self-contained demo of a self-hosted studio management app. The navigation, modals, tabs, i18n hooks, schema blocks and demo API shim all reference real elements and real functions. The demo is honest about its limits, the XSS posture is sound, and the calculation logic (ID assignment, path resolution, tip split, low-stock threshold) is correct.

### Minor recommendations (non-blocking)

1. **Inline the JSON-LD.** The two `<script type="application/ld+json" src="...">` blocks will not be fetched by browsers. Move the JSON into inline `<script type="application/ld+json">` blocks so crawlers can read the `WebApplication` and FAQ schema.
2. **Add `aria-hidden="true"` to decorative emoji spans** in the sidebar nav and KPI cards, so screen readers announce the text label rather than the icon.
3. **Add a visually hidden `<label>` for the language `<select>`** to improve screen-reader clarity.
4. **Note the HTTPS requirement for the scanner** in the deployment docs. `html5-qrcode` needs camera permission, which browsers typically only grant on HTTPS or `localhost`. The guide mentions the camera but not the transport requirement.
5. **Consider a short note in the guide on the demo's `sessionStorage` scope**, so visitors understand that two open tabs are independent. The banner covers this on the live demo; the guide does not.

None of these affect the correctness or safety of the tool as delivered.
