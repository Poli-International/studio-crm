# Studio CRM: Free Tattoo & Piercing Studio Software - Complete Guide

## Target Keywords

**Primary keyword:** free tattoo studio software

**Long-tail keywords:**

1. free tattoo and piercing studio CRM
2. self-hosted tattoo studio management software
3. offline tattoo studio software that keeps client data local
4. digital tattoo waiver with signature pad
5. tattoo studio software in Thai
6. tattoo appointment auto scheduler for multi-session work
7. tattoo studio inventory with lot and expiry tracking
8. autoclave sterilisation log software for tattoo studios
9. tattoo studio software with purchase order PDF
10. free piercing studio software with client medical notes
11. tattoo studio CRM with tip split calculator
12. tattoo studio software that prepares WhatsApp and LINE messages
13. tattoo studio software with barcode scanner for stock SKUs
14. multilingual tattoo studio software English French German Spanish
15. tattoo studio software with SQLite backup file

---

## Meta Title

```
Free Tattoo & Piercing Studio CRM, in 8 Languages
```

## Meta Description

```
Clients, waivers, bookings, stock, sterilisation records and money in one free app that runs on your studio computer. Your client data never leaves the studio.
```

---

## H1

# Studio CRM: Free Tattoo & Piercing Studio Software - Complete Guide

## Content Outline

### H2: What is Studio CRM: Free Tattoo & Piercing Studio Software?
- H3: One app on one studio computer
- H3: Where your data actually lives
- H3: What the online demo does and does not do

### H2: Who Should Use This
- H3: Studio owners and managers
- H3: Tattoo artists and piercers
- H3: Front desk and reception staff
- H3: Apprentices
- H3: Studios in non-English-speaking markets

### H2: The Eight Destinations
- H3: Dashboard
- H3: Clients
- H3: Calendar
- H3: Inventory
- H3: Compliance
- H3: Finance
- H3: Tools
- H3: Settings

### H2: How to Use Studio CRM
- H3: Step 1: Install and start the app
- H3: Step 2: Set your studio figures in Settings
- H3: Step 3: Clear the demo data when you are ready
- H3: Step 4: Add your first client
- H3: Step 5: Book a single appointment
- H3: Step 6: Book multi-session work with the Auto Scheduler
- H3: Step 7: Take a digital waiver
- H3: Step 8: Track stock, lots and expiry dates
- H3: Step 9: Scan a code with the device camera
- H3: Step 10: Raise a purchase order
- H3: Step 11: Log money, tips and shifts
- H3: Step 12: Record sterilisation and closing checks
- H3: Step 13: Prepare a message and send it yourself
- H3: Step 14: Back up the studio

### H2: Global Controls in the Top Bar
- H3: Search and command palette
- H3: Staff switcher
- H3: Language selector
- H3: Theme toggle
- H3: Sync and storage badge
- H3: Database backup warning

### H2: The Client Profile in Detail
- H3: Overview tab
- H3: Private staff notes tab
- H3: Appointments tab
- H3: Waivers tab

### H2: Use Case Examples
- H3: Example 1: A three-session sleeve with the Auto Scheduler
- H3: Example 2: A piercing client with a recorded allergy
- H3: Example 3: A pigment lot expiring in 30 days

### H2: Frequently Asked Questions (FAQ)

### H2: Structured Data

### H2: Internal Linking Suggestions

---

## What is Studio CRM: Free Tattoo & Piercing Studio Software?

Studio CRM is a free studio management application for tattoo and piercing studios. It is not a website you log into. It runs on one computer in your studio, and staff open it in a web browser on that computer or on any device on the studio network.

### One app on one studio computer

The application is installed with Node.js 22 or newer. You download the Studio CRM files, open a terminal in the `studio-crm` folder, run `npm install` once and then `npm start`. The app then serves at `http://localhost:3000`. Other devices on the studio network reach it using the computer's network address instead of `localhost`. You can change the port by setting `PORT` in a `.env` file, and set `STUDIO_MANAGER_EMAIL` there so alerts are addressed to you.

The interface is organised into eight destinations in a fixed order: Dashboard, Clients, Calendar, Inventory, Compliance, Finance, Tools and Settings. A persistent top bar carries six global controls: search and command palette, the active staff switcher, the language selector, the theme toggle, the sync and storage badge, and the database backup warning.

### Where your data actually lives

Everything is stored in `data/studio_crm.sqlite`, or at the path you set in `SQLITE_DB_PATH`. Copying that file backs up the studio. The snapshot button also writes a copy to `storage/backups/`. Nothing is sent to Poli International.

The app does not send email, SMS or chat messages itself. When you prepare an aftercare email, a reminder or a supplier order, a "Message ready" panel appears. You click Email, WhatsApp or LINE to open it in your own app with the text already filled in, then press send there, or you click Copy.

### What the online demo does and does not do

The live page at poliinternational.com/tools/studio-crm/ is an online demo with sample data. It stands in for the app's local server so you can click through every screen. Anything you enter stays in that browser tab using sessionStorage and is gone when you close it. Nothing is sent anywhere. A banner at the top of the page says this plainly and links to the free app. The demo answers `/api/*` calls from a recorded snapshot of the app's demo data, accepts form uploads such as photos without storing them, and replaces the live activity stream with a quiet stand-in so you do not see a "reconnecting" badge that never stops.

---

## Who Should Use This

### Studio owners and managers

You get today's revenue, station capacity, active clients and stock alerts on one dashboard, plus a practitioner performance widget covering punctuality, monthly procedures and gross production. You set prices, the deposit rule, the tax (VAT) rate, the touch-up policy and stock thresholds once in Settings, and the price estimator, quotes and invoices read those figures.

### Tattoo artists and piercers

Each client profile carries allergies, medical history, emergency contact, preferred style, pain tolerance and break schedule, and aftercare regimen. The private staff notes tab lets you log procedure observations, skin and pigment sensitivity, client preferences, consultation and deposit notes, aftercare and healing notes, and sanitation and safety notes, each stamped with an author, a role, a category and a timestamp. A voice-to-text button uses the Web Speech API so you can dictate notes hands-free during a session.

### Front desk and reception staff

New Client adds a record. Search filters the client list as you type. New Appointment books a single session with artist, station, price and deposit. The waiver form fills in the client's allergies automatically, requires an age check and a signature, and will not save without a client and a signature.

### Apprentices

The tip calculator splits a tip 80% artist, 15% apprentice, 5% desk and records it. The shift button clocks staff in and out. Task rota completion shows on the dashboard performance widget.

### Studios in non-English-speaking markets

The language menu offers English, French, Italian, German, Spanish, Dutch, Portuguese and Thai. The Poli tools inside the CRM open in the same language where they offer it, and tools without Thai open in English. The user guide ships in German, English, Spanish, French, Italian and Dutch.

---

## How to Use Studio CRM

### Step 1: Install and start the app

Install Node.js 22 or newer. Download the Studio CRM files and open a terminal in the `studio-crm` folder. Run `npm install` once, then `npm start`. Open `http://localhost:3000` in the browser. Other devices use the computer's network address instead of `localhost`. To use a different port, set `PORT` in a `.env` file copied from `.env.example`, and set `STUDIO_MANAGER_EMAIL` there too.

### Step 2: Set your studio figures in Settings

Open Settings and enter your prices, deposit rule, tax (VAT) rate, touch-up policy and stock thresholds. Export CSV downloads your price list; edit it and use Import CSV to load it back. You can also upload your studio logo, which appears in the top bar.

### Step 3: Clear the demo data when you are ready

A new install opens with demo clients, appointments, stock and staff so you can try every screen. When you are ready for real work, click "Start with an empty studio" on the Dashboard. It deletes the demo records and keeps the service list, categories, templates, stations and settings. This cannot be undone.

### Step 4: Add your first client

Go to Clients and click New Client. The list shows contact details, allergies and medical notes, signed waivers and total spent. Search filters as you type. View Profile opens the full record.

### Step 5: Book a single appointment

Click New Appointment to book one session with artist, station, price and deposit.

### Step 6: Book multi-session work with the Auto Scheduler

For multi-session work, the Auto Scheduler looks up the artist's free slots on a chosen day and books up to six sessions a set number of weeks apart.

### Step 7: Take a digital waiver

Open the waiver form, pick the client from the list so their allergies are filled in, confirm the age check, and have the client sign on the pad. The waiver is saved with the signature image. It will not save without a client and a signature.

### Step 8: Track stock, lots and expiry dates

Inventory tracks quantities, lots, expiry dates and suppliers. Items at or below their reorder level count as low stock. The dashboard sterile medical audit widget tracks needle cartridges, pigment lots and medical disposables nearing or past expiration, showing expired lots, items expiring within 30 days, and verified compliant items, with a shortcut of Alt + O to open the audit.

### Step 9: Scan a code with the device camera

The scanner in Log Activity uses the device camera. Scan a stock SKU or lot number to see the item, or a `CLIENT-<number>` code to open a client. You can also scan a code from a photo. Unknown codes are listed under Error Logs.

### Step 10: Raise a purchase order

Purchase Order lists your suppliers and their low-stock items, creates a PO number, downloads a PDF and prepares the order email.

### Step 11: Log money, tips and shifts

The Tip Calculator splits a tip 80% artist, 15% apprentice, 5% desk and records it. Staff clock in and out with the shift button. Exports give you the activity log, low stock, shifts and session durations as CSV or PDF.

### Step 12: Record sterilisation and closing checks

The closing checklist records which items were done, the supervisor, the autoclave cycle number and your notes. The Autoclave Vault lists sterilisation cycle records, and the Dashboard warns about stock past its expiry date. These are your own records: check your local health authority's rules for what you must keep.

### Step 13: Prepare a message and send it yourself

Studio CRM does not send email, SMS or chat messages itself. When you prepare an aftercare email, a reminder or a supplier order, a "Message ready" panel appears. Click Email, WhatsApp or LINE to open it in your own app with the text filled in, then press send there, or click Copy.

### Step 14: Back up the studio

Everything is stored in `data/studio_crm.sqlite`, or the path set in `SQLITE_DB_PATH`. Copy that file to back up the studio. The snapshot button also writes a copy to `storage/backups/`. If the cloud snapshot database backup is overdue by more than six hours, a red banner appears with a "Run Instant Cloud Snapshot Backup" button.

---

## Global Controls in the Top Bar

### Search and command palette

The Search button opens the command palette and search, with the keyboard shortcut Cmd+K or Alt+D.

### Staff switcher

The staff button shows the current active staff member and opens the staff login modal so you can switch user.

### Language selector

The dropdown switches the interface language between English, French, Italian, German, Spanish, Dutch, Portuguese and Thai.

### Theme toggle

The theme button toggles dark and light mode, with the shortcut Alt+T.

### Sync and storage badge

The sync badge shows cloud and local sync status and triggers a sync when clicked.

### Database backup warning

A red banner appears when the cloud snapshot database backup is overdue by more than six hours, with a button to run an instant cloud snapshot backup and a dismiss control.

---

## The Client Profile in Detail

### Overview tab

Shows a D3 interactive procedure and session progression timeline, personal information including full name, email, phone, date of birth and client since date, a medical and sensitivity overview with allergies, medical history and emergency contact, and studio preferences covering preferred style, pain tolerance and break schedule, and aftercare regimen. If allergies are recorded and are not "none", the allergies panel is outlined in red.

### Private staff notes tab

A confidential, staff-only form with a staff author dropdown, a note category dropdown covering procedure observation, skin and pigment sensitivity, client preference, consultation and deposit, aftercare and healing, sanitation and safety, and general staff note. The note details field has a voice-to-text button using the Web Speech API, with a live recording indicator. Notes are listed oldest to most recent, each with a coloured left border by category, the author, the author role, the category, the timestamp and a delete control.

### Appointments tab

Lists verified procedure appointments and sessions with service type, date, time, artist, price and status. Each row has a Receipt PDF button that generates a printable PDF receipt with tax and VAT breakdown and artist gratuity.

### Waivers tab

Lists signed liability and medical disclosure waivers. If none exist, it offers a button to open the digital signature pad.

---

## Use Case Examples

### Example 1: A three-session sleeve with the Auto Scheduler

A client books a full sleeve that needs three sittings. The artist opens the Auto Scheduler, picks a day, and the tool looks up the artist's free slots and books up to six sessions a set number of weeks apart. Each session carries the artist, station, price and deposit. The client profile then shows all three appointments under the Appointments tab, each with a status of CONFIRMED, COMPLETED or CANCELLED and a price such as $250.00, and each with a Receipt PDF button.

### Example 2: A piercing client with a recorded allergy

A walk-in piercing client has a recorded allergy. The front desk opens the waiver form, picks the client from the list, and the allergies field is filled in automatically. The age check is confirmed and the client signs on the pad. The waiver saves with the signature image. On the client profile, the allergies panel is outlined in red because the recorded value is not "none" and is not blank. The piercer later adds a private staff note with the category "Skin & Pigment Sensitivity" and the author "Maya Lin (Master Piercer)", which appears in the chronological log with a red left border.

### Example 3: A pigment lot expiring in 30 days

A pigment lot is approaching its expiry date. The dashboard sterile medical audit widget counts it under "Expiring ≤ 30 Days" and shows the number in amber. The widget's alert preview reads the current status, and the compliance auto-check stays active. The owner presses Alt + O or clicks "Open Audit" to see the full list, then raises a Purchase Order for the supplier, which creates a PO number, downloads a PDF and prepares the order email.

---

## Frequently Asked Questions (FAQ)

**Is Studio CRM really free?**

Yes. The structured data marks the offer at price 0 USD, the licence is MIT, and the app is accessible for free. You install it on your own computer and there is no subscription.

**Where is my client data stored?**

Everything is stored in `data/studio_crm.sqlite`, or at the path you set in `SQLITE_DB_PATH`. Your data stays in a file on your studio computer. Nothing is sent to Poli International.

**Does Studio CRM send emails or messages for me?**

No. Studio CRM does not send email, SMS or chat messages itself. When you prepare an aftercare email, a reminder or a supplier order, a "Message ready" panel appears. You click Email, WhatsApp or LINE to open it in your own app with the text filled in, then press send there, or you click Copy.

**Can I use it on more than one device?**

Yes, within the studio. Staff open it in a web browser on the studio computer or on any device on the studio network. Other devices use the computer's network address instead of `localhost`.

**Which languages does the interface support?**

English, French, Italian, German, Spanish, Dutch, Portuguese and Thai. The Poli tools inside the CRM open in the same language where they offer it, and tools without Thai open in English.

**What happens to the demo data?**

A new install opens with demo clients, appointments, stock and staff so you can try every screen. When you are ready for real work, click "Start with an empty studio" on the Dashboard. It deletes the demo records and keeps the service list, categories, templates, stations and settings. This cannot be undone.

**Will a waiver save without a signature?**

No. The waiver is saved with the signature image, and it will not save without a client and a signature.

**How does the scanner work?**

The scanner in Log Activity uses the device camera. Scan a stock SKU or lot number to see the item, or a `CLIENT-<number>` code to open a client. You can also scan a code from a photo. Unknown codes are listed under Error Logs.

**How do I back up the studio?**

Copy `data/studio_crm.sqlite`, or the path set in `SQLITE_DB_PATH`. The snapshot button also writes a copy to `storage/backups/`. If the cloud snapshot database backup is overdue by more than six hours, a red banner appears with a button to run an instant cloud snapshot backup.

**Does the online demo save my entries?**

No. The online demo keeps what you enter in that browser tab only, using sessionStorage, and it is gone when you close the tab. Nothing is sent anywhere. The banner at the top of the demo page says this and links to the free app.

---

## Structured Data

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "Studio CRM: Free Tattoo & Piercing Studio Software",
      "url": "https://poliinternational.com/tools/studio-crm/",
      "description": "Clients, waivers, bookings, stock, sterilisation records and money in one free app that runs on your studio computer. Your client data never leaves the studio. English, French, Italian, German, Spanish, Dutch, Portuguese and Thai.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "isAccessibleForFree": true,
      "license": "https://opensource.org/licenses/MIT",
      "codeRepository": "https://github.com/Poli-International/studio-crm",
      "author": {
        "@type": "Organization",
        "name": "Poli International",
        "url": "https://poliinternational.com"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "featureList": [
        "Client records with allergies, medical history and emergency contact",
        "Digital waivers with signature pad and age check",
        "Single appointments and multi-session Auto Scheduler",
        "Inventory with lots, expiry dates and suppliers",
        "Sterile medical audit with expiry warnings",
        "Device camera scanner for stock SKUs and CLIENT-<number> codes",
        "Purchase orders with PDF download and prepared email",
        "Tip calculator split 80% artist, 15% apprentice, 5% desk",
        "Autoclave vault and closing checklist",
        "Interface in English, French, Italian, German, Spanish, Dutch, Portuguese and Thai"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Studio CRM really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The structured data marks the offer at price 0 USD, the licence is MIT, and the app is accessible for free. You install it on your own computer and there is no subscription."
          }
        },
        {
          "@type": "Question",
          "name": "Where is my client data stored?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Everything is stored in data/studio_crm.sqlite, or at the path you set in SQLITE_DB_PATH. Your data stays in a file on your studio computer. Nothing is sent to Poli International."
          }
        },
        {
          "@type": "Question",
          "name": "Does Studio CRM send emails or messages for me?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Studio CRM does not send email, SMS or chat messages itself. When you prepare an aftercare email, a reminder or a supplier order, a Message ready panel appears. You click Email, WhatsApp or LINE to open it in your own app with the text filled in, then press send there, or you click Copy."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use it on more than one device?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, within the studio. Staff open it in a web browser on the studio computer or on any device on the studio network. Other devices use the computer's network address instead of localhost."
          }
        },
        {
          "@type": "Question",
          "name": "Which languages does the interface support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "English, French, Italian, German, Spanish, Dutch, Portuguese and Thai. The Poli tools inside the CRM open in the same language where they offer it, and tools without Thai open in English."
          }
        },
        {
          "@type": "Question",
          "name": "What happens to the demo data?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A new install opens with demo clients, appointments, stock and staff so you can try every screen. When you are ready for real work, click Start with an empty studio on the Dashboard. It deletes the demo records and keeps the service list, categories, templates, stations and settings. This cannot be undone."
          }
        },
        {
          "@type": "Question",
          "name": "Will a waiver save without a signature?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The waiver is saved with the signature image, and it will not save without a client and a signature."
          }
        },
        {
          "@type": "Question",
          "name": "How does the scanner work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The scanner in Log Activity uses the device camera. Scan a stock SKU or lot number to see the item, or a CLIENT-<number> code to open a client. You can also scan a code from a photo. Unknown codes are listed under Error Logs."
          }
        },
        {
          "@type": "Question",
          "name": "How do I back up the studio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Copy data/studio_crm.sqlite, or the path set in SQLITE_DB_PATH. The snapshot button also writes a copy to storage/backups/. If the cloud snapshot database backup is overdue by more than six hours, a red banner appears with a button to run an instant cloud snapshot backup."
          }
        },
        {
          "@type": "Question",
          "name": "Does the online demo save my entries?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The online demo keeps what you enter in that browser tab only, using sessionStorage, and it is gone when you close the tab. Nothing is sent anywhere. The banner at the top of the demo page says this and links to the free app."
          }
        }
      ]
    }
  ]
}
</script>
```

---

## Internal Linking Suggestions

Link out from this page to related Poli International wiki and blog topics:

- **Self-hosting a studio tool:** a guide to installing Node.js 22 or newer, running `npm install` and `npm start`, and setting `PORT` and `STUDIO_MANAGER_EMAIL` in a `.env` file.
- **Keeping client records local:** why a SQLite file on the studio computer changes how you handle consent and medical data, and how copying `data/studio_crm.sqlite` works as a backup.
- **Digital consent and waiver records:** what a signed waiver should capture, how an age check fits in, and why a waiver should not save without a client and a signature.
- **Sterilisation and autoclave record keeping:** what a cycle record should contain, and a reminder to check your local health authority's rules for what you must keep.
- **Stock control for tattoo and piercing studios:** reorder levels, lot numbers, expiry dates and supplier lists.
- **Multi-session tattoo scheduling:** how to plan sittings a set number of weeks apart and keep the client's history in one place.
- **Aftercare messaging that you send yourself:** why the CRM prepares the text and hands it to your own email, WhatsApp or LINE app.
- **Tip splitting and shift records for studios:** the 80/15/5 split and clocking in and out.
- **Running a studio in more than one language:** what changes when the interface is in Thai, and which tools fall back to English.
- **Scanning codes in a studio:** using the device camera for stock SKUs, lot numbers and `CLIENT-<number>` codes, and what to do with unknown codes.
