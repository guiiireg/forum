import { apiService } from "../apiService.js";
import { MessageHandler } from "../../modules/ui/messageHandler.js";

/**
 * Form Handler Service - Manages form interactions and submissions
 */
export class FormHandlerService {
  constructor() {
    this.messageHandler = new MessageHandler("post-message");
  }

  /**
   * Setup create post form event listeners
   * @param {Object} currentUser - Current authenticated user
   * @param {Function} onSuccess - Callback for successful submission
   */
  setupCreatePostForm(currentUser, onSuccess) {
    const form = document.getElementById("create-post-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleCreatePost(currentUser, onSuccess);
    });
  }

  /**
   * Handle post creation form submission
   * @param {Object} currentUser - Current authenticated user
   * @param {Function} onSuccess - Callback for successful submission
   */
  async handleCreatePost(currentUser, onSuccess) {
    if (!currentUser) {
      this.messageHandler.error("Vous devez être connecté pour créer un post.");
      setTimeout(() => (window.location.href = "login.html"), 2000);
      return;
    }

    const formData = this.getFormData();
    const result = await apiService.createPost({
      ...formData,
      userId: currentUser.id,
    });

    if (result.success && result.data.success) {
      this.messageHandler.success(result.data.message);
      this.resetForm();
      if (onSuccess) onSuccess();
    } else {
      this.messageHandler.error(
        result.data.message || "Erreur lors de la création du post"
      );
    }
  }

  /**
   * Get form data from create post form
   * @returns {Object} Form data
   */
  getFormData() {
    return {
      title: document.getElementById("title")?.value || "",
      content: document.getElementById("content")?.value || "",
      categoryId: document.getElementById("category")?.value || null,
    };
  }

  /**
   * Reset the create post form
   */
  resetForm() {
    const form = document.getElementById("create-post-form");
    if (form) {
      form.reset();
    }
  }

  /**
   * Validate form data before submission
   * @param {Object} formData - Form data to validate
   * @returns {Object} Validation result
   */
  validateForm(formData) {
    const errors = [];

    if (!formData.title?.trim()) {
      errors.push("Le titre est requis");
    }

    if (!formData.content?.trim()) {
      errors.push("Le contenu est requis");
    }

    if (formData.title?.length > 200) {
      errors.push("Le titre ne peut pas dépasser 200 caractères");
    }

    if (formData.content?.length > 5000) {
      errors.push("Le contenu ne peut pas dépasser 5000 caractères");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const formHandlerService = new FormHandlerService();
