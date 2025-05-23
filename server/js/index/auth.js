/**
 * Check if the user is authenticated
 * @returns {boolean} True if the user is authenticated, false otherwise
 */
export function isAuthenticated() {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  return userId && username;
}

/**
 * Check if the current page requires authentication
 * @returns {boolean} True if the page requires authentication, false otherwise
 */
export function requiresAuth() {
  // Get the full path and remove any query parameters
  const fullPath = window.location.pathname;
  console.log("Full path:", fullPath);
  
  // Get the last part of the path
  const currentPage = fullPath.split("/").pop() || "index.html";
  console.log("Current page:", currentPage);
  
  // List of pages that don't require authentication
  const publicPages = ["login.html", "register.html"];
  console.log("Is public page:", publicPages.includes(currentPage));
  
  return !publicPages.includes(currentPage);
}

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

/**
 * Update the UI based on authentication status
 */
export function updateAuthUI() {
  const logoutLink = document.getElementById("logout-link");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");
  
  if (isAuthenticated()) {
    if (logoutLink) logoutLink.style.display = "block";
    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";

    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        window.location.href = "/login.html";
      });
    }
  } else {
    if (logoutLink) logoutLink.style.display = "none";
    if (loginLink) loginLink.style.display = "block";
    if (registerLink) registerLink.style.display = "block";
  }
} 