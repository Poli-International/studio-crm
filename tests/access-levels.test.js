import { describe, it, expect } from 'vitest';
import { needLevel } from '../src/access.js';

// What each staff level may do. The server checks this on every request, so a button a level
// should not have is refused even if the screen still shows it.
describe('staff levels', () => {
  const cases = [
    // front desk: clients, bookings, waivers, payments
    ['GET', '/api/clients', 'front_desk'],
    ['POST', '/api/clients', 'front_desk'],
    ['PATCH', '/api/clients/4', 'front_desk'],
    ['POST', '/api/appointments', 'front_desk'],
    ['PATCH', '/api/appointments/9', 'front_desk'],
    ['POST', '/api/waivers', 'front_desk'],
    ['POST', '/api/financial', 'front_desk'],
    ['POST', '/api/staff/3/shift', 'front_desk'],
    ['POST', '/api/stations/2/status', 'front_desk'],
    ['GET', '/api/scanner/devices', 'front_desk'],
    ['POST', '/api/clients/4/aftercare', 'front_desk'],
    ['POST', '/api/clients/4/id-check', 'front_desk'],
    ['PUT', '/api/app-data/client_photo_12', 'front_desk'],
    // staff: stock, suppliers, compliance, the rota, the consent form designs
    ['POST', '/api/inventory', 'staff'],
    ['PUT', '/api/inventory/suppliers/2', 'staff'],
    ['POST', '/api/staff/assign-shift', 'staff'],
    ['PUT', '/api/app-data/poli_form_builder_autosave%3Atattoo_consent', 'staff'],
    // administrator: deleting, money reports, settings, the team, logins, backups, imports
    ['DELETE', '/api/clients/4', 'admin'],
    ['DELETE', '/api/appointments/9', 'admin'],
    ['GET', '/api/financial', 'admin'],
    ['GET', '/api/financials/deposits', 'admin'],
    ['GET', '/api/staff/commissions', 'admin'],
    ['POST', '/api/staff', 'admin'],
    ['PATCH', '/api/staff/3', 'admin'],
    ['POST', '/api/access/staff-login', 'admin'],
    ['POST', '/api/access/idle', 'admin'],
    ['POST', '/api/database/create-snapshot', 'admin'],
    ['POST', '/api/admin/start-empty', 'admin'],
    ['POST', '/api/clients/import-csv', 'admin'],
    ['PUT', '/api/settings', 'admin'],
    ['POST', '/api/stations', 'admin'],
    ['PATCH', '/api/stations/3', 'admin'],
    ['PUT', '/api/app-data/poli_studio_profile', 'admin'],
    ['PUT', '/api/app-data/poli_kiosk_exit_pin', 'admin'],
    // signing in and out is for everyone
    ['POST', '/api/access/login', 'front_desk'],
    ['POST', '/api/access/logout', 'kiosk'],
    ['GET', '/api/access/people', 'front_desk'],
    ['GET', '/index.html', 'front_desk'],
    ['GET', '/', 'front_desk'],
    // a kiosk tablet: waits for a form and sends it back signed, and loads the form builder's files; nothing else
    ['GET', '/api/kiosk/next', 'kiosk'],
    ['POST', '/api/kiosk/submit', 'kiosk'],
    ['GET', '/api/access', 'kiosk'],
    ['GET', '/tools/form-builder/index.html', 'kiosk'],
    ['GET', '/kiosk', 'kiosk'],
    ['POST', '/api/kiosk/send', 'front_desk'],
    ['POST', '/api/kiosk/cancel', 'front_desk'],
    ['GET', '/api/kiosk/devices', 'front_desk'],
    ['GET', '/api/clients/4/profile', 'front_desk'],
    ['POST', '/api/access/kiosk-password', 'admin'],
  ];
  for (const [method, path, level] of cases) {
    it(`${method} ${path} needs ${level}`, () => expect(needLevel(method, path)).toBe(level));
  }
});
