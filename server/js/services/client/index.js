import { AuthGuard } from "../../lib/authGuard.js";
import { formHandlerService } from "./formHandlerService.js";
import { categoryManagerService } from "./categoryManagerService.js";
import { postManagerService } from "./postManagerService.js";

/**
 * Simplified Post Page Orchestrator
 */
export class PostPageOrchestrator {
  constructor() {
    this.currentUser = null;
  }

  /**
   * Initialize the post page with all services
   */
  async initialize() {
    this.currentUser = AuthGuard.setupAuthUI({
      containerIds: ["create-post-container"],
      formIds: ["create-post-form"],
    });

    if (!AuthGuard.requireAuth()) {
      return;
    }

    await Promise.all([
      this.setupFormHandler(),
      this.setupCategoryManager(),
      this.loadInitialData(),
      this.initializeFilters(),
    ]);
  }

  /**
   * Setup form handler
   */
  async setupFormHandler() {
    formHandlerService.setupCreatePostForm(this.currentUser, () =>
      postManagerService.reloadPosts()
    );
  }

  /**
   * Setup category manager
   */
  async setupCategoryManager() {
    categoryManagerService.setupCategoryFilter((categoryId) =>
      postManagerService.loadPosts(categoryId)
    );
  }

  /**
   * Load initial data
   */
  async loadInitialData() {
    await Promise.all([
      categoryManagerService.loadAndPopulateCategories(),
      postManagerService.loadPosts(),
    ]);
  }

  /**
   * Initialize filters (delegate to existing module)
   */
  async initializeFilters() {
    const { initializeFilters } = await import(
      "../../modules/posts/postsActions.js"
    );
    initializeFilters();
  }
}

export { formHandlerService } from "./formHandlerService.js";
export { categoryManagerService } from "./categoryManagerService.js";
export { postManagerService } from "./postManagerService.js";

export const postPageOrchestrator = new PostPageOrchestrator();
