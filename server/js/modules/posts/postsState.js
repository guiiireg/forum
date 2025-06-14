import { getFormData, resetForm, populateSelect } from "../../lib/dom.js";
import { fetchCategories, fetchPosts, safeApiCall } from "../../lib/api.js";
import { handleCreatePost } from "./postsActions.js";

/**
 * Posts State Management
 */
export const postsState = {
  currentUser: null,
  posts: [],
  categories: [],
  currentFilters: {
    category: "",
    sortBy: "date",
    order: "desc",
  },
};

/**
 * Update posts state
 * @param {Array} posts - New posts array
 */
export function updatePostsState(posts) {
  postsState.posts = posts;
}

/**
 * Update categories state
 * @param {Array} categories - New categories array
 */
export function updateCategoriesState(categories) {
  postsState.categories = categories;
}

/**
 * Update current user state
 * @param {Object} user - Current user object
 */
export function updateCurrentUserState(user) {
  postsState.currentUser = user;
}

/**
 * Update filters state
 * @param {Object} newFilters - New filter values
 */
export function updateFiltersState(newFilters) {
  postsState.currentFilters = { ...postsState.currentFilters, ...newFilters };
}

/**
 * Get current posts
 * @returns {Array} Current posts
 */
export function getCurrentPosts() {
  return postsState.posts;
}

/**
 * Get current categories
 * @returns {Array} Current categories
 */
export function getCurrentCategories() {
  return postsState.categories;
}

/**
 * Get current user
 * @returns {Object} Current user
 */
export function getCurrentUser() {
  return postsState.currentUser;
}

/**
 * Get current filters
 * @returns {Object} Current filters
 */
export function getCurrentFilters() {
  return postsState.currentFilters;
}

/**
 * Apply filters and sorting to posts
 * @param {Array} posts - Posts to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered posts
 */
export function applyFilters(posts, filters) {
  let filteredPosts = [...posts];

  if (filters.category && filters.category !== "") {
    filteredPosts = filteredPosts.filter(
      (post) => post.category_id == filters.category
    );
  }

  filteredPosts.sort((a, b) => {
    let valueA, valueB;

    switch (filters.sortBy) {
      case "likes":
        valueA = a.total_votes || 0;
        valueB = b.total_votes || 0;
        break;
      case "replies":
        valueA = a.reply_count || 0;
        valueB = b.reply_count || 0;
        break;
      case "date":
      default:
        valueA = new Date(a.created_at);
        valueB = new Date(b.created_at);
        break;
    }

    return filters.order === "asc"
      ? valueA > valueB
        ? 1
        : -1
      : valueA < valueB
      ? 1
      : -1;
  });

  return filteredPosts;
}

/**
 * Update filters
 * @param {Object} newFilters - New filter values
 * @returns {Object} Updated filters
 */
export function updateFilters(newFilters) {
  updateFiltersState(newFilters);
  return getCurrentFilters();
}

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

/**
 * Load categories and populate selects
 */
export async function loadCategories() {
  try {
    const result = await fetchCategories();

    if (result.success && result.categories) {
      updateCategoriesState(result.categories);

      const categorySelect = document.getElementById("category");
      const filterSelect = document.getElementById("category-filter-select");

      if (categorySelect) {
        populateSelect("category", result.categories);
        categorySelect.style.display = "block";
        categorySelect.style.visibility = "visible";
        categorySelect.style.opacity = "1";
        categorySelect.style.height = "auto";
        categorySelect.style.minHeight = "30px";
        categorySelect.style.backgroundColor = "white";
        categorySelect.style.border = "2px solid red";
      } else {
        console.warn("Element 'category' not found");
      }

      if (filterSelect) {
        populateSelect(
          "category-filter-select",
          result.categories,
          "Toutes les catégories"
        );
      } else {
        console.warn("Element 'category-filter-select' not found");
      }
    } else {
      console.error(
        "Failed to load categories:",
        result.message || "No categories data"
      );
      handleCategoryLoadError();
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    handleCategoryLoadError();
  }
}

/**
 * Handle category loading error
 */
function handleCategoryLoadError() {
  const selects = ["category", "category-filter-select"];
  selects.forEach((selectId) => {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = '<option value="">Erreur de chargement</option>';
    }
  });
}

/**
 * Load posts with current filters
 */
export async function loadPosts() {
  const result = await safeApiCall(() => fetchPosts(), "chargement des posts");

  if (result.success) {
    updatePostsState(result.posts);
    return result.posts;
  }
  return [];
}
