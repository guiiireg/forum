# Guide de Développement

## Gestion des Versions

### Branches
- `main` : Version stable
- `test` : Tests et développement
- `docker` : Configuration Docker
- `main-css` : Styles
- `main-html` : Templates
- `main-js` : Logique JavaScript
- `readme` : Documentation

### Conventions de Commit
- Commits atomiques et descriptifs
- Format : `type(scope): description`
- Types : feat, fix, docs, style, refactor, test, chore

## Conventions de Code

### Style
- Modules ES6
- Architecture modulaire
- Séparation UI/Logique
- Commentaires explicatifs

### Nomenclature
- Conventions de nommage cohérentes
- Variables descriptives
- Fonctions avec responsabilité unique
- Commentaires pertinents

### Organisation des Fichiers
- Structure modulaire
- Séparation des responsabilités
- Architecture MVC
- Gestion des dépendances

## Tests

### Tests Unitaires
- Tests pour chaque module
- Couverture de code
- Tests d'intégration
- Tests de performance

### Qualité du Code
- Code modulaire
- Documentation claire
- Tests unitaires
- Gestion des erreurs

## Docker

### Configuration
- Containerisation complète
- Multi-stage builds
- Volumes persistants
- Réseau isolé
- Variables d'environnement

### Commandes Utiles
```bash
# Reconstruire l'image
docker compose build

# Démarrer les conteneurs
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter les conteneurs
docker compose down
```

## Développement Local

### Workflow
1. Créer une nouvelle branche
2. Développer les fonctionnalités
3. Tester localement
4. Créer une pull request
5. Code review
6. Merge dans main

### Outils Recommandés
- VS Code avec extensions :
  - ESLint
  - Prettier
  - Docker
  - GitLens

[Retour au README principal](../README.md) 