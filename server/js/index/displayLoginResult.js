/**
 * Display the login result
 * @param {Object} data - The data from the server
 */
export function displayLoginResult(data) {
  if (data.success) {
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);

    window.location.href = "home.html";
  } else {
    document.getElementById("error-message").textContent = data.message;
  }
}
