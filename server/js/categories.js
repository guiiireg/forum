import { categoryService } from "./services/categoryService.js";

export async function getAllCategories() {
  return categoryService.getAll();
}

export async function getCategoryById(categoryId) {
  return categoryService.getById(categoryId);
}

export async function getAutresCategoryId() {
  return categoryService.getAutresCategoryId();
}
