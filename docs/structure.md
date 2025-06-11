# Structure du Projet

## Vue d'ensemble
```
.
├── Dockerfile
├── README.md
├── database.db
├── docker-compose.yml
├── package-lock.json
├── package.json
└── server/
    ├── css/
    │   ├── replies.css
    │   └── style.css
    ├── html/
    │   ├── 404.html
    │   ├── home.html
    │   ├── login.html
    │   ├── password.html
    │   ├── post.html
    │   ├── posts.html
    │   ├── privacy.html
    │   ├── profil.html
    │   └── register.html
    └── js/
        ├── cache.js
        ├── categories.js
        ├── core/
        │   ├── api.js
        │   ├── auth.js
        │   └── dom.js
        ├── database.js
        ├── middleware/
        │   ├── authMiddleware.js
        │   └── errorHandler.js
        ├── modules/
        │   └── posts/
        │       └── index.js
        ├── pages/
        │   ├── generic.js
        │   ├── home.js
        │   ├── login.js
        │   └── posts.js
        ├── posts.js
        ├── replies.js
        ├── startServer.js
        ├── users.js
        └── votes.js
```

## Description des Dossiers

### `/server`
Dossier principal contenant tout le code source de l'application.

### `/server/css`
- `style.css` : Styles globaux de l'application
- `replies.css` : Styles spécifiques aux réponses

### `/server/html`
Templates HTML pour chaque page de l'application :
- `404.html` : Page d'erreur 404
- `home.html` : Page d'accueil
- `login.html` : Page de connexion
- `password.html` : Gestion des mots de passe
- `post.html` : Affichage d'un post
- `posts.html` : Liste des posts
- `privacy.html` : Politique de confidentialité
- `profil.html` : Page de profil
- `register.html` : Page d'inscription

### `/server/js`
Code JavaScript de l'application.

#### `/server/js/core`
Fonctionnalités core de l'application :
- `api.js` : Gestion des appels API
- `auth.js` : Logique d'authentification
- `dom.js` : Utilitaires DOM

#### `/server/js/middleware`
Middlewares Express :
- `authMiddleware.js` : Protection des routes
- `errorHandler.js` : Gestion des erreurs

#### `/server/js/modules`
Modules modulaires de l'application :
- `/posts` : Gestion des posts

#### `/server/js/pages`
Logique spécifique à chaque page :
- `generic.js` : Fonctionnalités communes
- `home.js` : Page d'accueil
- `login.js` : Gestion de la connexion
- `posts.js` : Gestion des posts

#### Fichiers Racine
- `cache.js` : Gestion du cache
- `categories.js` : Gestion des catégories
- `database.js` : Configuration de la base de données
- `posts.js` : API des posts
- `replies.js` : Gestion des réponses
- `startServer.js` : Point d'entrée de l'application
- `users.js` : Gestion des utilisateurs
- `votes.js` : Système de votes

## Fichiers de Configuration
- `Dockerfile` : Configuration Docker
- `docker-compose.yml` : Configuration des services Docker
- `package.json` : Dépendances et scripts npm
- `database.db` : Base de données SQLite

[Retour au README principal](../README.md) 