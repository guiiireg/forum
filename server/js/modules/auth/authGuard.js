export class AuthGuard {
  static currentUser = null;
  static authChecked = false;

  static async getCurrentUser() {
    if (this.authChecked && this.currentUser) {
      return this.currentUser;
    }

    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        this.currentUser = data.user;
        this.authChecked = true;
        return this.currentUser;
      } else {
        this.currentUser = null;
        this.authChecked = true;
        return null;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      this.currentUser = null;
      this.authChecked = true;
      return null;
    }
  }

  static async isAuthenticated() {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  static async requireAuth(redirectUrl = "/login") {
    if (!(await this.isAuthenticated())) {
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  static showAuthRequired(
    elementId,
    message = 'Vous devez être <a href="login.html">connecté</a> pour cette action.'
  ) {
    const element = document.getElementById(elementId);
    if (element) {
      element.innerHTML = `<p>${message}</p>`;
    }
  }

  static async hideFormIfNotAuth(formId) {
    if (!(await this.isAuthenticated())) {
      const form = document.getElementById(formId);
      if (form) {
        form.style.display = "none";
      }
    }
  }

  static async setupAuthUI(config = {}) {
    const user = await this.getCurrentUser();
    const { containerIds = [], formIds = [], authRequiredMessage } = config;

    if (!user) {
      for (const formId of formIds) {
        await this.hideFormIfNotAuth(formId);
      }
      containerIds.forEach((containerId) =>
        this.showAuthRequired(containerId, authRequiredMessage)
      );
    }

    return user;
  }

  static async logout() {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        this.currentUser = null;
        this.authChecked = false;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return false;
    }
  }

  static clearCache() {
    this.currentUser = null;
    this.authChecked = false;
  }
}
