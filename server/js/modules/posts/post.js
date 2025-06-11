import { createPostElement } from "./postUI.js";
import {
  handleEditPost,
  saveEditPost,
  handleDeletePost,
} from "./postActions.js";
import { loadReplies, createReplyForm } from "./postReplies.js";

export async function initializePost() {
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
        const isOwner = userId && parseInt(userId) === post.user_id;
        postContainer.innerHTML = createPostElement(post, isOwner);

        window.handleEditPost = () =>
          handleEditPost(document.querySelector(".post"));
        window.handleDeletePost = async () => {
          if (await handleDeletePost(postId, userId)) {
            window.location.href = "posts.html";
          }
        };
        window.saveEditPost = async () => {
          if (await saveEditPost(postId, userId)) {
            loadPost();
          }
        };
        window.cancelEditPost = () => {
          const postElement = document.querySelector(".post");
          const editForm = postElement.querySelector(".edit-form");
          if (editForm) {
            editForm.remove();
            const titleElement = postElement.querySelector("h2");
            const contentElement = postElement.querySelector("p");
            const actionsElement = postElement.querySelector(".post-actions");
            titleElement.style.display = "";
            contentElement.style.display = "";
            if (actionsElement) actionsElement.style.display = "";
          }
        };
      } else {
        postContainer.innerHTML = "<p>Post non trouvé.</p>";
      }
    } catch (error) {
      console.error("Erreur lors du chargement du post:", error);
      postContainer.innerHTML = "<p>Erreur lors du chargement du post.</p>";
    }
  }

  async function initializeReplies() {
    repliesContainer.innerHTML = await loadReplies(postId);
    const replyForm = createReplyForm(userId, postId);
    if (typeof replyForm === "string") {
      replyFormContainer.innerHTML = replyForm;
    } else {
      replyFormContainer.appendChild(replyForm);
    }
  }

  await loadPost();
  await initializeReplies();
}
