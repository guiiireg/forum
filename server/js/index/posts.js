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

  async function handleVote(postId, voteType) {
    if (!userId) {
      alert("Vous devez être connecté pour voter.");
      return;
    }

    try {
      const response = await fetch("/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, userId, voteType }),
      });

      const data = await response.json();

      if (data.success) {
        const voteContainer = document.querySelector(
          `#vote-container-${postId}`
        );
        if (voteContainer) {
          const voteCount = voteContainer.querySelector(".vote-count");
          const upvoteButton = voteContainer.querySelector(".upvote-button");
          const downvoteButton =
            voteContainer.querySelector(".downvote-button");

          voteCount.textContent = data.votes.totalVotes;

          upvoteButton.classList.toggle("upvoted", data.votes.userVote === 1);
          downvoteButton.classList.toggle(
            "downvoted",
            data.votes.userVote === -1
          );
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      alert("Une erreur est survenue lors du vote.");
    }
  }

  async function handleEditPost(postId) {
    const postElement = document.querySelector(`#post-${postId}`);
    const titleElement = postElement.querySelector('.post-title');
    const contentElement = postElement.querySelector('.post-content-text');
    const actionsElement = postElement.querySelector('.post-actions');
    
    const currentTitle = titleElement.textContent;
    const currentContent = contentElement.textContent;
    
    // Créer le formulaire d'édition
    const editForm = document.createElement('div');
    editForm.className = 'edit-form';
    editForm.innerHTML = `
      <div>
        <label for="edit-title-${postId}">Titre :</label>
        <input type="text" id="edit-title-${postId}" value="${currentTitle}" required />
      </div>
      <div>
        <label for="edit-content-${postId}">Contenu :</label>
        <textarea id="edit-content-${postId}" rows="4" required>${currentContent}</textarea>
      </div>
      <div class="edit-buttons">
        <button onclick="saveEditPost(${postId})">Sauvegarder</button>
        <button onclick="cancelEditPost(${postId})">Annuler</button>
      </div>
    `;
    
    // Masquer le contenu original et afficher le formulaire
    titleElement.style.display = 'none';
    contentElement.style.display = 'none';
    actionsElement.style.display = 'none';
    
    postElement.querySelector('.post-content').appendChild(editForm);
  }

  window.saveEditPost = async function(postId) {
    const titleInput = document.getElementById(`edit-title-${postId}`);
    const contentInput = document.getElementById(`edit-content-${postId}`);
    
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
        loadPosts(); // Recharger les posts
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
      alert("Une erreur est survenue lors de la modification.");
    }
  };

  window.cancelEditPost = function(postId) {
    const postElement = document.querySelector(`#post-${postId}`);
    const titleElement = postElement.querySelector('.post-title');
    const contentElement = postElement.querySelector('.post-content-text');
    const actionsElement = postElement.querySelector('.post-actions');
    const editForm = postElement.querySelector('.edit-form');
    
    // Remettre l'affichage normal
    titleElement.style.display = '';
    contentElement.style.display = '';
    actionsElement.style.display = '';
    editForm.remove();
  };

  async function handleDeletePost(postId) {
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
        loadPosts(); // Recharger les posts
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  }

  async function loadVotes(postId) {
    try {
      const response = await fetch(
        `/votes/${postId}${userId ? `?userId=${userId}` : ""}`
      );
      const data = await response.json();

      if (data.success) {
        return data;
      }
      return { totalVotes: 0, userVote: 0 };
    } catch (error) {
      console.error("Erreur lors du chargement des votes:", error);
      return { totalVotes: 0, userVote: 0 };
    }
  }

  async function loadPosts() {
    try {
      const response = await fetch("/posts");
      const data = await response.json();

      if (data.success && data.posts.length > 0) {
        postsContainer.innerHTML = "";
        
        for (const post of data.posts) {
          const votes = await loadVotes(post.id);
          
          const postElement = document.createElement("div");
          postElement.className = "post";
          postElement.id = `post-${post.id}`;
          
          // Créer les boutons d'édition et suppression seulement si l'utilisateur est le propriétaire
          const isOwner = userId && parseInt(userId) === post.user_id;
          const actionsHtml = isOwner ? `
            <div class="post-actions">
              <button onclick="handleEditPost(${post.id})" class="edit-btn">✏️ Modifier</button>
              <button onclick="handleDeletePost(${post.id})" class="delete-btn">🗑️ Supprimer</button>
            </div>
          ` : '';
          
          postElement.innerHTML = `
            <div class="vote-container" id="vote-container-${post.id}">
              <button class="vote-button upvote-button ${votes.userVote === 1 ? 'upvoted' : ''}">▲</button>
              <span class="vote-count">${votes.totalVotes}</span>
              <button class="vote-button downvote-button ${votes.userVote === -1 ? 'downvoted' : ''}">▼</button>
            </div>
            <div class="post-content">
              <h3 class="post-title"><a href="post.html?id=${post.id}">${post.title}</a></h3>
              <p class="post-content-text">${post.content}</p>
              <div class="post-meta">
                <span>Par: ${post.username}</span>
                <span>Date: ${new Date(post.created_at).toLocaleString()}</span>
              </div>
              ${actionsHtml}
            </div>
          `;
          
          postsContainer.appendChild(postElement);

          const upvoteBtn = postElement.querySelector('.upvote-button');
          const downvoteBtn = postElement.querySelector('.downvote-button');
          upvoteBtn.addEventListener('click', () => handleVote(post.id, 1));
          downvoteBtn.addEventListener('click', () => handleVote(post.id, -1));
        }
        
        // Rendre les fonctions globales pour les boutons
        window.handleEditPost = handleEditPost;
        window.handleDeletePost = handleDeletePost;
      } else {
        postsContainer.innerHTML = "<p>Aucun post disponible.</p>";
      }
    } catch (error) {
      postsContainer.innerHTML = "<p>Erreur lors du chargement des posts.</p>";
      console.error("Erreur:", error);
    }
  }

  loadPosts();
});
