# Fonctionnalités Détaillées

## Core Functionnalités
- **Architecture ES6 Modules** : Import/export modernes pour une structure claire
- **Gestion centralisée des appels API** via `core/api.js` avec `safeApiCall()`
- **Système d'authentification robuste** via `core/auth.js` et JWT
- **Utilitaires DOM optimisés** via `core/dom.js`
- **Gestion du cache** pour les performances avec `cache.js`
- **Orchestration modulaire** avec ServerOrchestrator

## Sécurité et Middleware
- **Middleware d'authentification** pour la protection des routes
- **Gestion globale des erreurs** avec middleware dédié
- **Helmet.js** : Protection HTTP avancée
- **CORS** configuré pour les requêtes cross-origin
- **BCrypt** : Hachage sécurisé des mots de passe
- **Cookie-parser** : Gestion sécurisée des cookies
- **Validation des entrées** utilisateur avec sanitisation

## Gestion des Posts
- **Architecture modulaire** : Module `posts/` avec 8 sous-modules spécialisés
- **CRUD complet** : Création, édition, suppression avec validation
- **Catégorisation obligatoire** : Système de catégories avec routes dédiées
- **Système de votes intelligent** :
  - **Toggle** : Clic répété supprime le vote
  - **Changement direct** : upvote ↔ downvote instantané
  - **Protection anti-négatif** : Score minimum à 0
  - **UI réactive** : Feedback visuel immédiat
- **Gestion des réponses** : Threading avec système de réponses
- **Filtrage et tri avancés** :
  - Filtrage par catégories (multiple)
  - Tri par date, popularité, nb réponses
  - Ordre croissant/décroissant

## Interface Utilisateur
- **Design responsive** avec CSS modulaire (11 fichiers CSS)
- **Feedback utilisateur en temps réel** via événements personnalisés
- **Navigation intuitive** avec routing Express optimisé
- **Gestion des erreurs** : Page 404 personnalisée + middleware global
- **Templates HTML** : 9 pages spécialisées
- **Components UI** : Modules `ui/` pour le rendu et messages

## Performance et Architecture
- **Système de cache** optimisé avec `cache.js`
- **Requêtes SQL préparées** et optimisées
- **Chargement asynchrone** avec async/await moderne
- **ES Modules** : Architecture modulaire moderne
- **Services séparés** : Couche métier client/serveur distincte
- **Docker** : Conteneurisation avec Node.js 20
- **Hot-reload** : Développement avec bind mounts

## Points Clés par Catégorie

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

### 6. Routing Erreur Web + RGPD (0.5 point)
- Gestion globale des erreurs avec middleware Express
- Page d'erreur 404 personnalisée
- Politique de confidentialité conforme RGPD
- Gestion des cookies et des données personnelles
- Droits des utilisateurs (accès, rectification, effacement)

### 7. Suivi des posts (0.5 point)
- **Système de vote intelligent** avec `votes.js` + `postsVoting.js`
- **Toggle avancé** : Clic répété = suppression du vote
- **Changement direct** : upvote ↔ downvote sans double clic
- **Un vote par utilisateur** avec vérification base de données
- **Mise à jour temps réel** : UI réactive + synchronisation serveur
- **Protection anti-négatif** : Score minimum à 0 avec validation
- **Logs de debug** détaillés pour le développement

### 8. Filtres (0.5 point)
- **Module dédié** `postsFilter.js` avec logique centralisée
- **Filtrage par catégories** : Sélection multiple avec API
- **Tri multi-critères** :
  - Date de création (récent/ancien)
  - Popularité (score de votes)
  - Nombre de réponses
- **Ordre bidirectionnel** : croissant/décroissant
- **Application temps réel** sans rechargement de page
- **État persistant** avec `postsState.js`

### 9. Syntaxe SQL (0.5 point)
- **Requêtes préparées** pour la sécurité (SQL injection)
- **Jointures optimisées** entre tables users, posts, votes, categories
- **Sous-requêtes** pour calculs de scores et statistiques
- **Agrégations** : COUNT, SUM pour votes et réponses
- **Indexation** appropriée pour les performances
- **Transactions** pour la cohérence des données

## Technologies et Architecture Moderne

### Backend
- **Node.js 20** : Runtime JavaScript dernière génération
- **Express.js 5.1.0** : Framework web moderne et performant
- **ES Modules** : `"type": "module"` avec import/export ES6
- **SQLite 5.1.7** : Base de données intégrée et performante
- **Architecture OOP** : Classes et patterns modernes

### Sécurité
- **BCrypt 6.0.0** : Hachage sécurisé des mots de passe
- **JWT 9.0.2** : Authentification par tokens
- **Helmet 7.1.0** : Protection HTTP avancée
- **CORS 2.8.5** : Gestion cross-origin sécurisée
- **Cookie-parser** : Gestion sécurisée des cookies

### Développement et Déploiement
- **Docker** : Conteneurisation complète
- **Docker Compose** : Orchestration développement
- **Hot-reload** : Développement avec bind mounts
- **Architecture modulaire** : Séparation claire des responsabilités
- **Middleware pattern** : Gestion centralisée des requêtes

### Structure de Fichiers
- **95+ fichiers JavaScript** organisés en modules
- **11 fichiers CSS** modulaires et responsive
- **9 templates HTML** spécialisés
- **Documentation complète** avec guides techniques

[Retour au README principal](../README.md)