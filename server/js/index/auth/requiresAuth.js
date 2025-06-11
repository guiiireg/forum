/**
 * Check if the current page requires authentication
 * @returns {boolean} True if the page requires authentication, false otherwise
 */
export function requiresAuth() {
  const fullPath = window.location.pathname;
  const currentPage = fullPath.split("/").pop() || "index.html";
  const publicPages = ["login.html", "register.html"];
  return !publicPages.includes(currentPage);
}
