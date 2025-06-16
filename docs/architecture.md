# Architecture Technique

## Architecture Globale Moderne
```mermaid
graph TD
    A[Client Browser] --> B[ServerOrchestrator]
    B --> C[ServerConfig]
    C --> D[Express App]
    D --> E[Middleware Layer]
    E --> F[Routes Layer]
    F --> G[Services Layer]
    G --> H[Models Layer]
    H --> I[SQLite Database]
    
    J[Core Modules] --> D
    K[Post Modules] --> F
    L[UI Modules] --> A
    M[Authentication] --> E
    N[Vote System] --> G
    O[Cache System] --> G
    
    subgraph "ES Modules Architecture"
        J
        K
        L
    end
    
    subgraph "Security Layer"
        M
        P[Helmet]
        Q[CORS]
        R[BCrypt]
    end
    
    P --> D
    Q --> D
    R --> M
```

## Flux d'Authentification JWT

```mermaid
sequenceDiagram
    participant Client
    participant AuthRoutes
    participant AuthService
    participant BCrypt
    participant Database
    participant JWT
    
    Client->>AuthRoutes: POST /login {username, password}
    AuthRoutes->>AuthService: authenticate(credentials)
    AuthService->>Database: findUser(username)
    Database-->>AuthService: User Data
    AuthService->>BCrypt: compare(password, hash)
    BCrypt-->>AuthService: Valid/Invalid
    
    alt Authentication Success
        AuthService->>JWT: generateToken(userData)
        JWT-->>AuthService: JWT Token
        AuthService-->>AuthRoutes: {success: true, token}
        AuthRoutes-->>Client: Set-Cookie + Response
    else Authentication Failed
        AuthService-->>AuthRoutes: {success: false, message}
        AuthRoutes-->>Client: 401 Unauthorized
    end
```

## Flux de Gestion des Posts

```mermaid
sequenceDiagram
    participant User
    participant Server
    participant Database
    
    User->>Server: Create Post
    Server->>Database: Save Post
    Database-->>Server: Post ID
    Server-->>User: Success Response
```

## Flux du Système de Votes Intelligent

```mermaid
sequenceDiagram
    participant Client
    participant VoteButton
    participant API
    participant VoteRoutes
    participant VoteService
    participant Database
    
    Client->>VoteButton: Click Vote (upvote/downvote)
    VoteButton->>API: safeApiCall(submitVote)
    API->>VoteRoutes: POST /votes {postId, voteType, userId}
    VoteRoutes->>VoteService: votePost(params)
    
    VoteService->>Database: SELECT existing vote
    Database-->>VoteService: Current Vote Status
    
    alt Same Vote (Toggle)
        VoteService->>Database: DELETE vote
        VoteService-->>VoteRoutes: {success: true, message: "Vote supprimé"}
    else Different Vote (Change)
        VoteService->>VoteService: Calculate new total
        alt Total would be negative
            VoteService-->>VoteRoutes: {success: false, message: "Score < 0"}
        else Valid Vote
            VoteService->>Database: DELETE old vote
            VoteService->>Database: INSERT new vote
            VoteService-->>VoteRoutes: {success: true, message: "Vote mis à jour"}
        end
    else No Existing Vote
        VoteService->>VoteService: Calculate new total
        alt Total would be negative
            VoteService-->>VoteRoutes: {success: false, message: "Score < 0"}
        else Valid Vote
            VoteService->>Database: INSERT new vote
            VoteService-->>VoteRoutes: {success: true, message: "Vote ajouté"}
        end
    end
    
    VoteRoutes-->>API: Response
    API-->>VoteButton: Update UI
    VoteButton->>VoteButton: Visual Feedback
```

## Flux du Système de Filtres Avancé

```mermaid
sequenceDiagram
    participant Client
    participant FilterUI
    participant PostsModule
    participant PostsFilter
    participant PostsState
    participant API
    participant Database
    
    Client->>FilterUI: Select Category/Sort Option
    FilterUI->>PostsModule: updateFilters(newFilters)
    PostsModule->>PostsState: setState(filters)
    PostsState-->>PostsModule: Updated State
    
    PostsModule->>API: fetchPosts(categoryId)
    API->>Database: SELECT posts with filters
    Database-->>API: Raw Posts Data
    
    API-->>PostsModule: Posts Array
    PostsModule->>PostsFilter: applyFilters(posts, filters)
    
    PostsFilter->>PostsFilter: Filter by Categories
    PostsFilter->>PostsFilter: Sort by Criteria
    note over PostsFilter: Date, Votes, Replies<br/>Ascending/Descending
    
    PostsFilter-->>PostsModule: Filtered & Sorted Posts
    PostsModule->>PostsModule: displayPostsWithVoting()
    PostsModule-->>Client: Updated UI
```

## Architecture des Modules ES6

```mermaid
graph TB
    subgraph "Client Side (Browser)"
        A[HTML Templates<br/>9 pages spécialisées]
        B[CSS Modules<br/>11 fichiers modulaires]
        C[Client JS Modules]
        
        C1[core/api.js<br/>API Client]
        C2[core/auth.js<br/>Auth Client]
        C3[core/dom.js<br/>DOM Utils]
        C4[modules/posts/<br/>8 sub-modules]
        C5[modules/ui/<br/>UI Components]
        
        C --> C1
        C --> C2
        C --> C3
        C --> C4
        C --> C5
    end
    
    subgraph "Server Side (Node.js ES Modules)"
        D[ServerOrchestrator]
        E[ServerConfig]
        F[Routes Layer]
        G[Services Layer]
        H[Models Layer]
        
        F1[authRoutes.js]
        F2[postRoutes.js]
        F3[voteRoutes.js]
        F4[categoryRoutes.js]
        
        G1[postService.js]
        G2[categoryService.js]
        G3[apiService.js]
        
        H1[User Model]
        H2[Post Model]
        H3[Vote Model]
        
        D --> E
        E --> F
        F --> G
        G --> H
        
        F --> F1
        F --> F2
        F --> F3
        F --> F4
        
        G --> G1
        G --> G2
        G --> G3
        
        H --> H1
        H --> H2
        H --> H3
    end
    
    subgraph "Database Layer"
        I[SQLite Database]
        I1[users table]
        I2[posts table]
        I3[votes table]
        I4[categories table]
        I5[replies table]
        
        I --> I1
        I --> I2
        I --> I3
        I --> I4
        I --> I5
    end
    
    subgraph "Security & Middleware"
        J[Helmet Security]
        K[CORS Handler]
        L[BCrypt Hashing]
        M[JWT Authentication]
        N[Error Handler]
    end
    
    A --> C
    B --> C
    C1 --> F
    C4 --> F2
    C4 --> F3
    
    E --> J
    E --> K
    F1 --> L
    F1 --> M
    F --> N
    
    H --> I
```

## Schéma de la Base de Données

```mermaid
erDiagram
    users {
        int id PK
        string username
        string password
        datetime created_at
    }
    
    categories {
        int id PK
        string name
        string description
        datetime created_at
    }
    
    posts {
        int id PK
        string title
        string content
        int user_id FK
        int category_id FK
        datetime created_at
    }
    
    replies {
        int id PK
        string content
        int post_id FK
        int user_id FK
        datetime created_at
    }
    
    votes {
        int id PK
        int post_id FK
        int user_id FK
        int vote_type
        datetime created_at
    }
    
    users ||--o{ posts : "creates"
    users ||--o{ replies : "writes"
    users ||--o{ votes : "casts"
    categories ||--o{ posts : "contains"
    posts ||--o{ replies : "has"
    posts ||--o{ votes : "receives"
```

## Composants Principaux de l'Architecture

### 🏗️ Core Modules (Fondamentaux)
- **`core/api.js`** : Client API avec `safeApiCall()` et gestion d'erreurs
- **`core/auth.js`** : Authentification côté client avec JWT
- **`core/dom.js`** : Utilitaires DOM optimisés et réutilisables

### 🔧 Server Architecture
- **`server/index.js`** : `ServerOrchestrator` - Point d'entrée principal
- **`server/config/serverConfig.js`** : Configuration Express + middleware
- **`startServer.js`** : Export principal du serveur

### 🛣️ Routes (Express RESTful)
- **`authRoutes.js`** : Login, register, logout avec JWT
- **`postRoutes.js`** : CRUD posts avec validation
- **`voteRoutes.js`** : API de vote intelligent (POST /votes)
- **`categoryRoutes.js`** : Gestion catégories
- **`replyRoutes.js`** : Système de réponses
- **`errorRoutes.js`** : Gestion globale des erreurs 404

### 🔄 Services (Business Logic)
#### Services Serveur
- **`apiService.js`** : Logique API principale
- **`categoryService.js`** : Gestion des catégories
- **`postService.js`** : Services posts de base

#### Services Client
- **`client/postManagerService.js`** : Gestion posts côté client
- **`client/categoryManagerService.js`** : Interface catégories
- **`client/formHandlerService.js`** : Traitement formulaires

#### Services Posts Spécialisés
- **`posts/postCrudService.js`** : CRUD avancé
- **`posts/postQueryService.js`** : Requêtes complexes
- **`posts/postOwnershipService.js`** : Gestion des droits

### 📝 Modules Posts (8 sous-modules)
- **`posts/index.js`** : Orchestrateur principal
- **`posts/postsState.js`** : Gestion d'état centralisée
- **`posts/postsDataLoader.js`** : Chargement données avec cache
- **`posts/postsDisplay.js`** : Rendu et affichage DOM
- **`posts/postsFilter.js`** : Logique de filtrage avancé
- **`posts/postsEventHandlers.js`** : Gestionnaires d'événements
- **`posts/postsActions.js`** : Actions CRUD utilisateur
- **`posts/postsVoting.js`** : Interface de vote réactive

### 🎨 UI Modules
- **`ui/postRenderer.js`** : Rendu des posts
- **`ui/messageHandler.js`** : Gestion des messages
- **`ui/selectPopulator.js`** : Population des selects

### 🔒 Middleware & Sécurité
- **`middleware/authMiddleware.js`** : Vérification JWT
- **`middleware/errorHandler.js`** : Gestionnaire d'erreurs global
- **Helmet** : Protection HTTP headers
- **CORS** : Cross-Origin Resource Sharing
- **BCrypt** : Hachage sécurisé des mots de passe

### 💾 Database Layer
- **`database/connection.js`** : Connexion SQLite
- **`database/schemas/`** : Structures de données (user, post, category)
- **`database/migrations/`** : Scripts de migration
- **`models/`** : Modèles et requêtes SQL préparées

### 📄 Pages Scripts
- **9 scripts spécialisés** : home.js, login.js, posts.js, etc.
- **Logique page spécifique** : Initialisation et comportements

## ⭐ Architecture du Système de Vote

### Double Architecture (Client + Serveur)

```mermaid
graph LR
    subgraph "Côté Client"
        A[User Click] --> B[postsVoting.js]
        B --> C[safeApiCall]
        C --> D[Visual Feedback]
    end
    
    subgraph "Côté Serveur"
        E[VoteRoutes] --> F[votes.js]
        F --> G[Logic Engine]
        G --> H[Database]
    end
    
    subgraph "Logic Engine Detail"
        G1[Check Existing Vote]
        G2[Toggle Detection]
        G3[Anti-Negative Protection]
        G4[Score Calculation]
        
        G --> G1
        G1 --> G2
        G2 --> G3
        G3 --> G4
    end
    
    C --> E
    F --> C
```

### Logique Intelligence

1. **Toggle Detection** : Même vote = suppression
2. **Change Detection** : Vote différent = changement direct
3. **Anti-Negative** : Protection score < 0
4. **Feedback Real-time** : UI mise à jour immédiate

## 🏛️ Patterns Architecturaux

### ES Modules Pattern
```javascript
// Export nommé moderne
export class ServerOrchestrator {
  async initialize() { /* ... */ }
}

// Import sélectif
import { votePost } from "./votes.js";
```

### Service Layer Pattern
```javascript
// Séparation des responsabilités
Routes → Services → Models → Database
```

### Observer Pattern
```javascript
// Événements personnalisés
window.dispatchEvent(new CustomEvent("api-error", {
  detail: { error, operation, message }
}));
```

### Module Pattern
```javascript
// Encapsulation et exports
export {
  initializePosts,
  refreshPosts as updateFilters
};
```

### Middleware Pattern
```javascript
// Pipeline de traitement
app.use(helmet());
app.use(cors());
app.use(authMiddleware);
```

## 🔄 Flux de Données

### Unidirectional Data Flow
```
User Action → State Update → UI Render → Server Sync
```

### State Management
- **Centralisé** : `postsState.js`
- **Persistant** : Session storage
- **Réactif** : Mises à jour automatiques

[Retour au README principal](../README.md) 
