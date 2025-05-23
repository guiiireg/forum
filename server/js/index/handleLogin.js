import { submitLoginData } from "./submitLoginData.js";
import { displayLoginResult } from "./displayLoginResult.js";
import { handleLoginError } from "./handleLoginError.js";

/**
 * Handle the login form submission
 * @param {Event} e - The form submission event
 */
export async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const response = await submitLoginData(username, password);
    const data = await response.json();
    displayLoginResult(data);
  } catch (error) {
    handleLoginError(error);
  }
}
