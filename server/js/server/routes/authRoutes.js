import {
  registerUser,
  loginUser,
  logoutUser,
  getUserFromRequest,
} from "../../users.js";

export class AuthRoutes {
  constructor(app) {
    this.app = app;
  }

  setupRoutes() {
    this.setupRegisterRoute();
    this.setupLoginRoute();
    this.setupLogoutRoute();
    this.setupMeRoute();
  }

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

  setupLoginRoute() {
    this.app.post("/login", async (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Données invalides" });
      }

      const result = await loginUser(username, password, res);

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

  setupLogoutRoute() {
    this.app.post("/logout", (req, res) => {
      const result = logoutUser(res);
      res.json(result);
    });
  }

  setupMeRoute() {
    this.app.get("/api/auth/me", (req, res) => {
      const userData = getUserFromRequest(req);

      if (userData) {
        res.json({
          success: true,
          user: {
            id: userData.id,
            username: userData.username,
            uuid: userData.uuid,
          },
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Non authentifié",
        });
      }
    });
  }
}
