# Forum Project

Un forum moderne et interactif développé avec **Node.js 20**, **Express 5** et **SQLite**, utilisant une architecture **ES Modules** moderne.

## 📚 Documentation

- [🏗️ Architecture Technique](docs/architecture.md) - Diagrammes et architecture du projet
- [⚡ Fonctionnalités](docs/features.md) - Liste détaillée des fonctionnalités
- [🚀 Installation](docs/installation.md) - Guide d'installation et prérequis  
- [💻 Développement](docs/development.md) - Guide de développement et conventions
- [📁 Structure](docs/structure.md) - Structure détaillée du projet

## ✨ Vue d'ensemble

Le Forum Project est une **application web moderne** offrant :

### 🔐 Sécurité Avancée
- **Authentification JWT** avec BCrypt et protection Helmet
- **Middleware d'authentification** et gestion des sessions
- **Validation des données** et protection CSRF
- **Cookies sécurisés** avec options appropriées

### 📝 Gestion Intelligente des Posts
- **Architecture modulaire** avec 8 sous-modules spécialisés
- **CRUD complet** : création, édition, suppression
- **Catégorisation obligatoire** avec système avancé
- **Système de réponses** avec threading

### ⭐ Système de Votes Révolutionnaire
- **Toggle intelligent** : clic répété supprime le vote
- **Changement direct** : upvote ↔ downvote instantané
- **Protection anti-négatif** : score minimum à 0
- **UI réactive** avec feedback visuel immédiat

### 🔍 Filtres et Tri Avancés
- **Filtrage multi-catégories** en temps réel
- **Tri intelligent** : date, popularité, nombre de réponses
- **Ordre bidirectionnel** croissant/décroissant
- **État persistant** entre les sessions

### 🎨 Interface Utilisateur
- **Design responsive** avec 11 modules CSS
- **Templates HTML** spécialisés (9 pages)
- **Feedback temps réel** via événements personnalisés
- **Navigation fluide** sans rechargement

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js 20+** 
- **Docker** (recommandé)
- **Git**

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/guiiireg/forum.git
cd forum
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer avec Docker** (recommandé)
```bash
docker compose down && docker compose build && docker compose up -d
```

4. **Ou démarrer sans Docker**
```bash
node server/js/startServer.js
```

5. **Accéder à l'application**
```
🌐 http://localhost:3000
```

### 🛠️ Technologies Principales

| Technologie | Version | Usage |
|------------|---------|-------|
| **Node.js** | `20` | Runtime JavaScript moderne |
| **Express** | `^5.1.0` | Framework web haute performance |
| **SQLite** | `^5.1.7` | Base de données intégrée |
| **BCrypt** | `^6.0.0` | Hachage sécurisé |
| **JWT** | `^9.0.2` | Authentification par tokens |
| **Helmet** | `^7.1.0` | Sécurité HTTP |
| **Docker** | Latest | Conteneurisation |

### 📁 Structure Moderne
```
forum/
├── 📂 server/js/          # 95+ fichiers JavaScript modulaires
│   ├── 🏗️ core/           # Modules fondamentaux
│   ├── 🔧 modules/        # Modules fonctionnels
│   ├── 🛣️ server/routes/  # Routes Express RESTful
│   └── 🔄 services/       # Couche métier
├── 📂 docs/               # Documentation technique
└── 🐳 Docker files        # Configuration conteneurs
```

Pour plus de détails, consultez la [🚀 documentation complète](docs/installation.md).
