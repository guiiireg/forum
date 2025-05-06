document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const loginButton = document.getElementById("login-button");
  const logoutLink = document.getElementById("logout-link");
  
  // Vérifier si l'utilisateur est connecté
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  
  if (userId && username) {
    // L'utilisateur est connecté, afficher le lien de déconnexion
    if (logoutLink) {
      logoutLink.style.display = "block";
    }
    
    // Ajouter un message de bienvenue si nous sommes sur la page de connexion
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
  
  // Gérer l'événement de déconnexion
  if (logoutLink) {
    logoutLink.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Supprimer les données utilisateur du localStorage
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      
      // Rediriger vers la page de connexion
      window.location.href = "login.html";
    });
  }

  // Ajout d'un event listener directement sur le bouton login
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

  // Logique de connexion existante pour la soumission du formulaire
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
