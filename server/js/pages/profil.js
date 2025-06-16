import { initAuth, getCurrentUser } from "../core/auth.js";
import { createElementFromHTML, initSidebarToggle } from "../core/dom.js";
import { safeApiCall } from "../core/api.js";

const profileState = {
  currentUser: null,
  userPosts: [],
};

async function initProfilePage() {
  initAuth();

  profileState.currentUser = getCurrentUser();

  if (!profileState.currentUser) {
    window.location.href = "/login.html";
    return;
  }

  await loadUserPosts();
  setupUI();
}

async function loadUserPosts() {
  if (!profileState.currentUser) return;

  const result = await safeApiCall(
    () => fetchUserPosts(profileState.currentUser.id),
    "chargement de vos posts"
  );

  if (result.success) {
    profileState.userPosts = result.posts;
    displayUserPosts(profileState.userPosts);
  }
}

async function fetchUserPosts(userId) {
  try {
    const response = await fetch(`/api/posts/user/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des posts"
      );
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    throw error;
  }
}

function displayUserPosts(posts) {
  const container = document.getElementById("posts-container");
  if (!container) return;

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="no-posts">
        <p>Vous n'avez encore créé aucun post.</p>
        <a href="posts.html" class="create-post-link">Créer votre premier post</a>
      </div>
    `;
    return;
  }

  container.innerHTML = "";

  posts.forEach((post) => {
    const postElement = createUserPostElement(post);
    container.appendChild(postElement);
  });
}

function createUserPostElement(post) {
  const postHTML = generateUserPostHTML(post);
  return createElementFromHTML(postHTML);
}

function generateUserPostHTML(post) {
  const createdAt = new Date(post.created_at).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <article class="post user-post" data-post-id="${post.id}">
      <div class="post-header">
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <div class="post-meta">
          <span class="post-date">${createdAt}</span>
          ${
            post.category_name
              ? `<span class="post-category">${escapeHtml(
                  post.category_name
                )}</span>`
              : ""
          }
        </div>
      </div>
      
      <div class="post-content">
        <p>${escapeHtml(post.content)}</p>
      </div>
      
      <div class="post-footer">
        <div class="post-stats">
          <span class="post-stat">
            <i class="icon-thumb-up"></i>
            ${post.total_votes || 0} votes
          </span>
          <span class="post-stat">
            <i class="icon-comment"></i>
            ${post.reply_count || 0} réponses
          </span>
        </div>
        
        <div class="post-actions">
          <a href="post.html?id=${
            post.id
          }" class="btn btn-small btn-primary">Voir le post</a>
        </div>
      </div>
    </article>
  `;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function setupUI() {
  updatePageTitle();
}

function updatePageTitle() {
  if (profileState.currentUser) {
    const titleElement = document.querySelector("main h3");
    if (titleElement) {
      titleElement.textContent = `Posts de ${profileState.currentUser.username}`;
    }
  }
}

function initTabFunctionality() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      tabBtns.forEach((tb) => tb.classList.remove("active"));
      tabContents.forEach((tc) => tc.classList.remove("active"));

      btn.classList.add("active");
      const tabContent = document.getElementById(tabId + "-tab");
      if (tabContent) {
        tabContent.classList.add("active");
      }
    });
  });
}

function initProfileActions() {
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const postsSort = document.getElementById("posts-sort");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      alert("Fonctionnalité de modification du profil à implémenter");
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      alert("Fonctionnalité des paramètres à implémenter");
    });
  }

  if (postsSort) {
    postsSort.addEventListener("change", (e) => {
      console.log("Sorting posts by:", e.target.value);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initProfilePage();
  initSidebarToggle();
  initTabFunctionality();
  initProfileActions();
});
