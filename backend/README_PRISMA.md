# Migration vers Prisma

Le projet a été migré de TypeORM vers Prisma. Voici les étapes pour configurer et utiliser Prisma.

## Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer le fichier `.env` :
```bash
cp env.example .env
```

Puis modifier le fichier `.env` avec vos paramètres de connexion PostgreSQL.

3. Générer le client Prisma :
```bash
npm run prisma:generate
```

4. Créer et appliquer les migrations :
```bash
npm run prisma:migrate
```

Cela va :
- Créer la première migration basée sur le schéma Prisma
- Appliquer la migration à la base de données
- Générer le client Prisma

5. (Optionnel) Initialiser l'utilisateur admin :
```bash
npm run seed:admin
```

Ou utiliser le seed Prisma :
```bash
npm run prisma:seed
```

## Structure du projet

Le projet est maintenant organisé en deux dossiers principaux :

### `src/common/`
Contient les éléments partagés entre les modules :
- `guards/` - Guards d'authentification (JWT, Local, Roles)
- `decorators/` - Décorateurs personnalisés (Roles, CurrentUser)
- `prisma/` - Service Prisma (module global)

### `src/feature/`
Contient les modules métier :
- `users/` - Module de gestion des utilisateurs
  - `dto/` - Data Transfer Objects
  - `users.service.ts` - Service utilisateurs
  - `users.controller.ts` - Contrôleur REST
  - `users.module.ts` - Module NestJS
- `auth/` - Module d'authentification
  - `strategies/` - Stratégies Passport (Local, JWT)
  - `auth.service.ts` - Service d'authentification
  - `auth.controller.ts` - Contrôleur REST
  - `auth.module.ts` - Module NestJS

## Commandes Prisma

- `npm run prisma:generate` - Génère le client Prisma
- `npm run prisma:migrate` - Crée et applique une nouvelle migration
- `npm run prisma:studio` - Ouvre Prisma Studio (interface graphique)
- `npm run prisma:seed` - Exécute le script de seed

## Schéma Prisma

Le schéma est défini dans `prisma/schema.prisma`. Pour modifier la structure de la base de données :

1. Modifier le schéma
2. Créer une migration : `npm run prisma:migrate`
3. Le client Prisma sera régénéré automatiquement

## Différences avec TypeORM

- **Pas d'entités TypeORM** : Les modèles sont définis dans `schema.prisma`
- **Client Prisma** : Utilisez `PrismaService` injecté dans vos services
- **Types générés** : Les types TypeScript sont générés automatiquement depuis le schéma
- **Migrations** : Utilisez `prisma migrate` au lieu de `synchronize`

## Exemple d'utilisation

```typescript
// Dans un service
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class MyService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }
}
```

## Notes importantes

- Le module Prisma est global, vous n'avez pas besoin de l'importer dans chaque module
- Les types Prisma sont disponibles via `@prisma/client`
- Les enums sont générés automatiquement depuis le schéma

