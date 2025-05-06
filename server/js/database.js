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
 * Export the database
 * @returns {Database} The database
 */
export default db;
