# Dockerfile
FROM node:23-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---

FROM node:23-alpine

WORKDIR /app

# Installer bash
RUN apk add --no-cache bash

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

# Créer dossier uploads (utilisé par NestJS à runtime)
RUN mkdir -p uploads && chmod -R 777 uploads

# Copier le script d'entrée depuis scripts/
COPY scripts/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production

ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/main"]
