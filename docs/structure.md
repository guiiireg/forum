# Structure du Projet

## Vue d'ensemble

```
forum/
├── server/
│   ├── css/
│   │   ├── replies.css
│   │   └── style.css
│   ├── html/
│   │   ├── 404.html
│   │   ├── home.html
│   │   ├── login.html
│   │   ├── password.html
│   │   ├── post.html
│   │   ├── posts.html
│   │   ├── privacy.html
│   │   ├── profil.html
│   │   └── register.html
│   └── js/
│       ├── database/
│       │   ├── connection.js
│       │   ├── index.js
│       │   └── schemas/
│       │       ├── categorySchema.js
│       │       ├── postSchema.js
│       │       └── userSchema.js
│       ├── lib/
│       │   ├── api.js
│       │   ├── auth.js
│       │   ├── authGuard.js
│       │   ├── base.js
│       │   ├── dom.js
│       │   ├── messageHandler.js
│       │   ├── postRenderer.js
│       │   └── selectPopulator.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── errorHandler.js
│       ├── modules/
│       │   └── posts/
│       │       ├── index.js
│       │       ├── postsActions.js
│       │       ├── postsDisplay.js
│       │       ├── postsState.js
│       │       └── postsVoting.js
│       ├── pages/
│       │   ├── generic.js
│       │   ├── home.js
│       │   ├── login.js
│       │   ├── posts.js
│       │   └── profil.js
│       ├── server/
│       │   ├── index.js
│       │   └── routes/
│       │       ├── authRoutes.js
│       │       ├── categoryRoutes.js
│       │       ├── errorRoutes.js
│       │       ├── pageRoutes.js
│       │       ├── posts/
│       │       │   ├── index.js
│       │       │   ├── postCreateRoutes.js
│       │       │   ├── postReadRoutes.js
│       │       │   └── postUpdateRoutes.js
│       │       ├── replyRoutes.js
│       │       └── voteRoutes.js
│       ├── services/
│       │   ├── apiService.js
│       │   ├── categoryService.js
│       │   ├── client/
│       │   │   ├── categoryManagerService.js
│       │   │   ├── formHandlerService.js
│       │   │   ├── index.js
│       │   │   └── postManagerService.js
│       │   └── posts/
│       │       ├── index.js
│       │       ├── postCrudService.js
│       │       ├── postOwnershipService.js
│       │       └── postQueryService.js
│       ├── database.js (legacy)
│       ├── posts.js (legacy)
│       ├── replies.js (legacy)
│       ├── users.js (legacy)
│       └── votes.js (legacy)
├── docs/
│   ├── architecture.md
│   ├── development.md
│   ├── features.md
│   ├── installation.md
│   └── structure.md
├── database.db
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
└── README.md
```

## Description des Répertoires

### `server/`
Contient tout le code source du serveur, organisé par type de ressource.

#### `css/`
Feuilles de style CSS.

- `style.css` : Styles principaux de l'application
- `replies.css` : Styles spécifiques aux réponses

#### `html/`
Templates HTML statiques.

- `home.html` : Page d'accueil
- `login.html` : Page de connexion
- `register.html` : Page d'inscription
- `posts.html` : Page de liste des posts
- `post.html` : Page de détail d'un post
- `profil.html` : Page de profil utilisateur
- `privacy.html` : Page de politique de confidentialité
- `404.html` : Page d'erreur 404
- `password.html` : Page de gestion du mot de passe

#### `js/`
Code JavaScript du serveur, organisé par domaine fonctionnel.

##### `database/`
Gestion de la base de données.

- `connection.js` : Configuration de la connexion à la base de données
- `index.js` : Point d'entrée du module database
- `schemas/` : Schémas de la base de données
  - `categorySchema.js` : Schéma des catégories
  - `postSchema.js` : Schéma des posts
  - `userSchema.js` : Schéma des utilisateurs

##### `lib/`
Bibliothèques utilitaires et services de base.

- `api.js` : Gestion centralisée des appels API
- `auth.js` : Utilitaires d'authentification
- `authGuard.js` : Protection des routes authentifiées
- `base.js` : Fonctions de base communes
- `dom.js` : Utilitaires DOM optimisés
- `messageHandler.js` : Gestion des messages utilisateur
- `postRenderer.js` : Rendu des posts
- `selectPopulator.js` : Peuplement des éléments select

##### `middleware/`
Middleware Express.

- `authMiddleware.js` : Middleware d'authentification
- `errorHandler.js` : Gestion globale des erreurs

##### `modules/`
Modules fonctionnels de l'application.

- `posts/` : Module de gestion des posts
  - `index.js` : Point d'entrée du module
  - `postsActions.js` : Actions sur les posts
  - `postsDisplay.js` : Affichage des posts
  - `postsState.js` : Gestion de l'état des posts
  - `postsVoting.js` : Système de votes

##### `pages/`
Contrôleurs de pages.

- `generic.js` : Contrôleur générique
- `home.js` : Contrôleur de la page d'accueil
- `login.js` : Contrôleur de la page de connexion
- `posts.js` : Contrôleur de la page des posts
- `profil.js` : Contrôleur de la page de profil

##### `server/`
Configuration du serveur et routes.

- `index.js` : Point d'entrée du serveur
- `routes/` : Définition des routes
  - `authRoutes.js` : Routes d'authentification
  - `categoryRoutes.js` : Routes des catégories
  - `errorRoutes.js` : Routes de gestion d'erreurs
  - `pageRoutes.js` : Routes des pages
  - `posts/` : Routes des posts (organisées par type CRUD)
    - `index.js` : Point d'entrée des routes posts
    - `postCreateRoutes.js` : Routes de création
    - `postReadRoutes.js` : Routes de lecture
    - `postUpdateRoutes.js` : Routes de mise à jour
  - `replyRoutes.js` : Routes des réponses
  - `voteRoutes.js` : Routes des votes

##### `services/`
Services métier organisés par domaine.

- `apiService.js` : Service API principal
- `categoryService.js` : Service de gestion des catégories
- `client/` : Services côté client
  - `categoryManagerService.js` : Gestion des catégories côté client
  - `formHandlerService.js` : Gestion des formulaires
  - `index.js` : Point d'entrée des services client
  - `postManagerService.js` : Gestion des posts côté client
- `posts/` : Services de gestion des posts
  - `index.js` : Point d'entrée des services posts
  - `postCrudService.js` : Opérations CRUD sur les posts
  - `postOwnershipService.js` : Gestion des droits de propriété
  - `postQueryService.js` : Requêtes de recherche de posts

##### Fichiers Legacy
Anciens fichiers conservés pour compatibilité.

- `database.js` : Ancienne gestion de la base de données
- `posts.js` : Ancienne gestion des posts
- `replies.js` : Ancienne gestion des réponses
- `users.js` : Ancienne gestion des utilisateurs
- `votes.js` : Ancien système de votes

### `docs/`
Documentation du projet.

- `architecture.md` : Architecture technique
- `development.md` : Guide de développement
- `features.md` : Fonctionnalités détaillées
- `installation.md` : Guide d'installation
- `structure.md` : Structure du projet

## Architecture Modulaire

L'application suit une architecture modulaire avec :

- **Séparation des responsabilités** : Chaque module a une responsabilité précise
- **Services réutilisables** : Logique métier centralisée dans les services
- **Routes organisées** : Routes groupées par fonctionnalité et type d'opération
- **Middleware centralisé** : Gestion transversale de l'authentification et des erreurs
- **Utilitaires partagés** : Bibliothèques communes dans le dossier `lib/`

## Migration en Cours

Le projet est en cours de migration d'une architecture monolithique vers une architecture modulaire :

- Les fichiers legacy sont conservés pour assurer la compatibilité
- Les nouveaux modules sont organisés selon les bonnes pratiques
- La migration se fait progressivement pour éviter les ruptures de service