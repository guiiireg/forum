/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export function isAuthenticated() {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  return userId && username;
} 