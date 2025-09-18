#!/bin/sh

ENV_FILE=.env

# Crée le fichier s'il n'existe pas
if [ ! -f "$ENV_FILE" ]; then
  touch "$ENV_FILE"
fi

# Fonction pour ajouter ou remplacer une variable dans .env
set_env_var() {
  VAR_NAME=$1
  VAR_VALUE=$2

  if grep -q "^$VAR_NAME=" "$ENV_FILE"; then
    # Remplace la ligne existante
    sed -i "s|^$VAR_NAME=.*|$VAR_NAME=$VAR_VALUE|" "$ENV_FILE"
  else
    # Ajoute la variable si elle n'existe pas
    echo "$VAR_NAME=$VAR_VALUE" >> "$ENV_FILE"
  fi
}

# Ajout sécurisé et remplacement
set_env_var "ALLOWED_ORIGINS" "https://bernabe.codes,https://www.bernabe.codes,https://api.bernabe.codes,https://www.api.bernabe.codes"

# Valeurs par défaut si non définies
DB_HOST=${DATABASE_HOST:-postgres}
DB_PORT=${DATABASE_PORT:-5432}
MONGO_HOST=${MONGODB_HOST:-mongodb}
MONGO_PORT=27017

# Attendre PostgreSQL
echo "⏳ Attente de PostgreSQL sur $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "❗ PostgreSQL non disponible, nouvelle tentative dans 2s..."
  sleep 2
done
echo "✅ PostgreSQL est prêt."

# Attendre MongoDB
echo "⏳ Attente de MongoDB sur $MONGO_HOST:$MONGO_PORT..."
until nc -z "$MONGO_HOST" "$MONGO_PORT"; do
  echo "❗ MongoDB non disponible, nouvelle tentative dans 2s..."
  sleep 2
done
echo "✅ MongoDB est prêt."

# Lancer l'application
echo "🚀 Lancement de l'application NestJS..."
exec "$@"
