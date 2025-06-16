import db from "../database.js";
import { BaseModel } from "../models/base.js";

class CategoryService extends BaseModel {
  constructor() {
    super("categories");
  }

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

  async validateCategoryId(categoryId) {
    if (!categoryId) {
      return await this.getAutresCategoryId();
    }

    const exists = await this.exists(categoryId);
    return exists ? categoryId : await this.getAutresCategoryId();
  }

  async getAll() {
    return this.executeQuery(async () => {
      const categories = await db.all(
        "SELECT * FROM categories ORDER BY name ASC"
      );
      return { categories };
    }, "la récupération des catégories");
  }

  async getById(categoryId) {
    return this.findById(categoryId);
  }
}

export const categoryService = new CategoryService();
