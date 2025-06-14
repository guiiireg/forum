import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

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
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
            scriptSrcAttr: ["'unsafe-inline'"],
          },
        },
      })
    );

    this.app.use(
      cors({
        origin: process.env.ALLOWED_ORIGINS
          ? process.env.ALLOWED_ORIGINS.split(",")
          : ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    this.app.use(
      session({
        secret: process.env.SESSION_SECRET || "votre_secret_tres_securise",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: "strict",
        },
      })
    );

    this.app.use((req, res, next) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("X-Frame-Options", "DENY");
      res.setHeader("X-XSS-Protection", "1; mode=block");
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );
      next();
    });

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
