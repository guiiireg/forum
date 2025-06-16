import { fetchCategories, fetchPosts, safeApiCall } from "../../core/api.js";
import { populateSelect } from "../../core/dom.js";
import { updateCategoriesState, updatePostsState } from "./postsState.js";

export async function loadCategories() {
  try {
    const result = await fetchCategories();

    if (result.success && result.categories) {
      updateCategoriesState(result.categories);

      const categorySelect = document.getElementById("category");
      const filterSelect = document.getElementById("category-filter-select");

      if (categorySelect) {
        populateSelect("category", result.categories);
        categorySelect.style.display = "block";
        categorySelect.style.visibility = "visible";
        categorySelect.style.opacity = "1";
        categorySelect.style.height = "auto";
        categorySelect.style.minHeight = "30px";
        categorySelect.style.backgroundColor = "white";
        categorySelect.style.border = "2px solid red";
      } else {
        console.warn("Element 'category' not found");
      }

      if (filterSelect) {
        populateSelect(
          "category-filter-select",
          result.categories,
          "Toutes les catégories"
        );
      } else {
        console.warn("Element 'category-filter-select' not found");
      }
    } else {
      console.error(
        "Failed to load categories:",
        result.message || "No categories data"
      );
      handleCategoryLoadError();
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    handleCategoryLoadError();
  }
}

function handleCategoryLoadError() {
  const selects = ["category", "category-filter-select"];
  selects.forEach((selectId) => {
    const select = document.getElementById(selectId);
    if (select) {
      select.innerHTML = '<option value="">Erreur de chargement</option>';
    }
  });
}

export async function loadPosts() {
  const result = await safeApiCall(() => fetchPosts(), "chargement des posts");

  if (result.success) {
    updatePostsState(result.posts);
    return result.posts;
  }
  return [];
}
