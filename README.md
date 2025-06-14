# Forum Project

Un forum moderne et interactif développé avec Node.js, Express et SQLite.

## Documentation

- [Architecture Technique](docs/architecture.md) - Diagrammes et architecture du projet
- [Fonctionnalités](docs/features.md) - Liste détaillée des fonctionnalités
- [Installation](docs/installation.md) - Guide d'installation et prérequis
- [Développement](docs/development.md) - Guide de développement et conventions
- [Structure](docs/structure.md) - Structure détaillée du projet

## Vue d'ensemble

Le Forum Project est une application web moderne offrant :
- Authentification sécurisée
- Gestion des posts et catégories
- Système de votes
- Interface responsive
- Performance optimisée
- Filtres avancés (catégories, date, popularité)

## Démarrage Rapide

1. Cloner le repository

```bash
git clone https://github.com/guiiireg/forum.git
```

2. Installer les dépendances

```bash
npm install
```

3. Démarrer avec Docker (recommandé)
```bash
docker compose up -d
```

4. Ou démarrer sans Docker
```bash
node server/js/startServer.js
```

5. Accéder à l'application : `http://localhost:3000`

Pour plus de détails, consultez la [documentation complète](docs/installation.md).
