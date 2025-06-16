# Structure du Projet

## Vue d'ensemble

```
forum/
├── server/
│   ├── css/                           # Styles CSS modulaires
│   │   ├── buttons.css                # Styles des boutons
│   │   ├── components.css             # Composants réutilisables
│   │   ├── forms.css                  # Formulaires
│   │   ├── header.css                 # En-tête de la page
│   │   ├── main.css                   # Styles principaux
│   │   ├── modals.css                 # Modales et popups
│   │   ├── posts.css                  # Affichage des posts
│   │   ├── privacy.css                # Page de confidentialité
│   │   ├── responsive.css             # Design responsive
│   │   ├── sidebar.css                # Barre latérale
│   │   └── style.css                  # Styles globaux
│   ├── html/                          # Templates HTML
│   │   ├── 404.html                   # Page d'erreur 404
│   │   ├── home.html                  # Page d'accueil
│   │   ├── login.html                 # Page de connexion
│   │   ├── password.html              # Récupération mot de passe
│   │   ├── post.html                  # Vue détaillée d'un post
│   │   ├── posts.html                 # Liste des posts
│   │   ├── privacy.html               # Politique de confidentialité
│   │   ├── profil.html                # Page profil utilisateur
│   │   └── register.html              # Page d'inscription
│   └── js/                            # Code JavaScript (ES Modules)
│       ├── cache.js                   # Système de cache
│       ├── categories.js              # Gestion des catégories (simple)
│       ├── database.js                # Configuration base de données
│       ├── posts.js                   # Logique posts (serveur)
│       ├── replies.js                 # Gestion des réponses
│       ├── startServer.js             # Point d'entrée principal
│       ├── users.js                   # Gestion des utilisateurs
│       ├── votes.js                   # Système de vote (logique serveur)
│       ├── core/                      # Modules principaux
│       │   ├── api.js                 # Utilitaires API côté client
│       │   ├── auth.js                # Authentification côté client
│       │   └── dom.js                 # Utilitaires DOM
│       ├── database/                  # Structure base de données
│       │   ├── connection.js          # Connexion SQLite
│       │   ├── index.js               # Export principal DB
│       │   ├── migrations/            # Scripts de migration
│       │   │   └── userMigrations.js  # Migrations utilisateurs
│       │   └── schemas/               # Schémas de données
│       │       ├── categorySchema.js  # Structure catégories
│       │       ├── postSchema.js      # Structure posts
│       │       └── userSchema.js      # Structure utilisateurs
│       ├── index/                     # Scripts de page individuelle
│       │   ├── post.js                # Script page post détail
│       │   └── posts.js               # Script page liste posts
│       ├── middleware/                # Middleware Express
│       │   ├── authMiddleware.js      # Middleware d'authentification
│       │   └── errorHandler.js        # Gestionnaire d'erreurs
│       ├── models/                    # Modèles de données
│       │   ├── base.js                # Modèle de base
│       │   ├── index.js               # Export des modèles
│       │   └── queries/               # Requêtes SQL
│       │       └── postQueries.js     # Requêtes liées aux posts
│       ├── modules/                   # Modules fonctionnels côté client
│       │   ├── auth/                  # Module authentification
│       │   │   └── authGuard.js       # Protection des routes
│       │   ├── posts/                 # Module posts (côté client)
│       │   │   ├── index.js           # Orchestrateur principal
│       │   │   ├── postsActions.js    # Actions utilisateur (CRUD)
│       │   │   ├── postsDataLoader.js # Chargement des données
│       │   │   ├── postsDisplay.js    # Affichage et rendu
│       │   │   ├── postsEventHandlers.js # Gestionnaires d'événements
│       │   │   ├── postsFilter.js     # Logique de filtrage
│       │   │   ├── postsState.js      # Gestion d'état
│       │   │   └── postsVoting.js     # Système de vote côté client
│       │   └── ui/                    # Interface utilisateur
│       │       ├── index.js           # Export des composants UI
│       │       ├── messageHandler.js  # Gestion des messages
│       │       ├── postRenderer.js    # Rendu des posts
│       │       └── selectPopulator.js # Population des selects
│       ├── pages/                     # Scripts spécifiques aux pages
│       │   ├── 404.js                 # Script page 404
│       │   ├── generic.js             # Script générique
│       │   ├── home.js                # Script page d'accueil
│       │   ├── login.js               # Script page connexion
│       │   ├── password.js            # Script récupération mot de passe
│       │   ├── posts.js               # Script page posts
│       │   ├── privacy.js             # Script page confidentialité
│       │   ├── profil.js              # Script page profil
│       │   └── register.js            # Script page inscription
│       ├── server/                    # Configuration serveur
│       │   ├── config/                # Configuration
│       │   │   └── serverConfig.js    # Configuration Express
│       │   ├── index.js               # Orchestrateur serveur principal
│       │   └── routes/                # Routes Express
│       │       ├── authRoutes.js      # Routes authentification
│       │       ├── categoryRoutes.js  # Routes catégories
│       │       ├── errorRoutes.js     # Routes gestion erreurs
│       │       ├── pageRoutes.js      # Routes pages HTML
│       │       ├── postRoutes.js      # Routes posts (simple)
│       │       ├── replyRoutes.js     # Routes réponses
│       │       ├── voteRoutes.js      # Routes votes
│       │       └── posts/             # Routes posts détaillées
│       │           ├── index.js       # Export routes posts
│       │           ├── postAuthHelper.js    # Aide authentification
│       │           ├── postCreateRoutes.js  # Création de posts
│       │           ├── postReadRoutes.js    # Lecture de posts
│       │           └── postUpdateRoutes.js  # Mise à jour de posts
│       └── services/                  # Services métier
│           ├── apiService.js          # Service API principal
│           ├── categoryService.js     # Service catégories
│           ├── clientIndex.js         # Export services client
│           ├── index.js               # Export services serveur
│           ├── postService.js         # Service posts (simple)
│           ├── client/                # Services côté client
│           │   ├── categoryManagerService.js # Gestion catégories client
│           │   ├── formHandlerService.js     # Gestion formulaires
│           │   ├── index.js           # Export services client
│           │   └── postManagerService.js     # Gestion posts client
│           └── posts/                 # Services posts détaillés
│               ├── index.js           # Export services posts
│               ├── postCrudService.js # CRUD posts
│               ├── postOwnershipService.js # Propriété posts
│               └── postQueryService.js     # Requêtes posts
├── docs/                              # Documentation
│   ├── architecture.md               # Architecture technique
│   ├── development.md                # Guide développement
│   ├── features.md                   # Fonctionnalités
│   ├── installation.md               # Installation
│   └── structure.md                  # Structure projet
├── database.db                       # Base de données SQLite
├── Dockerfile                        # Configuration Docker
├── docker-compose.yml                # Orchestration Docker
├── package.json                      # Dépendances et scripts
├── package-lock.json                 # Versions exactes
└── README.md                         # Documentation principale
```

## Description des Modules

### Architecture Générale
Le projet utilise une **architecture modulaire ES6** avec imports/exports modernes. L'application est structurée en couches distinctes :
- **Frontend** : HTML/CSS/JS côté client
- **Backend** : Express.js avec architecture en modules
- **Base de données** : SQLite avec couche d'abstraction

### Modules Core (`js/core/`)
**Modules fondamentaux** utilisés dans toute l'application :

#### `api.js` - Client API
- Fonctions utilitaires pour appels HTTP (GET, POST, PUT, DELETE)
- Gestion centralisée des erreurs API avec `safeApiCall()`
- Endpoints spécialisés pour posts, votes, catégories, réponses
- Système de feedback utilisateur via événements personnalisés

#### `auth.js` - Authentification Client
- Gestion des sessions utilisateur côté client
- Stockage sécurisé des données utilisateur
- Vérification du statut de connexion
- Interface avec le système d'authentification serveur

#### `dom.js` - Utilitaires DOM
- Manipulation du DOM simplifiée et optimisée
- Sélecteurs et gestionnaires d'événements
- Utilitaires pour l'interface utilisateur

### Système de Votes (`votes.js` + `modules/posts/postsVoting.js`)

#### **Côté Serveur (`votes.js`)**
- Logique métier complète du système de vote
- **Toggle intelligent** : clic répété = suppression du vote
- **Changement de vote** : upvote ↔ downvote direct
- **Protection anti-négatif** : empêche les scores < 0
- **Logs de debug** détaillés pour le développement
- Gestion des transactions et cohérence des données

#### **Côté Client (`modules/posts/postsVoting.js`)**
- Interface utilisateur réactive
- Feedback visuel immédiat
- Synchronisation avec le serveur
- Gestion des états des boutons (actif/inactif)

### Module Posts (`modules/posts/`)
**Architecture modulaire** pour la gestion complète des posts :

#### `index.js` - Orchestrateur Principal
- Point d'entrée du module posts
- Coordination entre tous les sous-modules
- Gestion du cycle de vie de l'application
- Export des fonctions publiques

#### `postsState.js` - Gestion d'État
- État centralisé de l'application (utilisateur, posts, filtres)
- Persistance des données en session
- Synchronisation entre composants

#### `postsDataLoader.js` - Chargement de Données
- Récupération des posts depuis l'API
- Cache et optimisation des requêtes
- Gestion des erreurs de chargement

#### `postsDisplay.js` - Rendu et Affichage
- Rendu des posts dans le DOM
- Templates et mise en forme
- Gestion de l'affichage responsive

#### `postsFilter.js` - Système de Filtres
- **Filtrage par catégorie** : sélection multiple
- **Tri avancé** : date, popularité (votes), nombre de réponses
- **Ordre** : croissant/décroissant
- Logique de filtrage en temps réel

#### `postsEventHandlers.js` - Événements
- Gestionnaires d'événements utilisateur
- Interactions avec les formulaires
- Coordination des actions utilisateur

#### `postsActions.js` - Actions CRUD
- Création, édition, suppression de posts
- Validation des données
- Interface avec l'API serveur

#### `postsVoting.js` - Votes Côté Client
- Interface de vote réactive
- Mise à jour en temps réel des scores
- Gestion des états visuels des boutons

### Routes Serveur (`server/routes/`)
**Architecture RESTful** avec routes spécialisées :

#### Routes Principales
- **`pageRoutes.js`** : Serveur de pages HTML statiques
- **`authRoutes.js`** : Authentification (login, register, logout)
- **`postRoutes.js`** : Routes posts simples
- **`voteRoutes.js`** : API de vote (POST /votes, GET /votes/:postId)
- **`replyRoutes.js`** : Gestion des réponses aux posts
- **`categoryRoutes.js`** : CRUD catégories
- **`errorRoutes.js`** : Gestion globale des erreurs

#### Routes Posts Détaillées (`routes/posts/`)
- **`postCreateRoutes.js`** : Création de posts avec validation
- **`postReadRoutes.js`** : Lecture et recherche de posts
- **`postUpdateRoutes.js`** : Modification et suppression
- **`postAuthHelper.js`** : Vérification des droits d'accès

### Services (`services/`)
**Couche métier** séparée en services client et serveur :

#### Services Serveur
- **`apiService.js`** : Logique API principale
- **`categoryService.js`** : Gestion des catégories
- **`postService.js`** : Services posts de base

#### Services Client (`services/client/`)
- **`postManagerService.js`** : Gestion posts côté client
- **`categoryManagerService.js`** : Gestion catégories côté client
- **`formHandlerService.js`** : Traitement des formulaires

#### Services Posts Spécialisés (`services/posts/`)
- **`postCrudService.js`** : CRUD avancé des posts
- **`postQueryService.js`** : Requêtes complexes
- **`postOwnershipService.js`** : Gestion des droits

### Base de Données (`database/`)
**Architecture SQLite** avec couche d'abstraction :

#### Structure
- **`connection.js`** : Configuration de la connexion SQLite
- **`index.js`** : Export principal de la base
- **`migrations/`** : Scripts de migration de schéma
- **`schemas/`** : Définitions des structures de données

#### Schémas
- **`userSchema.js`** : Structure des utilisateurs
- **`postSchema.js`** : Structure des posts
- **`categorySchema.js`** : Structure des catégories

### Configuration Docker
- **`Dockerfile`** : Image Node.js 20 optimisée
- **`docker-compose.yml`** : Orchestration avec volumes persistants
- **Développement** : Hot-reload avec bind mounts
- **Production** : Configuration optimisée

### Middleware (`middleware/`)
- **`authMiddleware.js`** : Vérification d'authentification
- **`errorHandler.js`** : Gestion centralisée des erreurs

## Technologies et Dépendances

### Dépendances Principales
```json
{
  "express": "^5.1.0",        // Framework web
  "sqlite3": "^5.1.7",       // Base de données
  "bcrypt": "^6.0.0",        // Hachage mots de passe
  "jsonwebtoken": "^9.0.2",  // Tokens JWT
  "helmet": "^7.1.0",        // Sécurité HTTP
  "cors": "^2.8.5",          // CORS
  "cookie-parser": "^1.4.7", // Parsing cookies
  "dotenv": "^16.5.0"        // Variables d'environnement
}
```

### Architecture Moderne
- **ES Modules** : `"type": "module"` dans package.json
- **Imports/Exports** : Syntaxe ES6 moderne
- **Classes** : Architecture orientée objet (ServerOrchestrator)
- **Async/Await** : Gestion asynchrone moderne

[Retour au README principal](../README.md)