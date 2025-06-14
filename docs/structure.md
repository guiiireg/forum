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
- `votes.js` : Système de votes (logique serveur, gestion du score, unicité, prévention du score négatif)
- `categories.js` : Gestion des catégories

##### `modules/posts/index.js`
- Gestion dynamique des posts et des votes côté client (UI réactive, feedback immédiat, gestion des erreurs, toggle/changement de vote)

##### `middleware/`
Middleware Express.

- `