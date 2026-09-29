# Studio CRM user guide

Studio CRM runs on one computer in your studio. Staff open it in a web browser on that computer or on any device on the studio network. Your data stays in a file on that computer. Nothing is sent to Poli International.

## Install and start

1. Install Node.js 20 or newer.
2. Download the Studio CRM files and open a terminal in the `studio-crm` folder.
3. Run `npm ci` once, then `npm start`.
4. Open `http://localhost:3000` in the browser. Other devices use the computer's network address instead of `localhost`.

To use a different port, set `PORT` in a `.env` file (copy `.env.example`). Set `STUDIO_MANAGER_EMAIL` there too, so alerts are addressed to you.

## First run: demo data

A new install opens with demo clients, appointments, stock and staff, so you can try every screen. When you are ready for real work, click **Start with an empty studio** on the Dashboard. It deletes the demo records and keeps the service list, categories, templates, stations and settings. This cannot be undone.

## Language

Choose English, French, Italian, German, Spanish, Dutch, Portuguese or Thai from the language menu at the top. The Poli tools inside the CRM open in the same language where they offer it (tools without Thai open in English).

## Studio settings

Open **Settings** to enter your prices, deposit rule, tax (VAT) rate, touch-up policy and stock thresholds. The price estimator, quotes and invoices read these figures, so set them first. **Export CSV** downloads your price list; edit it and use **Import CSV** to load it back. You can also upload your studio logo; it appears in the top bar.

## Clients

**Clients** lists everyone with their contact details, allergies and medical notes, signed waivers and total spent. Use **New Client** to add one. Search filters the list as you type. **View Profile** opens the full record.

## Appointments and scheduling

**New Appointment** books a single session with artist, station, price and deposit. For multi-session work, the **Auto Scheduler** looks up the artist's free slots on a chosen day and books up to six sessions a set number of weeks apart. The Dashboard shows today's figures, upcoming bookings, station status and low stock.

## Digital waivers

Open the waiver form, pick the client from the list (their allergies are filled in), confirm the age check, and have the client sign on the pad. The waiver is saved with the signature image. It will not save without a client and a signature.

## Messages: the CRM prepares, you send

Studio CRM does not send email, SMS or chat messages itself. When you prepare an aftercare email, a reminder or a supplier order, a **Message ready** panel appears. Click **Email**, **WhatsApp** or **LINE** to open it in your own app with the text filled in, then press send there, or click **Copy**.

## Stock, scanner and purchase orders

**Inventory** tracks quantities, lots, expiry dates and suppliers. Items at or below their reorder level count as low stock.

The scanner in **Log Activity** uses the device camera. Scan a stock SKU or lot number to see the item, or a `CLIENT-<number>` code to open a client. You can also scan a code from a photo. Unknown codes are listed under **Error Logs**.

**Purchase Order** lists your suppliers and their low-stock items, creates a PO number, downloads a PDF and prepares the order email.

## Gallery

**Portfolio Works** holds photos of finished work, linked to the client and artist. **Flash Sheets** holds designs with price and deposit; mark one as claimed when a client reserves it. **Share** prepares a message for WhatsApp, LINE, X or email; the phone's share sheet can include the photo.

## Money and staff

The **Tip Calculator** splits a tip 80% artist, 15% apprentice, 5% desk and records it. Staff clock in and out with the shift button. Exports give you the activity log, low stock, shifts and session durations as CSV or PDF.

## Compliance records

The **closing checklist** records which items were done, the supervisor, the autoclave cycle number and your notes. The **Autoclave Vault** lists sterilisation cycle records, and the Dashboard warns about stock past its expiry date. These are your own records: check your local health authority's rules for what you must keep.

## Poli tools

The **Tools** screen opens the Poli International tools (aftercare schedules, consent form builder, gauge converter, price estimator and more) inside the CRM.

## Backups

Everything is stored in `data/studio_crm.sqlite` (or the path set in `SQLITE_DB_PATH`). Copy that file to back up the studio. The snapshot button also writes a copy to `storage/backups/`.
