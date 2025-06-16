export class PostSchema {
  constructor(db) {
    this.db = db;
  }

  async createTable() {
    await this.db.exec(`
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
  }

  async addCategoryColumn() {
    const pragma = await this.db.all("PRAGMA table_info(posts)");
    const hasCategoryId = pragma.some((col) => col.name === "category_id");

    if (!hasCategoryId) {
      try {
        await this.db.exec(
          `ALTER TABLE posts ADD COLUMN category_id INTEGER DEFAULT NULL`
        );
      } catch (error) {
        console.error("Error checking/adding category_id column:", error);
      }
    }
  }

  async updatePostsWithoutCategory(autresCategoryId) {
    await this.db.run(
      "UPDATE posts SET category_id = ? WHERE category_id IS NULL",
      [autresCategoryId]
    );
  }

  async createRepliesTable() {
    await this.db.exec(`
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
  }

  async createVotesTable() {
    await this.db.exec(`
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
  }

  async createAllTables() {
    await this.createTable();
    await this.createRepliesTable();
    await this.createVotesTable();
  }
}
