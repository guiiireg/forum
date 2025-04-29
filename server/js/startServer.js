import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlDir = path.join(__dirname, '../html');

app.use(express.static(htmlDir));

async function setupRoutes() {
  try {
    const files = await fs.readdir(htmlDir);
    
    files.forEach(file => {
      if (file.endsWith('.html')) {
        let route;
        if (file === 'home.html') {
            route = '/';
        } else {
            route = `/${file.replace('.html', '')}`;
        }
        app.get(route, (req, res) => {
          res.sendFile(path.join(htmlDir, file));
        });
      }
    });
  } catch (error) {
  }
}

setupRoutes().then(() => {
  app.listen(port, () => {
    console.log('\x1b[36m%s\x1b[0m', `Server is running on port ${port}`);
  });
});
