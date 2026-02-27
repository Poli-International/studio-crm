#!/bin/bash

# Studio CRM Automated Setup Script
# Version 1.1 (2026) - Production Ready

echo "🚀 Starting Studio CRM Setup..."

# 1. Copy .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📄 Creating .env file from .env.example..."
    cp .env.example .env
else
    echo "✅ .env file already exists."
fi

# 2. Check for Docker
if ! [ -x "$(command -v docker-compose)" ]; then
  echo '❌ Error: docker-compose is not installed.' >&2
  exit 1
fi

# 3. Start Containers
echo "🐳 Starting Docker containers..."
docker-compose up -d --build

# 4. Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to stabilize..."
RETRIES=30
until docker-compose exec db mysqladmin ping -h"localhost" --silent || [ $RETRIES -eq 0 ]; do
    echo "Waiting for database connection... $((RETRIES--)) attempts left"
    sleep 2
done

if [ $RETRIES -eq 0 ]; then
    echo "❌ Error: MySQL failed to start in time."
    exit 1
fi

echo "✅ MySQL is ready!"

# 5. Install Dependencies
echo "📦 Installing PHP dependencies via Composer..."
docker-compose exec app composer install

# 6. Generate App Key
echo "🔑 Generating Application Key..."
docker-compose exec app php artisan key:generate

# 7. Run Migrations and Seeders
echo "💾 Running Database Migrations and Seeders..."
docker-compose exec app php artisan migrate:fresh --seed --force

# 8. Link Storage
echo "🔗 Linking Storage..."
docker-compose exec app php artisan storage:link

# 9. Set Permissions
echo "🔐 Setting Permissions..."
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache

echo ""
echo "✨ Setup Complete!"
echo "📍 Application available at: http://localhost:8080"
echo "🔑 Demo Admin Login:"
echo "   Email: marcus@studio.com"
echo "   Pass: password"
echo ""
