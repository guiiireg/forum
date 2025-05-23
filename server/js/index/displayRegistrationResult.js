import { redirectAfterDelay } from "./redirectAfterDelay.js";

/**
 * Display the registration result
 * @param {Object} data - The data from the server
 */
export function displayRegistrationResult(data) {
  if (data.success) {
    document.getElementById("success-message").textContent = data.message;
    document.getElementById("error-message").textContent = "";
    redirectAfterDelay("/login", 2000);
  } else {
    document.getElementById("error-message").textContent = data.message;
    document.getElementById("success-message").textContent = "";
  }
}
