document.addEventListener("DOMContentLoaded", function () {
  const lastUpdateElement = document.getElementById("last-update");
  if (lastUpdateElement) {
    lastUpdateElement.textContent = new Date().toLocaleDateString("fr-FR");
  }
});
