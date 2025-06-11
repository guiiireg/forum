import {
  createPostElement,
  createPostForm,
  createCategoryFilter,
} from "./postsUI.js";
import {
  handleEditPost,
  saveEditPost,
  handleDeletePost,
  handleVote,
  handleCreatePost,
} from "./postActions.js";

export async function initializePosts() {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const postsContainer = document.getElementById("posts-container");
  const createPostContainer = document.getElementById("create-post-container");

  if (!userId || !username) {
    createPostContainer.innerHTML =
      '<p>Vous devez être <a href="login.html">connecté</a> pour créer un post.</p>';
  } else {
    createPostContainer.innerHTML = createPostForm();
  }

  const categorySelect = document.getElementById("category");
  const categoryFilterSelect = document.getElementById(
    "category-filter-select"
  );

  async function loadCategories() {
    try {
      const response = await fetch("/categories");
      const data = await response.json();

      if (data.success) {
        if (categorySelect) {
          categorySelect.innerHTML =
            '<option value="">Sélectionnez une catégorie</option>';
          data.categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
          });
        }

        if (categoryFilterSelect) {
          categoryFilterSelect.innerHTML =
            '<option value="">Toutes les catégories</option>';
          data.categories.forEach((category) => {
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

  async function loadPosts(categoryId = null) {
    try {
      const url = categoryId ? `/posts/category/${categoryId}` : "/posts";
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        postsContainer.innerHTML = "";
        for (const post of data.posts) {
          const votes = await loadVotes(post.id);
          const isOwner = userId && parseInt(userId) === post.user_id;
          const postElement = document.createElement("div");
          postElement.innerHTML = createPostElement(post, isOwner, votes);
          postsContainer.appendChild(postElement);

          const upvoteBtn = postElement.querySelector(".upvote-button");
          const downvoteBtn = postElement.querySelector(".downvote-button");
          upvoteBtn.addEventListener("click", () =>
            handleVote(post.id, userId, 1)
          );
          downvoteBtn.addEventListener("click", () =>
            handleVote(post.id, userId, -1)
          );
        }

        window.handleEditPost = (postId) =>
          handleEditPost(postId, document.querySelector(`#post-${postId}`));
        window.handleDeletePost = async (postId) => {
          if (await handleDeletePost(postId, userId)) {
            loadPosts(categoryFilterSelect ? categoryFilterSelect.value : null);
          }
        };
        window.saveEditPost = async (postId) => {
          if (await saveEditPost(postId, userId)) {
            loadPosts(categoryFilterSelect ? categoryFilterSelect.value : null);
          }
        };
        window.cancelEditPost = (postId) => {
          const postElement = document.querySelector(`#post-${postId}`);
          const editForm = postElement.querySelector(".edit-form");
          if (editForm) {
            editForm.remove();
            const titleElement = postElement.querySelector(".post-title");
            const contentElement =
              postElement.querySelector(".post-content-text");
            const actionsElement = postElement.querySelector(".post-actions");
            titleElement.style.display = "";
            contentElement.style.display = "";
            actionsElement.style.display = "";
          }
        };
      }
    } catch (error) {
      console.error("Erreur lors du chargement des posts:", error);
      postsContainer.innerHTML = "<p>Erreur lors du chargement des posts.</p>";
    }
  }

  async function loadVotes(postId) {
    try {
      const response = await fetch(
        `/votes/${postId}${userId ? `?userId=${userId}` : ""}`
      );
      const data = await response.json();

      if (data.success) {
        return {
          totalVotes: data.totalVotes,
          userVote: data.userVote,
        };
      }
      return { totalVotes: 0, userVote: 0 };
    } catch (error) {
      console.error("Erreur lors du chargement des votes:", error);
      return { totalVotes: 0, userVote: 0 };
    }
  }

  if (categoryFilterSelect) {
    categoryFilterSelect.addEventListener("change", async () => {
      const selectedCategoryId = categoryFilterSelect.value;
      await loadPosts(selectedCategoryId || null);
    });
  }

  const createPostFormElement = document.getElementById("create-post-form");
  if (createPostFormElement) {
    createPostFormElement.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (await handleCreatePost(userId)) {
        loadPosts(categoryFilterSelect ? categoryFilterSelect.value : null);
      }
    });
  }

  await loadCategories();
  await loadPosts();
}
