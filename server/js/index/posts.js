import { initializeFilters } from "../modules/posts/postsActions.js";

document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const createPostForm = document.getElementById("create-post-form");
  const postsContainer = document.getElementById("posts-container");
  const postMessage = document.getElementById("post-message");
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

      try {
        const response = await fetch("/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content, userId }),
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
    window.location.href = "/login";
    return;
  }

  initializeFilters();

  loadPosts();
});

async function loadPosts() {
  try {
    const response = await fetch("/api/posts");
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
              <span>Date: ${new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
        `
        )
        .join("");
    } else {
      postsContainer.innerHTML = "<p>Aucun post disponible.</p>";
    }

    initializeFilters();
  } catch (error) {
    postsContainer.innerHTML = "<p>Erreur lors du chargement des posts.</p>";
    console.error("Erreur:", error);
  }
}
