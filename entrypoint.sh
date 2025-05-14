#!/bin/sh
# entrypoint.sh

# Vérifier si le fichier .env existe, sinon le créer
if [ ! -f .env ]; then
  touch .env
fi

# Ajouter les nouvelles variables d'environnement dans le fichier .env sans supprimer les existantes
# Si une variable existe déjà, elle ne sera pas écrasée
echo "DATABASE_URL=postgres://user:password@localhost:5432/dbname" >> .env
echo "ANOTHER_VAR=another_value" >> .env

# Exécuter l'application NestJS
exec "$@"
