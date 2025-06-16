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
