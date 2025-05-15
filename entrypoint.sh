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

# Exemple d'ajout sécurisé et remplacement
set_env_var "ALLOWED_ORIGINS" "http://bernabe.codes,http://www.bernabe.codes,http://api.bernabe.codes,http://www.api.bernabe.codes"

# Lancer l'application
exec "$@"
