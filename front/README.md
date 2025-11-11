# Application LoRaWAN - Frontend

Application de gestion du réseau LoRaWAN avec intégration ChirpStack.

## Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **React Query (@tanstack/react-query)** - Gestion des données et cache
- **Axios** - Client HTTP
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas

## Structure du projet

```
front/
├── src/
│   ├── app/              # Pages et routes Next.js (App Router)
│   ├── lib/
│   │   ├── api/          # Clients API et services
│   │   │   ├── chirpstack-client.ts  # Client HTTP pour ChirpStack
│   │   │   └── chirpstack.ts         # Services API ChirpStack
│   │   └── config/       # Configuration
│   │       └── chirpstack.ts         # Config ChirpStack
│   ├── hooks/            # Hooks React personnalisés
│   │   └── use-chirpstack-applications.ts
│   └── providers/        # Providers React
│       └── query-provider.tsx        # Provider React Query
├── public/               # Fichiers statiques
└── package.json
```

## Configuration

1. Créer un fichier `.env.local` à la racine du dossier `front` :

```env
NEXT_PUBLIC_CHIRPSTACK_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. Installer les dépendances :

```bash
npm install
```

## Démarrage

Lancer le serveur de développement :

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Intégration ChirpStack

Le projet inclut une intégration complète avec l'API ChirpStack :

### Client API

Le client API est configuré dans `src/lib/api/chirpstack-client.ts` et gère :
- L'authentification via tokens Bearer
- Les intercepteurs pour les requêtes/réponses
- La gestion des erreurs

### Services API

Les services sont disponibles dans `src/lib/api/chirpstack.ts` :
- **Applications** : CRUD complet
- **Devices** : CRUD, activation/désactivation
- **Gateways** : CRUD complet
- **Auth** : Authentification

### Hooks React Query

Des hooks personnalisés sont disponibles dans `src/hooks/` pour faciliter l'utilisation de l'API dans les composants React.

Exemple d'utilisation :

```tsx
import { useApplications } from '@/hooks/use-chirpstack-applications';

function ApplicationsList() {
  const { data, isLoading, error } = useApplications();

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <ul>
      {data?.result.map((app) => (
        <li key={app.id}>{app.name}</li>
      ))}
    </ul>
  );
}
```

## Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [ChirpStack API Documentation](https://www.chirpstack.io/application-server/integrations/api/)
- [React Query Documentation](https://tanstack.com/query/latest)
