export function createPostElement(post, isOwner) {
  const categoryBadge = post.category_name
    ? `<span class="category-badge">${post.category_name}</span>`
    : "";

  const actionsHtml = isOwner
    ? `
    <div class="post-actions">
      <button onclick="handleEditPost()" class="edit-btn">✏️ Modifier</button>
      <button onclick="handleDeletePost()" class="delete-btn">🗑️ Supprimer</button>
    </div>
  `
    : "";

  return `
    <div class="post">
      ${categoryBadge}
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <div class="post-meta">
        <span>Par: ${post.username}</span>
        <span>Date: ${new Date(post.created_at).toLocaleString()}</span>
      </div>
      ${actionsHtml}
    </div>
  `;
}

export function createEditForm(
  currentTitle,
  currentContent,
  categoriesOptions
) {
  return `
    <div class="edit-form">
      <div>
        <label for="edit-category">Catégorie :</label>
        <select id="edit-category">${categoriesOptions}</select>
      </div>
      <div>
        <label for="edit-title">Titre :</label>
        <input type="text" id="edit-title" value="${currentTitle}" required />
      </div>
      <div>
        <label for="edit-content">Contenu :</label>
        <textarea id="edit-content" rows="4" required>${currentContent}</textarea>
      </div>
      <div class="edit-buttons">
        <button onclick="saveEditPost()">Sauvegarder</button>
        <button onclick="cancelEditPost()">Annuler</button>
      </div>
    </div>
  `;
}

export function showEditForm(postElement) {
  const titleElement = postElement.querySelector("h2");
  const contentElement = postElement.querySelector("p");
  const actionsElement = postElement.querySelector(".post-actions");

  titleElement.style.display = "none";
  contentElement.style.display = "none";
  if (actionsElement) actionsElement.style.display = "none";
}

export function hideEditForm(postElement) {
  const titleElement = postElement.querySelector("h2");
  const contentElement = postElement.querySelector("p");
  const actionsElement = postElement.querySelector(".post-actions");
  const editForm = postElement.querySelector(".edit-form");

  titleElement.style.display = "";
  contentElement.style.display = "";
  if (actionsElement) actionsElement.style.display = "";
  editForm.remove();
}
 