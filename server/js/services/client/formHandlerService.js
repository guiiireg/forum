import { apiService } from "../apiService.js";
import { MessageHandler } from "../../modules/ui/messageHandler.js";

export class FormHandlerService {
  constructor() {
    this.messageHandler = new MessageHandler("post-message");
  }

  setupCreatePostForm(currentUser, onSuccess) {
    const form = document.getElementById("create-post-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleCreatePost(currentUser, onSuccess);
    });
  }

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

  getFormData() {
    return {
      title: document.getElementById("title")?.value || "",
      content: document.getElementById("content")?.value || "",
      categoryId: document.getElementById("category")?.value || null,
    };
  }

  resetForm() {
    const form = document.getElementById("create-post-form");
    if (form) {
      form.reset();
    }
  }

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
