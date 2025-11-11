/**
 * Configuration pour l'API ChirpStack
 */
export const chirpstackConfig = {
  // URL de base de l'API ChirpStack (à configurer via variables d'environnement)
  apiUrl: process.env.NEXT_PUBLIC_CHIRPSTACK_API_URL || 'http://localhost:8080/api',
  
  // Configuration par défaut pour les requêtes
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  
  // Timeout pour les requêtes (en millisecondes)
  timeout: 30000,
};

