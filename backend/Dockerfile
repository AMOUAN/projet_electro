# Dockerfile pour le backend NestJS

# Étape 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build de l'application NestJS
RUN npm run build

# Étape 2: Production
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Créer un utilisateur non-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copier les fichiers nécessaires depuis le builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Changer le propriétaire
RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001

# Commande pour démarrer l'application
CMD ["npm", "run", "start:prod"]

