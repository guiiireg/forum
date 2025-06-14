import db from "../../database.js";
import { categoryService } from "../../services/categoryService.js";

/**
 * Category Routes Handler
 */
export class CategoryRoutes {
  constructor(app) {
    this.app = app;
  }

  /**
   * Setup all category routes
   */
  setupRoutes() {
    this.setupGetAllCategories();
    this.setupTestRoute();
  }

  /**
   * Get all categories
   * @returns {Promise<Object>} The categories
   */
  async getAllCategories() {
    return categoryService.getAll();
  }

  /**
   * Get category by ID
   * @param {number} categoryId - The category ID
   * @returns {Promise<Object>} The category
   */
  async getCategoryById(categoryId) {
    return categoryService.getById(categoryId);
  }

  /**
   * Get the "Autres" category ID
   * @returns {Promise<number>} The "Autres" category ID
   */
  async getAutresCategoryId() {
    return categoryService.getAutresCategoryId();
  }

  /**
   * Setup get all categories route
   */
  setupGetAllCategories() {
    this.app.get("/categories", async (req, res) => {
      const result = await this.getAllCategories();

      if (result.success) {
        res.json({ success: true, categories: result.categories });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    });
  }

  /**
   * Setup test route for users (for testing UUID generation)
   */
  setupTestRoute() {
    this.app.get("/test/users", async (req, res) => {
      try {
        const users = await db.all(
          "SELECT id, username, uuid, created_at FROM users"
        );
        res.json({ success: true, users });
      } catch (error) {
        console.error("Error fetching users:", error);
        res
          .status(500)
          .json({ success: false, message: "Error fetching users" });
      }
    });
  }
}
