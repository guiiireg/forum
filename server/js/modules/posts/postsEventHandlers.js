import { getFormData, resetForm } from "../../core/dom.js";
import { updateFilters } from "./postsFilter.js";
import { handleCreatePost } from "./postsActions.js";

/**
 * Setup event listeners
 * @param {Function} onFilterUpdate - Callback when filters are updated
 * @param {Function} onPostCreate - Callback when post is created
 */
export function setupEventListeners(onFilterUpdate, onPostCreate) {
  setupFilterEventListeners(onFilterUpdate);
  setupCreatePostEventListener(onPostCreate);
}

/**
 * Setup filter-related event listeners
 * @param {Function} onFilterUpdate - Callback when filters are updated
 */
function setupFilterEventListeners(onFilterUpdate) {
  const filterForm = document.getElementById("filter-form");
  if (filterForm) {
    filterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = getFormData(filterForm);
      updateFilters(formData);
      if (onFilterUpdate) await onFilterUpdate();
    });
  }

  const resetBtn = document.getElementById("reset-filters-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      resetForm("filter-form");
      updateFilters({ category: "", sortBy: "date", order: "desc" });
      if (onFilterUpdate) await onFilterUpdate();
    });
  }

  const categorySelect = document.getElementById("category-filter-select");
  if (categorySelect) {
    categorySelect.addEventListener("change", async () => {
      updateFilters({ category: categorySelect.value });
      if (onFilterUpdate) await onFilterUpdate();
    });
  }
}

/**
 * Setup create post event listener
 * @param {Function} onPostCreate - Callback when post is created
 */
function setupCreatePostEventListener(onPostCreate) {
  setTimeout(() => {
    const createForm = document.getElementById("create-post-form");
    if (createForm) {
      createForm.addEventListener("submit", (e) =>
        handleCreatePost(e, onPostCreate)
      );
    }
  }, 100);
}
