export async function handleEditPost(postElement) {
  const titleElement = postElement.querySelector("h2");
  const contentElement = postElement.querySelector("p");
  const actionsElement = postElement.querySelector(".post-actions");

  const currentTitle = titleElement.textContent;
  const currentContent = contentElement.textContent;

  const categoriesResponse = await fetch("/categories");
  const categoriesData = await categoriesResponse.json();

  let categoriesOptions =
    '<option value="">Sélectionnez une catégorie</option>';
  if (categoriesData.success) {
    categoriesData.categories.forEach((category) => {
      categoriesOptions += `<option value="${category.id}">${category.name}</option>`;
    });
  }

  const editForm = document.createElement("div");
  editForm.className = "edit-form";
  editForm.innerHTML = `
    <div>
      <label for="edit-category">Catégorie :</label>
      <select id="edit-category">${categoriesOptions}</select>
    </div>
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

  titleElement.style.display = "none";
  contentElement.style.display = "none";
  if (actionsElement) actionsElement.style.display = "none";

  postElement.appendChild(editForm);
}

export async function saveEditPost(postId, userId) {
  const titleInput = document.getElementById("edit-title");
  const contentInput = document.getElementById("edit-content");
  const categoryInput = document.getElementById("edit-category");

  const newTitle = titleInput.value.trim();
  const newContent = contentInput.value.trim();
  const newCategoryId = categoryInput.value;

  if (!newTitle || !newContent) {
    alert("Le titre et le contenu sont requis.");
    return;
  }

  if (!newCategoryId) {
    alert("Veuillez sélectionner une catégorie.");
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
        userId: parseInt(userId),
        categoryId: parseInt(newCategoryId),
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      return true;
    } else {
      alert(data.message);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la modification:", error);
    alert("Une erreur est survenue lors de la modification.");
    return false;
  }
}

export async function handleDeletePost(postId, userId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) {
    return false;
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
      return true;
    } else {
      alert(data.message);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    alert("Une erreur est survenue lors de la suppression.");
    return false;
  }
}

export async function handleCreatePost(userId) {
  const categorySelect = document.getElementById("category");
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");

  const categoryId = categorySelect.value;
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Le titre et le contenu sont requis.");
    return false;
  }

  if (!categoryId) {
    alert("Veuillez sélectionner une catégorie.");
    return false;
  }

  try {
    const response = await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        userId: parseInt(userId),
        categoryId: parseInt(categoryId),
      }),
    });

    const data = await response.json();

    if (data.success) {
      alert(data.message);
      titleInput.value = "";
      contentInput.value = "";
      categorySelect.value = "";
      return true;
    } else {
      alert(data.message);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la création:", error);
    alert("Une erreur est survenue lors de la création du post.");
    return false;
  }
}

export async function handleVote(postId, userId, voteType) {
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
      body: JSON.stringify({
        postId: parseInt(postId),
        userId: parseInt(userId),
        voteType: parseInt(voteType),
      }),
    });

    const data = await response.json();

    if (data.success) {
      const voteContainer = document.getElementById(`vote-container-${postId}`);
      if (voteContainer) {
        const voteCount = voteContainer.querySelector(".vote-count");
        const upvoteBtn = voteContainer.querySelector(".upvote-button");
        const downvoteBtn = voteContainer.querySelector(".downvote-button");

        if (voteCount) voteCount.textContent = data.votes.totalVotes;

        upvoteBtn.classList.remove("upvoted");
        downvoteBtn.classList.remove("downvoted");

        if (data.votes.userVote === 1) {
          upvoteBtn.classList.add("upvoted");
        } else if (data.votes.userVote === -1) {
          downvoteBtn.classList.add("downvoted");
        }
      }
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    alert("Une erreur est survenue lors du vote.");
  }
}
