# Forum Project

Un forum moderne et interactif développé avec Node.js, Express et SQLite.

## Architecture Technique

### Diagramme d'Architecture Global
```mermaid
graph TD
    A[Client Browser] --> B[Express Server]
    B --> C[SQLite Database]
    B --> D[Session Management]
    B --> E[Authentication]
    B --> F[Post Management]
    B --> G[Vote System]
    B --> H[Category System]
```

### Gestion des Sessions et Authentification
```mermaid
sequenceDiagram
    participant User
    participant Server
    participant DB
    
    User->>Server: Register Request
    Server->>DB: Check Username
    DB-->>Server: Username Available
    Server->>DB: Create User
    Server-->>User: Registration Success
    
    User->>Server: Login Request
    Server->>DB: Verify Credentials
    DB-->>Server: Valid Credentials
    Server->>Server: Create Session
    Server-->>User: Login Success + Session Cookie
    
    User->>Server: Logout Request
    Server->>Server: Destroy Session
    Server-->>User: Logout Success
```

### Gestion des Posts
```mermaid
sequenceDiagram
    participant User
    participant Server
    participant DB
    
    User->>Server: Create Post
    Server->>DB: Save Post
    DB-->>Server: Post Created
    Server-->>User: Post Created Success
    
    User->>Server: Edit Post
    Server->>DB: Verify Ownership
    DB-->>Server: Ownership Confirmed
    Server->>DB: Update Post
    Server-->>User: Post Updated Success
    
    User->>Server: Delete Post
    Server->>DB: Verify Ownership
    DB-->>Server: Ownership Confirmed
    Server->>DB: Delete Post
    Server-->>User: Post Deleted Success
```

### Système de Votes
```mermaid
sequenceDiagram
    participant User
    participant Server
    participant DB
    
    User->>Server: Vote Request
    Server->>DB: Check Previous Vote
    DB-->>Server: Vote Status
    Server->>DB: Update Vote
    DB-->>Server: Vote Updated
    Server-->>User: Vote Success
```

## Fonctionnalités Détaillées

### 1. Gestion des Sessions et Cookies (1 point)
- Utilisation de `express-session` pour la gestion des sessions
- Stockage des sessions en mémoire avec possibilité de persistance
- Cookies sécurisés avec options httpOnly et secure
- Gestion des timeouts de session

### 2. Identification Sécurisée (1 point)
- Inscription avec validation des données
- Connexion avec hachage des mots de passe (bcrypt)
- Déconnexion avec destruction de session
- Protection contre les attaques CSRF
- Validation des entrées utilisateur

### 3. Création de Posts (1.75 points)
- Création de posts pour utilisateurs connectés
- Système de catégories obligatoire
- Validation des données
- Support du markdown
- Gestion des erreurs

### 4. Édition des Posts (1 point)
- Édition des posts par leurs auteurs
- Suppression des posts
- Historique des modifications
- Validation des permissions

### 5. Base de Données (1 point)
- Utilisation de SQLite
- Schéma optimisé
- Requêtes préparées
- Gestion des transactions
- Indexation appropriée

### 6. Système de Votes (0.5 point)
- Upvote/Downvote
- Un vote par utilisateur
- Mise à jour en temps réel
- Calcul des scores

### 7. Syntaxe SQL (0.5 point)
- Requêtes optimisées
- Jointures appropriées
- Sous-requêtes
- Agrégations

### 8. Gestion des Versions (0.5 point)
- Utilisation de Git
- Branches thématiques :
  - `main` : Version stable
  - `test` : Tests et développement
  - `docker` : Configuration Docker
  - `main-css` : Styles
  - `main-html` : Templates
  - `main-js` : Logique JavaScript
  - `readme` : Documentation
- Commits atomiques et descriptifs

### 9. Qualité du Code (0.5 point)
- Code modulaire
- Documentation claire
- Tests unitaires
- Gestion des erreurs

### 10. Nomenclature (0.75 point)
- Conventions de nommage cohérentes
- Variables descriptives
- Fonctions avec responsabilité unique
- Commentaires pertinents

### 11. Organisation des Fichiers (1 point)
- Structure modulaire
- Séparation des responsabilités
- Architecture MVC
- Gestion des dépendances

### 12. Docker (1.5 points - Bonus)
- Containerisation complète
- Multi-stage builds
- Volumes persistants
- Réseau isolé
- Variables d'environnement

## Prérequis

### Installation de WSL (Windows Subsystem for Linux)

1. Ouvrir PowerShell en tant qu'administrateur et exécuter :
```powershell
wsl --install
```

2. Redémarrer votre ordinateur

3. Après le redémarrage, WSL s'installera automatiquement et vous demandera de créer un nom d'utilisateur et un mot de passe pour votre distribution Linux

4. Vérifier l'installation :
```powershell
wsl --list --verbose
```

### Installation de Docker

#### Sur Windows
1. Télécharger Docker Desktop depuis [le site officiel](https://www.docker.com/products/docker-desktop)
2. Installer Docker Desktop
3. Lors de l'installation, cocher l'option "Use WSL 2 instead of Hyper-V"
4. Redémarrer votre ordinateur
5. Vérifier l'installation :
```powershell
docker --version
docker-compose --version
```

#### Sur Ubuntu (WSL)
1. Mettre à jour les paquets :
```bash
sudo apt update && sudo apt upgrade
```

2. Installer les prérequis :
```bash
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
```

3. Ajouter la clé GPG officielle de Docker :
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

4. Ajouter le dépôt Docker :
```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

5. Installer Docker :
```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

6. Ajouter votre utilisateur au groupe docker :
```bash
sudo usermod -aG docker $USER
```

7. Redémarrer WSL ou votre session :
```bash
wsl --shutdown
```

8. Vérifier l'installation :
```bash
docker --version
docker compose version
```

## Structure du Projet

```
.
├── server/
│   ├── css/
│   │   └── style.css          # Styles globaux
│   ├── html/                  # Templates HTML
│   │   ├── home.html         # Page d'accueil
│   │   ├── login.html        # Page de connexion
│   │   ├── password.html     # Gestion des mots de passe
│   │   ├── post.html         # Affichage d'un post
│   │   ├── posts.html        # Liste des posts
│   │   ├── profil.html       # Page de profil
│   │   └── register.html     # Page d'inscription
│   └── js/
│       ├── index/            # Scripts principaux
│       │   ├── auth/         # Module d'authentification
│       │   │   ├── checkAuth.js
│       │   │   ├── index.js
│       │   │   ├── isAuthenticated.js
│       │   │   ├── requiresAuth.js
│       │   │   └── updateAuthUI.js
│       │   ├── auth.js       # Gestion principale de l'authentification
│       │   ├── login.js      # Gestion de la connexion
│       │   ├── post.js       # Gestion d'un post individuel
│       │   ├── posts.js      # Gestion de la liste des posts
│       │   └── profil.js     # Gestion du profil
│       ├── modules/          # Modules modulaires
│       │   └── posts/        # Module de gestion des posts
│       │       ├── post.js           # Point d'entrée pour un post
│       │       ├── postActions.js    # Actions sur un post
│       │       ├── postReplies.js    # Gestion des réponses
│       │       ├── postUI.js         # Interface utilisateur d'un post
│       │       ├── posts.js          # Point d'entrée pour la liste des posts
│       │       ├── postsActions.js   # Actions sur la liste des posts
│       │       └── postsUI.js        # Interface utilisateur de la liste
│       ├── categories.js     # Gestion des catégories
│       ├── database.js       # Configuration de la base de données
│       ├── posts.js          # API des posts
│       ├── replies.js        # Gestion des réponses
│       ├── startServer.js    # Démarrage du serveur
│       ├── users.js          # Gestion des utilisateurs
│       └── votes.js          # Système de votes
```

## Fonctionnalités Principales

### Authentification
- Inscription et connexion des utilisateurs
- Gestion des sessions
- Protection des routes
- Mise à jour de l'interface en fonction de l'état de connexion

### Posts
- Création, édition et suppression de posts
- Catégorisation des posts
- Système de votes (upvote/downvote)
- Gestion des réponses
- Filtrage par catégorie

### Interface Utilisateur
- Design responsive
- Feedback utilisateur en temps réel
- Navigation intuitive
- Gestion des erreurs

## Organisation du Code

### Structure Modulaire
Le projet utilise une architecture modulaire pour une meilleure maintenabilité :

1. **Module d'Authentification** (`/js/index/auth/`)
   - Séparation des responsabilités d'authentification
   - Gestion des états de connexion
   - Protection des routes

2. **Module des Posts** (`/js/modules/posts/`)
   - Séparation UI/Actions
   - Gestion des réponses
   - Système de votes

### Base de Données
- SQLite pour la persistance des données
- Tables : users, posts, categories, replies, votes

### API REST
- Routes pour l'authentification
- Gestion des posts et réponses
- Système de votes
- Gestion des catégories

## Installation du Projet

1. Cloner le repository
```bash
git clone https://github.com/guiiireg/forum.git
```

2. Installer les dépendances
```bash
npm install
```

## Démarrage du Projet

### Avec Docker (Recommandé)

1. Se placer dans le répertoire du projet
```bash
cd forum
```

2. Lancer les conteneurs
```bash
docker compose down && docker compose build && docker compose up -d
```

Cette commande va :
- Arrêter les conteneurs existants (`down`)
- Reconstruire les images (`build`)
- Démarrer les conteneurs en arrière-plan (`up -d`)

3. Vérifier que les conteneurs sont en cours d'exécution
```bash
docker compose ps
```

4. Accéder au forum
Ouvrir votre navigateur et aller à `http://localhost:3000`

### Sans Docker

1. Démarrer le serveur
```bash
node server/js/startServer.js
```

2. Accéder au forum
Ouvrir votre navigateur et aller à `http://localhost:3000`

## Dépendances Principales
- express: ^5.1.0
- sqlite3: ^5.1.7
- dotenv: ^16.5.0

## Développement

### Branches
- `main` : Version stable
- `test` : Tests et développement
- `docker` : Configuration Docker
- `main-css` : Styles
- `main-html` : Templates
- `main-js` : Logique JavaScript

### Conventions de Code
- Modules ES6
- Architecture modulaire
- Séparation UI/Logique
- Commentaires explicatifs
