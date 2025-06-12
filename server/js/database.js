import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

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
 * Add uuid column to existing users table if it doesn't exist
 */
const userTableInfo = await db.all("PRAGMA table_info(users)");
const hasUuidColumn = userTableInfo.some((col) => col.name === "uuid");
if (!hasUuidColumn) {
  try {
    await db.exec(`ALTER TABLE users ADD COLUMN uuid TEXT`);
    console.log("✅ Added uuid column to users table");
  } catch (error) {
    console.error("Error adding uuid column to users table:", error);
  }
}

/**
 * Generate UUIDs for existing users who don't have one
 */
try {
  const usersWithoutUuid = await db.all(
    "SELECT id FROM users WHERE uuid IS NULL OR uuid = ''"
  );
  if (usersWithoutUuid.length > 0) {
    console.log(
      `Generating UUIDs for ${usersWithoutUuid.length} existing users...`
    );

    for (const user of usersWithoutUuid) {
      const uuid = randomUUID();
      await db.run("UPDATE users SET uuid = ? WHERE id = ?", [uuid, user.id]);
    }

    try {
      await db.exec(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid)"
      );
      console.log("✅ Added unique constraint to uuid column");
    } catch (indexError) {
      console.error("Error adding unique constraint to uuid:", indexError);
    }
  }
} catch (error) {
  console.error("Error generating UUIDs for existing users:", error);
}

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
 * Migrate existing plain text passwords to hashed passwords
 */
try {
  console.log("🔐 Vérification des mots de passe à migrer...");
  const usersWithPlainPasswords = await db.all(
    "SELECT id, username, password FROM users WHERE password NOT LIKE '$2b$%'"
  );
  
  if (usersWithPlainPasswords.length > 0) {
    console.log(`🔄 Migration de ${usersWithPlainPasswords.length} mots de passe...`);
    const saltRounds = 12;
    
    for (const user of usersWithPlainPasswords) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      await db.run("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        user.id,
      ]);
      console.log(`✅ Mot de passe hashé pour l'utilisateur: ${user.username}`);
    }
    
    console.log("✅ Migration des mots de passe terminée !");
  } else {
    console.log("✅ Tous les mots de passe sont déjà hashés.");
  }
} catch (error) {
  console.error("❌ Erreur lors de la migration des mots de passe:", error);
}

/**
 * Export the database
 * @returns {Database} The database
 */
export default db;
