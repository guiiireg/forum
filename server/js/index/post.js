document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const postId = new URLSearchParams(window.location.search).get("id");

  if (!postId) {
    window.location.href = "home.html";
    return;
  }

  const postContainer = document.getElementById("post-container");
  const repliesContainer = document.getElementById("replies-container");
  const replyFormContainer = document.getElementById("reply-form-container");

  async function loadPost() {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();

      if (data.success) {
        const post = data.post;
        postContainer.innerHTML = `
          <div class="post">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <div class="post-meta">
              <span>Par: ${post.username}</span>
              <span>Date: ${new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
        `;
      } else {
        postContainer.innerHTML = "<p>Post non trouvé.</p>";
      }
    } catch (error) {
      console.error("Erreur lors du chargement du post:", error);
      postContainer.innerHTML = "<p>Erreur lors du chargement du post.</p>";
    }
  }

  async function loadReplies() {
    try {
      const response = await fetch(`/api/replies/${postId}`);
      const data = await response.json();

      if (data.success) {
        if (data.replies.length > 0) {
          repliesContainer.innerHTML = `
            <h3>Réponses (${data.replies.length})</h3>
            <div class="replies-list">
              ${data.replies
                .map(
                  (reply) => `
                  <div class="reply">
                    <p>${reply.content}</p>
                    <div class="reply-meta">
                      <span>Par: ${reply.username}</span>
                      <span>Date: ${new Date(
                        reply.created_at
                      ).toLocaleString()}</span>
                    </div>
                  </div>
                `
                )
                .join("")}
            </div>
          `;
        } else {
          repliesContainer.innerHTML = "<p>Aucune réponse pour le moment.</p>";
        }
      } else {
        repliesContainer.innerHTML = "<p>Erreur lors du chargement des réponses.</p>";
      }
    } catch (error) {
      console.error("Erreur lors du chargement des réponses:", error);
      repliesContainer.innerHTML = "<p>Erreur lors du chargement des réponses.</p>";
    }
  }

  function createReplyForm() {
    if (!userId) {
      replyFormContainer.innerHTML =
        '<p>Vous devez être <a href="login.html">connecté</a> pour répondre.</p>';
      return;
    }

    const form = document.createElement("form");
    form.className = "reply-form";
    form.innerHTML = `
      <textarea class="reply-content" placeholder="Votre réponse..." required></textarea>
      <button type="submit" class="reply-button">Répondre</button>
    `;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const content = form.querySelector(".reply-content").value;

      try {
        const response = await fetch("/api/replies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content, postId, userId }),
        });

        const data = await response.json();

        if (data.success) {
          form.querySelector(".reply-content").value = "";
          loadReplies();
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Erreur lors de la création de la réponse:", error);
        alert("Une erreur est survenue lors de la création de la réponse.");
      }
    });

    replyFormContainer.appendChild(form);
  }

  await loadPost();
  await loadReplies();
  createReplyForm();
}); 