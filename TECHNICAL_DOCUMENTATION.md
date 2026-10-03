# Studio CRM: Free Tattoo & Piercing Studio Software - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support / Contact](#support--contact)

---

## Architecture Overview

Studio CRM is a self-hosted studio management application for tattoo and piercing studios. It runs on one computer inside the studio and is opened in a web browser on that computer or on any device on the studio network. Data is stored in a SQLite file on that computer; nothing is sent to Poli International.

### Technology Stack

| Layer | Technology |
|---|---|
| Markup | Static HTML5 (`index.html`) |
| Styling | Plain CSS, split into `css/01-base.css`, `css/02-components.css`, `css/03-navigation-theme.css` |
| Application logic | Vanilla JavaScript (no framework), loaded as plain `<script>` tags |
| Charts / timelines | D3.js (`js/vendor/d3.min.js`) |
| PDF generation | jsPDF + jsPDF AutoTable (`js/vendor/jspdf.umd.min.js`, `js/vendor/jspdf.plugin.autotable.min.js`) |
| Drag-and-drop | Sortable.js (`js/vendor/Sortable.min.js`) |
| QR / barcode scanning | html5-qrcode (`js/vendor/html5-qrcode.min.js`) |
| Persistence | SQLite file on the studio computer, reached over `/api/*` |
| Live updates | Server-Sent Events (SSE) activity stream |
| Internationalisation | `i18n.js` + `js/i18n-phrases.js`, 8 languages |
| Structured data | JSON-LD WebApplication schema (`js/02-schema-webapp.js`), FAQ schema (`js/03-schema-faq.js`) |

### File Structure

```
studio-crm/
├── index.html                      # App shell: sidebar, topbar, destination views
├── demo-api.js                     # Online-demo stand-in for the local server
├── i18n.js                         # Language switching
├── app-features.js                 # Client profile modal, staff notes, waivers, etc.
├── js/
│   ├── 01-boot.js                  # Boot sequence
│   ├── 02-schema-webapp.js         # JSON-LD WebApplication schema
│   ├── 03-schema-faq.js            # JSON-LD FAQ schema
│   ├── app-data-sync.js            # Reads /api/app-data before app start
│   ├── compose-message.js          # "Message ready" panel (Email / WhatsApp / LINE / Copy)
│   ├── i18n-phrases.js             # Translation phrase table
│   └── vendor/
│       ├── d3.min.js
│       ├── jspdf.umd.min.js
│       ├── jspdf.plugin.autotable.min.js
│       ├── Sortable.min.js
│       └── html5-qrcode.min.js
├── css/
│   ├── 01-base.css
│   ├── 02-components.css
│   └── 03-navigation-theme.css
├── guide/
│   ├── en.html  de.html  es.html  fr.html  it.html  nl.html  (localised user guides)
├── assets/
│   └── studio_crm_logo.jpg
├── data/
│   └── studio_crm.sqlite           # Main database (path overridable via SQLITE_DB_PATH)
└── storage/
    └── backups/                    # Snapshot copies written by the snapshot button
```

### Component / Logic Breakdown

The UI is a persistent two-pane layout: a left sidebar with **exactly 8 destinations** and a main workspace with a top bar of **6 global controls**.

**Sidebar destinations (in order):**

1. Dashboard (`nav-dest-dashboard`) - today's numbers, station status, alerts, activity feed
2. Clients (`nav-dest-clients`) - client list and profile, documents, consent forms, history
3. Calendar (`nav-dest-calendar`) - appointments, scheduling, auto scheduler, shifts, rota
4. Inventory (`nav-dest-inventory`) - stock, lots, restock, procurement, scanner
5. Compliance (`nav-dest-compliance`) - sterilisation and autoclave logs, certifications, waivers, expiry audit
6. Finance (`nav-dest-finance`) - POS, transactions, margins, commissions, deposits, tax
7. Tools (`nav-dest-tools`) - integrated Poli tools, consent form builder, calculators
8. Settings (`nav-dest-settings`) - studio details, staff accounts, preferences, theme, language

**Top bar global controls:**

1. Mobile hamburger toggle (`#sidebar-mobile-toggle`)
2. Global search / command palette (`#topbar-search-btn`, opens via `openCmdPalette()`)
3. Current active staff switcher (`#topbar-user-btn`, opens via `openStaffLoginModal()`)
4. Language selector (`#global-studio-language-select`, calls `switchStudioLanguage(value)`)
5. Theme toggle (`#navbar-theme-toggle-btn`, calls `toggleGlobalDarkMode()`)
6. Cloud sync status badge (`#navbar-sync-badge`, calls `triggerNavbarSync()`)

**Dashboard widgets:**

- Artist performance widget (`#artist-performance-widget`) with per-practitioner metrics
- Four KPI cards: Today's Revenue, Station Capacity, Active Clients, Stock Alerts
- Sterile medical audit warning summary (`#sterile-audit-warning-summary-widget`) with expired / expiring ≤30 days / compliant counts and an alert preview
- Station floor live status strip (`#station-floor-strip`)
- Studio Operations Command Stream (`#tab-activity`) with an SSE live feed

**Backup warning toast** (`#database-backup-warning-toast`) appears when the cloud snapshot backup is overdue (>6 hours), with a "Run Instant Cloud Snapshot Backup" action (`triggerInstantDatabaseSnapshot()`) and a dismiss action (`dismissBackupWarningToast()`).

---

## Data Schemas

The following objects are defined or consumed by the code shown.

### Client object

Consumed by `renderClientProfileHeader(data)` and the profile tabs. Fields read from the API response:

| Field | Type | Example | Notes |
|---|---|---|---|
| `id` | number | `7` | Used for `/api/clients/{id}/profile` and localStorage photo key |
| `name` | string | `"Alex Miller"` | Displayed in header and personal info |
| `email` | string | `"alex@example.com"` | Falls back to `"No email recorded"` |
| `phone` | string | `"+44 7700 900123"` | Falls back to `"No phone recorded"` |
| `is_vip` / `vip` | boolean | `true` | Renders a VIP badge |
| `loyalty_tier` | string | `"Gold Tier"` | Defaults to `"Gold Tier"` |
| `total_spent` / `lifetime_value` | number | `1420.00` | Rendered to 2 decimals |
| `allergies` | string | `"Latex"` | Highlighted red when not empty and not `"none"` |
| `medical_history` | string | `"None Reported"` | |
| `emergency_contact` | string | `"ICE: On File"` | |
| `preferred_style` | string | `"Neo-Traditional & Micro-Realism"` | |
| `dob` / `birthdate` | string | `"1992-05-14"` | |
| `created_at` | string | `"2023-01-10"` | "Client Since" |
| `staff_notes` | array | `[]` | Fallback when profile endpoint omits notes |

### Client profile response (`/api/clients/{id}/profile`)

```json
{
  "client": { "...client object..." },
  "appointments": [],
  "waivers": [],
  "tattoo_work": [],
  "staff_notes": []
}
```

### Appointment object

| Field | Type | Example |
|---|---|---|
| `service_type` / `service` | string | `"Tattoo Procedure Session"` |
| `date` | string | `"2025-01-15"` |
| `time` | string | `"14:00"` |
| `staff_name` | string | `"Jaxon Vance"` |
| `price` / `amount` | number | `250` |
| `status` | string | `"CONFIRMED"`, `"COMPLETED"`, `"CANCELLED"`, or other |

### Staff note object

| Field | Type | Example |
|---|---|---|
| `id` | string | used in `confirmDeleteClientStaffNote(clientId, noteId, preview)` |
| `author` | string | `"Jaxon Vance"` |
| `author_role` | string | `"Senior Tattoo Artist"` |
| `category` | string | `"Procedure Observation"`, `"Skin Sensitivity"`, `"Consultation & Deposit"`, `"Client Preference"`, `"Aftercare & Healing"`, `"Sanitation & Safety"`, `"General Staff Note"` |
| `note` | string | free text |
| `timestamp` | string (ISO) | sorted ascending for chronological display |

### Staff author options (hard-coded in the note form)

| Value | Role |
|---|---|
| `Admin Manager` | Studio Manager |
| `Jaxon Vance` | Senior Tattoo Artist |
| `Maya Lin` | Master Piercer |
| `Soren Frost` | Fine-Line Artist |
| `Chloe Vance` | Apprentice |
| `Dr. Elena Rostova` | Medical Consultant |

### Waiver object

Read from `data.waivers`. Each waiver is rendered with a signature image; a waiver cannot be saved without a client and a signature.

### Demo API state (online demo only)

`demo-api.js` maintains a session-scoped state object keyed by API path:

```js
var KEY = 'poli_crm_demo_state_v1'   // sessionStorage key
var state = {}                        // { "/api/clients": [...], "/api/clients/7": {...} }
var snapshot = null                   // loaded from ./demo-data.json
```

- `current(path)` returns the visitor's edited value if present, otherwise the snapshot value.
- `nextId(list)` computes `max(existing ids) + 1`.
- `POST` creates `{ id, created_at, ...body }` and returns HTTP 201.
- `PUT` / `PATCH` merges the body into the matching item.
- `DELETE` removes the matching item.
- FormData uploads (photos) are accepted but not stored.

---

## Calculation / Logic Algorithms

### `openClientProfileModal(clientId)`

1. Guard: return if `clientId` is falsy or the overlay `#client-profile-modal-overlay` is missing.
2. Show the overlay via `forceShowModalOverlay(overlay)` if available, else set `display: flex`.
3. Render a loading placeholder into `#client-profile-modal-body`.
4. `fetch('/api/clients/{clientId}/profile')`.
5. On success: store the response in `currentActiveProfileClient`, call `renderClientProfileHeader(data)`, then `switchClientProfileTab('overview')`.
6. On failure: fall back to `fetch('/api/clients/{clientId}')` and build a minimal profile object with empty `appointments`, `waivers`, `tattoo_work` and `staff_notes` taken from `clientObj.staff_notes`.
7. If the fallback also fails, render a red error message in the modal body.

### `renderClientProfileHeader(data)`

1. Resolve `client = data.client || data`.
2. Set `#client-profile-name` to `client.name` or `"Client Record"`.
3. Build the tag strip: email, phone, loyalty tier badge, optional VIP badge, and total spent formatted with `Number(...).toFixed(2)`.
4. Avatar: if `localStorage['client_photo_' + client.id]` exists, render an `<img>`; otherwise render initials derived from `client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()`.
5. Set the four tab counters: appointments, waivers, tattoo work, staff notes (each `(array || []).length`).

### `switchClientProfileTab(tabName)`

1. Store `tabName` in `currentProfileActiveTab`.
2. Restyle every `.cp-nav-btn`: the active tab gets white text, a 3px `#6366F1` bottom border and a translucent indigo background; inactive tabs revert to grey.
3. Read `currentActiveProfileClient` and destructure `client`, `appointments`, `waivers`, `tattoo_work`, `staffNotes`.
4. Branch on `tabName`:
   - **`overview`**: compute `hasAllergies` (allergies present, not `"none"`, not blank). Render the D3 timeline container, personal information card, medical & sensitivity card (allergy border turns red when `hasAllergies`), and studio preferences card. Then call `renderD3ClientAppointmentTimeline(appointments)`.
   - **`notes`**: sort notes ascending by `timestamp`, render the "Add Private Staff-Only Note" form and the chronological log. Each note gets a left border colour by category: `Skin Sensitivity` → `#EF4444`, `Procedure Observation` → `#8B5CF6`, `Consultation & Deposit` → `#10B981`, otherwise `#38BDF8`. Empty state renders a dashed placeholder.
   - **`appointments`**: if empty, render a dashed empty state. Otherwise render each appointment with status colour: `CONFIRMED` or `COMPLETED` → `#10B981`, `CANCELLED` → `#EF4444`, anything else → `#F59E0B`. Price is `Number(a.price || a.amount || 250).toFixed(2)`. Each row has a "Receipt PDF" button calling `generateClientAppointmentReceiptPDF(appointment, client)`.
   - **`waivers`**: if empty, render a dashed empty state with an "Open Digital Signature Pad" button calling `openWaiverModal(client.id)`. Otherwise list each signed waiver.

### Staff note submission

`handleStaffNoteSubmit(event, clientId)` is bound to the note form's `submit` event. The form collects author (`sn-author-select`), category (`sn-category-select`) and note text (`sn-note-text`). The note text field supports hands-free dictation via `toggleVoiceDictation('sn-note-text', this)` (Web Speech API), with a live recording indicator `#voice-dictate-indicator-sn-note-text`.

### Demo API request routing (`demo-api.js`)

1. `window.fetch` is wrapped. Any request whose origin differs from the page origin, or whose path does not start with `/api/`, is passed through to the real `fetch`.
2. Otherwise, `load()` resolves the snapshot and session state, then `handle(url, init)` runs.
3. `GET`: try the full path + query string, then the bare path, then match `/api/{collection}/{id}` against the collection list.
4. `POST` / `PUT` / `PATCH` / `DELETE`: operate on the in-memory array copy, persist to `sessionStorage`, and reply with JSON.
5. `PUT /api/app-data/*` returns `{ success: true }`.
6. Unmatched routes return `{ success: true, demo: true }`.

### Synchronous XHR shim

`app-data-sync.js` reads `/api/app-data` with a synchronous XHR before the app starts. The demo intercepts `XMLHttpRequest.prototype.open` and redirects any same-origin `/api/` request to a `Blob` URL containing `{}`, so the boot sequence sees an empty answer instead of a 404.

### EventSource shim

The live activity stream has no server in the demo. `window.EventSource` is replaced for `/api/` URLs with a quiet stub that reports `readyState: 1`, fires `onopen` after 50 ms, and does nothing else.

---

## API Reference

### Public functions (global scope)

| Function | Parameters | Behaviour |
|---|---|---|
| `openClientProfileModal(clientId)` | `clientId` (number/string) | Opens the client profile modal and loads the full record. Exposed on `window`. |
| `closeClientProfileModal()` | none | Hides the profile overlay and clears `currentActiveProfileClient`. Exposed on `window`. |
| `renderClientProfileHeader(data)` | `data` (profile response) | Fills the modal header: name, tags, avatar, tab counters. |
| `switchClientProfileTab(tabName)` | `tabName` (`overview` \| `notes` \| `appointments` \| `waivers`) | Renders the selected tab body. |
| `handleStaffNoteSubmit(event, clientId)` | `event`, `clientId` | Form submit handler for private staff notes. |
| `confirmDeleteClientStaffNote(clientId, noteId, preview)` | client id, note id, preview text | Confirmation flow for deleting a staff note. |
| `toggleVoiceDictation(fieldId, buttonEl)` | target field id, button element | Toggles Web Speech API dictation into a text field. |
| `generateClientAppointmentReceiptPDF(appointment, client)` | appointment object, client object | Generates a printable PDF receipt with tax/VAT breakdown and artist gratuity. |
| `openWaiverModal(clientId)` | `clientId` | Opens the digital signature pad for a waiver. |
| `openSterileAuditModal()` | none | Opens the sterile medical audit modal (Dashboard widget, hotkey Alt+O). |
| `openQuickLogModal()` | none | Opens the quick activity log modal. |
| `openSessionDurationReportModal()` | none | Opens the session duration report modal. |
| `navigateToDestination(dest)` | `dest` (`dashboard` \| `clients` \| `calendar` \| `inventory` \| `compliance` \| `finance` \| `tools` \| `settings`) | Switches the main workspace to a destination. |
| `toggleSidebar(force)` | optional boolean | Shows/hides the mobile sidebar and backdrop. |
| `openCmdPalette()` | none | Opens the command palette and search (Cmd+K / Alt+D). |
| `openStaffLoginModal()` | none | Opens the staff switcher. |
| `switchStudioLanguage(lang)` | `lang` (`en` \| `fr` \| `it` \| `de` \| `es` \| `nl` \| `pt` \| `th`) | Changes the interface language. |
| `toggleGlobalDarkMode()` | none | Toggles dark / light theme (Alt+T). |
| `triggerNavbarSync()` | none | Triggers cloud and local sync. |
| `triggerInstantDatabaseSnapshot()` | none | Runs an instant cloud snapshot backup. |
| `dismissBackupWarningToast()` | none | Hides the backup warning toast. |

### HTTP endpoints consumed by the client

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/studio-meta` | Studio metadata. Demo replies `{ demo: false, onlineDemo: true }`. |
| `GET` | `/api/app-data` | Boot-time data sync (read via synchronous XHR). |
| `PUT` | `/api/app-data/*` | App data write-back. |
| `GET` | `/api/clients` | Client list. |
| `GET` | `/api/clients/{id}` | Single client record. |
| `GET` | `/api/clients/{id}/profile` | Full profile: client, appointments, waivers, tattoo_work, staff_notes. |
| `POST` | `/api/{collection}` | Create a record. Returns `{ success: true, id, created_at, ...body }` with HTTP 201. |
| `PUT` / `PATCH` | `/api/{collection}/{id}` | Update a record. Returns `{ success: true }`. |
| `DELETE` | `/api/{collection}/{id}` | Delete a record. Returns `{ success: true }`. |
| `GET` (SSE) | `/api/*` | Live activity stream. |

---

## Integration Guide

### Standalone embedding via iframe

The tool is a static HTML/CSS/JS application. It can be embedded in any page with an iframe pointing at the live URL:

```html
<iframe
  src="https://poliinternational.com/tools/studio-crm/"
  title="Studio CRM: Free Tattoo & Piercing Studio Software"
  width="100%"
  height="900"
  style="border:0;border-radius:12px;"
  loading="lazy"
  referrerpolicy="no-referrer"
></iframe>
```

### Self-hosting

The real application runs on the studio's own computer:

1. Install Node.js 22 or newer.
2. Download the Studio CRM files and open a terminal in the `studio-crm` folder.
3. Run `npm install` once, then `npm start`.
4. Open `http://localhost:3000` in the browser. Other devices on the studio network use the computer's network address instead of `localhost`.

Optional environment settings (in a `.env` file copied from `.env.example`):

- `PORT` - change the listening port.
- `STUDIO_MANAGER_EMAIL` - address for alerts.
- `SQLITE_DB_PATH` - override the database file location (default `data/studio_crm.sqlite`).

### Online demo behaviour

On the public website there is no local server. `demo-api.js` answers `/api/*` calls from a snapshot of the app's demo data (`demo-data.json`). Changes a visitor makes live in `sessionStorage` under the key `poli_crm_demo_state_v1` and vanish when the tab closes. A banner is inserted at the top of the page stating that this is an online demo with sample data and linking to the free app on GitHub.

### Dependency-free static hosting

The application shell and all logic are plain HTML, CSS and JavaScript. The only third-party code is bundled locally under `js/vendor/` (D3, jsPDF, jsPDF AutoTable, Sortable, html5-qrcode). No CDN or network fetch is required at runtime beyond the local server.

---

## Customization

- **Language**: eight interface languages are selectable from the top bar (`en`, `fr`, `it`, `de`, `es`, `nl`, `pt`, `th`). Translations live in `i18n.js` and `js/i18n-phrases.js`. Localised user guides ship in `guide/`.
- **Theme**: dark / light toggle via `toggleGlobalDarkMode()`. Base colours are defined as CSS custom properties (for example `--bg-body`).
- **Branding**: the sidebar logo is `assets/studio_crm_logo.jpg`; the studio's own logo can be uploaded in Settings and appears in the top bar.
- **Studio settings**: prices, deposit rule, tax (VAT) rate, touch-up policy and stock thresholds are entered in Settings. The price estimator, quotes and invoices read these values. A price list can be exported to CSV, edited, and imported back.
- **Demo data reset**: a new install opens with demo clients, appointments, stock and staff. "Start with an empty studio" on the Dashboard deletes the demo records while keeping the service list, categories, templates, stations and settings. This cannot be undone.

---

## Performance

- Vendor libraries are pinned and served locally, so there are no third-party network round trips at runtime.
- The online demo loads its snapshot once (`load()` caches the resolved state in the module variable `state`) and reuses it for every subsequent request.
- The live activity feed uses Server-Sent Events, so the dashboard updates arrive as a stream rather than through polling.
- The client profile modal renders a lightweight loading placeholder before the fetch resolves, and falls back to a smaller `/api/clients/{id}` request if the full profile endpoint fails.

---

## Browser Compatibility

- The application requires JavaScript and HTML5 (`browserRequirements` in the JSON-LD schema is `"Requires JavaScript. Requires HTML5."`).
- The layout is responsive: below 900px the sidebar collapses behind a hamburger toggle and a backdrop (`#sidebar-backdrop`).
- The scanner uses the device camera through html5-qrcode, so it depends on browser camera permission support. Codes can also be scanned from a photo.
- Voice dictation in the staff note form uses the Web Speech API and is therefore limited to browsers that implement it.
- The demo banner uses `position: sticky` and `backdrop-filter`; both degrade gracefully where unsupported.

---

## Security

- **Self-hosted data**: the real application stores everything in a SQLite file on the studio's own computer. Nothing is sent to Poli International.
- **Demo isolation**: in the online demo, all edits are held in `sessionStorage` under `poli_crm_demo_state_v1` and are discarded when the tab closes. FormData uploads (photos) are accepted but not stored.
- **Output escaping**: user-supplied strings rendered into the profile modal are passed through `escapeHtml(...)` before insertion, including client name, email, phone, allergies, medical history, emergency contact, preferred style, appointment service type, date, time, staff name, status, note author, author role, category and note body. Appointment and client objects passed into `generateClientAppointmentReceiptPDF` are serialised with `JSON.stringify(...).replace(/"/g, '&quot;')` before being placed in inline handlers.
- **API scoping**: the demo `fetch` wrapper only intercepts same-origin requests whose path begins with `/api/`; everything else is forwarded to the real `fetch`.
- **Waiver integrity**: a waiver will not save without both a client and a signature.
- **Compliance records**: the closing checklist, autoclave vault and expiry warnings are the studio's own records; the guide advises checking local health authority rules for retention requirements.

---

## Version History

### 1.0.0

- Initial documented release. Sidebar footer displays `v2.5`.
- Eight destinations: Dashboard, Clients, Calendar, Inventory, Compliance, Finance, Tools, Settings.
- Six global top-bar controls: mobile menu, command palette search, staff switcher, language selector, theme toggle, sync status.
- Client profiles with overview, private staff notes, appointments and waivers tabs.
- D3 procedure and session progression timeline.
- Digital waiver signature pad.
- Inventory with lots, expiry dates, suppliers, camera scanner and purchase orders.
- Sterile medical audit widget with expired / expiring ≤30 days / compliant counts.
- Tip calculator splitting 80% artist, 15% apprentice, 5% desk.
- CSV and PDF exports for activity log, low stock, shifts and session durations.
- Eight interface languages: English, French, Italian, German, Spanish, Dutch, Portuguese, Thai.
- JSON-LD WebApplication and FAQ schemas.
- Online demo with session-scoped sample data and a clear demo banner.

---

## Support / Contact

For help with installation, self-hosting, backups or translations, contact:

**support@poliinternational.com**

Source repository: `github.com/Poli-International/studio-crm`
