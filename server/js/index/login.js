document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const loginButton = document.getElementById("login-button");
  const logoutLink = document.getElementById("logout-link");

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  if (userId && username) {
    if (logoutLink) {
      logoutLink.style.display = "block";
    }

    const mainElement = document.querySelector("main");
    if (mainElement && document.getElementById("login-form")) {
      const welcomeMessage = document.createElement("div");
      welcomeMessage.className = "welcome-message";
      welcomeMessage.textContent = `Connecté en tant que: ${username}`;
      welcomeMessage.style.marginBottom = "20px";
      welcomeMessage.style.fontWeight = "bold";
      mainElement.insertBefore(welcomeMessage, mainElement.firstChild);
    }
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();

      localStorage.removeItem("userId");
      localStorage.removeItem("username");

      window.location.href = "login.html";
    });
  }

  if (loginButton) {
    loginButton.addEventListener("click", async function () {
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

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
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          window.location.href = "home.html";
        } else {
          document.getElementById("error-message").textContent = data.message;
        }
      } catch (error) {
        document.getElementById("error-message").textContent =
          "Erreur de connexion";
        console.error("Erreur:", error);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

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
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          window.location.href = "home.html";
        } else {
          document.getElementById("error-message").textContent = data.message;
        }
      } catch (error) {
        document.getElementById("error-message").textContent =
          "Erreur de connexion";
        console.error("Erreur:", error);
      }
    });
  }
});
