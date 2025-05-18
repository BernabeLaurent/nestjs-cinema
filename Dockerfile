# Dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npm run compodoc

# ---

FROM node:22-alpine

WORKDIR /app

# Installer bash
RUN apk add --no-cache bash

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/documentation ./documentation

RUN npm install --omit=dev

# Créer dossier uploads (utilisé par NestJS à runtime)
RUN mkdir -p uploads && chmod -R 777 uploads

# Copier le script d'entrée depuis scripts/
COPY scripts/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/main"]
