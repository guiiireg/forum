import { initAuth } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";
import { initializePosts } from "../modules/posts/index.js";

function initCharacterCounter() {
  const contentTextarea = document.getElementById("content");
  const charCount = document.getElementById("char-count");

  if (!contentTextarea || !charCount) return;

  contentTextarea.addEventListener("input", () => {
    const count = contentTextarea.value.length;
    charCount.textContent = count;

    if (count > 2000) {
      charCount.style.color = "var(--error-color)";
    } else if (count > 1800) {
      charCount.style.color = "var(--warning-color)";
    } else {
      charCount.style.color = "var(--text-secondary)";
    }
  });
}

function initPreviewFunctionality() {
  const previewBtn = document.getElementById("preview-btn");
  const previewModal = document.getElementById("preview-modal");
  const closePreview = document.getElementById("close-preview");
  const closeModalBtn = document.querySelector(".close");

  if (!previewBtn || !previewModal) return;

  previewBtn.addEventListener("click", () => {
    const title = document.getElementById("title").value || "Titre du post";
    const content =
      document.getElementById("content").value || "Contenu du post...";
    const category =
      document.getElementById("category").selectedOptions[0]?.text ||
      "Catégorie";

    document.getElementById("preview-title").textContent = title;
    document.getElementById("preview-content").textContent = content;
    document.getElementById("preview-category").textContent = category;

    previewModal.style.display = "block";
  });

  [closePreview, closeModalBtn].forEach((btn) => {
    if (btn) {
      btn.addEventListener("click", () => {
        previewModal.style.display = "none";
      });
    }
  });

  window.addEventListener("click", (e) => {
    if (e.target === previewModal) {
      previewModal.style.display = "none";
    }
  });
}

function initPostsPage() {
  initAuth();
  initSidebarToggle();
  initCharacterCounter();
  initPreviewFunctionality();
  initializePosts();
}

document.addEventListener("DOMContentLoaded", initPostsPage);
