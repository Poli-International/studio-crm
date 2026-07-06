# Studio CRM, Client Manager - Technical Documentation

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
11. [Support and Contact](#support-and-contact)

---

## Architecture Overview

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | Vue.js 3 (Composition API) |
| Build Tool | Vite |
| State Management | Pinia |
| Routing | Vue Router (createWebHistory) |
| Styling | Custom CSS with CSS custom properties (dark/light mode) |
| Icons | Lucide (via unpkg CDN in demo) |
| Data Persistence | Browser localStorage (client-side only) |
| Backend | None required (fully client-side) |

### File Structure

```
studio-crm/
├── index.html                          # Main entry with tab navigation (Tool/Docs/Embed)
├── demo.html                           # Interactive demo with full UI simulation
├── documentation.html                  # Full documentation page
├── embed.html                          # Embeddable version with dark mode toggle
├── frontend/
│   ├── index.html                      # Dev entry point
│   ├── vite.config.js                  # Vite configuration with API proxy
│   ├── dist/
│   │   ├── index.html                  # Built production entry
│   │   ├── assets/
│   │   │   ├── index-*.js              # Main bundle (Vue app)
│   │   │   ├── index-*.css             # Main stylesheet
│   │   │   ├── ClientDetail-*.js       # Client detail view component
│   │   │   ├── ClientList-*.js         # Client list view component
│   │   │   ├── ComplianceDashboard-*.js
│   │   │   ├── FinancialDashboard-*.js
│   │   │   ├── InventoryList-*.js
│   │   │   ├── Login-*.js
│   │   │   ├── ServiceList-*.js
│   │   │   └── SettingsDashboard-*.js
│   │   └── service-worker.js           # Offline caching service worker
│   ├── public/
│   │   └── service-worker.js           # Service worker source
│   └── src/
│       ├── main.js                     # Vue app bootstrap
│       ├── router/
│       │   └── index.js                # Route definitions and navigation guard
│       ├── views/
│       │   ├── Dashboard.vue           # Main dashboard view
│       │   ├── Login.vue               # Authentication view
│       │   ├── Clients/
│       │   │   ├── ClientList.vue      # Client listing with search
│       │   │   └── ClientDetail.vue    # Individual client profile
│       │   ├── Scheduling/
│       │   │   └── Calendar.vue        # Appointment calendar
│       │   ├── Services/
│       │   │   └── ServiceList.vue     # Service records
│       │   ├── Financial/
│       │   │   └── FinancialDashboard.vue
│       │   ├── Inventory/
│       │   │   └── InventoryList.vue
│       │   ├── Compliance/
│       │   │   └── ComplianceDashboard.vue
│       │   └── Settings/
│       │       └── SettingsDashboard.vue
│       └── assets/
│           └── main.css                # Global styles
├── email-templates/
│   ├── base.html                       # Email template wrapper
│   ├── piercing-checkup.html           # 2-week piercing follow-up
│   ├── piercing-fresh.html             # New piercing aftercare
│   ├── tattoo-aftercare-7d.html        # 7-day tattoo aftercare
│   ├── tattoo-checkin-3d.html          # 3-day tattoo check-in
│   ├── tattoo-touchup-reminder.html    # 6-month touch-up reminder
│   └── tattoo-welcome.html             # Post-session welcome
└── resources/views/emails/
    ├── piercing-fresh.html
    └── tattoo-checkin-3d.html
```

### Component / Logic Breakdown

The application follows a single-page application (SPA) architecture with Vue Router handling navigation between views:

1. **App Shell** (`App.vue`) - Root component with sidebar navigation and content area
2. **Login View** (`Login.vue`) - Authentication form with simulated JWT token storage
3. **Dashboard View** (`Dashboard.vue`) - Overview with stats cards, upcoming schedule, quick actions
4. **Client List** (`ClientList.vue`) - Searchable table of clients with view action
5. **Client Detail** (`ClientDetail.vue`) - Full client profile with tabs (history, forms, photos)
6. **Calendar View** (`Calendar.vue`) - Appointment scheduling interface
7. **Service List** (`ServiceList.vue`) - Service records (placeholder)
8. **Financial Dashboard** (`FinancialDashboard.vue`) - Financial management (placeholder)
9. **Inventory List** (`InventoryList.vue`) - Inventory tracking (placeholder)
10. **Compliance Dashboard** (`ComplianceDashboard.vue`) - Compliance documentation (placeholder)
11. **Settings Dashboard** (`SettingsDashboard.vue`) - System configuration (placeholder)

### Demo Layer

The `demo.html` file provides a fully interactive simulation with:
- Sidebar navigation with 11 screens
- Dashboard with real-time stats
- Client management with sample data
- Schedule display
- Service logs with technical details
- Modal dialogs for adding clients, appointments, and payments
- Dark/light mode support via CSS custom properties

---

## Data Schemas

### Client Object (ClientDetail.vue)

```javascript
{
  id: "string",           // Route parameter from URL
  name: "John Doe",
  email: "john@example.com",
  phone: "555-0123",
  dob: "1990-05-15",
  medical_history: "None",
  allergies: "Latex",
  notes: "Prefers realistic style."
}
```

### Client List Item (ClientList.vue)

```javascript
{
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  phone: "555-0123",
  lastVisit: "2023-11-15"
}
```

### Sample Client Data (ClientList.vue)

```javascript
[
  { id: 1, name: "John Doe", email: "john@example.com", phone: "555-0123", lastVisit: "2023-11-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "555-0124", lastVisit: "2023-11-20" },
  { id: 3, name: "Mike Ross", email: "mike@example.com", phone: "555-0125", lastVisit: "2023-12-01" }
]
```

### Authentication State

```javascript
// Stored in localStorage
localStorage.setItem("token", "simulated-jwt-token")
```

### Demo Dashboard Stats (demo.html)

```javascript
{
  appointmentsToday: 5,
  revenueToday: "$1,280.00",
  activeClients: 127,
  pendingAlerts: 2
}
```

### Demo Schedule Items (demo.html)

```javascript
[
  { time: "10:00 AM", client: "Sarah Mitchell", service: "Tattoo", status: "Confirmed" },
  { time: "11:30 AM", client: "James Rodriguez", service: "Piercing", status: "Confirmed" },
  { time: "1:00 PM", client: "Emma Thompson", service: "Consultation", status: "Pending" },
  { time: "2:30 PM", client: "Alex Chen", service: "Tattoo", status: "Confirmed" },
  { time: "4:00 PM", client: "Maria Santos", service: "Touch-up", status: "Confirmed" }
]
```

### Demo Team Members (demo.html)

```javascript
[
  { initials: "M", name: "Marcus Rivera", role: "Admin", appointments: 0 },
  { initials: "Y", name: "Yuki Tanaka", role: "Artist", appointments: 3 },
  { initials: "S", name: "Sofia Petrov", role: "Artist", appointments: 2 },
  { initials: "J", name: "Jake Williams", role: "Piercer", appointments: 1 }
]
```

### Demo Appointment History (demo.html)

```javascript
[
  { date: "Feb 15, 2026", service: "Tattoo", artist: "Yuki Tanaka", status: "Completed" },
  { date: "Jan 22, 2026", service: "Touch-up", artist: "Yuki Tanaka", status: "Completed" },
  { date: "Dec 10, 2025", service: "Tattoo", artist: "Sofia Petrov", status: "Completed" },
  { date: "Nov 05, 2025", service: "Consultation", artist: "Marcus Rivera", status: "Completed" }
]
```

---

## Calculation / Logic Algorithms

### 1. Client Search Filtering (ClientList.vue)

**Function**: Computed property `filteredClients`

**Logic**:
1. Accepts a search query string from the input field
2. Converts both the query and each client's `name` and `email` to lowercase
3. Returns only clients where `name` OR `email` includes the search query

**Pseudocode**:
```
filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
)
```

### 2. Authentication Guard (router/index.js)

**Function**: `router.beforeEach(to, from, next)`

**Logic**:
1. Check if the target route has `meta.requiresAuth` set to `true`
2. Check if `localStorage.getItem('token')` exists
3. If authentication required and no token exists, redirect to `/login`
4. Otherwise, allow navigation

### 3. Login Handler (Login.vue)

**Function**: `handleLogin()` (async)

**Logic**:
1. Validate that both `email` and `password` fields are non-empty
2. If valid, store `"simulated-jwt-token"` in `localStorage`
3. Navigate to the root route (`/`)
4. If validation fails, set error message to `"Please enter email and password"`
5. If exception occurs, set error message to `"Invalid credentials"`

### 4. Client Detail Navigation (ClientList.vue)

**Function**: `viewClient(id)`

**Logic**:
1. Accepts a client ID (number)
2. Uses Vue Router's `push` method to navigate to `/clients/{id}`
3. The `ClientDetail` component reads the ID from route params

### 5. Tab Switching (ClientDetail.vue)

**Function**: Reactive state `activeTab`

**Logic**:
1. Maintains a reactive string state: `"history"`, `"forms"`, or `"photos"`
2. Clicking a tab button sets `activeTab` to the corresponding value
3. Renders conditional content blocks based on `activeTab` value
4. Each tab shows an empty state with appropriate messaging

### 6. Demo Tab Navigation (index.html)

**Function**: `navigateTo(screenId)`

**Logic**:
1. Hides all screens by setting `display: none`
2. Shows the target screen by setting `display: block`
3. Updates active state on sidebar navigation items

### 7. Demo Modal Controls (demo.html)

**Functions**: `showModal(modalId)`, `hideModal(modalId)`

**Logic**:
1. `showModal`: Sets `display: flex` on the modal overlay
2. `hideModal`: Sets `display: none` on the modal overlay
3. Modals include: `new-appointment-modal`, `add-client-modal`, `record-payment-modal`

### 8. Embed Code Copy (index.html)

**Function**: `copyEmbedCode()`

**Logic**:
1. Selects the text in the embed code textarea
2. Executes `document.execCommand('copy')`
3. Shows an alert confirming the copy

### 9. Theme Synchronization (index.html, public/index.html)

**Function**: `window.addEventListener('message', handler)`

**Logic**:
1. Listens for `postMessage` events with `type: 'poli-theme'`
2. If `e.data.light` is true, applies light mode classes
3. If `e.data.light` is false, applies dark mode classes
4. Forwards the theme message to the demo iframe

### 10. Service Worker Caching (service-worker.js)

**Logic**:
1. On install, caches specified assets (`/`, `/index.html`, `/manifest.json`)
2. On fetch, attempts to serve from cache first, falls back to network

---

## API Reference

### Vue Router Routes

| Path | Name | Component | Auth Required |
|------|------|-----------|---------------|
| `/login` | login | Login.vue | No |
| `/` | dashboard | Dashboard.vue | Yes |
| `/clients` | clients | ClientList.vue | Yes |
| `/clients/:id` | client-detail | ClientDetail.vue | Yes |
| `/calendar` | calendar | Calendar.vue | Yes |
| `/services` | services | ServiceList.vue | Yes |
| `/financial` | financial | FinancialDashboard.vue | Yes |
| `/inventory` | inventory | InventoryList.vue | Yes |
| `/compliance` | compliance | ComplianceDashboard.vue | Yes |
| `/settings` | settings | SettingsDashboard.vue | Yes |

### Public Functions (Client-Side)

#### Authentication

| Function | Location | Parameters | Returns | Behavior |
|----------|----------|------------|---------|----------|
| `handleLogin()` | Login.vue | None (reads reactive state) | Promise<void> | Validates credentials, stores token, navigates to dashboard |

#### Client Management

| Function | Location | Parameters | Returns | Behavior |
|----------|----------|------------|---------|----------|
| `viewClient(id)` | ClientList.vue | `id: number` | void | Navigates to client detail page |
| `filteredClients` (computed) | ClientList.vue | None (reads `searchQuery` and `clients`) | Array | Returns filtered client list |

#### Demo Interface

| Function | Location | Parameters | Returns | Behavior |
|----------|----------|------------|---------|----------|
| `navigateTo(screenId)` | demo.html | `screenId: string` | void | Switches visible screen |
| `showModal(modalId)` | demo.html | `modalId: string` | void | Opens modal overlay |
| `hideModal(modalId)` | demo.html | `modalId: string` | void | Closes modal overlay |

#### Embed / Theme

| Function | Location | Parameters | Returns | Behavior |
|----------|----------|------------|---------|----------|
| `copyEmbedCode()` | index.html | None | void | Copies embed iframe code to clipboard |
| `message` handler | index.html, public/index.html | `e: MessageEvent` | void | Synchronizes theme between parent and iframe |

---

## Integration Guide

### Standalone Usage

The tool can be accessed directly at:
```
https://poliinternational.com/tools/studio-crm/
```

### Embedding via iframe

Copy the following code to embed the tool on any website:

```html
<iframe 
  src="https://poliinternational.com/tools/studio-crm/index.html" 
  width="100%" 
  height="1000" 
  frameborder="0" 
  style="border-radius:12px;">
</iframe>
```

### Theme Synchronization

When embedded, the tool supports theme synchronization via `postMessage`:

```javascript
// Send theme to iframe
iframe.contentWindow.postMessage({
  type: 'poli-theme',
  light: true  // or false for dark mode
}, '*');
```

### Dependencies

The tool is fully self-contained with no external dependencies for the core application. The demo page loads Lucide icons from CDN:
```
https://unpkg.com/lucide@latest
```

### Installation (Self-Hosted)

1. Download the `studio-crm` folder from the GitHub repository
2. Serve the `frontend/dist/` directory with any static file server
3. No database or server-side processing required

---

## Customization

### Theme Customization

The application uses CSS custom properties for theming. Override these variables to customize appearance:

```css
:root {
  --primary: #3B82F6;
  --primary-dark: #2563EB;
  --secondary: #8B5CF6;
  --success: #10B981;
  --warning: #F59E0B;
  --danger: #EF4444;
  --background: #0F172A;
  --sidebar: #1E293B;
  --card: #1E293B;
  --text: #F8FAFC;
  --text-muted: #94A3B8;
  --border: #334155;
  --input-bg: #0F172A;
  --radius: 12px;
}
```

For light mode, the demo page defines these overrides:

```css
body.light-mode {
  --background: #F8FAFC;
  --sidebar: #FFFFFF;
  --card: #FFFFFF;
  --text: #0F172A;
  --text-muted: #64748B;
  --border: #E2E8F0;
  --input-bg: #FFFFFF;
}
```

### Adding Custom Routes

Modify `frontend/src/router/index.js` to add new routes:

```javascript
{
  path: '/custom-page',
  name: 'custom',
  component: () => import('../views/CustomPage.vue'),
  meta: { requiresAuth: true }
}
```

### Email Template Customization

Edit the HTML files in `email-templates/` to customize automated communications. Templates use `{{PLACEHOLDER}}` syntax for dynamic content.

---

## Performance

### Build Optimization

- Vite produces minified, tree-shaken bundles with hashed filenames for cache busting
- Route-level code splitting loads components on demand
- Service worker caches static assets for offline access

### Rendering Performance

- Vue's reactive system minimizes DOM updates
- Computed properties (`filteredClients`) cache results and only re-evaluate when dependencies change
- Conditional rendering (`v-if`) prevents unnecessary component mounting

### Data Storage

- All data stored in `localStorage` (synchronous, blocking on main thread)
- For large datasets, consider migrating to IndexedDB for async operations
- Maximum localStorage size is typically 5-10MB per origin

### Bundle Size

The main application bundle (`index-*.js`) contains the core Vue application, router, and state management. Individual view components are loaded lazily via dynamic imports.

---

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome 60+ | Full support |
| Firefox 55+ | Full support |
| Safari 11+ | Full support |
| Edge 79+ | Full support |
| Opera 47+ | Full support |
| Internet Explorer | Not supported |

### Requirements

- JavaScript enabled
- HTML5 support
- `localStorage` API support
- ES6+ module support (for Vue 3)
- Service Worker API (for offline caching)

### Known Limitations

- Data is browser-specific and does not sync across devices
- Clearing browser data will delete all stored records
- No server-side backup mechanism (export JSON manually)

---

## Security

### Input Handling

- All user inputs are handled through Vue's reactive system, which uses text interpolation (not raw HTML)
- The `v-model` directive binds input values safely without executing arbitrary code
- No `v-html` usage in user-facing content areas

### XSS Prevention

- Vue.js automatically escapes HTML in template expressions
- User data is rendered as text nodes, not HTML
- The application does not use `innerHTML` for user content
- Template strings use text interpolation (`{{ }}`) which is XSS-safe

### Authentication

- Authentication is simulated with a hardcoded token (`"simulated-jwt-token"`)
- Token stored in `localStorage` (not HTTP-only cookies)
- No actual server-side authentication occurs
- For production use, implement proper JWT validation on a backend server

### Data Storage

- All data stored in browser `localStorage`
- No data transmitted to external servers
- Relies on device-level encryption (full disk encryption recommended)
- No HTTPS requirement for local operation

### GDPR Compliance

- Full data sovereignty (user controls all data)
- Consent tracking capabilities
- Right-to-erasure support (per-client deletion or full wipe)
- Data portability via JSON export

### Recommendations for Production

1. Implement proper server-side authentication with JWT
2. Use HTTPS for all communications
3. Add input validation on both client and server
4. Implement rate limiting on login attempts
5. Use HTTP-only cookies for token storage
6. Add CSRF protection for API calls
7. Implement proper session management

---

## Version History

### Version 1.0.0 (February 7, 2026)

- Initial release
- Client management with search and detail views
- Dashboard with appointment overview and quick actions
- Appointment scheduling interface
- Service record tracking
- Financial management module (placeholder)
- Inventory tracking module (placeholder)
- Compliance documentation module (placeholder)
- Settings configuration module (placeholder)
- Interactive demo with sample data
- Dark/light mode support
- Embeddable via iframe
- Email templates for aftercare automation
- Service worker for offline caching
- GDPR-compliant data handling

---

## Support and Contact

For technical support, feature requests, or custom integration assistance:

**Email**: support@poliinternational.com

**Website**: https://poliinternational.com

**GitHub Repository**: https://github.com/poli-international/studio-crm

**Documentation**: https://poliinternational.com/studio-crm-documentation/

**Support Development**: https://ko-fi.com/patrickkofi

---

*Technical Standard provided by Poli International Engineering*

*Last updated: February 7, 2026*
