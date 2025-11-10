# Backend NestJS avec PostgreSQL

Backend développé avec NestJS et connecté à PostgreSQL via TypeORM.

## Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v12 ou supérieur)
- npm ou yarn

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```

3. Modifier le fichier `.env` avec vos paramètres de connexion PostgreSQL :
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
DB_NAME=electro_db
```

4. Créer la base de données PostgreSQL :
```sql
CREATE DATABASE electro_db;
```

## Démarrage

### Mode développement
```bash
npm run start:dev
```

### Mode production
```bash
npm run build
npm run start:prod
```

L'application sera accessible sur `http://localhost:3000`

## Endpoints

- `GET /` - Message de bienvenue
- `GET /health` - Vérification de l'état de l'application

## Structure du projet

```
src/
├── app.module.ts       # Module principal
├── app.controller.ts   # Contrôleur principal
├── app.service.ts      # Service principal
└── main.ts            # Point d'entrée de l'application
```

## Technologies utilisées

- NestJS - Framework Node.js
- TypeORM - ORM pour PostgreSQL
- PostgreSQL - Base de données relationnelle
- TypeScript - Langage de programmation

