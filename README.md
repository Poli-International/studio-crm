# Studio CRM - Community Edition

Professional Studio Management system designed for Tattoo and Piercing studios. Built with Laravel.

## 🚀 Features

- **Client Management**: Secure database for client history, medical notes, and detailed professional profiles.
- **Studio Gallery**: Shared creative portfolio with social media integration, tagging, and artist filtering.
- **Team Management**: Role-based access control (Admin, Manager, Artist) with performance tracking.
- **Smart Scheduling**: Visual calendar with context-aware booking from client profiles.
- **Financial Hub**: Revenue tracking, artist commissions, and CSV reporting.
- **Compliance Vault**: HIPAA-compliant logs for sterilization, health checks, and waivers.
- **Inventory Control**: Real-time stock tracking with low-stock alerts.

## 🛠️ Tech Stack

- **Backend**: Laravel 10
- **Frontend**: Blade, Vanilla CSS (Glassmorphism design)
- **Icons**: Lucide Icons
- **Auth**: Laravel Session + Social Authentication (Google/Facebook)

## 📦 Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Poli-International/studio-crm.git
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and configure your database and mail settings.

3. **Install Dependencies**:

   ```bash
   composer install
   npm install
   ```

4. **Database Setup**:
   Import `database/schema.sql` into your MySQL database or run migrations if applicable.

5. **Symlink Storage**:

   ```bash
   php artisan storage:link
   ```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌐 Official Website

Visit [Poli International](https://poliinternational.com) for more tools and professional resources.

---
(c) 2026 Poli International. Support: <support@poliinternational.com>
