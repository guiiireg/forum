import { isAuthenticated } from "./isAuthenticated.js";
import { requiresAuth } from "./requiresAuth.js";

/**
 * Check authentication and redirect if necessary
 */
export function checkAuth() {
  console.log("Checking authentication...");
  console.log("Is authenticated:", isAuthenticated());
  console.log("Requires auth:", requiresAuth());
  
  if (requiresAuth() && !isAuthenticated()) {
    console.log("Redirecting to login page...");
    window.location.href = "/login.html";
  }
} 