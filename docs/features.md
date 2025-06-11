# Fonctionnalités Détaillées

## Core Functionnalités
- Gestion centralisée des appels API via `core/api.js`
- Système d'authentification robuste via `core/auth.js`
- Utilitaires DOM optimisés via `core/dom.js`
- Gestion du cache pour les performances

## Sécurité et Middleware
- Middleware d'authentification pour la protection des routes
- Gestion globale des erreurs avec middleware dédié
- Protection CSRF
- Validation des entrées utilisateur

## Gestion des Posts
- Création, édition et suppression de posts
- Catégorisation des posts
- Système de votes (upvote/downvote)
- Gestion des réponses
- Filtrage par catégorie

## Interface Utilisateur
- Design responsive avec CSS modulaire
- Feedback utilisateur en temps réel
- Navigation intuitive
- Gestion des erreurs avec page 404 personnalisée
- Support du markdown dans les posts

## Performance
- Système de cache pour optimiser les performances
- Requêtes SQL optimisées
- Chargement asynchrone des ressources
- Gestion efficace des sessions

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
- Upvote/Downvote
- Un vote par utilisateur
- Mise à jour en temps réel
- Calcul des scores

### 8. Filtres (0.5 point)
- Filtrage par catégories
- Tri par date de création
- Tri par nombre de likes
- Tri par nombre de réponses
- Ordre croissant/décroissant

### 9. Syntaxe SQL (0.5 point)
- Requêtes optimisées
- Jointures appropriées
- Sous-requêtes
- Agrégations

[Retour au README principal](../README.md) 