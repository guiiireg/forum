import { registerUser, loginUser } from "../../users.js";

/**
 * Authentication Routes Handler
 */
export class AuthRoutes {
  constructor(app) {
    this.app = app;
  }

  /**
   * Setup all authentication routes
   */
  setupRoutes() {
    this.setupRegisterRoute();
    this.setupLoginRoute();
  }

  /**
   * Setup register route
   */
  setupRegisterRoute() {
    this.app.post("/register", async (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Données invalides" });
      }

      const result = await registerUser(username, password);

      if (result.success) {
        res.json({ success: true, message: result.message });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    });
  }

  /**
   * Setup login route
   */
  setupLoginRoute() {
    this.app.post("/login", async (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Données invalides" });
      }

      const result = await loginUser(username, password);

      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          userId: result.userId,
          username: result.username,
        });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    });
  }
}
