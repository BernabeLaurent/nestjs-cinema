#!/bin/sh

ENV_FILE=.env

# Crée le fichier s'il n'existe pas
if [ ! -f $ENV_FILE ]; then
  touch $ENV_FILE
fi

# Fonction pour ajouter une variable uniquement si elle n'existe pas
add_env_var() {
  VAR_NAME=$1
  VAR_VALUE=$2
  # Escape slashes in VAR_VALUE for grep compatibility
  ESCAPED_VALUE=$(printf '%s\n' "$VAR_VALUE" | sed 's/[\/&]/\\&/g')
  if ! grep -q "^$VAR_NAME=" "$ENV_FILE"; then
    echo "$VAR_NAME=$VAR_VALUE" >> "$ENV_FILE"
  fi
}

# Ajout sécurisé des variables d'environnement

add_env_var "DATABASE_HOST" "localhost"
add_env_var "DATABASE_PORT" "5432"
add_env_var "DATABASE_USER" "postgres"
add_env_var "DATABASE_PASSWORD" "admin"
add_env_var "DATABASE_NAME" "cinema"
add_env_var "DATABASE_SYNC" "true"
add_env_var "DATABASE_AUTO_LOAD_ENTITIES" "true"

add_env_var "NESTJS_PORT" "3000"

add_env_var "MONGODB_URI" "mongodb://mongodb:27017/cinema"

add_env_var "TMDB_API_KEY" "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMzE4OTU0ZWIwN2NkOWIxMjFhMzMxNjRmMThjY2U5NSIsInN1YiI6IjY1ZWEwYTZhYWY5NTkwMDE4NGRkYWVmZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lJrzkqoXIBPlWG6jw9w7Rh4wtBa9MX38eLThzCmnVYc"
add_env_var "TMDB_DEFAULT_LANGUAGE" "fr_FR"
add_env_var "TMDB_DEFAULT_REGION" "FR"
add_env_var "TMDB_DEFAULT_PAGE" "1"

add_env_var "GOOGLE_CLIENT_ID" ""
add_env_var "GOOGLE_CLIENT_SECRET" ""

add_env_var "API_VERSION" "1.0.0"

add_env_var "MOVIES_SOURCE" "tmdb"

add_env_var "ALLOWED_ORIGINS" "http://bernabe.codes,http://www.bernabe.codes,http://api.bernabe.codes,http://www.api.bernabe.codes"

# Exécute la commande passée au script (généralement le lancement de NestJS)
exec "$@"