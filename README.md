<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Un framework <a href="http://nodejs.org" target="_blank">Node.js</a> progressif pour construire des applications serveur efficaces et évolutives.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Ce projet est un système de gestion de cinéma développé avec [Nest](https://github.com/nestjs/nest), un framework TypeScript pour Node.js. Il permet de gérer l'ensemble des opérations d'un cinéma, de la programmation des films à la gestion des réservations.

## Architecture Logicielle

### Choix Technologiques

#### Backend : NestJS
- **Pourquoi NestJS ?**
  - Architecture modulaire et évolutive
  - Support natif de TypeScript
  - Injection de dépendances intégrée
  - Décorateurs similaires à Angular
  - Documentation complète et communauté active
  - Support natif des WebSockets
  - Tests unitaires et e2e facilités

#### Base de Données : PostgreSQL
- **Avantages**
  - Transactions ACID
  - Support des relations complexes
  - Performances élevées
  - Fiabilité et stabilité
  - Support des types JSON
  - Indexation avancée

#### Cache : NestJS Cache Manager
- **Fonctionnalités**
  - Mise en cache des réponses API
  - Invalidation automatique
  - Configuration flexible
  - Performance optimisée

#### Frontend : Angular
- **Raison du choix**
  - Cohérence avec NestJS
  - Architecture similaire
  - TypeScript natif
  - RxJS pour la gestion des flux
  - Material Design intégré
  - Tests unitaires et e2e

### Architecture Globale

#### Modules Principaux
1. **Module d'Authentification**
   - JWT pour les tokens
   - OAuth2 pour Google
   - Gestion des sessions
   - Sécurité renforcée

2. **Module de Gestion des Films**
   - Intégration TMDB
   - Cache des données
   - Gestion des médias
   - Synchronisation automatique

3. **Module de Réservation**
   - Transactions atomiques
   - Gestion des places
   - Notifications en temps réel
   - Historique des réservations

4. **Module de Notification**
   - WebSockets
   - Emails
   - Logs MongoDB
   - Alertes système

### Réflexions Initiales

#### Analyse des Besoins
1. **Fonctionnels**
   - Gestion des films et séances
   - Système de réservation
   - Authentification utilisateurs
   - Notifications en temps réel

2. **Non-Fonctionnels**
   - Performance
   - Scalabilité
   - Sécurité
   - Maintenabilité

#### Choix d'Architecture
1. **Microservices vs Monolithe**
   - Choix du monolithe modulaire
   - Facilité de déploiement
   - Maintenance simplifiée
   - Évolution possible vers microservices

2. **Base de Données**
   - PostgreSQL pour les données transactionnelles
   - MongoDB pour les logs
   - Cache pour les performances

3. **API Design**
   - REST pour la majorité des endpoints
   - WebSocket pour le temps réel (dans l'idéal)
   - GraphQL pour les requêtes complexes (futur)

#### Considérations Techniques
1. **Performance**
   - Cache à plusieurs niveaux
   - Indexation optimisée
   - Pagination des résultats
   - Compression des réponses

2. **Sécurité**
   - Validation des entrées
   - Protection CSRF
   - Rate limiting
   - Headers de sécurité

3. **Maintenabilité**
   - Tests automatisés
   - Documentation Swagger
   - Logs structurés
   - CI/CD avec GitHub Actions

### Évolution Future

#### Améliorations Planifiées
1. **Court Terme**
   - Optimisation des requêtes
   - Amélioration du cache
   - Tests de performance

2. **Moyen Terme**
   - Migration vers microservices
   - Ajout de GraphQL
   - Intégration de nouveaux fournisseurs

3. **Long Terme**
   - Architecture distribuée
   - Support multi-langues
   - Analytics avancés

### Pourquoi NestJS ?

NestJS a été choisi pour ce projet car il offre une architecture similaire à Angular, permettant ainsi un développement full-stack cohérent. Les deux frameworks partagent :
- Une architecture basée sur les modules
- L'utilisation de TypeScript
- Des décorateurs similaires
- Une structure de projet similaire
- Des concepts de dépendances et d'injection identiques

### Frontend Angular

Le frontend de l'application est développé avec Angular et est disponible dans un repository séparé :
[angular-cinema](https://github.com/BernabeLaurent/angular-cinema)

### Déploiement Full-Stack

Les deux projets (NestJS et Angular) peuvent être déployés ensemble en utilisant Docker Compose :

1. Cloner les deux repositories :
```bash
# Backend NestJS
git clone https://github.com/BernabeLaurent/nestjs-cinema
# Frontend Angular
git clone https://github.com/BernabeLaurent/angular-cinema
```

2. Configurer les variables d'environnement :
   - Copier `.env.docker` en `.env` dans les deux projets
   - Ajuster les variables selon votre environnement

3. Lancer avec Docker Compose :
```bash
# Depuis le projet NestJS
docker-compose up -d
```

Les services seront disponibles sur :
- Backend : http://localhost:3000
- Frontend : http://localhost:4200
- Documentation : http://localhost:3000/api

### Déploiement Automatisé avec GitHub Actions

Le projet utilise GitHub Actions pour automatiser le processus de build et de déploiement.

#### Workflow de Déploiement

1. **Déclencheurs**
   - Push sur la branche `main`
   - Création d'un tag de version
   - Pull Request sur `main`

2. **Étapes du Workflow**
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # Configuration de l'environnement
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      # Installation des dépendances
      - name: Install dependencies
        run: npm ci
        
      # Tests
      - name: Run tests
        run: npm run test
        
      # Build
      - name: Build
        run: npm run build
        
      # Déploiement
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: |
          docker-compose -f docker-compose.prod.yml up -d
```

#### Environnements de Déploiement

1. **Développement**
   - Déploiement automatique sur la branche `develop`
   - Tests unitaires et e2e
   - Build de développement

2. **Staging**
   - Déploiement sur la branche `staging`
   - Tests d'intégration
   - Build de production

3. **Production**
   - Déploiement sur la branche `main`
   - Tests complets
   - Build optimisé
   - Déploiement sur le serveur de production

#### Sécurité du Déploiement

- Secrets stockés dans GitHub
- Vérification des signatures des commits
- Protection des branches
- Validation des pull requests

#### Monitoring du Déploiement

- Logs de déploiement
- Statut des builds
- Métriques de performance

#### Rollback

En cas de problème, le rollback est automatique :
1. Détection d'erreur
2. Restauration de la version précédente
3. Notification de l'équipe
4. Logs d'erreur

### Communication Angular-NestJS

#### Configuration CORS
Le backend NestJS est configuré pour accepter les requêtes du frontend Angular :

```typescript
// Configuration CORS dans main.ts
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:4200',  // Angular en développement
    'http://localhost:3000',  // NestJS en développement
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 3600,
});
```

#### Communication HTTP
Le frontend Angular utilise un service HTTP dédié pour communiquer avec le backend :

```typescript
// Exemple de service Angular
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Exemple de requête authentifiée
  getMovies(): Observable<ApiResponse<Movie[]>> {
    return this.http.get<ApiResponse<Movie[]>>(`${this.apiUrl}/movies`);
  }
}
```

#### Gestion des Tokens
- Les tokens JWT sont stockés dans le localStorage
- Un intercepteur HTTP ajoute automatiquement le token aux requêtes
- Gestion du refresh token pour maintenir la session

#### Format des Réponses
Les réponses suivent un format standardisé :
```typescript
interface ApiResponse<T> {
  data: T;
  apiVersion: string;
  timestamp: string;
}
```

#### Gestion des Erreurs
- Intercepteur global pour la gestion des erreurs HTTP
- Redirection vers la page de login si le token expire
- Affichage des messages d'erreur utilisateur
- Logging des erreurs côté serveur
- Ajout des logs dans la base Mongodb

#### WebSocket (Optionnel)
Pour les fonctionnalités en temps réel :
```typescript
// Configuration WebSocket dans NestJS
@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:4200'],
    credentials: true
  }
})
```

### Bonnes Pratiques de Communication

1. **Sécurité**
   - Validation des données côté client et serveur
   - Protection CSRF
   - Headers de sécurité appropriés

2. **Performance**
   - Mise en cache des requêtes fréquentes
   - Compression des réponses
   - Pagination des grandes listes

3. **Maintenance**
   - Interfaces TypeScript partagées
   - Documentation Swagger
   - Tests d'intégration

4. **Développement**
   - Environnements de développement séparés
   - Variables d'environnement pour les URLs
   - Proxy de développement Angular

## Fonctionnalités principales

- 🎬 **Gestion des films**
  - Ajout et mise à jour des films
  - Gestion des informations détaillées (durée, genre, synopsis, etc.)
  - Gestion des affiches et médias

- 🎭 **Gestion des salles**
  - Configuration des salles de cinéma
  - Gestion des places et des rangées
  - Plan de salle interactif

- 📅 **Programmation des séances**
  - Planification des séances
  - Gestion des horaires
  - Association films/salles

- 🎟️ **Réservations**
  - Système de réservation en ligne
  - Gestion des places disponibles
  - Confirmation par email

- 👥 **Gestion des utilisateurs**
  - Inscription et authentification
  - Profils utilisateurs
  - Historique des réservations

- 🔔 **Notifications**
  - Alertes de confirmation
  - Rappels de séance
  - Notifications système

## Prérequis techniques

- Node.js (version 22 ou supérieure)
- PostgreSQL (version 16 ou supérieure)
- Docker (optionnel, pour le déploiement)

## Sécurité

Le projet implémente plusieurs couches de sécurité pour protéger les données et les utilisateurs :

### Authentification et Autorisation
- Authentification JWT avec tokens d'accès et de rafraîchissement
- Système de rôles utilisateurs (ADMIN, USER, etc.)
- Authentification Google disponible
- Protection des routes avec des guards personnalisés

### Protection des Données
- Hachage sécurisé des mots de passe avec bcrypt
- Validation des entrées avec class-validator
- Protection contre les injections SQL
- Sérialisation sécurisée des réponses

### Sécurité des API
- Rate limiting pour prévenir les attaques par force brute
- Configuration CORS sécurisée
- Timeout global pour les requêtes
- Documentation Swagger avec authentification

### Configuration
- Variables d'environnement validées
- Gestion sécurisée des secrets
- Environnements séparés (dev, production, test)

### Bonnes Pratiques
- Validation des données avec Joi
- Gestion des erreurs centralisée
- DTO pour la validation des entrées
- Logs de sécurité
- Compression des réponses

## Installation détaillée

1. **Cloner le repository**
```bash
git clone [URL_DU_REPO]
cd nestjs-cinema
```

2. **Configuration de l'environnement**
```bash
# Renommer le fichier .env.docker en .env
cp .env.docker .env

# Configurer les variables d'environnement dans le fichier .env
# - DATABASE_URL
# - JWT_SECRET
# - REDIS_URL
# - SMTP_CONFIG
```

3. **Installer les dépendances**
```bash
npm install
```

4. **Lancer l'application**
```bash
# Mode développement
npm run start:dev

# Mode production
npm run start:prod
```

## Configuration des Variables d'Environnement

Le fichier `.env` doit contenir les variables suivantes :

### Configuration de l'Application
```env
# Environnement (dev, production, test, staging)
NODE_ENV=dev

# Ports
NESTJS_PORT=3000
ANGULAR_PORT=4200
API_VERSION=1.0.0
```

### Base de Données
```env
# Configuration PostgreSQL
DATABASE_PORT=5432
DATABASE_PASSWORD=votre_mot_de_passe
DATABASE_HOST=localhost
DATABASE_NAME=cinema_db
DATABASE_USER=postgres
```

### Sécurité JWT
```env
# Configuration des tokens JWT
JWT_SECRET=votre_secret_jwt
JWT_TOKEN_AUDIENCE=cinema-api
JWT_TOKEN_ISSUER=cinema-app
JWT_ACCESS_TOKEN_TTL=3600        # Durée de vie du token d'accès (en secondes)
JWT_REFRESH_TOKEN_TTL=86400      # Durée de vie du token de rafraîchissement (en secondes)
```

### Authentification Google (Optionnel)
```env
# Configuration OAuth Google
GOOGLE_CLIENT_ID=votre_client_id
GOOGLE_CLIENT_SECRET=votre_client_secret
```

### Email (Optionnel)
```env
# Configuration SMTP pour les notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=votre_email
SMTP_PASSWORD=votre_mot_de_passe
SMTP_FROM=noreply@cinema.com
```

### CORS
```env
# Origines autorisées (séparées par des virgules)
ALLOWED_ORIGINS=http://localhost:4200,http://localhost:3000
```

### API Externe (TMDB)
```env
# Clé API pour The Movie Database
PROFILE_API_KEY=votre_cle_api_tmdb
```

### Notes Importantes
- Ne jamais commiter le fichier `.env` dans le repository
- Utiliser des valeurs sécurisées en production
- Les valeurs ci-dessus sont des exemples, à adapter selon votre environnement
- En production, utilisez des secrets plus complexes et des URLs sécurisées

## Documentation

### Documentation du Projet
La documentation complète du projet, incluant la gestion de projet, les spécifications et le suivi, est disponible sur Notion :
[Documentation du Projet Cinéma](https://www.notion.so/Projet-Cin-ma-17e3897d217e80249e6eefc9fa1e88d6?pvs=4)

Cette documentation inclut :
- Gestion du projet
- Spécifications techniques
- Planning et suivi
- Documentation utilisateur
- Guides de contribution

### Documentation Technique
La documentation technique complète du projet est disponible de deux manières :

### Documentation Locale
Pour générer et consulter la documentation en local :
```bash
# Générer la documentation
npm run compodoc

# La documentation sera disponible à l'adresse : http://localhost:8080/documentation
```

### Documentation en Ligne
La documentation est également accessible en ligne à l'adresse :
[api.bernabe.codes/documentation](https://api.bernabe.codes/documentation)

Cette documentation inclut :
- La structure détaillée du code
- Les diagrammes de classes
- La documentation des modules
- Les interfaces et types
- Les décorateurs et guards
- Les services et contrôleurs
- Les entités

## Intégration TMDB et Gestion des Films

### Source des Données
- Les films sont synchronisés avec [The Movie Database (TMDB)](https://www.themoviedb.org/)
- Une clé API TMDB est nécessaire (voir variables d'environnement)

### Synchronisation Automatique
- Une tâche CRON s'exécute quotidiennement pour récupérer les prochaines sorties
- Les films sont automatiquement ajoutés à la base de données
- Les informations sont mises à jour (notes, dates de sortie, etc.)

### Gestion des Images
- Les affiches de films sont automatiquement téléchargées
- Les photos du casting sont également récupérées
- Toutes les images sont stockées dans le dossier `uploads/`
- Structure des dossiers :
  ```
  uploads/
  ├── movies/      # Affiches des films
  ├── cast/        # Photos du casting
  └── profiles/    # Photos de profil utilisateurs
  ```

### Endpoints TMDB Utilisés

#### Films
- `GET /movie/upcoming` - Prochaines sorties
  - Récupère les films à venir
  - Inclut : titre, date de sortie, note, synopsis
  - Limite : 20 films par appel

- `GET /movie/{id}` - Détails d'un film
  - Informations complètes sur un film
  - Inclut : casting, genres, durée, budget, revenus
  - Images : affiches, backdrops, logos

- `GET /movie/{id}/credits` - Casting
  - Liste complète du casting
  - Inclut : acteurs, réalisateurs, équipe technique
  - Photos de profil des acteurs

- `GET /movie/{id}/videos` - Bandes-annonces
  - Vidéos associées au film
  - Inclut : bandes-annonces, teasers, making-of

#### Recherche
- `GET /search/movie` - Recherche de films
  - Recherche par titre
  - Filtres : année, langue, note minimale
  - Pagination intégrée

#### Configuration
- `GET /configuration` - Configuration de l'API
  - URLs des images
  - Tailles disponibles
  - Langues supportées

### Synchronisation des Données

#### Données Récupérées
- Informations de base
  - Titre original et traduit
  - Date de sortie
  - Durée
  - Genres
  - Note moyenne
  - Synopsis

- Médias
  - Affiches (plusieurs tailles)
  - Photos du casting
  - Bandes-annonces
  - Backdrops

- Casting
  - Acteurs principaux
  - Réalisateurs
  - Équipe technique

#### Mise à Jour
- Vérification quotidienne des nouvelles sorties
- Mise à jour des notes et avis
- Actualisation des dates de sortie
- Synchronisation des médias

### Gestion des Erreurs
- Retry automatique en cas d'échec
- Logging des erreurs dans MongoDB
- Notification en cas de problème persistant
- Fallback sur les données locales

### Système de Cache

#### Cache Nestjs
- Mise en cache des réponses TMDB
- Durée de cache configurable par type de données
- Invalidation automatique lors des mises à jour
- Cache distribué pour les environnements multi-instances

#### Durées de Cache
- Films à venir : 24 heures
- Détails des films : 7 jours
- Casting : 7 jours
- Configuration : 30 jours
- Recherche : 1 heure

### Format de Réponse API

Toutes les réponses de l'API suivent un format standardisé :

```json
{
  "data": [
    // Données de la réponse
  ],
  "apiVersion": "1.0.0",
  "timestamp": "2024-03-20T10:30:00Z"
}
```

#### Exemples de Réponses

1. Liste de films :
```json
{
  "data": [
    {
      "id": 123,
      "title": "Nom du Film",
      "releaseDate": "2024-03-20",
      "posterPath": "/path/to/poster.jpg"
    }
  ],
  "apiVersion": "1.0.0",
  "timestamp": "2024-03-20T10:30:00Z"
}
```

2. Détails d'un film :
```json
{
  "data": {
    "id": 123,
    "title": "Nom du Film",
    "overview": "Description du film...",
    "cast": [...],
    "videos": [...]
  },
  "apiVersion": "1.0.0",
  "timestamp": "2024-03-20T10:30:00Z"
}
```

#### Avantages du Format
- Cohérence des réponses
- Versioning de l'API
- Traçabilité des données
- Facilité de mise en cache

## Base de Données

### Diagramme de la Base de Données
Un diagramme complet de la structure de la base de données PostgreSQL est disponible en ligne :
[Diagramme de la Base de Données](https://lucid.app/lucidchart/b7bd4ef8-bcfa-4ec5-9307-a6af1f99457b/edit?invitationId=inv_6fe26536-c9f0-4744-96d2-9a207c4695f5)

Ce diagramme inclut :
- Toutes les tables et leurs relations
- Les clés primaires et étrangères
- Les contraintes et index
- Les types de données
- Les cardinalités des relations

### Structure Principale
- Tables pour les films et leurs métadonnées
- Tables pour les salles et les séances
- Tables pour les utilisateurs et les réservations
- Tables pour les notifications et les logs

### Scripts de Base de Données

Dans le dossier `bdd/`, vous trouverez :

#### Modélisation avec Toad Data Modeler
- Le fichier de modélisation complet (`.tdm`)
- Le script SQL généré pour la création des tables
- Les contraintes et les index
- Les relations entre les tables

#### Exemple de Transaction
Un exemple de transaction est fourni pour illustrer :
- Le script de transaction (transaction.sql)
- La création d'une réservation
- Le contrôle de la cohérence des données
- La gestion des erreurs
- Le rollback en cas de problème

```sql
-- Exemple de transaction
CREATE OR REPLACE FUNCTION make_booking(...)

```

#### Utilisation des Scripts
1. Ouvrir le fichier `.tdm` avec Toad Data Modeler
2. Modifier le modèle si nécessaire
3. Générer le script SQL
4. Exécuter le script sur votre base de données
   ( à noter que le script est inutile, la compilation du projet crée automatiquement la base)

## Logging et MongoDB

### Configuration MongoDB
- Une base MongoDB est utilisée pour le logging avancé
- Surcharge du Logger natif de NestJS
- Stockage des logs avec plus de détails et de contexte

### Types de Logs
- Logs d'erreurs
- Logs d'audit
- Logs de sécurité

### Configuration
```env
# Configuration MongoDB (à ajouter dans .env)
MONGODB_URI=mongodb://localhost:27017/cinema_logs
MONGODB_DB=cinema_logs
```

## Structure du projet

```
src/
├── auth/           # Authentification et autorisation
├── bookings/       # Gestion des réservations
├── common/         # Utilitaires et configurations communes
├── config/         # Configuration de l'application
├── movies/         # Gestion des films
├── notifications/  # Système de notifications
├── sessions-cinemas/ # Gestion des séances
├── theaters/       # Gestion des salles
└── users/          # Gestion des utilisateurs
```

## API Endpoints

### Films
- `GET /movies` - Liste des films
- `GET /movies/:id` - Détails d'un film
- `POST /movies` - Ajouter un film
- `PUT /movies/:id` - Mettre à jour un film
- `DELETE /movies/:id` - Supprimer un film

### Salles
- `GET /theaters` - Liste des salles
- `GET /theaters/:id` - Détails d'une salle
- `POST /theaters` - Ajouter une salle
- `PUT /theaters/:id` - Mettre à jour une salle

### Séances
- `GET /sessions` - Liste des séances
- `GET /sessions/:id` - Détails d'une séance
- `POST /sessions` - Créer une séance
- `PUT /sessions/:id` - Mettre à jour une séance

### Réservations
- `GET /bookings` - Liste des réservations
- `POST /bookings` - Créer une réservation
- `GET /bookings/:id` - Détails d'une réservation
- `DELETE /bookings/:id` - Annuler une réservation

## Manuel d'Utilisation de l'API

### Introduction

Ce manuel détaille l'utilisation de l'API du système de gestion de cinéma. L'API est RESTful et utilise JSON comme format d'échange de données.

### Authentification

#### Obtention d'un Token
```http
POST /auth/login
Content-Type: application/json

{
  "email": "utilisateur@example.com",
  "password": "motdepasse"
}
```

Réponse :
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "apiVersion": "1.0.0",
  "timestamp": "2024-03-20T10:30:00Z"
}
```

#### Utilisation du Token
Ajoutez le token dans le header de vos requêtes :
```http
Authorization: Bearer <votre_token>
```

### Gestion des Films

#### Lister les Films
```http
GET /movies
```

Paramètres de requête :
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)
- `sort` : Champ de tri (ex: "releaseDate")
- `order` : Ordre de tri ("asc" ou "desc")

#### Obtenir les Détails d'un Film
```http
GET /movies/:id
```

#### Rechercher des Films
```http
GET /movies/search
```

Paramètres de requête :
- `query` : Terme de recherche
- `year` : Année de sortie
- `genre` : ID du genre
- `language` : Code de langue

### Gestion des Salles

#### Lister les Salles
```http
GET /theaters
```

#### Obtenir les Détails d'une Salle
```http
GET /theaters/:id
```

#### Vérifier la Disponibilité
```http
GET /theaters/:id/availability
```

Paramètres de requête :
- `date` : Date de la séance (YYYY-MM-DD)
- `time` : Heure de la séance (HH:mm)

### Gestion des Séances

#### Lister les Séances
```http
GET /sessions
```

Paramètres de requête :
- `movieId` : ID du film
- `theaterId` : ID de la salle
- `date` : Date de la séance
- `status` : Statut de la séance

#### Créer une Séance
```http
POST /sessions
Content-Type: application/json

{
  "movieId": "123",
  "theaterId": "456",
  "startTime": "2024-03-20T20:00:00Z",
  "price": 12.50
}
```

### Gestion des Réservations

#### Créer une Réservation
```http
POST /bookings
Content-Type: application/json

{
  "sessionId": "789",
  "seats": ["A1", "A2"],
  "userId": "123"
}
```

#### Annuler une Réservation
```http
DELETE /bookings/:id
```

### Gestion des Utilisateurs

#### Créer un Compte
```http
POST /users/register
Content-Type: application/json

{
  "email": "nouveau@example.com",
  "password": "motdepasse",
  "firstName": "Prénom",
  "lastName": "Nom"
}
```

#### Mettre à Jour le Profil
```http
PUT /users/profile
Content-Type: application/json

{
  "firstName": "Nouveau Prénom",
  "lastName": "Nouveau Nom",
  "phone": "+33123456789"
}
```

### Gestion des Erreurs

L'API utilise des codes HTTP standard et renvoie des messages d'erreur au format suivant :

```json
{
  "statusCode": 400,
  "message": "Message d'erreur détaillé",
  "error": "Bad Request",
  "timestamp": "2024-03-20T10:30:00Z"
}
```

Codes d'erreur courants :
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `409` : Conflit
- `500` : Erreur serveur

### Bonnes Pratiques

1. **Gestion des Tokens**
   - Stockez le token de manière sécurisée
   - Utilisez le refresh token pour obtenir un nouveau token
   - Ne partagez jamais vos tokens

2. **Rate Limiting**
   - Maximum 100 requêtes par minute
   - Maximum 1000 requêtes par heure

3. **Cache**
   - Utilisez les en-têtes de cache fournis
   - Respectez les durées de cache indiquées

4. **Pagination**
   - Utilisez toujours la pagination pour les listes
   - Limitez le nombre d'éléments par page

### Exemples d'Utilisation

#### Exemple de Flux de Réservation
1. Rechercher un film
2. Vérifier les séances disponibles
3. Vérifier la disponibilité des places
4. Créer la réservation
5. Confirmer la réservation

#### Exemple de Code (JavaScript)
```javascript
async function createBooking(sessionId, seats) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      sessionId,
      seats
    })
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la création de la réservation');
  }
  
  return response.json();
}
```

### Support

Pour toute question ou problème :
- Consultez la documentation Swagger : `http://localhost:3000/api`
- Consultez les logs d'erreur dans MongoDB
- Consultez les logs d'erreur dans la console nestjs

## Tests et Qualité

### Suite de Tests
Le projet inclut une suite complète de tests automatisés :

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture des tests
npm run test:cov
```

### Qualité du Code
- Tests unitaires pour chaque service
- Tests e2e pour les flux critiques
- Couverture de code minimale de 80%
- Linting avec ESLint
- Formatage avec Prettier

## Documentation

### Documentation Technique
La documentation technique est disponible de deux manières :

1. **Documentation Locale**
```bash
# Générer la documentation
npm run compodoc

# Accès : http://localhost:8080/documentation
```

2. **Documentation en Ligne**
- URL : [api.bernabe.codes/documentation](https://api.bernabe.codes/documentation)
- Inclut :
  - Structure du code
  - Diagrammes de classes
  - Documentation des modules
  - Interfaces et types
  - Décorateurs et guards
  - Services et contrôleurs
  - Entités

### Documentation API (Swagger)
- URL : `http://localhost:3000/api`
- Authentification requise
- Exemples de requêtes
- Schémas de réponses
- Tests interactifs

## Déploiement

### Prérequis
- Node.js (version 22 ou supérieure)
- PostgreSQL (version 16 ou supérieure)
- Docker (optionnel)
- Nginx (pour la production)

### Configuration
1. **Variables d'Environnement**
```bash
# Copier le fichier de configuration
cp .env.docker .env

# Configurer les variables requises
# - DATABASE_URL
# - JWT_SECRET
# - SMTP_CONFIG
```

2. **Installation**
```bash
# Installer les dépendances
npm install

# Compiler le projet
npm run build
```

### Déploiement Local
```bash
# Mode développement
npm run start:dev

# Mode production
npm run start:prod
```

### Déploiement avec Docker
```bash
# Lancer les services
docker-compose up -d

# Services disponibles sur :
# - Backend : http://localhost:3000
# - Frontend : http://localhost:4200
# - Documentation : http://localhost:3000/api
```

### Déploiement Production (Droplet)

#### Analyse de l'Environnement
```bash
# Vérifier les services existants
docker ps

# Services détectés :
# - live (ports 80, 443) - Service principal existant
# - ticketing (ports 90, 453)
# - postgres (port 5433)
# - mongodb (port 27017)
```

#### Résolution des Conflits de Ports
**Problème** : Le container `live` occupe les ports 80/443

**Solutions** :
1. **Ports alternatifs** (Recommandé)
   - Nginx sur ports 8080/8443
   - NestJS sur port 3001

2. **Arrêt du service existant**
   ```bash
   docker stop live
   ```

3. **Configuration hybride**
   - Modifier le proxy du container `live`

#### Configuration Nginx Production
```nginx
# Configuration avec ports alternatifs
server {
    listen 8080;
    server_name bernabe.codes www.bernabe.codes;
    return 301 https://$host:8443$request_uri;
}

server {
    listen 8443 ssl;
    server_name bernabe.codes www.bernabe.codes;

    root /var/www/angular-cinema/dist;
    index index.html;

    ssl_certificate /etc/letsencrypt/live/bernabe.codes/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bernabe.codes/privkey.pem;

    # Frontend Angular
    location / {
        try_files $uri /index.html;
    }

    # API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Étapes de Déploiement Production
```bash
# 1. Préparation
mkdir -p /var/www/angular-cinema
cp .env.docker .env
echo "NESTJS_PORT=3001" >> .env

# 2. Build et démarrage backend
npm install && npm run build
docker-compose up -d

# 3. Déploiement frontend Angular
git clone https://github.com/BernabeLaurent/angular-cinema /var/www/angular-cinema
cd /var/www/angular-cinema
npm install && npm run build --prod

# 4. Configuration nginx
apt install -y nginx
# Créer le fichier de configuration nginx ci-dessus
systemctl restart nginx
```

#### Variables d'Environnement Production
```env
NODE_ENV=production
NESTJS_PORT=3001
ALLOWED_ORIGINS=https://bernabe.codes:8443,https://www.bernabe.codes:8443
DATABASE_HOST=localhost
DATABASE_PORT=5432
MONGODB_URI=mongodb://localhost:27017/cinema
```

#### Vérifications Post-Déploiement
```bash
# Services
systemctl status nginx
docker ps
docker logs nestjs-cinema-app

# Connectivité
curl -I https://bernabe.codes:8443
curl -I http://localhost:3001/api/health

# Logs
tail -f /var/log/nginx/error.log
docker logs -f nestjs-cinema-app
```

#### URLs d'Accès Production
- **Frontend** : https://bernabe.codes:8443
- **API** : https://bernabe.codes:8443/api
- **Documentation** : https://bernabe.codes:8443/api/docs

#### Troubleshooting Production

##### Problème : "Site introuvable"
```bash
# 1. Vérifier le DNS
nslookup bernabe.codes
# Doit pointer vers 159.89.20.85

# 2. Vérifier nginx
systemctl status nginx
nginx -t

# 3. Vérifier les ports
netstat -tuln | grep :8443
ss -tuln | grep :8443

# 4. Vérifier les logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

##### Problème : API inaccessible
```bash
# 1. Vérifier le backend NestJS
curl http://localhost:3001/api/health
docker ps | grep nestjs-cinema
docker logs nestjs-cinema-app

# 2. Vérifier la base de données
docker ps | grep postgres
docker logs nestjs-cinema-postgres-1

# 3. Vérifier la configuration
cat .env | grep NESTJS_PORT
cat .env | grep DATABASE_
```

##### Problème : Erreurs SSL/TLS
```bash
# 1. Vérifier les certificats
ls -la /etc/letsencrypt/live/bernabe.codes/
openssl x509 -in /etc/letsencrypt/live/bernabe.codes/fullchain.pem -text -noout

# 2. Tester SSL
curl -I https://bernabe.codes:8443
openssl s_client -connect bernabe.codes:8443
```

##### Commandes de Maintenance
```bash
# Redémarrage complet
systemctl restart nginx
docker-compose restart

# Mise à jour de l'application
git pull origin main
npm run build
docker-compose up -d --build

# Sauvegarde base de données
docker exec nestjs-cinema-postgres-1 pg_dump -U postgres cinema > backup_$(date +%Y%m%d).sql

# Monitoring en temps réel
docker stats
htop
```

### Déploiement Automatisé (GitHub Actions)

#### Workflow
1. **Déclencheurs**
   - Push sur `main`
   - Création de tag
   - Pull Request sur `main`

2. **Environnements**
   - Développement (`develop`)
   - Staging (`staging`)
   - Production (`main`)

3. **Sécurité**
   - Secrets GitHub
   - Vérification des signatures
   - Protection des branches
   - Validation des PR

4. **Monitoring**
   - Logs de déploiement
   - Statut des builds
   - Métriques de performance

5. **Rollback**
   - Détection automatique
   - Restauration de version
   - Notification d'équipe
   - Logs d'erreur

### Déploiement Cloud (Optionnel)
Pour un déploiement sur AWS, utilisez [NestJS Mau](https://mau.nestjs.com) :

```bash
# Installation
npm install -g @nestjs/mau

# Déploiement
mau deploy
```

## Support et Ressources

### Support Technique
- Documentation : [docs.nestjs.com](https://docs.nestjs.com)
- Discord : [discord.gg/G7Qnnhy](https://discord.gg/G7Qnnhy)
- Cours : [courses.nestjs.com](https://courses.nestjs.com)
- Entreprise : [enterprise.nestjs.com](https://enterprise.nestjs.com)

### Ressources Utiles
- [NestJS Devtools](https://devtools.nestjs.com)
- [NestJS Jobs](https://jobs.nestjs.com)
- [@nestframework sur X](https://x.com/nestframework)
- [NestJS sur LinkedIn](https://linkedin.com/company/nestjs)

## Contribution

Les contributions sont les bienvenues ! Consultez notre guide de contribution pour plus de détails.

## Licence

Nest est sous [licence MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
