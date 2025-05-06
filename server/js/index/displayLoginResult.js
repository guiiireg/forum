/**
 * Display the login result
 * @param {Object} data - The data from the server
 */
export function displayLoginResult(data) {
  if (data.success) {
    window.location.href = "/";
  } else {
    document.getElementById("error-message").textContent = data.message;
  }
}
