/**
 * Submit the registration data to the server
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<Response>} The response from the server
 */
export async function submitRegistrationData(username, password) {
  return fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}
