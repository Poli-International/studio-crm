# Studio CRM - Community Edition

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PHP](https://img.shields.io/badge/PHP-8.1+-777BB4?logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-10-FF2D20?logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-4479A1?logo=mysql&logoColor=white)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?logo=ko-fi&logoColor=white)](https://ko-fi.com/patrickkofi)

**Professional Studio Management System for Tattoo & Piercing Studios**

[🌐 Live Demo](https://poliinternational.com/studio-crm) • [📖 Documentation](https://poliinternational.com/studio-crm/documentation/) • [🐛 Report Bug](https://github.com/Poli-International/studio-crm/issues) • [💡 Request Feature](https://github.com/Poli-International/studio-crm/discussions)

</div>

---

## ✨ Why Studio CRM?

Built by industry professionals for industry professionals. Studio CRM combines powerful management features with an intuitive interface designed specifically for tattoo and piercing studios.

**🎯 Try it now:** [poliinternational.com/studio-crm](https://poliinternational.com/studio-crm) - *No installation required!*

---

## 🚀 Features

- **👥 Client Management**: Secure database for client history, medical notes, and detailed professional profiles with AES-256 encryption
- **🎨 Studio Gallery**: Shared creative portfolio with social media integration, tagging, and artist-specific filtering
- **🔐 Team Management**: Role-based access control (Admin, Manager, Artist) with performance tracking and commission management
- **📅 Smart Scheduling**: Visual drag-and-drop calendar with Google Calendar sync and context-aware booking
- **💰 Financial Hub**: Revenue tracking, artist commission calculations, and comprehensive CSV reporting
- **🏥 Compliance Vault**: HIPAA-compliant storage for waivers, sterilization logs, and health compliance records
- **📦 Inventory Control**: Real-time stock tracking with intelligent low-stock alerts

---

## 🛠️ Tech Stack

- **Backend**: Laravel 10 (PHP 8.1+)
- **Frontend**: Blade Templates + Vanilla CSS (Glassmorphism design)
- **Database**: MySQL 5.7+
- **Icons**: Lucide Icon Library
- **Auth**: Laravel Session + Social Authentication (Google/Facebook)
- **Security**: CSRF Protection, Encrypted Database Fields, Secure Session Management

---

## 📦 Installation

### Prerequisites

- PHP 8.1 or higher
- Composer
- MySQL 5.7 or higher
- Node.js & npm (for asset compilation)

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Poli-International/studio-crm.git
   cd studio-crm
   ```

2. **Environment Setup**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your database and mail settings.

3. **Install Dependencies**:

   ```bash
   composer install
   npm install
   ```

4. **Generate Application Key**:

   ```bash
   php artisan key:generate
   ```

5. **Database Setup**:

   Import `database/schema.sql` into your MySQL database or run migrations if applicable.

6. **Symlink Storage**:

   ```bash
   php artisan storage:link
   ```

7. **Start Development Server**:

   ```bash
   php artisan serve
   ```

   Visit `http://localhost:8000` in your browser.

---

## 🌐 Live Demo

**Try Studio CRM without installation:**

👉 **[poliinternational.com/studio-crm](https://poliinternational.com/studio-crm)**

*Experience all features in action with our hosted demo!*

---

## 📸 Screenshots

> 📝 *Screenshots coming soon! Check the [live demo](https://poliinternational.com/studio-crm) to see it in action.*

---

## 🤝 Contributing

We welcome contributions! Whether it's:

- 🐛 Bug reports
- 💡 Feature requests
- 📖 Documentation improvements
- 🔧 Code contributions

Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**TL;DR:** Free to use, modify, and distribute. No restrictions!

---

## 🛠️ More Professional Tools

Studio CRM is one of **17 free tools** we've built for the tattoo & piercing industry:

- 🎨 [Tattoo Font Previewer](https://poliinternational.com/tools/tattoo-font-previewer/) - Preview custom text in 100+ tattoo fonts
- 📏 [Gauge Converter](https://poliinternational.com/tools/gauge-converter/) - Convert between gauge sizes and millimeters
- 🩹 [Healing Tracker](https://poliinternational.com/tools/healing-tracker/) - Track healing progress with photos
- 💉 [Pain Guide](https://poliinternational.com/tools/pain-guide/) - Interactive body pain level guide
- 📐 [Stencil Calculator](https://poliinternational.com/tools/stencil-calculator/) - Calculate stencil sizes
- 🎯 [Piercing Angle Guide](https://poliinternational.com/tools/piercing-angle-guide/) - Proper piercing angles
- ...and 11 more!

**Explore all tools:** [poliinternational.com/tools](https://poliinternational.com/tools)

---

## 💬 Support & Community

- 📧 **Email**: [patrick@poli-international.com](mailto:patrick@poli-international.com)
- 🌐 **Website**: [poliinternational.com](https://poliinternational.com)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Poli-International/studio-crm/discussions)
- 🐛 **Issues**: [GitHub Issues](https://github.com/Poli-International/studio-crm/issues)

---

## ☕ Support This Project

If Studio CRM helps your business, consider supporting its development:

[![Ko-fi](https://img.shields.io/badge/Support%20on-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/patrickkofi)

Your support helps us:

- 🚀 Add new features
- 🐛 Fix bugs faster
- 📖 Improve documentation
- 🆓 Keep it free forever

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

<div align="center">

**Built with ❤️ by [Poli International](https://poliinternational.com)**

*Empowering studios with professional tools since 2026*

[![Website](https://img.shields.io/badge/Website-poliinternational.com-0693e3?style=flat-square)](https://poliinternational.com)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-patrickkofi-FF5E5B?style=flat-square&logo=ko-fi)](https://ko-fi.com/patrickkofi)

</div>
