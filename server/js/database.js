import sqlite3 from "sqlite3";
import { open } from "sqlite";

/**
 * Open the database
 * @returns {Promise<Database>} The database
 */
const db = await open({
  filename: "./database.db",
  driver: sqlite3.Database,
});

/**
 * Create the users table if it doesn't exist
 */
await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

/**
 * Create the posts table if it doesn't exist
 */
await db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        category_id INTEGER DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (category_id) REFERENCES categories (id)
    );
`);

/**
 * Add category_id column to existing posts table if it doesn't exist
 */
const pragma = await db.all("PRAGMA table_info(posts)");
const hasCategoryId = pragma.some(col => col.name === "category_id");
if (!hasCategoryId) {
  try {
    await db.exec(
      `ALTER TABLE posts ADD COLUMN category_id INTEGER DEFAULT NULL`
    );
  } catch (error) {
    console.error("Error adding category_id column:", error);
  }
}

/**
 * Update posts without category to use "Autres" category
 */
const autresCategory = await db.get(
  "SELECT id FROM categories WHERE name = 'Autres'"
);
if (autresCategory) {
  await db.run("UPDATE posts SET category_id = ? WHERE category_id IS NULL", [
    autresCategory.id,
  ]);
}

/**
 * Create the replies table if it doesn't exist
 */
await db.exec(`
    CREATE TABLE IF NOT EXISTS replies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
`);

/**
 * Export the database
 * @returns {Database} The database
 */
export default db;
