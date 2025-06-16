import { categoryService } from "./services/categoryService.js";

/**
 * Get all categories
 * @returns {Promise<Object>} The categories
 */
export async function getAllCategories() {
  return categoryService.getAll();
}

/**
 * Get category by ID
 * @param {number} categoryId - The category ID
 * @returns {Promise<Object>} The category
 */
export async function getCategoryById(categoryId) {
  return categoryService.getById(categoryId);
}

/**
 * Get the "Autres" category ID
 * @returns {Promise<number>} The "Autres" category ID
 */
export async function getAutresCategoryId() {
  return categoryService.getAutresCategoryId();
}
