import { getAllCategories } from "../../categories.js";
import db from "../../database.js";

export class CategoryRoutes {
  constructor(app) {
    this.app = app;
  }

  setupRoutes() {
    this.setupGetAllCategories();
    this.setupTestRoute();
  }

  setupGetAllCategories() {
    this.app.get("/categories", async (req, res) => {
      const result = await getAllCategories();

      if (result.success) {
        res.json({ success: true, categories: result.categories });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    });
  }

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
