export async function handleEditPost(postId, postElement) {
  const titleElement = postElement.querySelector(".post-title");
  const contentElement = postElement.querySelector(".post-content-text");
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
      <label for="edit-category-${postId}">Catégorie :</label>
      <select id="edit-category-${postId}">${categoriesOptions}</select>
    </div>
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

  titleElement.style.display = "none";
  contentElement.style.display = "none";
  actionsElement.style.display = "none";

  postElement.querySelector(".post-content").appendChild(editForm);
}

export async function saveEditPost(postId, userId) {
  const titleInput = document.getElementById(`edit-title-${postId}`);
  const contentInput = document.getElementById(`edit-content-${postId}`);
  const categoryInput = document.getElementById(`edit-category-${postId}`);

  const newTitle = titleInput.value.trim();
  const newContent = contentInput.value.trim();
  const newCategoryId = categoryInput.value;

  if (!newTitle || !newContent) {
    alert("Le titre et le contenu sont requis.");
    return false;
  }

  if (!newCategoryId) {
    alert("Veuillez sélectionner une catégorie.");
    return false;
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

export async function handleVote(postId, userId, voteValue) {
  try {
    const response = await fetch(`/votes/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: parseInt(userId),
        vote: voteValue,
      }),
    });

    const data = await response.json();

    if (data.success) {
      const voteContainer = document.querySelector(`#vote-container-${postId}`);
      if (voteContainer) {
        const voteCount = voteContainer.querySelector(".vote-count");
        const upvoteButton = voteContainer.querySelector(".upvote-button");
        const downvoteButton = voteContainer.querySelector(".downvote-button");

        voteCount.textContent = data.votes.totalVotes;

        upvoteButton.classList.toggle("upvoted", data.votes.userVote === 1);
        downvoteButton.classList.toggle(
          "downvoted",
          data.votes.userVote === -1
        );
      }
      return true;
    } else {
      alert(data.message);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    alert("Une erreur est survenue lors du vote.");
    return false;
  }
}

export async function handleCreatePost(userId) {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const categoryInput = document.getElementById("category");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const categoryId = categoryInput.value;

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
      categoryInput.value = "";
      return true;
    } else {
      alert(data.message);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    alert("Une erreur est survenue lors de la création du post.");
    return false;
  }
}
