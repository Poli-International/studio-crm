# Gemini CLI Prompt: Make Studio CRM Production-Ready for Download

## Context

You are working on the **Studio CRM** — a Laravel 10 application for tattoo and piercing studio management. It's offered as a **free, open-source, self-hosted app** that studio owners can download from GitHub and run on their own server or local machine.

The codebase is **70% complete** — it has all models, controllers, views, and Docker setup, but is missing critical infrastructure: **database migrations, seeders, authentication middleware, email templates, and bug fixes**. Your job is to make it **100% production-ready** so a non-technical user can clone the repo, run the setup script, and have a working app.

**Working directory:** `Z:\Poliinternational work VS Code\studio-crm-laravel`

---

## Priority Order

Complete these tasks in order. Each section lists exactly what to create or fix.

---

## TASK 1: Fix Import Bugs in routes/web.php (CRITICAL)

The routes file uses `Hash::` and `Str::` without importing them.

**File:** `routes/web.php`

Add these two imports at the top of the file, after the existing `use` statements:

```php
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
```

These are used on lines 69, 95, 98, 147, 148, 149 for password hashing and UUID generation.

---

## TASK 2: Create Database Migrations (CRITICAL)

The app currently only has a `database/schema.sql` file. Laravel requires migration files for `php artisan migrate` to work.

Create the `database/migrations/` directory and add the following migration files. The table structures MUST match the existing schema.sql exactly.

### Migration 1: `2025_01_20_000001_create_staff_table.php`

```
Table: staff
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- user_uuid: VARCHAR(36), NOT NULL
- name: VARCHAR(100), NOT NULL
- email: VARCHAR(100), NOT NULL, UNIQUE
- password_hash: VARCHAR(255), NOT NULL
- role: ENUM('admin', 'manager', 'artist', 'receptionist'), default 'artist'
- specialties: TEXT, nullable (stores JSON array)
- commission_rate: DECIMAL(5,2), default 0.00
- active: TINYINT(1), default 1
- timestamps (created_at, updated_at)
```

### Migration 2: `2025_01_20_000002_create_clients_table.php`

```
Table: clients
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- name: VARCHAR(100), NOT NULL
- email: VARCHAR(100), NOT NULL, UNIQUE
- password_hash: VARCHAR(255), nullable (for Client Portal)
- phone: VARCHAR(20), nullable
- dob: DATE, nullable
- address: TEXT, nullable
- profession: VARCHAR(100), nullable
- website: VARCHAR(255), nullable
- medical_history: TEXT, nullable
- allergies: TEXT, nullable
- photo_url: VARCHAR(255), nullable
- notes: TEXT, nullable
- timestamps
```

### Migration 3: `2025_01_20_000003_create_appointments_table.php`

```
Table: appointments
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- client_id: INT UNSIGNED, foreign key → clients(id) ON DELETE CASCADE
- staff_id: INT UNSIGNED, foreign key → staff(id)
- service_type: ENUM('tattoo', 'piercing', 'consultation', 'touchup', 'removal'), NOT NULL
- datetime: DATETIME, NOT NULL
- duration_minutes: INT, default 60
- deposit_amount: DECIMAL(10,2), default 0.00
- status: ENUM('pending', 'confirmed', 'completed', 'cancelled', 'noshow'), default 'pending'
- notes: TEXT, nullable
- timestamps
```

### Migration 4: `2025_01_20_000004_create_services_table.php`

```
Table: services
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- client_id: INT UNSIGNED, foreign key → clients(id) ON DELETE CASCADE
- staff_id: INT UNSIGNED, foreign key → staff(id)
- appointment_id: INT UNSIGNED, nullable, foreign key → appointments(id)
- type: ENUM('tattoo', 'piercing', 'touchup', 'removal'), NOT NULL
- body_location: VARCHAR(100), NOT NULL
- machine_tools: TEXT, nullable
- materials_used: TEXT, nullable
- practitioner_notes: TEXT, nullable
- price: DECIMAL(10,2), NOT NULL
- execution_photo_url: VARCHAR(255), nullable
- date_completed: DATETIME, NOT NULL
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP
```

### Migration 5: `2025_01_20_000005_create_financial_table.php`

```
Table: financial
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- client_id: INT UNSIGNED, nullable, foreign key → clients(id)
- service_id: INT UNSIGNED, nullable, foreign key → services(id)
- staff_id: INT UNSIGNED, nullable, foreign key → staff(id)
- type: ENUM('payment', 'refund', 'expense', 'deposit'), NOT NULL
- amount: DECIMAL(10,2), NOT NULL
- method: VARCHAR(50), nullable (cash, card, bank_transfer)
- source: VARCHAR(50), nullable (in-studio, online, etc.)
- external_order_id: VARCHAR(255), nullable
- transaction_date: DATETIME, NOT NULL
- status: VARCHAR(20), default 'completed'
- notes: TEXT, nullable
```

### Migration 6: `2025_01_20_000006_create_inventory_table.php`

```
Table: inventory
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- name: VARCHAR(255), NOT NULL
- item_type: VARCHAR(50), NOT NULL (ink, needle, jewelry, aftercare, supply)
- sku: VARCHAR(50), nullable
- quantity: INT, default 0
- reorder_point: INT, default 5
- details: JSON, nullable
- supplier_info: TEXT, nullable
```

### Migration 7: `2025_01_20_000007_create_forms_table.php`

```
Table: forms
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- client_id: INT UNSIGNED, foreign key → clients(id) ON DELETE CASCADE
- form_type: ENUM('intake', 'consent', 'aftercare', 'waiver'), NOT NULL
- data: JSON, NOT NULL
- signed_at: DATETIME, NOT NULL
- pdf_path: VARCHAR(255), nullable
```

### Migration 8: `2025_01_20_000008_create_documents_table.php`

```
Table: documents
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- client_id: INT UNSIGNED, nullable
- type: ENUM('id_scan', 'design_reference', 'msds', 'autoclave_log', 'certificate', 'license', 'other'), NOT NULL
- file_path: VARCHAR(255), NOT NULL
- description: VARCHAR(255), nullable
- uploaded_by_client: TINYINT(1), default 0
- uploaded_at: TIMESTAMP, default CURRENT_TIMESTAMP
```

### Migration 9: `2025_01_20_000009_create_compliance_table.php`

```
Table: compliance
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- staff_id: INT UNSIGNED, nullable, foreign key → staff(id)
- type: VARCHAR(50), NOT NULL
- log_date: DATE, NOT NULL
- details: JSON, nullable
- status: VARCHAR(20), default 'pass'
- verified_by: INT UNSIGNED, nullable, foreign key → staff(id)
```

### Migration 10: `2025_01_20_000010_create_gallery_posts_table.php`

```
Table: gallery_posts
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- staff_id: INT UNSIGNED, foreign key → staff(id)
- title: VARCHAR(255), nullable
- description: TEXT, nullable
- image_path: VARCHAR(255), NOT NULL
- tags: VARCHAR(255), nullable
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP
```

### Migration 11: `2025_01_20_000011_create_service_photos_table.php`

```
Table: service_photos
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- service_id: INT UNSIGNED, foreign key → services(id) ON DELETE CASCADE
- photo_path: VARCHAR(255), NOT NULL
- photo_type: ENUM('before', 'during', 'after', 'healed'), default 'after'
- uploaded_at: TIMESTAMP, default CURRENT_TIMESTAMP
```

### Migration 12: `2025_01_20_000012_create_email_queue_table.php`

```
Table: email_queue
Columns:
- id: INT UNSIGNED, auto-increment, primary key
- client_id: INT UNSIGNED, nullable, foreign key → clients(id)
- template: VARCHAR(100), NOT NULL
- subject: VARCHAR(255), NOT NULL
- body: TEXT, nullable
- scheduled_at: DATETIME, NOT NULL
- sent_at: DATETIME, nullable
- status: VARCHAR(20), default 'pending'
- created_at: TIMESTAMP, default CURRENT_TIMESTAMP
```

---

## TASK 3: Create Database Seeders (HIGH)

Create seeders that populate the database with realistic demo data so studio owners can immediately see how the app works.

### File: `database/seeders/DatabaseSeeder.php`

Call all seeders in order:
1. StaffSeeder
2. ClientSeeder
3. AppointmentSeeder
4. ServiceSeeder
5. FinancialSeeder
6. InventorySeeder
7. ComplianceSeeder
8. FormSeeder

### File: `database/seeders/StaffSeeder.php`

Create 6 staff members:

| name | email | password (hash "password") | role | specialties (JSON) | commission_rate | active |
|------|-------|---------------------------|------|--------------------|-----------------|--------|
| Marcus Rivera | marcus@studio.com | (hashed) | admin | ["Management", "Training"] | 0.00 | 1 |
| Yuki Tanaka | yuki@studio.com | (hashed) | artist | ["Neo-Japanese", "Realism", "Color"] | 55.00 | 1 |
| Sofia Petrov | sofia@studio.com | (hashed) | artist | ["Geometric", "Watercolor", "Dotwork"] | 50.00 | 1 |
| Jake Williams | jake@studio.com | (hashed) | artist | ["Celtic", "Traditional", "Piercings"] | 50.00 | 1 |
| Ana Martinez | ana@studio.com | (hashed) | manager | ["Operations", "Scheduling"] | 0.00 | 1 |
| Tom Bradley | tom@studio.com | (hashed) | artist | ["Blackwork", "Lettering"] | 45.00 | 0 |

Use `Hash::make('password')` for all passwords. Generate UUIDs with `Str::uuid()`.

**Important**: The default demo login should be:
- Email: `marcus@studio.com`
- Password: `password`

### File: `database/seeders/ClientSeeder.php`

Create 8 clients:

| name | email | phone | profession | dob | address | allergies | medical_history |
|------|-------|-------|------------|-----|---------|-----------|-----------------|
| Sarah Mitchell | sarah.m@email.com | +1 555-0101 | Graphic Designer | 1992-03-15 | 42 Art Street, Brooklyn NY | Latex sensitivity | Previous keloid scarring on left shoulder |
| James Rodriguez | j.rodriguez@email.com | +1 555-0102 | Music Producer | 1988-07-22 | 15 Sound Ave, Austin TX | None known | (null) |
| Emma Thompson | emma.t@email.com | +1 555-0103 | Nurse | 1995-11-08 | 78 Health Blvd, Portland OR | Nickel allergy | (null) |
| Alex Chen | alex.chen@email.com | +1 555-0104 | Software Engineer | 1990-01-30 | 200 Tech Lane, Seattle WA | (null) | Prone to keloids — test area first |
| Maria Santos | maria.s@email.com | +1 555-0105 | Photographer | 1993-06-14 | 33 Lens Rd, Miami FL | (null) | (null) |
| David Kim | david.k@email.com | +1 555-0106 | Chef | 1987-12-03 | 5 Kitchen St, Chicago IL | (null) | (null) |
| Lisa Johnson | lisa.j@email.com | +1 555-0107 | Teacher | 1991-09-20 | 12 School Dr, Denver CO | (null) | (null) |
| Ryan O'Brien | ryan.ob@email.com | +1 555-0108 | Electrician | 1985-04-11 | 88 Wire Ave, Boston MA | (null) | Blood thinner medication |

### File: `database/seeders/AppointmentSeeder.php`

Create 10 appointments with various dates (mix of past completed and future confirmed/pending). Use client IDs 1-8 and staff IDs 2-4 (artists). Include various service types.

### File: `database/seeders/ServiceSeeder.php`

Create 8 completed service records matching some past appointments. Include realistic body_location, machine_tools, materials_used, and price data.

### File: `database/seeders/FinancialSeeder.php`

Create 8 payment transactions matching the completed services. Use various payment methods (cash, card, bank_transfer).

### File: `database/seeders/InventorySeeder.php`

Create 10 inventory items:

| name | item_type | sku | quantity | reorder_point |
|------|-----------|-----|----------|---------------|
| Black Ink (Eternal) | ink | INK-BLK-01 | 12 | 5 |
| Liner Needles 3RL | needle | NDL-3RL-01 | 3 | 10 |
| Shader Needles 7M1 | needle | NDL-7M1-01 | 45 | 10 |
| Red Ink (Intenze) | ink | INK-RED-01 | 8 | 5 |
| Blue Ink (Eternal) | ink | INK-BLU-01 | 2 | 5 |
| Titanium Labret 16g | jewelry | JWL-LAB-01 | 28 | 10 |
| Surgical Steel CBR 14g | jewelry | JWL-CBR-01 | 15 | 8 |
| Aftercare Balm | aftercare | AFC-BLM-01 | 34 | 15 |
| Nitrile Gloves (L) | supply | SUP-GLV-01 | 200 | 50 |
| Stencil Paper | supply | SUP-STP-01 | 85 | 20 |

### File: `database/seeders/ComplianceSeeder.php`

Create 4 compliance logs with various types (maintenance, autoclave_log, training) and status 'pass'.

### File: `database/seeders/FormSeeder.php`

Create 4 consent/waiver forms linked to clients with `signed_at` dates and empty `data` JSON (`{}`).

---

## TASK 4: Add Authentication Middleware (CRITICAL)

Currently, ALL routes are accessible without logging in. This is a major security issue.

### Step 1: Create Auth Middleware

**File:** `app/Http/Middleware/EnsureAuthenticated.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAuthenticated
{
    public function handle(Request $request, Closure $next)
    {
        if (!session('authenticated')) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
```

### Step 2: Create Role Middleware

**File:** `app/Http/Middleware/EnsureRole.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!in_array(session('user_role'), $roles)) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
```

### Step 3: Register Middleware

**File:** `app/Http/Kernel.php`

Add to the `$middlewareAliases` array (or `$routeMiddleware` in Laravel 10):

```php
'auth.session' => \App\Http\Middleware\EnsureAuthenticated::class,
'role' => \App\Http\Middleware\EnsureRole::class,
```

### Step 4: Apply Middleware to Routes in `routes/web.php`

Wrap all protected routes in a middleware group. The file should be restructured like this:

```php
// PUBLIC routes (no auth required)
Route::get('/login', ...)->name('login');
Route::post('/login', ...)->name('login.post');
Route::get('/register', ...)->name('register');
Route::post('/register', ...)->name('register.post');
Route::get('/auth/{provider}', ...)->name('social.login');
Route::get('/auth/{provider}/callback', ...)->name('auth.callback');

// PROTECTED routes (require auth)
Route::middleware(['auth.session'])->group(function () {
    Route::get('/', ...)->name('dashboard');
    Route::get('/logout', ...)->name('logout');
    Route::get('/clients', ...)->name('clients.index');
    Route::post('/clients', ...)->name('clients.store');
    Route::get('/clients/{client}', ...)->name('clients.show');
    Route::get('/appointments', ...)->name('appointments.index');
    Route::post('/appointments', ...)->name('appointments.store');
    Route::get('/services', ...)->name('services.index');
    Route::get('/financial', ...)->name('financial.index');
    Route::post('/financial', ...)->name('financial.store');
    Route::get('/inventory', ...)->name('inventory.index');
    Route::post('/inventory', ...)->name('inventory.store');
    Route::get('/compliance', ...)->name('compliance.index');
    Route::post('/compliance', ...)->name('compliance.store');
    Route::post('/forms', ...)->name('forms.store');
    Route::post('/documents', ...)->name('documents.store');
    Route::get('/gallery', ...)->name('gallery.index');
    Route::post('/gallery', ...)->name('gallery.store');
    Route::get('/settings', ...)->name('settings.index');
    Route::get('/documentation', ...)->name('documentation.index');
    Route::get('/download-resource/{filename}', ...)->name('download.resource');

    // Admin/Manager only
    Route::middleware(['role:admin,manager'])->group(function () {
        Route::get('/team', ...)->name('staff.index');
        Route::post('/team', ...)->name('staff.store');
    });
});
```

Also update the dashboard route's redirect: when not authenticated, redirect to `/login` instead of showing the landing view. The landing page should be at a different route (e.g., `/welcome`).

Actually, keep it as-is — the `landing` view IS the public-facing page at `/`. When the user is NOT authenticated, show the landing page. When they ARE authenticated, show the dashboard. This pattern is already correct in the existing code. The middleware group should protect the other routes, NOT the `/` route. Move `/` outside the middleware group and keep the existing `if (!session('authenticated'))` check inside the route closure.

---

## TASK 5: Add CSRF Middleware (CRITICAL)

Laravel's CSRF middleware should already be registered in `app/Http/Kernel.php` in the `web` middleware group. Verify that `\App\Http\Middleware\VerifyCsrfToken::class` is present. If the Kernel.php file doesn't exist or doesn't have it, create it with all the standard Laravel 10 middleware.

Check if `app/Http/Kernel.php` exists. If not, create the standard Laravel 10 Kernel with:
- Web middleware group including: EncryptCookies, AddQueuedCookiesToResponse, StartSession, ShareErrorsFromSession, VerifyCsrfToken, SubstituteBindings
- API middleware group including: throttle:api, SubstituteBindings
- The custom middlewares from Task 4

---

## TASK 6: Create Email Templates (HIGH)

The `EmailEngine.php` service references email templates that don't exist.

### Create directory: `resources/views/emails/`

### File: `resources/views/emails/base.blade.php`

A base email layout with:
- Studio CRM header/logo
- Content section (`@yield('content')`)
- Footer with studio name and unsubscribe link
- Clean, professional styling (inline CSS for email compatibility)

### File: `resources/views/emails/tattoo-welcome.blade.php`

```
@extends('emails.base')
Subject: Welcome & Aftercare Instructions
Content: Thank you for your session! Here are your aftercare instructions...
Variables: {{ $clientName }}, {{ $artistName }}, {{ $serviceType }}
```

### File: `resources/views/emails/tattoo-checkin.blade.php`

```
Subject: How's Your New Tattoo Healing?
Content: It's been 3 days since your session. Check-in on healing progress...
```

### File: `resources/views/emails/tattoo-aftercare.blade.php`

```
Subject: One Week Aftercare Reminder
Content: 7-day aftercare check...
```

### File: `resources/views/emails/tattoo-touchup.blade.php`

```
Subject: Time for a Touch-Up?
Content: 6-month follow-up reminder...
```

### File: `resources/views/emails/piercing-welcome.blade.php`

```
Subject: Piercing Care Instructions
Content: Fresh piercing care guide...
```

### File: `resources/views/emails/piercing-checkup.blade.php`

```
Subject: 2-Week Piercing Check-Up
Content: Check-up reminder...
```

Each template should be a proper HTML email with inline CSS, look professional, and include the `{{ $clientName }}` placeholder at minimum.

---

## TASK 7: Create Missing Storage Directories

Ensure these directories exist (create them with `.gitkeep` files):

```
storage/app/public/.gitkeep
storage/app/public/gallery/.gitkeep
storage/app/public/vault/.gitkeep
storage/app/public/photos/.gitkeep
storage/framework/cache/.gitkeep
storage/framework/sessions/.gitkeep
storage/framework/views/.gitkeep
storage/logs/.gitkeep
```

---

## TASK 8: Update Landing Page with Demo Credentials (MEDIUM)

**File:** `resources/views/landing.blade.php`

Add a visible box on the landing page that shows demo login credentials:

```
Demo Login:
Email: marcus@studio.com
Password: password
```

This should be styled prominently so new users know how to get in immediately.

Also update `resources/views/auth/login.blade.php` to show the same demo credentials hint.

---

## TASK 9: Update Setup Scripts (MEDIUM)

### File: `setup.sh`

Verify and update the setup script to:
1. Copy `.env.example` to `.env` (if not exists)
2. Run `docker-compose up -d`
3. Wait for MySQL to be ready (add a health check loop)
4. Run `docker-compose exec app composer install`
5. Run `docker-compose exec app php artisan key:generate`
6. Run `docker-compose exec app php artisan migrate --seed`
7. Run `docker-compose exec app php artisan storage:link`
8. Print success message with URL and demo credentials

### File: `setup.ps1`

Same logic for Windows PowerShell.

### Add: `Makefile` (optional but nice)

```makefile
setup:
	cp -n .env.example .env || true
	docker-compose up -d
	docker-compose exec app composer install
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan migrate --seed
	docker-compose exec app php artisan storage:link
	@echo "Studio CRM is ready at http://localhost:8080"
	@echo "Login: marcus@studio.com / password"

down:
	docker-compose down

reset:
	docker-compose exec app php artisan migrate:fresh --seed

logs:
	docker-compose logs -f app
```

---

## TASK 10: Add .env.example Updates (LOW)

**File:** `.env.example`

Update to be more user-friendly:

```env
APP_NAME="Studio CRM"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8080

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=studio_crm
DB_USERNAME=sail
DB_PASSWORD=password

# Email (change to smtp for real emails)
MAIL_MAILER=log
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@yourstudio.com"
MAIL_FROM_NAME="${APP_NAME}"

SESSION_DRIVER=file
SESSION_LIFETIME=120
QUEUE_CONNECTION=database
```

---

## TASK 11: Create a LICENSE File (LOW)

**File:** `LICENSE`

Standard MIT License with:
- Copyright (c) 2026 Poli International
- Full MIT license text

---

## TASK 12: Update README with Accurate Information (LOW)

**File:** `README.md`

Update the installation section to accurately reflect that:
1. Docker is the recommended approach
2. Demo credentials are `marcus@studio.com` / `password`
3. `php artisan migrate --seed` now works (migrations exist)
4. The Screenshots section should say "See the live demo" with a link

---

## Existing Files Reference (DO NOT recreate — these already exist and work)

### Models (12 files in `app/Models/`) — all correct, don't modify:
- Staff.php, Client.php, Appointment.php, Service.php, ServicePhoto.php
- Financial.php, Inventory.php, Form.php, Document.php
- Compliance.php, GalleryPost.php, EmailQueue.php

### Controllers (14 files in `app/Http/Controllers/`) — all correct, don't modify:
- AuthController.php, ClientController.php, AppointmentController.php
- ServiceController.php, FinancialController.php, InventoryController.php
- ComplianceController.php, DocumentController.php, GalleryController.php
- StaffController.php, ClientPortalController.php
- OnlineStoreIntegrationController.php, SalesController.php, Controller.php

### Views (17 blade templates) — all correct, don't modify:
- layouts/app.blade.php, partials/modals.blade.php
- auth/login.blade.php, auth/register.blade.php
- landing.blade.php, dashboard/index.blade.php
- clients/index.blade.php, clients/show.blade.php
- appointments/index.blade.php, services/index.blade.php
- financial/index.blade.php, inventory/index.blade.php
- compliance/index.blade.php, gallery/index.blade.php
- staff/index.blade.php, settings/index.blade.php
- documentation/index.blade.php

### Docker files — exist and work, only update setup scripts:
- docker-compose.yml, docker/Dockerfile, docker/nginx.conf

### Documentation — exists, only update README.md:
- README.md, DOCKER_SETUP.md, QUICK_START.md, CONTRIBUTING.md

### Other existing files that work fine:
- composer.json, .env.example, .gitignore
- public/index.php, public/downloads/*.txt
- app/Services/EmailEngine.php

---

## Existing Database Schema (for reference — migrations must match this)

```sql
-- Table: staff
CREATE TABLE IF NOT EXISTS `staff` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_uuid` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'manager', 'artist', 'receptionist') NOT NULL DEFAULT 'artist',
  `specialties` TEXT NULL,
  `commission_rate` DECIMAL(5,2) DEFAULT 0.00,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_unique` (`email` ASC)
) ENGINE = InnoDB;

-- Table: clients
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NULL,
  `phone` VARCHAR(20) NULL,
  `dob` DATE NULL,
  `address` TEXT NULL,
  `profession` VARCHAR(100) NULL,
  `website` VARCHAR(255) NULL,
  `medical_history` TEXT NULL,
  `allergies` TEXT NULL,
  `photo_url` VARCHAR(255) NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_unique` (`email` ASC)
) ENGINE = InnoDB;

-- Table: appointments
CREATE TABLE IF NOT EXISTS `appointments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` INT UNSIGNED NOT NULL,
  `staff_id` INT UNSIGNED NOT NULL,
  `service_type` ENUM('tattoo', 'piercing', 'consultation', 'touchup', 'removal') NOT NULL,
  `datetime` DATETIME NOT NULL,
  `duration_minutes` INT NOT NULL DEFAULT 60,
  `deposit_amount` DECIMAL(10,2) DEFAULT 0.00,
  `status` ENUM('pending', 'confirmed', 'completed', 'cancelled', 'noshow') NOT NULL DEFAULT 'pending',
  `notes` TEXT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_appt_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Table: services
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` INT UNSIGNED NOT NULL,
  `staff_id` INT UNSIGNED NOT NULL,
  `appointment_id` INT UNSIGNED NULL,
  `type` ENUM('tattoo', 'piercing', 'touchup', 'removal') NOT NULL,
  `body_location` VARCHAR(100) NOT NULL,
  `machine_tools` TEXT NULL,
  `materials_used` TEXT NULL,
  `practitioner_notes` TEXT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `execution_photo_url` VARCHAR(255) NULL,
  `date_completed` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_service_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Table: forms
CREATE TABLE IF NOT EXISTS `forms` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` INT UNSIGNED NOT NULL,
  `form_type` ENUM('intake', 'consent', 'aftercare', 'waiver') NOT NULL,
  `data` JSON NOT NULL,
  `signed_at` DATETIME NOT NULL,
  `pdf_path` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_form_client` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Table: documents
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `client_id` INT UNSIGNED NULL,
  `type` ENUM('id_scan', 'design_reference', 'msds', 'autoclave_log', 'certificate', 'license', 'other') NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL,
  `uploaded_by_client` TINYINT(1) DEFAULT 0,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- Table: gallery_posts
CREATE TABLE IF NOT EXISTS `gallery_posts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `staff_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `tags` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;
```

Note: The `financial`, `inventory`, `compliance`, `service_photos`, and `email_queue` tables are NOT in schema.sql — they were added later via the models/controllers. Your migrations must create ALL tables including these.

---

## Verification Steps

After completing all tasks:

1. **Test migrations**: `php artisan migrate:fresh --seed` should succeed with zero errors
2. **Test login**: Visit the app, login with `marcus@studio.com` / `password`
3. **Test all pages**: Click through Dashboard, Clients, Schedule, Services, Financial, Inventory, Compliance, Gallery, Team, Settings, Documentation
4. **Test auth middleware**: Log out, try to visit `/clients` directly — should redirect to login
5. **Test role middleware**: Login as an artist (e.g., `yuki@studio.com`), try `/team` — should get 403
6. **Test modals**: Open Add Client, New Appointment, Record Payment modals — submit forms
7. **Test CSV export**: Go to Financial, click Export CSV — verify download
8. **Docker test**: `docker-compose up -d && docker-compose exec app php artisan migrate:fresh --seed` should work

---

## Important Notes

- Do NOT modify any existing Model files — they all work correctly
- Do NOT modify any existing Controller files — they work correctly
- Do NOT modify any existing Blade template files EXCEPT login.blade.php and landing.blade.php (to add demo credentials)
- The `password_hash` column name is intentional — the Staff model has `getAuthPassword()` that returns it
- Specialties in the Staff model casts to `array` — store as JSON string in the database
- The Financial model has `$timestamps = false` — do NOT add timestamps to its migration
- The Compliance model has `$timestamps = false` — same
- The Inventory model has `$timestamps = false` — same
- Keep all existing documentation files (.md) as-is except README.md
