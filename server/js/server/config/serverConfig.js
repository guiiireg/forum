import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

/**
 * Server Configuration
 */
export class ServerConfig {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);
    this.htmlDir = path.join(this.__dirname, "../../../html");
  }

  /**
   * Setup middleware
   */
  setupMiddleware() {
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || "votre_secret_tres_securise",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        },
      })
    );

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  /**
   * Setup static files
   */
  setupStaticFiles() {
    this.app.use(express.static(this.htmlDir));
    this.app.use("/js", express.static(path.join(this.__dirname, "../../")));
    this.app.use(
      "/css",
      express.static(path.join(this.__dirname, "../../../css"))
    );
  }

  /**
   * Get Express app instance
   */
  getApp() {
    return this.app;
  }

  /**
   * Get server port
   */
  getPort() {
    return this.port;
  }

  /**
   * Get HTML directory path
   */
  getHtmlDir() {
    return this.htmlDir;
  }
}
