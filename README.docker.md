# Guide Docker pour l'Application LoRaWAN

Ce guide explique comment utiliser Docker pour lancer l'application complète (Frontend, Backend, PostgreSQL).

## Prérequis

- Docker Desktop installé et démarré
- Docker Compose installé (inclus avec Docker Desktop)

## Structure

Le projet utilise Docker Compose pour orchestrer trois services :
- **PostgreSQL** : Base de données
- **Backend** : API NestJS
- **Frontend** : Application Next.js

## Configuration

1. Créer un fichier `.env` à la racine du projet (copier depuis `.env.example`) :

```bash
cp .env.example .env
```

2. Modifier les variables d'environnement selon vos besoins dans le fichier `.env`.

## Utilisation

### Mode Développement (avec hot-reload)

Pour le développement avec rechargement automatique :

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Cette commande :
- Construit les images si nécessaire
- Lance les trois services
- Active le hot-reload pour le frontend et le backend
- Monte les volumes pour le développement

### Mode Production

Pour lancer en mode production :

```bash
docker-compose up --build
```

### Commandes utiles

**Arrêter les services :**
```bash
docker-compose down
```

**Arrêter et supprimer les volumes (⚠️ supprime les données de la base) :**
```bash
docker-compose down -v
```

**Voir les logs :**
```bash
docker-compose logs -f
```

**Voir les logs d'un service spécifique :**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

**Rebuild un service spécifique :**
```bash
docker-compose build backend
docker-compose up -d backend
```

**Accéder au shell d'un conteneur :**
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec postgres psql -U postgres -d electro_db
```

## Accès aux services

Une fois les services démarrés :

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3001
- **PostgreSQL** : localhost:5432
  - User: `postgres` (par défaut)
  - Password: `postgres` (par défaut)
  - Database: `electro_db` (par défaut)

## Volumes

Les données PostgreSQL sont persistées dans un volume Docker nommé `postgres_data` (ou `postgres_data_dev` en mode dev).

Pour sauvegarder la base de données :
```bash
docker-compose exec postgres pg_dump -U postgres electro_db > backup.sql
```

Pour restaurer :
```bash
docker-compose exec -T postgres psql -U postgres electro_db < backup.sql
```

## Dépannage

### Les services ne démarrent pas

1. Vérifier que les ports ne sont pas déjà utilisés :
   - 3000 (Frontend)
   - 3001 (Backend)
   - 5432 (PostgreSQL)

2. Vérifier les logs :
   ```bash
   docker-compose logs
   ```

### Rebuild complet

Si vous rencontrez des problèmes, vous pouvez faire un rebuild complet :

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Problèmes de permissions

Sur Linux/Mac, si vous rencontrez des problèmes de permissions avec les volumes, vous pouvez ajuster les permissions :

```bash
sudo chown -R $USER:$USER ./backend ./front
```

## Notes

- En mode développement, les changements de code sont reflétés automatiquement grâce aux volumes montés.
- Les `node_modules` sont exclus des volumes pour éviter les conflits entre l'hôte et le conteneur.
- Le backend attend que PostgreSQL soit prêt avant de démarrer (healthcheck).

