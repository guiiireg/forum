import { dbConnection } from "./connection.js";
import { UserSchema } from "./schemas/userSchema.js";
import { CategorySchema } from "./schemas/categorySchema.js";
import { PostSchema } from "./schemas/postSchema.js";
import { UserMigrations } from "./migrations/userMigrations.js";

class DatabaseInitializer {
  constructor() {
    this.db = null;
    this.userSchema = null;
    this.categorySchema = null;
    this.postSchema = null;
    this.userMigrations = null;
  }

  async initialize() {
    this.db = await dbConnection.initialize();

    this.userSchema = new UserSchema(this.db);
    this.categorySchema = new CategorySchema(this.db);
    this.postSchema = new PostSchema(this.db);
    this.userMigrations = new UserMigrations(this.userSchema);

    await this.setupDatabase();

    return this.db;
  }

  async setupDatabase() {
    await this.createTables();

    await this.runMigrations();

    await this.seedData();
  }

  async createTables() {
    await this.userSchema.createTable();
    await this.categorySchema.createTable();
    await this.postSchema.createAllTables();
  }

  async runMigrations() {
    await this.userMigrations.runAllMigrations();
    await this.postSchema.addCategoryColumn();
    await this.updatePostsWithoutCategory();
  }

  async seedData() {
    const categoriesExist = await this.categorySchema.categoriesExist();
    if (!categoriesExist) {
      await this.categorySchema.insertDefaultCategories();
    }
  }

  async updatePostsWithoutCategory() {
    const autresCategory = await this.categorySchema.getAutresCategory();
    if (autresCategory) {
      await this.postSchema.updatePostsWithoutCategory(autresCategory.id);
    }
  }
}

const initializer = new DatabaseInitializer();
const db = await initializer.initialize();

export default db;
