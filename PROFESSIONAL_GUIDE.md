# Studio CRM: Professional Implementation Guide
## Strategic Management & Technical Excellence

Welcome to the **Studio CRM Community Edition**. This application is designed to give you 100% data sovereignty while providing pro-grade management tools. This guide contains everything you need to transition your studio to digital excellence.

---

## 🚀 1. Fast-Track Setup

### The Docker Way (Recommended)
If you have Docker installed, you are 2 minutes away from a working system.
1. Extract the ZIP file.
2. Open your terminal/command prompt in the folder.
3. Run:
   - **Windows:** `.\setup.ps1`
   - **Linux/Mac:** `chmod +x setup.sh && ./setup.sh`
4. Visit `http://localhost:8080`.
5. **Login:** `marcus@studio.com` / `password`

### The Manual Way
Requires PHP 8.1+, Composer, and MySQL.
1. `cp .env.example .env`
2. `composer install`
3. `php artisan key:generate`
4. `php artisan migrate --seed`
5. `php artisan storage:link`
6. `php artisan serve`

---

## 💡 Professional Tips for Studio Owners

### Tip 1: The "Local Network" Access
You don't need a cloud server to use this across your studio. 
- Once the app is running on your main desk computer, find that computer's local IP (e.g., `192.168.1.50`).
- Artists can then access the CRM from their tablets or stations by visiting `http://192.168.1.50:8080`.

### Tip 2: Data Sovereignty & Backups
Because you host this app, **you own the data**. 
- **Hint:** Regularly export your SQL database or copy the `database/database.sqlite` file (if using SQLite) to an encrypted external drive.
- Never lose your client history to a "cloud outage" again.

### Tip 3: Optimized Workflow
Use the **Compliance Vault** before the needle touches skin.
- Have your client sign the digital waiver on a tablet.
- The CRM automatically links that signed PDF to the client's profile.
- **Tip:** Take a photo of the completed tattoo and upload it directly to the session log for insurance protection.

---

## 🛠️ Technical Hints

### Custom Branding
Want to add your logo to the login page?
- Replace the image URL in `resources/views/auth/login.blade.php` with your own hosted logo or a local path in the `public` folder.

### Production Security
If you plan to put this on a public web server (like a VPS):
1. Change `APP_DEBUG` to `false` in your `.env` file.
2. Change the default password for `marcus@studio.com` immediately in the **Team Management** screen.
3. Ensure your `.env` file is never publicly accessible.

### Email Integration
To send real aftercare emails:
- Update the `MAIL_` settings in your `.env` file with your SMTP provider details (Gmail, Mailgun, SendGrid, etc.).
- Switch `MAIL_MAILER` from `log` to `smtp`.

---

## ☕ Support the Ecosystem
This tool is provided free by **Poli International**. If it helps your business grow, consider supporting our engineering of future open-source tools:

👉 **[Support us on Ko-fi](https://ko-fi.com/C0C81NEXBV)**

---

*© 2026 Poli International Ltd. | Built for the community, by the community.*
