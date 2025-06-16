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

## 📋 Conventions de Code

### JavaScript/Node.js Moderne
- **ES Modules** : `import/export` exclusivement (défini dans package.json)
- **Classes OOP** : Architecture orientée objet (ex: ServerOrchestrator)
- **Async/Await** : Gestion asynchrone moderne, éviter les callbacks
- **Arrow Functions** : Préférer `() =>` pour les fonctions courtes
- **Template Literals** : Utiliser `` ` `` pour les chaînes complexes
- **Destructuring** : Extraction de propriétés moderne
- **Noms explicites** : Variables et fonctions auto-documentées

```javascript
// ✅ Bon exemple
export class PostManager {
  async createPost({ title, content, categoryId, userId }) {
    const result = await this.database.insert(/* ... */);
    return { success: true, postId: result.id };
  }
}

// ❌ Éviter
function createPost(a, b, c, d, callback) {
  db.query("INSERT...", [a, b, c, d], callback);
}
```

### Architecture Modulaire
- **Un fichier = une responsabilité** claire
- **Modules par fonctionnalité** : posts/, auth/, ui/
- **Index.js systématique** : Export centralisé de chaque module
- **Séparation couches** : routes ≠ services ≠ models
- **Injection de dépendances** : Éviter les imports statiques pour les services

### SQL et Base de Données
- **Requêtes préparées** : Protection SQL injection obligatoire
- **Transactions** : Pour les opérations multi-tables
- **Naming convention** : snake_case pour les colonnes
- **Documentation** : Commenter les requêtes complexes
- **Indexation** : Performance sur les clés étrangères

```javascript
// ✅ Requête préparée sécurisée
const result = await db.get(
  "SELECT * FROM posts WHERE user_id = ? AND category_id = ?",
  [userId, categoryId]
);

// ❌ Vulnérable
const result = await db.get(
  `SELECT * FROM posts WHERE user_id = ${userId}`
);
```

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

## 🐛 Debug et Système de Vote Avancé

### Architecture du Système de Vote
Le système de vote est divisé en **deux couches** avec debugging intégré :

#### **Côté Serveur (`votes.js`)**
```javascript
export async function votePost(postId, userId, voteType) {
  console.log("=== DÉBUT DU VOTE ===");
  console.log("Paramètres reçus:", { postId, userId, voteType });
  
  // Logique avec logs détaillés pour chaque décision
  // Toggle, changement, protection anti-négatif
  
  console.log("=== FIN DU VOTE ===");
}
```

**Fonctionnalités de debug :**
- 🔍 **Logs détaillés** : Affichage des paramètres et calculs
- 📊 **Traçabilité** : Chaque décision est documentée
- ⚠️ **Validation** : Protection anti-négatif avec logs
- 🔄 **Toggle intelligent** : Clic répété = suppression

#### **Côté Client (`modules/posts/postsVoting.js`)**
```javascript
import { safeApiCall } from "../../core/api.js";

// UI réactive avec feedback immédiat
export function setupPostVoting(postElement, postId) {
  // Gestion des états visuels
  // Synchronisation serveur
  // Gestion des erreurs avec feedback
}
```

**Fonctionnalités client :**
- ⚡ **Feedback immédiat** : UI responsive
- 🔄 **Synchronisation** : État serveur ↔ client
- 🛡️ **Gestion d'erreurs** : `safeApiCall` avec messages utilisateur
- 🎨 **États visuels** : Boutons actifs/inactifs

### Patterns de Debug Modernes
```javascript
// 🔍 Debug avec contexte
console.log("Vote decision:", {
  existingVote: existingVote?.vote_type,
  newVote: voteType,
  calculation: `${currentTotal} + ${voteType} = ${newTotal}`
});

// ⚠️ Validation avec feedback
if (newTotal < 0) {
  console.log("❌ Vote rejected: negative score");
  return { success: false, message: "Score cannot be negative" };
}
```

### Outils de Debug Recommandés
- **Chrome DevTools** : F12 pour inspection réseau
- **Console logs** : Système intégré dans `votes.js`
- **API testing** : Postman/Thunder Client
- **Docker logs** : `docker compose logs -f`

[Retour au README principal](../README.md) 