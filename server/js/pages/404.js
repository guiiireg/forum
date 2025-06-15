/**
 * 404 Error Page - JavaScript functionality for the 404 error page
 */

import { initAuth } from "../core/auth.js";
import { initSidebarToggle } from "../core/dom.js";

/**
 * Initialize search functionality from 404 page
 */
function initSearchFunctionality() {
  const search404Input = document.getElementById('search-404');
  const search404Btn = document.getElementById('search-404-btn');

  if (!search404Input || !search404Btn) return;

  function performSearch() {
    const query = search404Input.value.trim();
    if (query) {
      // Redirect to home page with search query
      window.location.href = `/?search=${encodeURIComponent(query)}`;
    }
  }

  search404Btn.addEventListener('click', performSearch);
  
  search404Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  // Auto-focus on search input
  search404Input.focus();
}

/**
 * Initialize the 404 error page
 */
function init404Page() {
  initAuth();
  initSidebarToggle();
  initSearchFunctionality();
}

document.addEventListener("DOMContentLoaded", init404Page); 