# Architecture Technique

## Architecture Globale
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

## Flux d'Authentification

```mermaid
sequenceDiagram
    participant User
    participant Server
    participant Database
    
    User->>Server: Login Request
    Server->>Database: Verify Credentials
    Database-->>Server: User Data
    Server->>Server: Create Session
    Server-->>User: Session Token
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

## Flux du Système de Votes

```mermaid
sequenceDiagram
    participant User
    participant Server
    participant Database
    
    User->>Server: Vote Request
    Server->>Database: Check Existing Vote
    Database-->>Server: Vote Status
    Server->>Database: Update Vote
    Server-->>User: Updated Score
```

## Flux du Système de Filtres

```mermaid
sequenceDiagram
    participant User
    participant Server
    participant Database
    
    User->>Server: Filter Request
    Server->>Database: Query Posts
    Database-->>Server: Filtered Posts
    Server->>Server: Sort Results
    Server-->>User: Filtered & Sorted Posts
```

## Architecture des Modules

```mermaid
graph TB
    subgraph Frontend
        A[HTML Templates]
        B[CSS Styles]
    end
    
    subgraph Backend
        C[Core Module]
        D[Middleware]
        E[Pages]
        F[Modules]
    end
    
    subgraph Database
        G[SQLite]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    D --> F
    E --> G
    F --> G
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

## Composants Principaux

### Modules Core
- `api.js` : Configuration des routes API
- `auth.js` : Gestion de l'authentification
- `posts.js` : Gestion des posts
- `votes.js` : Système de votes
- `categories.js` : Gestion des catégories
- `index.js` : Système de filtrage et tri

### Middleware
- `auth.js` : Middleware d'authentification
- `error.js` : Gestion des erreurs
- `validation.js` : Validation des données

[Retour au README principal](../README.md) 


