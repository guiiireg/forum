import path from "path";
import { requireAuth, requireGuest } from "../../middleware/authMiddleware.js";

export class PageRoutes {
  constructor(app, htmlDir) {
    this.app = app;
    this.htmlDir = htmlDir;
  }

  setupRoutes() {
    this.setupAuthPages();
    this.setupMainPages();
  }

  setupAuthPages() {
    this.app.get("/login", requireGuest, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "login.html"));
    });

    this.app.get("/register", requireGuest, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "register.html"));
    });
  }

  setupMainPages() {
    this.app.get("/", requireAuth, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "home.html"));
    });

    this.app.get("/posts", requireAuth, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "posts.html"));
    });

    this.app.get("/post/:id", requireAuth, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "post.html"));
    });

    this.app.get("/post.html", requireAuth, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "post.html"));
    });

    this.app.get("/profil", requireAuth, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "profil.html"));
    });

    this.app.get("/password", requireAuth, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "password.html"));
    });

    this.app.get("/privacy", requireAuth, (req, res) => {
      res.sendFile(path.join(this.htmlDir, "privacy.html"));
    });
  }
}
