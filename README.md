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

**The easy way (no Node.js to install).** Download the ZIP for your computer, unzip it, and double-click the starter. Your browser opens on the CRM.

| Computer | Download | Starter |
|---|---|---|
| Windows | [studio-crm-windows-x64.zip](https://github.com/Poli-International/studio-crm/releases/latest/download/studio-crm-windows-x64.zip) | `Start Studio CRM.bat` |
| Mac, Apple chip (M1 and newer) | [studio-crm-macos-arm64.zip](https://github.com/Poli-International/studio-crm/releases/latest/download/studio-crm-macos-arm64.zip) | `Start Studio CRM.command` |
| Mac, Intel | [studio-crm-macos-x64.zip](https://github.com/Poli-International/studio-crm/releases/latest/download/studio-crm-macos-x64.zip) | `Start Studio CRM.command` |
| Linux | [studio-crm-linux-x64.zip](https://github.com/Poli-International/studio-crm/releases/latest/download/studio-crm-linux-x64.zip) | `./start-studio-crm.sh` |

Keep the window that opens while you use the CRM; closing it stops the CRM. On a Mac, the first time, right-click the starter and choose **Open**. Windows may ask you to confirm the first time as well.

**From the source.** Requires [Node.js](https://nodejs.org/) 22 or newer (no compiler or build tools needed).

```bash
npm install
npm start
```

**With Docker.**

```bash
docker compose up -d
```

In all three cases, open `http://localhost:3000`. Other devices on the studio network use the computer's address instead of `localhost`, always with `:3000`. The CRM is its own web server: do not put the files behind Apache, nginx or PHP, the pages would load but nothing would save.

A new install starts with demo data so you can try every screen; click **Start with an empty studio** on the Dashboard before entering real clients.

Settings go in a `.env` file (copy `.env.example`): `PORT`, `STUDIO_MANAGER_EMAIL`, `SQLITE_DB_PATH`.

**Updating.** Download the new ZIP, unzip it to a new folder, and copy your `data` folder from the old one into it.

## User guide

In the app under **Docs**, or in [`docs/USER-GUIDE.md`](docs/USER-GUIDE.md) and [`docs/user-guide/`](docs/user-guide/) (FR, IT, DE, ES, NL, PT, TH).

## Backups

All data is in `data/studio_crm.sqlite`. Copy that file to back up the studio. **Back up now** in Settings saves a full copy in `storage/backups/`.

## Other devices in the studio

- Computers open `http://THE-COMPUTER:3000`.
- Tablets and phones that need the camera (the scanner) open `https://THE-COMPUTER:3443`. The certificate is made by the CRM itself, so the browser warns once: choose Advanced, then Continue. Browsers give a page the camera only on `localhost` or over https. `HTTPS_PORT=0` turns https off.
- To keep other people on the network out, set a **Studio Password** in Settings. It is off by default and is one password for the whole studio. Forgotten: create an empty file `reset-password.txt` in the `data` folder and restart.

## Development

```bash
npm test           # unit tests
npm run test:click # real clicks in Chrome or Edge: the daily jobs, then every button
npm run guide      # rebuild public/guide/<lang>.html from docs/
```

The click test (`tests/click/`) starts the app on a throwaway database, opens a real browser and uses the mouse. `flows.mjs` does the jobs a studio does every day (add, edit and delete a client, manage staff, export, clock in, import a CSV, fill and sign the tablet form), plus the awkward cases: two quick taps on Save, every screen at phone width. `crawl.mjs` clicks every button it can reach and fails on one that does nothing, throws an error or is covered by something else. `CRAWL_PAGE=tools/<tool>/ node tests/click/crawl.mjs` does the same inside one of the embedded tools, and the release workflow crawls every tool in `public/tools`, one runner each. All of it runs before a release is packed, so a dead button blocks the release. It needs Chrome or Edge on the machine and nothing else.

Interface text is translated by `public/js/i18n-phrases.js` from `public/i18n/<lang>.json`, keyed on the exact English text.

## License

MIT, see [LICENSE](LICENSE).
