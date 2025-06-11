export function createPostElement(post, isOwner, votes) {
  const categoryBadge = post.category_name
    ? `<span class="category-badge">${post.category_name}</span>`
    : "";

  const actionsHtml = isOwner
    ? `
    <div class="post-actions">
      <button onclick="handleEditPost(${post.id})" class="edit-btn">✏️ Modifier</button>
      <button onclick="handleDeletePost(${post.id})" class="delete-btn">🗑️ Supprimer</button>
    </div>
  `
    : "";

  return `
    <div class="post" id="post-${post.id}">
      <div class="vote-container" id="vote-container-${post.id}">
        <button class="vote-button upvote-button ${
          votes.userVote === 1 ? "upvoted" : ""
        }">▲</button>
        <span class="vote-count">${votes.totalVotes}</span>
        <button class="vote-button downvote-button ${
          votes.userVote === -1 ? "downvoted" : ""
        }">▼</button>
      </div>
      <div class="post-content">
        ${categoryBadge}
        <h3 class="post-title"><a href="post.html?id=${post.id}">${
    post.title
  }</a></h3>
        <p class="post-content-text">${post.content}</p>
        <div class="post-meta">
          <span>Par: ${post.username}</span>
          <span>Date: ${new Date(post.created_at).toLocaleString()}</span>
        </div>
        ${actionsHtml}
      </div>
    </div>
  `;
}

export function createEditForm(
  postId,
  currentTitle,
  currentContent,
  categoriesOptions
) {
  return `
    <div class="edit-form">
      <div>
        <label for="edit-category-${postId}">Catégorie :</label>
        <select id="edit-category-${postId}">${categoriesOptions}</select>
      </div>
      <div>
        <label for="edit-title-${postId}">Titre :</label>
        <input type="text" id="edit-title-${postId}" value="${currentTitle}" required />
      </div>
      <div>
        <label for="edit-content-${postId}">Contenu :</label>
        <textarea id="edit-content-${postId}" rows="4" required>${currentContent}</textarea>
      </div>
      <div class="edit-buttons">
        <button onclick="saveEditPost(${postId})">Sauvegarder</button>
        <button onclick="cancelEditPost(${postId})">Annuler</button>
      </div>
    </div>
  `;
}

export function createPostForm() {
  return `
    <div class="create-post-form">
      <h2>Créer un nouveau post</h2>
      <form id="create-post-form">
        <div>
          <label for="category">Catégorie :</label>
          <select id="category" required>
            <option value="">Sélectionnez une catégorie</option>
          </select>
        </div>
        <div>
          <label for="title">Titre :</label>
          <input type="text" id="title" required />
        </div>
        <div>
          <label for="content">Contenu :</label>
          <textarea id="content" rows="4" required></textarea>
        </div>
        <button type="submit">Publier</button>
      </form>
    </div>
  `;
}

export function createCategoryFilter() {
  return `
    <div class="category-filter">
      <label for="category-filter-select">Filtrer par catégorie :</label>
      <select id="category-filter-select">
        <option value="">Toutes les catégories</option>
      </select>
    </div>
  `;
}
