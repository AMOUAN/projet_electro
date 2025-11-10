#!/bin/sh
set -e

echo "🔧 Vérification de l'installation des dépendances..."

# Vérifier si node_modules existe et contient les packages essentiels
if [ ! -d "node_modules/@prisma" ] || [ ! -d "node_modules/@nestjs" ]; then
  echo "📦 Installation des dépendances npm..."
  npm install
fi

# Vérifier si le schéma Prisma existe
if [ ! -f "prisma/schema.prisma" ]; then
  echo "❌ Erreur: Le fichier prisma/schema.prisma est introuvable!"
  exit 1
fi

# Toujours régénérer le client Prisma pour s'assurer qu'il est à jour
# (nécessaire car le volume peut écraser le client généré)
echo "🔨 Génération du client Prisma..."
echo "📋 Schéma Prisma trouvé:"
cat prisma/schema.prisma | head -20

# Supprimer l'ancien client Prisma pour forcer une régénération complète
echo "🗑️  Suppression de l'ancien client Prisma..."
rm -rf node_modules/.prisma node_modules/@prisma/client 2>/dev/null || true

# Forcer la régénération complète du client Prisma
echo "🔄 Régénération du client Prisma..."
npx prisma generate --schema=./prisma/schema.prisma

# Vérifier que le client Prisma a été généré correctement
if [ ! -d "node_modules/.prisma/client" ]; then
  echo "❌ Erreur: Le client Prisma n'a pas été généré correctement!"
  echo "📁 Contenu de node_modules/.prisma:"
  ls -la node_modules/.prisma/ 2>/dev/null || echo "Le répertoire .prisma n'existe pas"
  exit 1
fi

# Vérifier que les types sont bien exportés
if [ ! -f "node_modules/.prisma/client/index.d.ts" ]; then
  echo "❌ Erreur: Le fichier de types Prisma n'a pas été généré!"
  exit 1
fi

echo "✅ Client Prisma généré avec succès"
echo "📦 Types disponibles dans node_modules/.prisma/client"

# Exécuter la commande passée en argument
exec "$@"

