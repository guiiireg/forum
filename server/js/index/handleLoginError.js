/**
 * Handle the login error
 * @param {Error} error - The error
 */
export function handleLoginError(error) {
  console.error("Error:", error);
  document.getElementById("error-message").textContent =
    "Error: " + error.message;
}
