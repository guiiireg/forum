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

export function updatePostsState(posts) {
  postsState.posts = posts;
}

export function updateCategoriesState(categories) {
  postsState.categories = categories;
}

export function updateCurrentUserState(user) {
  postsState.currentUser = user;
}

export function updateFiltersState(newFilters) {
  postsState.currentFilters = { ...postsState.currentFilters, ...newFilters };
}

export function getCurrentPosts() {
  return postsState.posts;
}

export function getCurrentCategories() {
  return postsState.categories;
}

export function getCurrentUser() {
  return postsState.currentUser;
}

export function getCurrentFilters() {
  return postsState.currentFilters;
}
