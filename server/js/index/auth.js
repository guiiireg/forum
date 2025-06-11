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
  const fullPath = window.location.pathname;
  const currentPage = fullPath.split("/").pop() || "index.html";
  const publicPages = ["login.html", "register.html"];
  return !publicPages.includes(currentPage);
}

/**
 * Check authentication and redirect if necessary
 */
export function checkAuth() {
  if (requiresAuth() && !isAuthenticated()) {
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
