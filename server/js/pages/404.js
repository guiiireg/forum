import { initAuth } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";

function initSearchFunctionality() {
  const search404Input = document.getElementById("search-404");
  const search404Btn = document.getElementById("search-404-btn");

  if (!search404Input || !search404Btn) return;

  function performSearch() {
    const query = search404Input.value.trim();
    if (query) {
      window.location.href = `/?search=${encodeURIComponent(query)}`;
    }
  }

  search404Btn.addEventListener("click", performSearch);

  search404Input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  search404Input.focus();
}

function init404Page() {
  initAuth();
  initSidebarToggle();
  initSearchFunctionality();
}

document.addEventListener("DOMContentLoaded", init404Page);
