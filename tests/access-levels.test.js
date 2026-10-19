import { describe, it, expect } from 'vitest';
import { needLevel, PERMISSIONS, BUILT_IN_ROLES } from '../src/access.js';

// What each request needs: an area a role can be given (Settings, Roles), 'any' signed-in person,
// 'admin', or 'kiosk' (a kiosk tablet may do it too). The server checks this on every request, so a
// button a role should not have is refused even if the screen still shows it.
describe('what a request needs', () => {
  const cases = [
    // anyone signed in: reading, clocking in, station status, the scanner, client photos
    ['GET', '/api/clients', 'any'],
    ['GET', '/api/clients/4/profile', 'any'],
    ['POST', '/api/staff/3/shift', 'any'],
    ['POST', '/api/stations/2/status', 'any'],
    ['GET', '/api/scanner/devices', 'any'],
    ['PUT', '/api/app-data/client_photo_12', 'any'],
    ['GET', '/api/kiosk/devices', 'any'],
    // clients and bookings: clients, appointments, waivers, payments taken, aftercare given, the kiosk
    ['POST', '/api/clients', 'clients'],
    ['PATCH', '/api/clients/4', 'clients'],
    ['POST', '/api/appointments', 'clients'],
    ['PATCH', '/api/appointments/9', 'clients'],
    ['POST', '/api/waivers', 'clients'],
    ['POST', '/api/financial', 'clients'],
    ['POST', '/api/clients/4/aftercare', 'clients'],
    ['POST', '/api/clients/4/id-check', 'clients'],
    ['POST', '/api/clients/4/tattoo-work', 'clients'],
    ['POST', '/api/kiosk/send', 'clients'],
    ['POST', '/api/kiosk/cancel', 'clients'],
    // stock and suppliers
    ['POST', '/api/inventory', 'stock'],
    ['PUT', '/api/inventory/suppliers/2', 'stock'],
    // sterilization and compliance
    ['POST', '/api/compliance/autoclave-logs', 'compliance'],
    // the shift rota
    ['POST', '/api/staff/assign-shift', 'rota'],
    // consent form designs and aftercare sheets
    ['PUT', '/api/app-data/poli_form_builder_autosave%3Atattoo_consent', 'forms'],
    ['PATCH', '/api/aftercare/templates/2', 'forms'],
    // money: the reports, payment methods, accounting
    ['GET', '/api/financial', 'finance'],
    ['GET', '/api/financials/deposits', 'finance'],
    ['GET', '/api/staff/commissions', 'finance'],
    ['GET', '/api/accounting/ledger-timeseries', 'finance'],
    ['GET', '/api/accounting/export/quickbooks', 'finance'],
    ['POST', '/api/financial/payment-methods', 'finance'],
    ['POST', '/api/accounting/sync', 'finance'],
    // deleting
    ['DELETE', '/api/clients/4', 'delete'],
    ['DELETE', '/api/appointments/9', 'delete'],
    ['DELETE', '/api/clients/4/tattoo-work/2', 'delete'],
    // administrator only: settings, the team, logins, roles, backups, imports, stations, CSV sync
    ['DELETE', '/api/staff/3', 'admin'],
    ['DELETE', '/api/stations/3', 'admin'],
    ['DELETE', '/api/app-data/poli_studio_profile', 'admin'],
    ['POST', '/api/staff', 'admin'],
    ['PATCH', '/api/staff/3', 'admin'],
    ['POST', '/api/access/staff-login', 'admin'],
    ['PUT', '/api/access/roles', 'admin'],
    ['POST', '/api/access/idle', 'admin'],
    ['POST', '/api/database/create-snapshot', 'admin'],
    ['POST', '/api/admin/start-empty', 'admin'],
    ['POST', '/api/clients/import-csv', 'admin'],
    ['PUT', '/api/settings', 'admin'],
    ['POST', '/api/sync/config', 'admin'],
    ['POST', '/api/stations', 'admin'],
    ['PATCH', '/api/stations/3', 'admin'],
    ['PUT', '/api/app-data/poli_studio_profile', 'admin'],
    ['PUT', '/api/app-data/poli_kiosk_exit_pin', 'admin'],
    ['POST', '/api/access/kiosk-password', 'admin'],
    // signing in and out is for everyone
    ['POST', '/api/access/login', 'any'],
    ['POST', '/api/access/logout', 'kiosk'],
    ['GET', '/api/access/people', 'any'],
    ['GET', '/index.html', 'any'],
    ['GET', '/', 'any'],
    // a kiosk tablet: waits for a form and sends it back signed, and loads the form builder's files; nothing else
    ['GET', '/api/kiosk/next', 'kiosk'],
    ['POST', '/api/kiosk/submit', 'kiosk'],
    ['GET', '/api/access', 'kiosk'],
    ['GET', '/tools/form-builder/index.html', 'kiosk'],
    ['GET', '/kiosk', 'kiosk'],
  ];
  for (const [method, path, need] of cases) {
    it(`${method} ${path} needs ${need}`, () => expect(needLevel(method, path)).toBe(need));
  }

  it('every area a request can need is one a role can be given', () => {
    const needs = new Set(cases.map(([, , n]) => n));
    for (const n of needs) if (!['any', 'admin', 'kiosk'].includes(n)) expect(PERMISSIONS).toContain(n);
  });

  it('Front desk and Staff start with what they could do before roles', () => {
    expect(BUILT_IN_ROLES.find((r) => r.id === 'front_desk').perms).toEqual(['clients']);
    expect(BUILT_IN_ROLES.find((r) => r.id === 'staff').perms).toEqual(['clients', 'stock', 'compliance', 'rota', 'forms']);
  });
});
