# Guide de Développement

## Gestion des Versions

### Structure des Versions
- Format : `X.Y.Z` (Semantic Versioning)
  - X : Version majeure (changements incompatibles)
  - Y : Version mineure (nouvelles fonctionnalités compatibles)
  - Z : Patch (corrections de bugs)

### Convention de Nommage des Branches
- `main` : Branche principale stable
- `develop` : Branche de développement
- `feature/*` : Nouvelles fonctionnalités
- `bugfix/*` : Corrections de bugs
- `hotfix/*` : Corrections urgentes en production

## Conventions de Commit

### Format des Messages
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types de Commit
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation
- `style` : Formatage
- `refactor` : Refactoring
- `test` : Tests
- `chore` : Maintenance

### Exemples
```
feat(auth): add password reset functionality
fix(api): correct user validation
docs(readme): update installation instructions
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

## Tests

### Types de Tests
- Tests unitaires
- Tests d'intégration
- Tests de performance
- Tests de sécurité

### Outils Recommandés
- Jest pour les tests unitaires
- Supertest pour les tests d'API
- SQLite pour les tests de base de données

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

## Workflow de Développement Local

1. Cloner le repository
2. Créer une branche feature
3. Développer et tester
4. Créer une pull request
5. Code review
6. Merge dans develop
7. Tests d'intégration
8. Merge dans main

## Outils Recommandés

### IDE
- Visual Studio Code
- Extensions recommandées :
  - ESLint
  - Prettier
  - Docker
  - SQLite

### Ligne de Commande
- Git
- Docker
- Node.js
- npm

### Monitoring
- Docker Desktop
- Chrome DevTools
- SQLite Browser

[Retour au README principal](../README.md) 