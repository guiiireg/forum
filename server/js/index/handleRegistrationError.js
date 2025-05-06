/**
 * Handle the registration error
 * @param {Error} error - The error
 */
export function handleRegistrationError(error) {
  console.error("Error:", error);
  document.getElementById("error-message").textContent =
    "Une erreur est survenue lors de l'inscription";
  document.getElementById("success-message").textContent = "";
}
