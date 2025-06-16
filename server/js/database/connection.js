import sqlite3 from "sqlite3";
import { open } from "sqlite";

export class DatabaseConnection {
  constructor() {
    this.db = null;
  }

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

  getDatabase() {
    if (!this.db) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.db;
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
}

export const dbConnection = new DatabaseConnection();
