import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../html/home.html"));
});

function startServer() {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer();
