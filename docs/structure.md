# Structure du Projet

## Vue d'ensemble

```
forum/
├── server/
│   ├── js/
│   │   ├── core/
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── posts.js
│   │   │   ├── votes.js
│   │   │   └── categories.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── error.js
│   │   │   └── validation.js
│   │   └── startServer.js
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── views/
├── database.db
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## Description des Répertoires

### `server/`
Contient tout le code source du serveur.

#### `js/`
Code JavaScript du serveur.

##### `core/`
Modules principaux de l'application.

- `api.js` : Configuration des routes API
- `auth.js` : Gestion de l'authentification
- `posts.js` : Gestion des posts
- `votes.js` : Système de votes
- `categories.js` : Gestion des catégories

##### `middleware/`
Middleware Express.

- `auth.js` : Middleware d'authentification
- `error.js` : Gestion des erreurs
- `validation.js` : Validation des données

#### `public/`
Fichiers statiques.

- `css/` : Styles
- `js/` : Scripts client
- `images/` : Images

#### `views/`
Templates EJS.

### Fichiers Racine

- `database.db` : Base de données SQLite
- `Dockerfile` : Configuration Docker
- `docker-compose.yml` : Configuration Docker Compose
- `package.json` : Dépendances et scripts

## Organisation du Code

### Architecture Modulaire
- Séparation claire des responsabilités
- Modules indépendants
- Interface bien définie entre les modules

### Gestion des Dépendances
- Dépendances minimales
- Versions fixes
- Pas de dépendances inutiles

### Structure des Modules
- Un fichier = une responsabilité
- Exports clairs
- Documentation intégrée

[Retour au README principal](../README.md) 