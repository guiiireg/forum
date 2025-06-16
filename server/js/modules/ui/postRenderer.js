/**
 * Post Renderer for displaying posts in the UI
 */
export class PostRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  /**
   * Render a single post
   * @param {Object} post - Post data
   * @returns {string} HTML string for the post
   */
  renderPost(post) {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString();
    };

    return `
      <div class="post">
        <h3>${this.escapeHtml(post.title)}</h3>
        <p>${this.escapeHtml(post.content)}</p>
        <div class="post-meta">
          <span>Par: ${this.escapeHtml(post.username)}</span>
          <span>Catégorie: ${this.escapeHtml(
            post.category_name || "Aucune"
          )}</span>
          <span>Date: ${formatDate(post.created_at)}</span>
        </div>
      </div>
    `;
  }

  /**
   * Render multiple posts
   * @param {Array} posts - Array of posts
   */
  renderPosts(posts) {
    if (!this.container) return;

    if (!posts || posts.length === 0) {
      this.container.innerHTML = "<p>Aucun post disponible.</p>";
      return;
    }

    this.container.innerHTML = posts
      .map((post) => this.renderPost(post))
      .join("");
  }

  /**
   * Show error message in container
   * @param {string} message - Error message
   */
  showError(message = "Erreur lors du chargement des posts.") {
    if (this.container) {
      this.container.innerHTML = `<p class="error">${this.escapeHtml(
        message
      )}</p>`;
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    if (this.container) {
      this.container.innerHTML = "<p>Chargement des posts...</p>";
    }
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
