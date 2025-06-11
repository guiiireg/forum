/**
 * Filtre les posts selon différents critères
 * @param {Array} posts - Liste des posts à filtrer
 * @param {Object} filters - Critères de filtrage
 * @param {string} filters.category - Catégorie à filtrer
 * @param {string} filters.sortBy - Critère de tri (likes, messages, date)
 * @param {string} filters.order - Ordre de tri (asc, desc)
 * @returns {Array} Posts filtrés et triés
 */
export function filterPosts(posts, filters) {
  let filteredPosts = [...posts];

  if (filters.category && filters.category !== "all") {
    filteredPosts = filteredPosts.filter(
      (post) => post.category_id === filters.category
    );
  }

  switch (filters.sortBy) {
    case "likes":
      filteredPosts.sort((a, b) => {
        const likesA = a.likes || 0;
        const likesB = b.likes || 0;
        return filters.order === "asc" ? likesA - likesB : likesB - likesA;
      });
      break;
    case "messages":
      filteredPosts.sort((a, b) => {
        const messagesA = a.replies_count || 0;
        const messagesB = b.replies_count || 0;
        return filters.order === "asc"
          ? messagesA - messagesB
          : messagesB - messagesA;
      });
      break;
    case "date":
      filteredPosts.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return filters.order === "asc" ? dateA - dateB : dateB - dateA;
      });
      break;
  }

  return filteredPosts;
}

/**
 * Met à jour l'interface utilisateur avec les posts filtrés
 * @param {Array} posts - Posts filtrés à afficher
 */
export function updatePostsUI(posts) {
  const postsContainer = document.getElementById("posts-container");
  if (!postsContainer) return;

  postsContainer.innerHTML = posts
    .map(
      (post) => `
    <div class="post-card" data-post-id="${post.id}">
      <h3>${post.title}</h3>
      <div class="post-meta">
        <span class="category">${post.category_name}</span>
        <span class="likes">❤️ ${post.likes || 0}</span>
        <span class="replies">💬 ${post.replies_count || 0}</span>
        <span class="date">📅 ${new Date(
          post.created_at
        ).toLocaleDateString()}</span>
      </div>
      <p>${post.content.substring(0, 200)}...</p>
    </div>
  `
    )
    .join("");
}

/**
 * Initialise les écouteurs d'événements pour les filtres
 */
export function initializeFilters() {
  const filterForm = document.getElementById("filter-form");
  if (!filterForm) return;

  filterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(filterForm);
    const filters = {
      category: formData.get("category"),
      sortBy: formData.get("sortBy"),
      order: formData.get("order"),
    };

    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      if (data.success) {
        const filteredPosts = filterPosts(data.posts, filters);
        updatePostsUI(filteredPosts);
      }
    } catch (error) {
      console.error("Erreur lors du filtrage des posts:", error);
    }
  });
}
