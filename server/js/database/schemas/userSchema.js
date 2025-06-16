export class UserSchema {
  constructor(db) {
    this.db = db;
  }

  async createTable() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  async addUuidColumn() {
    const userTableInfo = await this.db.all("PRAGMA table_info(users)");
    const hasUuidColumn = userTableInfo.some((col) => col.name === "uuid");

    if (!hasUuidColumn) {
      try {
        await this.db.exec(`ALTER TABLE users ADD COLUMN uuid TEXT`);
        console.log("✅ Added uuid column to users table");
      } catch (error) {
        console.error("Error adding uuid column to users table:", error);
      }
    }
  }

  async createUuidIndex() {
    try {
      await this.db.exec(
        "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid)"
      );
      console.log("✅ Added unique constraint to uuid column");
    } catch (indexError) {
      console.error("Error adding unique constraint to uuid:", indexError);
    }
  }

  async getUsersWithoutUuid() {
    return await this.db.all(
      "SELECT id FROM users WHERE uuid IS NULL OR uuid = ''"
    );
  }

  async updateUserUuid(uuid, userId) {
    await this.db.run("UPDATE users SET uuid = ? WHERE id = ?", [uuid, userId]);
  }

  async getUsersWithPlainPasswords() {
    return await this.db.all(
      "SELECT id, username, password FROM users WHERE password NOT LIKE '$2b$%'"
    );
  }

  async updateUserPassword(hashedPassword, userId) {
    await this.db.run("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      userId,
    ]);
  }
}
