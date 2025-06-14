import db from "../database.js";
import { BaseModel } from "../lib/base.js";

class CategoryService extends BaseModel {
  constructor() {
    super("categories");
  }

  /**
   * Get the "Autres" category ID (fallback category)
   * @returns {Promise<number|null>} The "Autres" category ID
   */
  async getAutresCategoryId() {
    try {
      const category = await db.get(
        "SELECT id FROM categories WHERE name = 'Autres'"
      );
      return category?.id || null;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la catégorie 'Autres':",
        error
      );
      return null;
    }
  }

  /**
   * Validate category ID and return valid category or fallback
   * @param {number|null} categoryId - The category ID to validate
   * @returns {Promise<number>} Valid category ID
   */
  async validateCategoryId(categoryId) {
    if (!categoryId) {
      return await this.getAutresCategoryId();
    }

    const exists = await this.exists(categoryId);
    return exists ? categoryId : await this.getAutresCategoryId();
  }

  /**
   * Get all categories
   * @returns {Promise<Object>} The categories
   */
  async getAll() {
    return this.executeQuery(async () => {
      const categories = await db.all(
        "SELECT * FROM categories ORDER BY name ASC"
      );
      return { categories };
    }, "la récupération des catégories");
  }

  /**
   * Get category by ID
   * @param {number} categoryId - The category ID
   * @returns {Promise<Object>} The category
   */
  async getById(categoryId) {
    return this.findById(categoryId);
  }
}

export const categoryService = new CategoryService();
