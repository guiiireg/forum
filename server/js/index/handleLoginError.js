/**
 * Handle the login error
 * @param {Error} error - The error
 */
export function handleLoginError(error) {
  console.error("Error:", error);
  document.getElementById("error-message").textContent =
    "Une erreur est survenue lors de la connexion";
}
