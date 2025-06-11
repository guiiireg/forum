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

  async function handleEditPost() {
    const postElement = document.querySelector('.post');
    const titleElement = postElement.querySelector('h2');
    const contentElement = postElement.querySelector('p');
    const actionsElement = postElement.querySelector('.post-actions');
    
    const currentTitle = titleElement.textContent;
    const currentContent = contentElement.textContent;
    
    // Créer le formulaire d'édition
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
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
    `;
    
    // Masquer le contenu original et afficher le formulaire
    titleElement.style.display = 'none';
    contentElement.style.display = 'none';
    if (actionsElement) actionsElement.style.display = 'none';
    
    postElement.appendChild(editForm);
  }

  window.saveEditPost = async function() {
    const titleInput = document.getElementById('edit-title');
    const contentInput = document.getElementById('edit-content');
    
    const newTitle = titleInput.value.trim();
    const newContent = contentInput.value.trim();
    
    if (!newTitle || !newContent) {
      alert("Le titre et le contenu sont requis.");
      return;
    }
    
    try {
      const response = await fetch(`/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title: newTitle, 
          content: newContent, 
          userId: parseInt(userId) 
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        loadPost(); // Recharger le post
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      alert("Une erreur est survenue lors de la modification.");
    }
  };

  window.cancelEditPost = function() {
    const postElement = document.querySelector('.post');
    const titleElement = postElement.querySelector('h2');
    const contentElement = postElement.querySelector('p');
    const actionsElement = postElement.querySelector('.post-actions');
    const editForm = postElement.querySelector('.edit-form');
    
    // Remettre l'affichage normal
    titleElement.style.display = '';
    contentElement.style.display = '';
    if (actionsElement) actionsElement.style.display = '';
    editForm.remove();
  };

  async function handleDeletePost() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
      return;
    }
    
    try {
      const response = await fetch(`/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: parseInt(userId) }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        window.location.href = "posts.html"; // Rediriger vers la liste des posts
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  }

  async function loadPost() {
    try {
      const response = await fetch(`/api/posts/${postId}`);
      const data = await response.json();

      if (data.success) {
        const post = data.post;
        
        // Créer les boutons d'édition et suppression seulement si l'utilisateur est le propriétaire
        const isOwner = userId && parseInt(userId) === post.user_id;
        const actionsHtml = isOwner ? `
          <div class="post-actions">
            <button onclick="handleEditPost()" class="edit-btn">✏️ Modifier</button>
            <button onclick="handleDeletePost()" class="delete-btn">🗑️ Supprimer</button>
          </div>
        ` : '';
        
        postContainer.innerHTML = `
          <div class="post">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <div class="post-meta">
              <span>Par: ${post.username}</span>
              <span>Date: ${new Date(post.created_at).toLocaleString()}</span>
            </div>
            ${actionsHtml}
          </div>
        `;
        
        // Rendre les fonctions globales pour les boutons
        window.handleEditPost = handleEditPost;
        window.handleDeletePost = handleDeletePost;
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