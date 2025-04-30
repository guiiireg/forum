/**
 * Handle the registration error
 * @param {Error} error - The error
 */
export function handleRegistrationError(error) {
  console.error("Error:", error);
  document.getElementById("error-message").textContent =
    "Error: " + error.message;
  document.getElementById("success-message").textContent = "";
}
