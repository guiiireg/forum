/**
 * Submit the login data to the server
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<Response>} The response from the server
 */
export async function submitLoginData(username, password) {
  return fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
}
