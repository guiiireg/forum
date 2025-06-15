/**
 * Individual Post Page - JavaScript functionality for viewing and interacting with a specific post
 */

import { initAuth } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";

/**
 * Initialize reply form functionality
 */
function initReplyFormFunctionality() {
  const addReplyBtn = document.getElementById('add-reply-btn');
  const firstReplyBtn = document.getElementById('first-reply-btn');
  const replySection = document.getElementById('reply-section');
  const cancelReplyBtn = document.getElementById('cancel-reply');
  const replyContentTextarea = document.getElementById('reply-content');
  const replyCharCount = document.getElementById('reply-char-count');

  // Show reply form
  [addReplyBtn, firstReplyBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        replySection.style.display = 'block';
        replySection.scrollIntoView({ behavior: 'smooth' });
        if (replyContentTextarea) {
          replyContentTextarea.focus();
        }
      });
    }
  });

  // Hide reply form
  if (cancelReplyBtn) {
    cancelReplyBtn.addEventListener('click', () => {
      replySection.style.display = 'none';
      const replyForm = document.getElementById('reply-form');
      if (replyForm) {
        replyForm.reset();
      }
      if (replyCharCount) {
        replyCharCount.textContent = '0';
      }
    });
  }

  // Character counter for reply
  if (replyContentTextarea && replyCharCount) {
    replyContentTextarea.addEventListener('input', () => {
      const count = replyContentTextarea.value.length;
      replyCharCount.textContent = count;
      
      if (count > 1000) {
        replyCharCount.style.color = 'var(--error-color)';
      } else if (count > 900) {
        replyCharCount.style.color = 'var(--warning-color)';
      } else {
        replyCharCount.style.color = 'var(--text-secondary)';
      }
    });
  }
}

/**
 * Initialize edit modal functionality
 */
function initEditModalFunctionality() {
  const editModal = document.getElementById('edit-modal');
  const editPostBtn = document.getElementById('edit-post-btn');
  const closeModalBtn = document.querySelector('.close');
  const cancelModalBtn = document.querySelector('.cancel-btn');

  if (editPostBtn) {
    editPostBtn.addEventListener('click', () => {
      editModal.style.display = 'block';
    });
  }

  [closeModalBtn, cancelModalBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        editModal.style.display = 'none';
      });
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target === editModal) {
      editModal.style.display = 'none';
    }
  });
}

/**
 * Initialize the post page
 */
function initPostPage() {
  initAuth();
  initSidebarToggle();
  initReplyFormFunctionality();
  initEditModalFunctionality();
}

document.addEventListener("DOMContentLoaded", initPostPage); 