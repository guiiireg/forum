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
 * Create the categories table if it doesn't exist
 */
await db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

/**
 * Insert default categories if they don't exist
 */
const categoriesCount = await db.get(
  "SELECT COUNT(*) as count FROM categories"
);
if (categoriesCount.count === 0) {
  await db.exec(`
    INSERT INTO categories (name, description) VALUES 
    ('Technologie', 'Discussions sur la technologie, programmation, gadgets'),
    ('Politique', 'Débats et discussions politiques'),
    ('Sport', 'Actualités et discussions sportives'),
    ('Culture', 'Art, musique, littérature, cinéma'),
    ('Sciences', 'Découvertes scientifiques et recherches'),
    ('Jeux Vidéo', 'Gaming, actualités des jeux vidéo'),
    ('Santé', 'Conseils santé et bien-être'),
    ('Actualités', 'Actualités générales et informations'),
    ('Autres', 'Sujets divers qui ne rentrent dans aucune autre catégorie');
  `);
}

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
const hasCategoryId = pragma.some((col) => col.name === "category_id");
if (!hasCategoryId) {
  try {
    await db.exec(
      `ALTER TABLE posts ADD COLUMN category_id INTEGER DEFAULT NULL`
    );
  } catch (error) {
    console.error("Error checking/adding category_id column:", error);
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
        FOREIGN KEY (post_id) REFERENCES posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    );
`);

/**
 * Create the votes table if it doesn't exist
 */
await db.exec(`
    CREATE TABLE IF NOT EXISTS votes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        vote_type INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE (post_id, user_id)
    );
`);

/**
 * Export the database
 * @returns {Database} The database
 */
export default db;
