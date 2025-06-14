# Guide de Développement

## Structure des Branches

- `main` : Version stable principale
- `docker` : Configuration et optimisation Docker
- `main-css` : Styles et interface utilisateur
- `main-html` : Templates et structure HTML
- `main-js` : Logique JavaScript et API
- `main-db` : Structure et optimisation de la base de données
- `test` : Tests et développement
- `fixes` : Corrections de bugs
- `user-error` : Gestion des erreurs utilisateur
- `readme` : Documentation et guides

## Conventions de Commit

### Format des Messages
```
[TYPE]: description
```

### Types de Commit
- `[add]` : Ajout de fonctionnalités
- `[fix]` : Correction de bugs
- `[update]` : Mise à jour de fonctionnalités
- `[refactor]` : Refactoring de code
- `[style]` : Modifications de style

### Exemples
```
[add]: nouvelle fonctionnalité de recherche
[fix]: correction du bug de connexion
[update]: mise à jour de l'interface utilisateur
[refactor]: optimisation du code de la base de données
[style]: amélioration du CSS des posts
```

## Conventions de Code

### JavaScript/Node.js
- Utiliser ES6+ features
- Préférer les fonctions fléchées
- Utiliser async/await pour les opérations asynchrones
- Commenter les fonctions complexes
- Utiliser des noms explicites

### SQL
- Utiliser des requêtes paramétrées
- Éviter les requêtes dynamiques
- Commenter les requêtes complexes
- Utiliser des transactions quand nécessaire

### Structure des Fichiers
- Un fichier = une responsabilité
- Regrouper les fichiers par fonctionnalité
- Utiliser des index.js pour l'export
- Séparer la logique métier des routes

## Configuration Docker

### Structure
- Dockerfile pour l'application
- docker-compose.yml pour l'orchestration
- .dockerignore pour exclure les fichiers

### Bonnes Pratiques
- Utiliser des images officielles
- Multi-stage builds
- Optimiser les layers
- Sécuriser les conteneurs

## Outils de Développement

### IDE
- Visual Studio Code
- Extensions :
  - Prettier : Formatage du code
  - Docker : Gestion des conteneurs

### Debugging
- Chrome DevTools (F12) pour l'inspection et le debugging

## Debug et Système de Vote

- Le système de vote côté serveur (votes.js) inclut des logs détaillés pour le debug (affichage des paramètres, calculs de score, décisions prises).
- La logique côté client (modules/posts/index.js) gère :
  - Le toggle du vote (clic répété supprime le vote)
  - Le changement de vote (upvote <-> downvote)
  - L'affichage dynamique du score et de l'état des boutons
- La gestion des erreurs API côté client utilise `safeApiCall` pour afficher un feedback immédiat à l'utilisateur (ex : impossibilité de descendre sous zéro, non connecté, etc).

[Retour au README principal](../README.md) 