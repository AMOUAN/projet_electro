# Système d'authentification et de gestion des utilisateurs

Ce document explique comment utiliser le système d'authentification et de gestion des utilisateurs.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp env.example .env
```

Puis modifier le fichier `.env` avec vos paramètres :
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=electro_db

PORT=3000
NODE_ENV=development

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

3. Créer la base de données PostgreSQL :
```sql
CREATE DATABASE electro_db;
```

4. Initialiser l'utilisateur admin par défaut :
```bash
npm run seed:admin
```

Cela créera un utilisateur avec :
- **Username**: `admin`
- **Password**: `admin`
- **Role**: `SUPER_ADMIN`
- **Status**: `ACTIVE`

⚠️ **IMPORTANT**: Changez le mot de passe après la première connexion !

## API Endpoints

### Authentification

#### POST /auth/login
Connexion utilisateur

**Body:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "System",
    "company": null,
    "role": "super_admin",
    "status": "active"
  }
}
```

### Utilisateurs

#### POST /users/request-access
Demander un accès (première connexion)

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "company": "Acme Corp",
  "phone": "+33123456789",
  "usageDescription": "I want to use LoRaWAN for IoT monitoring"
}
```

#### POST /users/activate
Activer un compte et définir le mot de passe

**Body:**
```json
{
  "token": "activation-token-uuid",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### GET /users
Obtenir la liste de tous les utilisateurs (Admin uniquement)

**Headers:**
```
Authorization: Bearer <access_token>
```

#### GET /users/:id
Obtenir un utilisateur par ID

**Headers:**
```
Authorization: Bearer <access_token>
```

#### POST /users
Créer un nouvel utilisateur (Admin uniquement)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "firstName": "New",
  "lastName": "User",
  "company": "Company",
  "role": "user",
  "status": "active"
}
```

#### PATCH /users/:id
Mettre à jour un utilisateur (Admin uniquement)

**Headers:**
```
Authorization: Bearer <access_token>
```

#### DELETE /users/:id
Supprimer un utilisateur (Super Admin uniquement)

**Headers:**
```
Authorization: Bearer <access_token>
```

## Rôles et Permissions

- **SUPER_ADMIN**: Accès complet, peut supprimer des utilisateurs
- **ADMIN**: Peut créer, lire et modifier des utilisateurs
- **USER**: Accès limité, peut seulement lire ses propres informations

## Statuts des utilisateurs

- **PENDING**: Compte en attente d'activation
- **ACTIVE**: Compte actif
- **INACTIVE**: Compte inactif
- **SUSPENDED**: Compte suspendu

## Documentation Swagger

Une fois l'application démarrée, la documentation Swagger est disponible à :
```
http://localhost:3000/api
```

## Utilisation dans le frontend

Pour utiliser l'API depuis le frontend :

1. Appeler `/auth/login` pour obtenir le token JWT
2. Stocker le token (localStorage, sessionStorage, etc.)
3. Inclure le token dans les requêtes suivantes :
```
Authorization: Bearer <access_token>
```

## Sécurité

- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Les tokens JWT expirent après 24h (configurable via `JWT_EXPIRES_IN`)
- Changez `JWT_SECRET` en production avec une clé sécurisée
- Utilisez HTTPS en production

