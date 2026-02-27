setup:
	@if [ ! -f .env ]; then cp .env.example .env; fi
	docker-compose up -d
	docker-compose exec app composer install
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan migrate:fresh --seed --force
	docker-compose exec app php artisan storage:link
	@echo "Studio CRM is ready at http://localhost:8080"
	@echo "Login: marcus@studio.com / password"

down:
	docker-compose down

reset:
	docker-compose exec app php artisan migrate:fresh --seed --force

logs:
	docker-compose logs -f app
