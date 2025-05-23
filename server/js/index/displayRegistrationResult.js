/**
 * Display the registration result
 * @param {Object} data - The data from the server
 */
export function displayRegistrationResult(data) {
  if (data.success) {
    document.getElementById("success-message").textContent = data.message;
    document.getElementById("error-message").textContent = "";
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.username);
    window.location.href = "home.html";
  } else {
    document.getElementById("error-message").textContent = data.message;
    document.getElementById("success-message").textContent = "";
  }
}
