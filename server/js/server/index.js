import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";

import { PageRoutes } from "./routes/pageRoutes.js";
import { AuthRoutes } from "./routes/authRoutes.js";
import { PostRoutes } from "./routes/posts/index.js";
import { VoteRoutes } from "./routes/voteRoutes.js";
import { ReplyRoutes } from "./routes/replyRoutes.js";
import { CategoryRoutes } from "./routes/categoryRoutes.js";
import { ErrorRoutes } from "./routes/errorRoutes.js";

/**
 * Server Configuration and Orchestrator - Manages all server components
 */
class ServerOrchestrator {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);
    this.htmlDir = path.join(this.__dirname, "../../html");
  }

  /**
   * Initialize the complete server
   */
  async initialize() {
    this.setupConfiguration();
    this.setupAllRoutes();
    await this.setupErrorHandling();
    this.startServer();
  }

  /**
   * Setup server configuration
   */
  setupConfiguration() {
    this.setupMiddleware();
    this.setupStaticFiles();
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
    this.app.use("/js", express.static(path.join(this.__dirname, "../")));
    this.app.use(
      "/css",
      express.static(path.join(this.__dirname, "../../css"))
    );
  }

  /**
   * Setup all route handlers
   */
  setupAllRoutes() {
    const pageRoutes = new PageRoutes(this.app, this.htmlDir);
    const authRoutes = new AuthRoutes(this.app);
    const postRoutes = new PostRoutes(this.app);
    const voteRoutes = new VoteRoutes(this.app);
    const replyRoutes = new ReplyRoutes(this.app);
    const categoryRoutes = new CategoryRoutes(this.app);

    pageRoutes.setupRoutes();
    authRoutes.setupRoutes();
    postRoutes.setupRoutes();
    voteRoutes.setupRoutes();
    replyRoutes.setupRoutes();
    categoryRoutes.setupRoutes();
  }

  /**
   * Setup error handling (must be last)
   */
  async setupErrorHandling() {
    const errorRoutes = new ErrorRoutes(this.app, this.htmlDir);
    await errorRoutes.setupErrorHandling();
  }

  /**
   * Start the server
   */
  startServer() {
    this.app.listen(this.port, () => {
      console.log(
        "\x1b[36m%s\x1b[0m",
        `Server is running on port ${this.port}`
      );
    });
  }
}

const server = new ServerOrchestrator();
server.initialize();

export default server;
