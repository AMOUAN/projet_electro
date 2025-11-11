.PHONY: help build up down restart logs clean dev prod

help: ## Affiche cette aide
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Construit les images Docker
	docker-compose build

up: ## Lance les services en mode production
	docker-compose up -d

down: ## Arrête les services
	docker-compose down

restart: ## Redémarre les services
	docker-compose restart

logs: ## Affiche les logs de tous les services
	docker-compose logs -f

logs-backend: ## Affiche les logs du backend
	docker-compose logs -f backend

logs-frontend: ## Affiche les logs du frontend
	docker-compose logs -f frontend

logs-postgres: ## Affiche les logs de PostgreSQL
	docker-compose logs -f postgres

dev: ## Lance les services en mode développement
	docker-compose -f docker-compose.dev.yml up --build

dev-down: ## Arrête les services de développement
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Affiche les logs en mode développement
	docker-compose -f docker-compose.dev.yml logs -f

prod: build up ## Build et lance en mode production

clean: ## Arrête les services et supprime les volumes (⚠️ supprime les données)
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v

clean-all: clean ## Nettoie tout (volumes, images, conteneurs)
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all

rebuild: ## Rebuild complet sans cache
	docker-compose build --no-cache
	docker-compose up -d

shell-backend: ## Ouvre un shell dans le conteneur backend
	docker-compose exec backend sh

shell-frontend: ## Ouvre un shell dans le conteneur frontend
	docker-compose exec frontend sh

shell-postgres: ## Ouvre psql dans le conteneur PostgreSQL
	docker-compose exec postgres psql -U postgres -d electro_db

backup-db: ## Sauvegarde la base de données
	docker-compose exec postgres pg_dump -U postgres electro_db > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Sauvegarde créée: backup_$(shell date +%Y%m%d_%H%M%S).sql"

restore-db: ## Restaure la base de données (usage: make restore-db FILE=backup.sql)
	docker-compose exec -T postgres psql -U postgres electro_db < $(FILE)

status: ## Affiche le statut des conteneurs
	docker-compose ps

