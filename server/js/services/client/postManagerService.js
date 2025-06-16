import { apiService } from "../apiService.js";
import { PostRenderer } from "../../modules/ui/postRenderer.js";

export class PostManagerService {
  constructor() {
    this.postRenderer = new PostRenderer("posts-container");
    this.currentPosts = [];
    this.currentFilter = null;
  }

  async loadPosts(categoryId = null) {
    this.currentFilter = categoryId;
    this.postRenderer.showLoading();

    try {
      const result = categoryId
        ? await apiService.getPostsByCategory(categoryId)
        : await apiService.getAllPosts();

      if (result.success && result.data.success) {
        this.currentPosts = result.data.posts;
        this.postRenderer.renderPosts(this.currentPosts);
      } else {
        this.postRenderer.showError();
      }
    } catch (error) {
      console.error("Erreur lors du chargement des posts:", error);
      this.postRenderer.showError();
    }
  }

  async reloadPosts() {
    await this.loadPosts(this.currentFilter);
  }

  getCurrentPosts() {
    return this.currentPosts;
  }

  getCurrentFilter() {
    return this.currentFilter;
  }

  searchPosts(searchTerm) {
    if (!searchTerm.trim()) {
      this.postRenderer.renderPosts(this.currentPosts);
      return;
    }

    const filteredPosts = this.currentPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    this.postRenderer.renderPosts(filteredPosts);
  }

  sortPosts(sortBy = "date", order = "desc") {
    const sortedPosts = [...this.currentPosts].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case "title":
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case "author":
          valueA = a.username.toLowerCase();
          valueB = b.username.toLowerCase();
          break;
        case "date":
        default:
          valueA = new Date(a.created_at);
          valueB = new Date(b.created_at);
          break;
      }

      if (order === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    this.postRenderer.renderPosts(sortedPosts);
  }

  getPostCount() {
    return this.currentPosts.length;
  }

  clearPosts() {
    this.currentPosts = [];
    this.postRenderer.renderPosts([]);
  }
}

export const postManagerService = new PostManagerService();
