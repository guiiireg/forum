import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import session from "express-session";
import { registerUser, loginUser } from "./users.js";
import { createPost, getAllPosts, getPostsByUser } from "./posts.js";
import db from "./database.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requireAuth, requireGuest } from "./middleware/authMiddleware.js";

dotenv.config();

/**
 * Create the express app
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * Get the filename of the current file
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlDir = path.join(__dirname, "../html");

app.use(
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(htmlDir));
app.use("/js", express.static(path.join(__dirname)));
app.use("/css", express.static(path.join(__dirname, "../css")));

app.get("/", (req, res) => {
  res.sendFile(path.join(htmlDir, "home.html"));
});

app.get("/login", requireGuest, (req, res) => {
  res.sendFile(path.join(htmlDir, "login.html"));
});

app.get("/register", requireGuest, (req, res) => {
  res.sendFile(path.join(htmlDir, "register.html"));
});

app.get("/posts", requireAuth, (req, res) => {
  res.sendFile(path.join(htmlDir, "posts.html"));
});

app.get("/post/:id", requireAuth, (req, res) => {
  res.sendFile(path.join(htmlDir, "post.html"));
});

app.get("/profil", requireAuth, (req, res) => {
  res.sendFile(path.join(htmlDir, "profil.html"));
});

/**
 * Register a user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
app.post("/register", async (req, res) => {
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

/**
 * Login a user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
app.post("/login", async (req, res) => {
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

/**
 * Create a post
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
app.post("/posts", async (req, res) => {
  const { title, content, userId } = req.body;
  if (!title || !content || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Données invalides" });
  }

  try {
    const user = await db.get("SELECT id FROM users WHERE id = ?", [userId]);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Utilisateur non authentifié" });
    }

    const result = await createPost(title, content, userId);
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        postId: result.postId,
      });
    } else {
      res.status(400).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'utilisateur:", error);
    res
      .status(500)
      .json({ success: false, message: "Erreur interne du serveur" });
  }
});

/**
 * Get all posts
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
app.get("/posts", async (req, res) => {
  const result = await getAllPosts();
  if (result.success) {
    res.json({ success: true, posts: result.posts });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

/**
 * Get posts by user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
app.get("/posts/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const result = await getPostsByUser(userId);
  if (result.success) {
    res.json({ success: true, posts: result.posts });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

/**
 * Setup the routes
 */
async function setupRoutes() {
  try {
    const files = await fs.readdir(htmlDir);

    files.forEach((file) => {
      if (file.endsWith(".html")) {
        let route;
        if (file === "home.html") {
          route = "/";
        } else {
          route = `/${file.replace(".html", "")}`;
        }
        app.get(route, (req, res) => {
          res.sendFile(path.join(htmlDir, file));
        });
      }
    });

    app.use((req, res) => {
      res.status(404).sendFile(path.join(htmlDir, "404.html"));
    });

    app.use(errorHandler);
  } catch (error) {
    console.error("Error setting up routes:", error);
  }
}

/**
 * Start the server
 */
setupRoutes().then(() => {
  app.listen(port, () => {
    console.log("\x1b[36m%s\x1b[0m", `Server is running on port ${port}`);
  });
});
