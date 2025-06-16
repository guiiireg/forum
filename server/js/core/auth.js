export function isAuthenticated() {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  return userId && username;
}

export function getCurrentUser() {
  if (!isAuthenticated()) return null;

  return {
    id: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
  };
}

export function setAuthData(userData) {
  localStorage.setItem("userId", userData.userId);
  localStorage.setItem("username", userData.username);
}

export function clearAuthData() {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
}

export function requiresAuth() {
  const fullPath = window.location.pathname;
  const currentPage = fullPath.split("/").pop() || "index.html";
  const publicPages = ["login.html", "register.html", "privacy.html"];
  return !publicPages.includes(currentPage);
}

export function checkAuth() {
  if (requiresAuth() && !isAuthenticated()) {
    window.location.href = "/login.html";
  }
}

export function updateAuthUI() {
  const logoutLink = document.getElementById("logout-link");
  const loginLink = document.getElementById("login-link");
  const registerLink = document.getElementById("register-link");

  if (isAuthenticated()) {
    if (logoutLink) {
      logoutLink.style.display = "block";
      logoutLink.replaceWith(logoutLink.cloneNode(true));
      const newLogoutLink = document.getElementById("logout-link");

      newLogoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }

    if (loginLink) loginLink.style.display = "none";
    if (registerLink) registerLink.style.display = "none";
  } else {
    if (logoutLink) logoutLink.style.display = "none";
    if (loginLink) loginLink.style.display = "block";
    if (registerLink) registerLink.style.display = "block";
  }
}

export function logout() {
  clearAuthData();
  window.location.href = "/login.html";
}

export async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("error-message");

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      setAuthData(data);
      window.location.href = "home.html";
    } else {
      if (errorElement) {
        errorElement.textContent = data.message;
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    if (errorElement) {
      errorElement.textContent = "Une erreur est survenue lors de la connexion";
    }
  }
}

export async function handleRegistration(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("error-message");
  const successElement = document.getElementById("success-message");

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      if (successElement) {
        successElement.textContent = data.message;
      }
      if (errorElement) {
        errorElement.textContent = "";
      }

      setAuthData(data);
      window.location.href = "home.html";
    } else {
      if (errorElement) {
        errorElement.textContent = data.message;
      }
      if (successElement) {
        successElement.textContent = "";
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    if (errorElement) {
      errorElement.textContent =
        "Une erreur est survenue lors de l'inscription";
    }
  }
}

export function initAuth() {
  checkAuth();
  updateAuthUI();

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegistration);
  }
}

export function showWelcomeMessage() {
  const user = getCurrentUser();
  if (user && document.getElementById("login-form")) {
    const mainElement = document.querySelector("main");
    if (mainElement) {
      const welcomeMessage = document.createElement("div");
      welcomeMessage.className = "welcome-message";
      welcomeMessage.textContent = `Connecté en tant que: ${user.username}`;
      welcomeMessage.style.marginBottom = "20px";
      welcomeMessage.style.fontWeight = "bold";
      mainElement.insertBefore(welcomeMessage, mainElement.firstChild);
    }
  }
}
