import { submitRegistrationData } from './submitRegistrationData.js';
import { displayRegistrationResult } from './displayRegistrationResult.js';
import { handleRegistrationError } from './handleRegistrationError.js';

/**
 * Handle the registration form submission
 * @param {Event} e - The form submission event
 */
export async function handleRegistration(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await submitRegistrationData(username, password);
    const data = await response.json();
    displayRegistrationResult(data);
  } catch (error) {
    handleRegistrationError(error);
  }
}
