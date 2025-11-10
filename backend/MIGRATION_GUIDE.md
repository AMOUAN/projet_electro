# Guide de Migration TypeORM → Prisma

Ce guide explique comment migrer le projet de TypeORM vers Prisma.

## ✅ Ce qui a été fait

1. ✅ Installation de Prisma et suppression de TypeORM
2. ✅ Création du schéma Prisma (`prisma/schema.prisma`)
3. ✅ Restructuration du projet en `common/` et `feature/`
4. ✅ Migration des services pour utiliser Prisma
5. ✅ Mise à jour des modules NestJS
6. ✅ Création des scripts de seed

## 📁 Nouvelle structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Schéma de la base de données
│   └── seed.ts                # Script de seed Prisma
├── src/
│   ├── common/                # Éléments partagés
│   │   ├── guards/            # Guards d'authentification
│   │   ├── decorators/        # Décorateurs personnalisés
│   │   └── prisma/            # Service Prisma (global)
│   ├── feature/               # Modules métier
│   │   ├── auth/              # Module d'authentification
│   │   └── users/             # Module utilisateurs
│   ├── scripts/               # Scripts utilitaires
│   └── app.module.ts          # Module principal
└── .env                       # Variables d'environnement
```

## 🚀 Installation et configuration

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer l'environnement

Créez un fichier `.env` à partir de `env.example` :

```bash
cp env.example .env
```

Modifiez les valeurs dans `.env` selon votre configuration PostgreSQL.

### 3. Générer le client Prisma

```bash
npm run prisma:generate
```

### 4. Créer la base de données

Assurez-vous que PostgreSQL est démarré et créez la base de données :

```sql
CREATE DATABASE electro_db;
```

### 5. Créer et appliquer les migrations

```bash
npm run prisma:migrate
```

Cette commande va :
- Créer la première migration basée sur le schéma
- Appliquer la migration à la base de données
- Générer le client Prisma

### 6. Initialiser l'utilisateur admin

```bash
npm run seed:admin
```

Ou utilisez le seed Prisma :

```bash
npm run prisma:seed
```

## 📝 Commandes disponibles

| Commande | Description |
|----------|-------------|
| `npm run prisma:generate` | Génère le client Prisma |
| `npm run prisma:migrate` | Crée et applique une migration |
| `npm run prisma:studio` | Ouvre Prisma Studio (interface graphique) |
| `npm run prisma:seed` | Exécute le script de seed |
| `npm run seed:admin` | Crée l'utilisateur admin |

## 🔄 Modifier le schéma

Pour ajouter ou modifier des modèles :

1. Modifiez `prisma/schema.prisma`
2. Créez une migration : `npm run prisma:migrate`
3. Le client Prisma sera régénéré automatiquement

## 📚 Utilisation dans le code

### Service Prisma

Le service Prisma est global et peut être injecté dans n'importe quel service :

```typescript
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        // Exclure le mot de passe
      },
    });
  }
}
```

### Types générés

Les types TypeScript sont générés automatiquement :

```typescript
import { User, UserRole, UserStatus } from '@prisma/client';
```

## 🗑️ Fichiers à supprimer (anciens fichiers TypeORM)

Les fichiers suivants peuvent être supprimés car ils ne sont plus utilisés :

- `src/users/entities/user.entity.ts` (remplacé par le schéma Prisma)
- `src/auth/` (ancien module, remplacé par `src/feature/auth/`)
- `src/users/` (ancien module, remplacé par `src/feature/users/`)

⚠️ **Note** : Ces fichiers sont conservés temporairement pour référence. Vous pouvez les supprimer une fois que vous êtes sûr que tout fonctionne.

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. Démarrer l'application : `npm run start:dev`
2. Tester l'endpoint de connexion : `POST /auth/login`
3. Vérifier la documentation Swagger : `http://localhost:3000/api`

## 📖 Documentation

- [Documentation Prisma](https://www.prisma.io/docs)
- [NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)

