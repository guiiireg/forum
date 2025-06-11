import { initializeFilters } from '../modules/posts/postsActions.js';

let postsContainer;
let postMessage;

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const createPostForm = document.getElementById("create-post-form");
  postsContainer = document.getElementById("posts-container");
  postMessage = document.getElementById("post-message");
  const createPostContainer = document.getElementById("create-post-container");

  if (!userId || !username) {
    if (createPostContainer) {
      createPostContainer.innerHTML =
        '<p>Vous devez être <a href="login.html">connecté</a> pour créer un post.</p>';
    }

    if (createPostForm) {
      createPostForm.style.display = "none";
    }
  }

  if (createPostForm) {
    createPostForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!userId || !username) {
        postMessage.textContent =
          "Vous devez être connecté pour créer un post.";
        postMessage.style.color = "red";
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
        return;
      }

      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const categoryId = document.getElementById("category").value;

      try {
        const response = await fetch("/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content, userId, categoryId }),
        });

        const data = await response.json();

        if (data.success) {
          postMessage.textContent = data.message;
          postMessage.style.color = "green";
          createPostForm.reset();
          loadPosts();
        } else {
          postMessage.textContent = data.message;
          postMessage.style.color = "red";
        }
      } catch (error) {
        postMessage.textContent =
          "Une erreur est survenue lors de la création du post.";
        postMessage.style.color = "red";
        console.error("Erreur:", error);
      }
    });
  }

  if (!userId) {
    window.location.href = '/login';
    return;
  }

  loadCategories();
  loadPosts();
  initializeFilters();
  setupCategoryFilter();
});

async function loadCategories() {
  try {
    const response = await fetch("/categories");
    const data = await response.json();

    if (data.success) {
      const categorySelect = document.getElementById("category");
      if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Sélectionnez une catégorie</option>';
        data.categories.forEach(category => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      }

      const categoryFilterSelect = document.getElementById("category-filter-select");
      if (categoryFilterSelect) {
        categoryFilterSelect.innerHTML = '<option value="">Toutes les catégories</option>';
        data.categories.forEach(category => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categoryFilterSelect.appendChild(option);
        });
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement des catégories:", error);
  }
}

function setupCategoryFilter() {
  const categoryFilterSelect = document.getElementById("category-filter-select");
  if (categoryFilterSelect) {
    categoryFilterSelect.addEventListener("change", async () => {
      const selectedCategoryId = categoryFilterSelect.value || null;
      loadPosts(selectedCategoryId);
    });
  }
}

async function loadPosts(categoryId = null) {
  if (!postsContainer) return;
  
  try {
    const url = categoryId ? `/posts/category/${categoryId}` : "/api/posts";
    const response = await fetch(url);
    const data = await response.json();

    if (data.success && data.posts.length > 0) {
      postsContainer.innerHTML = data.posts
        .map(
          (post) => `
          <div class="post">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <div class="post-meta">
              <span>Par: ${post.username}</span>
              <span>Catégorie: ${post.category_name || 'Aucune'}</span>
              <span>Date: ${new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
        `
        )
        .join("");
    } else {
      postsContainer.innerHTML = "<p>Aucun post disponible.</p>";
    }
  } catch (error) {
    postsContainer.innerHTML = "<p>Erreur lors du chargement des posts.</p>";
    console.error("Erreur:", error);
  }
}
