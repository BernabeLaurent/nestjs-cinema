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

## Documentation Technique

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

## Tests

Le projet inclut une suite complète de tests :

```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Couverture des tests
npm run test:cov
```

## Contribution

Les contributions sont les bienvenues ! Consultez notre guide de contribution pour plus de détails.

## Configuration du projet

```bash
$ npm install
```

## Compilation et exécution du projet

```bash
# développement
$ npm run start

# mode watch
$ npm run start:dev

# mode production
$ npm run start:prod
```

## Exécution des tests

```bash
# tests unitaires
$ npm run test

# tests e2e
$ npm run test:e2e

# couverture des tests
$ npm run test:cov
```

## Déploiement

Lorsque vous êtes prêt à déployer votre application NestJS en production, il y a plusieurs étapes clés à suivre pour assurer son bon fonctionnement. Consultez la [documentation de déploiement](https://docs.nestjs.com/deployment) pour plus d'informations.

Si vous recherchez une plateforme cloud pour déployer votre application NestJS, découvrez [Mau](https://mau.nestjs.com), notre plateforme officielle pour le déploiement d'applications NestJS sur AWS. Mau simplifie et accélère le déploiement en quelques étapes simples :

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

Avec Mau, vous pouvez déployer votre application en quelques clics, vous permettant de vous concentrer sur le développement des fonctionnalités plutôt que sur la gestion de l'infrastructure.

## Ressources

Voici quelques ressources utiles pour travailler avec NestJS :

- Consultez la [Documentation NestJS](https://docs.nestjs.com) pour en apprendre davantage sur le framework.
- Pour les questions et le support, visitez notre [canal Discord](https://discord.gg/G7Qnnhy).
- Pour approfondir et obtenir plus d'expérience pratique, découvrez nos [cours vidéo](https://courses.nestjs.com/) officiels.
- Déployez votre application sur AWS avec l'aide de [NestJS Mau](https://mau.nestjs.com) en quelques clics.
- Visualisez le graphe de votre application et interagissez avec l'application NestJS en temps réel en utilisant [NestJS Devtools](https://devtools.nestjs.com).
- Besoin d'aide pour votre projet (à temps partiel ou plein temps) ? Consultez notre [support entreprise](https://enterprise.nestjs.com) officiel.
- Pour rester informé et recevoir des mises à jour, suivez-nous sur [X](https://x.com/nestframework) et [LinkedIn](https://linkedin.com/company/nestjs).
- Vous cherchez un emploi ou vous avez une offre d'emploi ? Consultez notre [plateforme d'emplois](https://jobs.nestjs.com) officielle.

## Support

Nest est un projet open source sous licence MIT. Il peut se développer grâce aux sponsors et au soutien de nos incroyables contributeurs. Si vous souhaitez les rejoindre, [lisez-en plus ici](https://docs.nestjs.com/support).

## Restez en contact

- Auteur - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Site web - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Licence

Nest est sous [licence MIT](https://github.com/nestjs/nest/blob/master/LICENSE).
