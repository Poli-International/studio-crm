# Studio CRM user guide

Studio CRM runs on one computer in your studio. Staff open it in a web browser on that computer or on any device on the studio network. Your data stays in a file on that computer. Nothing is sent to Poli International.

## Install and start

1. Download the Studio CRM ZIP for your computer (Windows, Mac or Linux) from the Studio CRM page. Node.js is already inside; there is nothing else to install.
2. Unzip it. Put the `studio-crm` folder where it can stay, for example in Documents.
3. Double-click **Start Studio CRM** (`Start Studio CRM.bat` on Windows, `Start Studio CRM.command` on a Mac, `./start-studio-crm.sh` on Linux). On a Mac, the first time, right-click it and choose **Open**.
4. Your browser opens on `http://localhost:3000`. Keep the window that opened while you use the CRM; closing it stops the CRM. Other devices use the computer's network address instead of `localhost`, with `:3000` at the end.

If you downloaded the source code instead, install Node.js 22 or newer, then run `npm install` once and `npm start`. Docker users: `docker compose up -d`.

**Updating:** when a new version is out, the version number at the bottom of the menu says **update available**. Open **Settings**, **Updates**, and click **Update now** (an administrator only). The CRM downloads the new version, backs up the database into `storage/backups`, tries the new version on a copy of your data, and only then installs it and restarts by itself; the page reloads. Your data stays in the `data` folder and is never moved. If anything goes wrong, nothing is changed and the old version keeps running. The previous version is kept in the hidden `.update/previous` folder. Versions before 1.0.12 update by hand once: download the new ZIP, unzip it to a new folder, and copy your `data` folder from the old folder into the new one.

To use a different port, set `PORT` in a `.env` file (copy `.env.example`). Set `STUDIO_MANAGER_EMAIL` there too, so alerts are addressed to you.

## First run: demo data

A new install opens with demo clients, appointments, stock and staff, so you can try every screen. When you are ready for real work, click **Start with an empty studio** on the Dashboard. It deletes the demo records and keeps the service list, categories, templates, stations and settings. This cannot be undone.

## Language

Choose English, French, Italian, German, Spanish, Dutch, Portuguese or Thai from the language menu at the top. The Poli tools inside the CRM open in the same language where they offer it (tools without Thai open in English).

## Studio settings

Open **Settings** to enter your prices, deposit rule, tax (VAT) rate, touch-up policy and stock thresholds. The price estimator, quotes and invoices read these figures, so set them first. **Export CSV** downloads your price list; edit it and use **Import CSV** to load it back. You can also upload your studio logo; it appears in the top bar.

**Studio details and stations:** in **Settings**, **Studio details**, enter your studio's name, address, phone, email and health permit or licence number: every consent form shows them, on the computer and on the kiosk tablets. In **Stations**, add, rename or remove your stations (a tattoo room, a piercing room, a branding area...), give each a type and a usual artist. The booking form lists your stations, and booking an artist chooses the station they usually work at.

## Clients

**Clients** lists everyone with their contact details, allergies and medical notes, signed waivers and total spent. Use **New Client** to add one. Search filters the list as you type. **View Profile** opens the full record. In the profile, **Edit client** changes the details and **Delete** removes the client. The profile also lists appointments, staff notes, signed waivers, saved consent forms and photos of the work. To add many clients at once, open **Settings**, **Import Data** and paste a list whose first line is `name,email,phone,allergies,notes`. The **Signed** count includes consent forms signed on the tablet. **Healing Pipeline** lists the clients whose session was marked Completed in the last 90 days, grouped by days since the session, with **View Profile** and **Download PDF**.

**Aftercare:** in a client's profile, under **Aftercare**, choose the sheet (tattoo, piercing, fine line, PMU) and the appointment, then **Print and record aftercare**: the sheet prints with your studio's details and the client's name, and the CRM records which sheet was given, for which appointment, by whom and when. Each appointment shows whether aftercare was given. **🖨️ Aftercare sheet** in Clients prints a sheet with no client name, and records nothing. Each sheet prints in the language chosen next to it. In **Settings**, **Aftercare sheets**, change any sheet's title, description and steps in each language, or add your own sheets; a language left empty prints the English.

## Staff

Click the staff button at the top right (it reads **Staff Login** until someone is selected) to see your team. **Add staff member** adds a person, **Edit** changes their details and **Remove** takes them off the team. **Select** shows that person's name in the top bar, so everyone can see who is at the screen. Once a studio password is set, each person can also have their own login and access level (see below). A new staff member can be chosen straight away wherever an artist is picked, for example when you book an appointment.

## Tablets, phones and the studio password

Other devices in the studio open the CRM with the address shown in the window that started it. A tablet or phone that needs the camera (the scanner) must use the address that starts with `https://` and ends with `:3443`. The first time, the browser warns that the connection is not private, because the certificate was made by your own computer: choose Advanced, then Continue. On the plain `http://` address everything works except the camera.

The first time the CRM starts, it asks you to create the **studio password**. Every computer, tablet and phone then signs in once with it. You can choose **Continue without a password** and set one later in **Settings**, **Studio Password**. If you forget it, create an empty file named `reset-password.txt` in the `data` folder and start the CRM again: this removes the studio password and all staff logins.

**Lock a device that is not used:** in **Settings**, under the studio password, choose how long a device may stay unused (5, 10, 15 or 30 minutes) before it signs out by itself. The tablet kiosk is never locked: it has its own exit PIN.

**Staff logins and levels:** with the studio password set, open the staff list, click **Edit** on a person and choose an **Access level** and a **Login password** (at least 8 characters). Give yourself the **Administrator** level first: staff logins start working once one administrator has a login. From then on the sign-in page asks **Who are you?** and each person signs in with their own password. The studio password still works and signs in as administrator.

- **Front desk**: clients, appointments, waivers, payments, clocking in and out.
- **Staff**: everything front desk does, plus stock, suppliers, compliance records, aftercare, the rota and the consent form designs.
- **Administrator**: everything, including deleting records, the money reports, Settings, the team, logins, backups and imports.

Front desk and Staff do not see Finance and Settings. When someone tries something their level does not allow, the CRM says so and changes nothing. To remove a login, set the level to **No login**.

## Appointments and scheduling

**New Appointment** books a single session with artist, station, price and deposit. For multi-session work, the **Auto Scheduler** looks up the artist's free slots on a chosen day and books up to six sessions a set number of weeks apart. The Dashboard shows today's figures, upcoming bookings, station status and low stock. The Calendar lists every booked appointment, the coming ones first. **Completed** marks a session as done, so it counts in Duration Analytics, and **Remove** deletes it. **Edit** on an appointment changes its time, artist, station, price, deposit or notes. When booking, type the client's name and pick them from the list, so the appointment appears in their profile. Tapping a save button twice quickly saves once. The list also shows each appointment's deposit and the amount still to pay (price minus deposit).

## Digital waivers

Open the waiver form, pick the client from the list (their allergies are filled in), confirm the age check, and have the client sign on the pad. The waiver is saved with the signature image. It will not save without a client and a signature. Opened from a client's profile, the form already has that client chosen.

To have the client fill in a consent form on a tablet, open **Clients**, **Consent Form Builder**, **Preview Form**, then **Tablet Kiosk Mode**. The client answers one section per screen, signs on the last one and taps **Complete**. The form is saved with the signature and a PDF is downloaded. If no client was chosen first, a new client is created from the name, email, phone and date of birth on the form. Saved forms are in the client's profile under **Waivers**; **View answers** shows every answer. A form you edit in the form builder is saved with the studio data, so the tablet shows the same form as the computer you edited it on.

To keep a client inside the form when you step away, set a **Tablet Kiosk PIN** in **Settings**. Leaving Kiosk Mode then needs the PIN. When the client taps **Complete**, the kiosk checks that nothing is missing, saves the form and shows "Thank you, your form has been submitted" until a staff member enters the PIN. Signed waivers are in the client's profile under **Waivers**: **View waiver** shows the answers and the signature, and **Download PDF** saves a copy to print or keep.

**Kiosk tablets:** a tablet on a stand can do nothing but forms. In **Settings**, **Kiosk Tablets**, set a kiosk password (it needs the studio password). On the tablet, open the address shown there (it ends in `/kiosk`), sign in with the kiosk password and give the tablet a name; it then shows "Please wait". To send a form, open **Clients**, **Sign Waiver** on the client, choose the form, **Preview Form**, then **Send to kiosk**. The form opens on the tablet; when the client taps **Complete** it is saved to that client (under **Waivers**) and the tablet waits again. If you send while a form is still waiting, you can **Take back** the waiting one. A kiosk sign-in cannot open the CRM or read any client data. Turn on the tablet's full-screen or kiosk mode (for example Android screen pinning, or a kiosk browser) so the client stays on the page.

**Setting up a kiosk tablet, good to know:** the first time, the tablet warns that the connection is not private: tap **Advanced**, then **Proceed** (Chrome) or **Continue** (Edge). It is your own server; it made the certificate itself. If the warning keeps coming back, or a kiosk browser stops on it, use the `http://` address that **Settings** shows below it: no warning, but the forms cross your network unencrypted, so use it only on the studio's own Wi-Fi. Give the CRM computer a fixed address in your router ("DHCP reservation" or "static IP"), or the tablets lose it when its address changes. A tablet stays signed in, and a form waiting on it stays there, when the CRM is restarted.

**Clients under 18 and ID checks:** the CRM works out each client's age from their date of birth (from the record, the ID check, or a date of birth the client writes on a form). A client under 18 is marked **Under 18** in the client list, the profile and the booking form, and their forms need a parent or guardian signature: the CRM will not save or send a form without one (the **Minor Consent & Legal Guardian Authorization** template has it). If a client writes a date of birth under 18 on the tablet, the signed form is kept but marked in red, and the activity log says so. In the client's profile, **Record an ID check** keeps the type of ID and only its last 4 letters or digits, with who checked it and when; every form signed afterwards shows the age and the ID check, on screen and in the PDF.

**Scanner field:** in the form builder, add a **Scanner** field to a form and give its button your own words. On the form, the button scans a page from the scanner plugged into the computer that runs the CRM, from the desk or from a kiosk tablet; the page is kept with the form like a photo, and printed in its PDF. On Windows it uses the scanning built into Windows (WIA): if the scanner works with the Windows Scan app, it works here. On Linux it uses SANE. Not yet on a Mac.

## Messages: the CRM prepares, you send

Studio CRM does not send email, SMS or chat messages itself. When you prepare an aftercare email, a reminder or a supplier order, a **Message ready** panel appears. Click **Email**, **WhatsApp** or **LINE** to open it in your own app with the text filled in, then press send there, or click **Copy**.

## Stock, scanner and purchase orders

**Inventory** tracks quantities, lots, expiry dates and suppliers. Items at or below their reorder level count as low stock. The **Stock items** list shows every item with its quantity, reorder level, lot, expiry and supplier; search by name, SKU or supplier. **+ Add item** adds one by hand and **Edit** changes it. **Suppliers** lists your suppliers: **+ Add supplier** and **Edit**. Purchase orders are emailed to the supplier's order email, so check it.

The scanner in **Log Activity** uses the device camera. Scan a stock SKU or lot number to see the item, or a `CLIENT-<number>` code to open a client. You can also scan a code from a photo. Unknown codes are listed under **Error Logs**.

**Purchase Order** lists your suppliers and their low-stock items, creates a PO number, downloads a PDF and prepares the order email.

## Gallery

**Portfolio Works** holds photos of finished work, linked to the client and artist. **Flash Sheets** holds designs with price and deposit; mark one as claimed when a client reserves it. **Share** prepares a message for WhatsApp, LINE, X or email; the phone's share sheet can include the photo.

## Money and staff

The **Tip Calculator** splits a tip 80% artist, 15% apprentice, 5% desk and records it. Staff clock in and out with the shift button. Exports give you the activity log, low stock, shifts and session durations as CSV or PDF. On the Calendar, **Staff Shifts & Rota** shows whether a person is on shift, and the **Shift Rota** lists planned shifts: choose a person, a date and the hours, then **Add shift**. **Export Shift Roster** and, in Inventory, **Export Manifest** save a CSV or PDF file in your Downloads folder. In **Finance**, **Record Payment** records a payment: the client, the amount and how they paid. **Deposit Ledger** lists the deposits taken when appointments were booked.

## Compliance records

The **closing checklist** records which items were done, the supervisor, the autoclave cycle number and your notes. The **Autoclave Vault** lists sterilisation cycle records, and the Dashboard warns about stock past its expiry date. These are your own records: check your local health authority's rules for what you must keep.

## Poli tools

The **Tools** screen opens the Poli International tools (aftercare schedules, consent form builder, gauge converter, price estimator and more) inside the CRM.

## Backups

Everything is stored in `data/studio_crm.sqlite` (or the path set in `SQLITE_DB_PATH`). Copy that file to back up the studio. **Back up now** in **Settings** also writes a copy to `storage/backups/`. The CRM also saves a copy there every day and keeps the last 30 days. In **Settings**, **Database Backup**, **Also copy every backup to** a second folder (a USB stick, another disk, or a Google Drive, OneDrive or Dropbox folder) so a dead disk or a stolen computer does not take every copy with it.
