import { initAuth, getCurrentUser } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";
import { fetchPost, fetchReplies, createReply } from "../core/api.js";

function getPostIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryId = urlParams.get("id");
  if (queryId) {
    return queryId;
  }

  const pathParts = window.location.pathname.split("/");
  const routeId = pathParts[pathParts.length - 1];
  if (routeId && routeId !== "post" && !routeId.includes(".html")) {
    return routeId;
  }

  return null;
}

function showLoading() {
  document.getElementById("loading-state").style.display = "block";
  document.getElementById("main-post").style.display = "none";
  document.getElementById("error-state").style.display = "none";
  document.getElementById("replies-section").style.display = "none";
}

function showError() {
  document.getElementById("loading-state").style.display = "none";
  document.getElementById("main-post").style.display = "none";
  document.getElementById("error-state").style.display = "block";
  document.getElementById("replies-section").style.display = "none";
}

function showPost() {
  document.getElementById("loading-state").style.display = "none";
  document.getElementById("main-post").style.display = "block";
  document.getElementById("error-state").style.display = "none";
  document.getElementById("replies-section").style.display = "block";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function populatePostData(post) {
  document.getElementById("post-title").textContent = post.title;
  document.getElementById("post-category").textContent =
    post.category_name || "Non classé";
  document.getElementById("post-author").textContent =
    post.username || "Anonyme";
  document.getElementById("post-date").textContent = formatDate(
    post.created_at
  );
  document.getElementById("post-content").textContent = post.content;

  document.getElementById("likes-count").textContent = `${
    post.total_votes || 0
  } likes`;
  document.getElementById("replies-count").textContent = `${
    post.reply_count || 0
  } réponses`;
  document.getElementById("views-count").textContent = `${
    post.views || 0
  } vues`;

  document.getElementById("vote-count").textContent = post.total_votes || 0;

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === post.user_id) {
    document.getElementById("post-actions").style.display = "flex";
  }
}

async function loadPost(postId) {
  try {
    console.log("Loading post with ID:", postId);
    showLoading();

    const response = await fetchPost(postId);
    console.log("API response:", response);

    if (response.success && response.post) {
      populatePostData(response.post);
      showPost();

      await loadReplies(postId);
    } else {
      console.error("Failed to load post:", response.message);
      showError();
    }
  } catch (error) {
    console.error("Error loading post:", error);
    showError();
  }
}

async function loadReplies(postId) {
  try {
    console.log("Loading replies for post:", postId);
    const response = await fetchReplies(postId);
    console.log("Replies API response:", response);

    if (response.success && response.replies && response.replies.length > 0) {
      renderReplies(response.replies);
      document.getElementById("no-replies").style.display = "none";
    } else {
      document.getElementById("no-replies").style.display = "block";
    }
  } catch (error) {
    console.error("Error loading replies:", error);
    document.getElementById("no-replies").style.display = "block";
  }
}

function renderReplies(replies) {
  const repliesContainer = document.getElementById("replies-container");
  if (!repliesContainer) return;

  repliesContainer.innerHTML = replies
    .map(
      (reply) => `
    <div class="post reply" data-reply-id="${reply.id}">
      <div class="post-content">
        <div class="post-meta">
          <span class="post-stat">
            <i class="fas fa-user"></i>
            <span>${reply.username || "Utilisateur"}</span>
          </span>
          <span class="post-stat">
            <i class="fas fa-clock"></i>
            <span>${formatDate(reply.created_at)}</span>
          </span>
        </div>
        <div class="post-description">
          ${escapeHtml(reply.content)}
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function initReplyFormFunctionality() {
  console.log("Initializing reply form functionality...");

  const addReplyBtn = document.getElementById("add-reply-btn");
  const firstReplyBtn = document.getElementById("first-reply-btn");
  const replySection = document.getElementById("reply-section");
  const cancelReplyBtn = document.getElementById("cancel-reply");
  const replyContentTextarea = document.getElementById("reply-content");
  const replyCharCount = document.getElementById("reply-char-count");
  const replyForm = document.getElementById("reply-form");

  console.log("Reply form elements found:", {
    addReplyBtn: !!addReplyBtn,
    firstReplyBtn: !!firstReplyBtn,
    replySection: !!replySection,
    cancelReplyBtn: !!cancelReplyBtn,
    replyContentTextarea: !!replyContentTextarea,
    replyCharCount: !!replyCharCount,
    replyForm: !!replyForm,
  });

  [addReplyBtn, firstReplyBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        replySection.style.display = "block";
        replySection.scrollIntoView({ behavior: "smooth" });
        if (replyContentTextarea) {
          replyContentTextarea.focus();
        }
      });
    }
  });

  if (cancelReplyBtn) {
    cancelReplyBtn.addEventListener("click", () => {
      replySection.style.display = "none";
      if (replyForm) {
        replyForm.reset();
      }
      if (replyCharCount) {
        replyCharCount.textContent = "0";
      }
    });
  }

  if (replyContentTextarea && replyCharCount) {
    replyContentTextarea.addEventListener("input", () => {
      const count = replyContentTextarea.value.length;
      replyCharCount.textContent = count;

      if (count > 1000) {
        replyCharCount.style.color = "var(--error-color)";
      } else if (count > 900) {
        replyCharCount.style.color = "var(--warning-color)";
      } else {
        replyCharCount.style.color = "var(--text-secondary)";
      }
    });
  }

  if (replyForm) {
    replyForm.addEventListener("submit", async (e) => {
      console.log("Reply form submitted!");
      e.preventDefault();

      const content = replyContentTextarea.value.trim();
      console.log("Reply content:", content);

      if (!content) {
        showReplyMessage(
          "Veuillez saisir un contenu pour votre réponse.",
          "error"
        );
        return;
      }

      const postId = getPostIdFromURL();
      console.log("Post ID for reply:", postId);

      if (!postId) {
        showReplyMessage("Impossible de déterminer l'ID du post.", "error");
        return;
      }

      try {
        showReplyMessage("Publication en cours...", "info");

        const currentUser = getCurrentUser();
        console.log("Current user:", currentUser);

        if (!currentUser.id) {
          showReplyMessage("Vous devez être connecté pour répondre.", "error");
          return;
        }

        const replyData = {
          content: content,
          postId: parseInt(postId),
          userId: currentUser.id,
        };
        console.log("Sending reply data:", replyData);

        const response = await createReply(replyData);
        console.log("API response:", response);

        if (response.success) {
          showReplyMessage("Réponse publiée avec succès !", "success");
          replyForm.reset();
          replyCharCount.textContent = "0";

          setTimeout(() => {
            loadReplies(postId);
          }, 1000);
        } else {
          showReplyMessage(
            response.message || "Erreur lors de la publication.",
            "error"
          );
        }
      } catch (error) {
        console.error("Error submitting reply:", error);
        showReplyMessage(
          "Une erreur est survenue lors de la publication.",
          "error"
        );
      }
    });
  } else {
    console.error("Reply form not found!");
  }
}

function showReplyMessage(message, type) {
  const messageContainer = document.getElementById("reply-message");
  if (messageContainer) {
    messageContainer.innerHTML = `<div class="message ${type}">${message}</div>`;

    if (type === "success" || type === "info") {
      setTimeout(() => {
        messageContainer.innerHTML = "";
      }, 5000);
    }
  }
}

function initEditModalFunctionality() {
  const editModal = document.getElementById("edit-modal");
  const editPostBtn = document.getElementById("edit-post-btn");
  const closeModalBtn = document.querySelector(".close");
  const cancelModalBtn = document.querySelector(".cancel-btn");

  if (editPostBtn) {
    editPostBtn.addEventListener("click", () => {
      editModal.style.display = "block";
    });
  }

  [closeModalBtn, cancelModalBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        editModal.style.display = "none";
      });
    }
  });

  window.addEventListener("click", (e) => {
    if (e.target === editModal) {
      editModal.style.display = "none";
    }
  });
}

function initPostPage() {
  initAuth();
  initSidebarToggle();
  initReplyFormFunctionality();
  initEditModalFunctionality();

  const postId = getPostIdFromURL();
  console.log("Current URL:", window.location.href);
  console.log("Extracted post ID:", postId);

  if (postId) {
    loadPost(postId);
  } else {
    console.error("No post ID found in URL");
    showError();
  }
}

document.addEventListener("DOMContentLoaded", initPostPage);
