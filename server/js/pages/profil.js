/**
 * Profile Page - Display user's posts
 */

import { initAuth, getCurrentUser } from "../lib/auth.js";
import { createElementFromHTML, showError } from "../lib/dom.js";
import { safeApiCall } from "../lib/api.js";

// ==================== STATE MANAGEMENT ====================

const profileState = {
  currentUser: null,
  userPosts: [],
};

// ==================== INITIALIZATION ====================

/**
 * Initialize the profile page
 */
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

// ==================== DATA LOADING ====================

/**
 * Load posts created by the current user
 */
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

/**
 * Fetch user posts from API
 * @param {string} userId - User ID
 * @returns {Promise<Object>} API response
 */
async function fetchUserPosts(userId) {
  try {
    const response = await fetch(`/api/posts/user/${userId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de la récupération des posts');
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    throw error;
  }
}

// ==================== UI DISPLAY ====================

/**
 * Display user posts in the container
 * @param {Array} posts - Posts to display
 */
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

  posts.forEach(post => {
    const postElement = createUserPostElement(post);
    container.appendChild(postElement);
  });
}

/**
 * Create a post element for user profile
 * @param {Object} post - Post data
 * @returns {HTMLElement} Post element
 */
function createUserPostElement(post) {
  const postHTML = generateUserPostHTML(post);
  return createElementFromHTML(postHTML);
}

/**
 * Generate HTML for a user post
 * @param {Object} post - Post data
 * @returns {string} Post HTML
 */
function generateUserPostHTML(post) {
  const createdAt = new Date(post.created_at).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <article class="post user-post" data-post-id="${post.id}">
      <div class="post-header">
        <h3 class="post-title">${escapeHtml(post.title)}</h3>
        <div class="post-meta">
          <span class="post-date">${createdAt}</span>
          ${post.category_name ? `<span class="post-category">${escapeHtml(post.category_name)}</span>` : ''}
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
          <a href="post.html?id=${post.id}" class="btn btn-small btn-primary">Voir le post</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * Escape HTML characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== UI SETUP ====================

/**
 * Setup the profile page UI
 */
function setupUI() {
  updatePageTitle();
}

/**
 * Update page title with user information
 */
function updatePageTitle() {
  if (profileState.currentUser) {
    const titleElement = document.querySelector('main h3');
    if (titleElement) {
      titleElement.textContent = `Posts de ${profileState.currentUser.username}`;
    }
  }
}

// ==================== EVENT LISTENERS ====================

document.addEventListener("DOMContentLoaded", initProfilePage); 