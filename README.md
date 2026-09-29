# Studio CRM

A free studio management app for tattoo and piercing studios, by [Poli International](https://poliinternational.com/tools/). It runs on one computer in your studio; staff use it from a browser on that computer or on any device on the studio network. Your data stays in a file on that computer. Nothing is sent to Poli International.

## What it does

- **Clients**: contact details, allergies and medical notes, signed waivers, total spent.
- **Appointments**: single bookings, and an auto scheduler that finds an artist's free slots and books multi-session work.
- **Digital waivers**: pick the client, confirm the age check, sign on the screen; saved with the signature.
- **Stock**: quantities, lots, expiry dates, suppliers, low-stock alerts, a camera QR/barcode scanner, purchase orders as PDF.
- **Gallery**: portfolio photos and flash designs, with sharing to WhatsApp, LINE, X or email.
- **Money and staff**: tip splits, shift clock in/out, exports (CSV and PDF).
- **Compliance records**: closing checklist, autoclave cycle log, expiry warnings.
- **Poli tools built in**: aftercare schedules, consent form builder, gauge converter, price estimator and more.
- **8 languages**: English, French, Italian, German, Spanish, Dutch, Portuguese, Thai.

The CRM prepares messages (aftercare emails, reminders, supplier orders) and opens them in your own email, WhatsApp or LINE; it does not send anything by itself.

## Install

Requires [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm ci
npm start
```

Then open `http://localhost:3000`. A new install starts with demo data so you can try every screen; click **Start with an empty studio** on the Dashboard before entering real clients.

Settings go in a `.env` file (copy `.env.example`): `PORT`, `STUDIO_MANAGER_EMAIL`, `SQLITE_DB_PATH`.

## User guide

In the app under **Docs**, or in [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) and [`docs/user-guide/`](docs/user-guide/) (FR, IT, DE, ES, NL, PT, TH).

## Backups

All data is in `data/studio_crm.sqlite`. Copy that file to back up the studio.

## Development

```bash
npm test           # test battery + vitest
npm run guide      # rebuild public/guide/<lang>.html from docs/
```

Interface text is translated by `public/js/i18n-phrases.js` from `public/i18n/<lang>.json`, keyed on the exact English text.

## License

MIT, see [LICENSE](LICENSE).
