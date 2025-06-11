import { isAuthenticated } from "./isAuthenticated.js";
import { requiresAuth } from "./requiresAuth.js";

/**
 * Check authentication and redirect if necessary
 */
export function checkAuth() {
  if (requiresAuth() && !isAuthenticated()) {
    window.location.href = "/login.html";
  }
}
