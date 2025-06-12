import sqlite3 from "sqlite3";
import { open } from "sqlite";

/**
 * Database Connection Service
 */
export class DatabaseConnection {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize database connection
   * @returns {Promise<Database>} The database instance
   */
  async initialize() {
    if (this.db) {
      return this.db;
    }

    this.db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    return this.db;
  }

  /**
   * Get database instance
   * @returns {Database} The database instance
   */
  getDatabase() {
    if (!this.db) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.db;
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export const dbConnection = new DatabaseConnection();
