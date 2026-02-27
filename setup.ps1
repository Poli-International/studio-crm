# Studio CRM Automated Setup Script for Windows
# Version 1.1 (2026) - Production Ready

Write-Host "🚀 Starting Studio CRM Setup..." -ForegroundColor Cyan

# 1. Copy .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📄 Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
} else {
    Write-Host "✅ .env file already exists." -ForegroundColor Green
}

# 2. Start Containers
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Green
docker-compose up -d --build

# 3. Wait for MySQL to be ready
Write-Host "⏳ Waiting for MySQL to stabilize..." -ForegroundColor Yellow
$retries = 30
while ($retries -gt 0) {
    $check = docker-compose exec db mysqladmin ping -h"localhost" --silent
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL is ready!" -ForegroundColor Green
        break
    }
    Write-Host "Waiting for database connection... ($retries attempts left)"
    Start-Sleep -Seconds 2
    $retries--
}

if ($retries -eq 0) {
    Write-Host "❌ Error: MySQL failed to start in time." -ForegroundColor Red
    exit
}

# 4. Install Dependencies
Write-Host "📦 Installing PHP dependencies via Composer..." -ForegroundColor Yellow
docker-compose exec app composer install

# 5. Generate App Key
Write-Host "🔑 Generating Application Key..." -ForegroundColor Magenta
docker-compose exec app php artisan key:generate

# 6. Run Migrations and Seeders
Write-Host "💾 Running Database Migrations and Seeders..." -ForegroundColor Blue
docker-compose exec app php artisan migrate:fresh --seed --force

# 7. Link Storage
Write-Host "🔗 Linking Storage..." -ForegroundColor Gray
docker-compose exec app php artisan storage:link

Write-Host "`n✨ Setup Complete!" -ForegroundColor Cyan
Write-Host "📍 Application available at: http://localhost:8080"
Write-Host "🔑 Demo Admin Login:"
Write-Host "   Email: marcus@studio.com"
Write-Host "   Pass: password"
