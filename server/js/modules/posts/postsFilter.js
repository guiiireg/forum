import { updateFiltersState, getCurrentFilters } from "./postsState.js";

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
