import { createElementFromHTML } from "../../core/dom.js";
import { getCurrentUser } from "./postsState.js";
import { loadVotesForPost } from "./postsVoting.js";

export async function displayPosts(posts) {
  const container = document.getElementById("posts-container");
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = "<p>Aucun post trouvé avec ces filtres.</p>";
    return;
  }

  container.innerHTML = "";

  for (const post of posts) {
    const postElement = await createPostElement(post);
    container.appendChild(postElement);
  }
}

export async function createPostElement(post) {
  const currentUser = getCurrentUser();
  const votes = currentUser
    ? await loadVotesForPost(post.id, currentUser.id)
    : { totalVotes: post.total_votes || 0, userVote: 0 };

  const isOwner = currentUser && parseInt(currentUser.id) === post.user_id;
  const postHTML = generatePostHTML(post, isOwner, votes);

  return createElementFromHTML(postHTML);
}

export function generatePostHTML(post, isOwner, votes) {
  const actionsHtml = isOwner
    ? `
    <div class="post-actions">
      <button onclick="editPost(${post.id})" class="edit-btn">✏️ Modifier</button>
      <button onclick="deletePostHandler(${post.id})" class="delete-btn">🗑️ Supprimer</button>
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
        <h3 class="post-title"><a href="post.html?id=${post.id}">${
    post.title
  }</a></h3>
        <p class="post-content-text">${post.content}</p>
        <div class="post-meta">
          <span class="category">${post.category_name || "Autres"}</span>
          <span class="likes">❤️ ${post.total_votes || 0}</span>
          <span class="replies">💬 ${post.reply_count || 0}</span>
          <span class="date">📅 ${new Date(
            post.created_at
          ).toLocaleDateString()}</span>
        </div>
        <div class="post-details">
          <span>Par: ${post.username}</span>
        </div>
        ${actionsHtml}
      </div>
    </div>
  `;
}

export function setupUI() {
  const createPostContainer = document.getElementById("create-post-container");
  const currentUser = getCurrentUser();

  if (createPostContainer) {
    if (!currentUser) {
      createPostContainer.innerHTML =
        '<p>Vous devez être <a href="login.html">connecté</a> pour créer un post.</p>';
    } else {
      createPostContainer.innerHTML = createPostFormHTML();
    }
  }
}

export function createPostFormHTML() {
  return `
    <h3>Créer un nouveau post</h3>
    <form id="create-post-form">
      <div>
        <label for="category">Catégorie :</label>
        <select id="category" name="category" required>
          <option value="">Chargement des catégories...</option>
        </select>
      </div>
      <div>
        <label for="title">Titre :</label>
        <input type="text" id="title" name="title" required />
      </div>
      <div>
        <label for="content">Contenu :</label>
        <textarea id="content" name="content" rows="4" required></textarea>
      </div>
      <button type="submit">Publier</button>
    </form>
    <div id="post-message"></div>
  `;
}
