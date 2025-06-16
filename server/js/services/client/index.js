import { AuthGuard } from "../../modules/auth/authGuard.js";
import { formHandlerService } from "./formHandlerService.js";
import { categoryManagerService } from "./categoryManagerService.js";
import { postManagerService } from "./postManagerService.js";

export class PostPageOrchestrator {
  constructor() {
    this.currentUser = null;
  }

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

  async setupFormHandler() {
    formHandlerService.setupCreatePostForm(this.currentUser, () =>
      postManagerService.reloadPosts()
    );
  }

  async setupCategoryManager() {
    categoryManagerService.setupCategoryFilter((categoryId) =>
      postManagerService.loadPosts(categoryId)
    );
  }

  async loadInitialData() {
    await Promise.all([
      categoryManagerService.loadAndPopulateCategories(),
      postManagerService.loadPosts(),
    ]);
  }

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
