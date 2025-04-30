import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { registerUser, loginUser } from "./users.js";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(htmlDir));

/**
 * Register a user
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object
 */
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Invalid data" });
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
    return res.status(400).json({ success: false, message: "Invalid data" }); 
  }
  const result = await loginUser(username, password);
  if (result.success) {
    res.json({ success: true, message: result.message });
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
