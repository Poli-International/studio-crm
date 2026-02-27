# Docker Setup for Studio CRM

## 🚀 Quick Start with Docker

If you have Docker installed, you can spin up a local instance of Studio CRM in minutes.

### 1. Prerequisites

- Docker Desktop
- Git

### 2. Launching the App

Run the following command in your terminal:

```bash
docker-compose up -d
```

### 3. Initial Configuration

After the containers are up, run the setup script:

```bash
# On Linux/macOS
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --seed
docker-compose exec app php artisan storage:link

# On Windows
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate --seed
docker-compose exec app php artisan storage:link
```

The application will be available at [http://localhost:8080](http://localhost:8080).

---

## 🛠️ Docker Architecture

- **App**: PHP 8.2-FPM container with necessary extensions (GD, PDO, Zip).
- **Web**: Nginx container configured for Laravel.
- **MySQL**: MySQL 8.0 database.

## 💾 Default Database Credentials

- **Database**: `studio_crm`
- **Username**: `sail`
- **Password**: `password`
- **Host**: `mysql` (internal to Docker)

---

## 🛑 Troubleshooting

### Port Conflicts

If port `8080` or `3306` is already in use on your machine, you can change the mappings in `docker-compose.yml`.

### Permission Issues

If you encounter permission issues with the `storage` or `bootstrap/cache` folders:

```bash
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```
