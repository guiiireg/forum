import { dbConnection } from "./connection.js";
import { UserSchema } from "./schemas/userSchema.js";
import { CategorySchema } from "./schemas/categorySchema.js";
import { PostSchema } from "./schemas/postSchema.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

/**
 * User Migrations Service - Integrated into DatabaseInitializer
 */
class UserMigrations {
  constructor(userSchema) {
    this.userSchema = userSchema;
  }

  /**
   * Generate UUIDs for existing users
   */
  async generateUuidsForExistingUsers() {
    try {
      const usersWithoutUuid = await this.userSchema.getUsersWithoutUuid();

      if (usersWithoutUuid.length > 0) {
        console.log(
          `Generating UUIDs for ${usersWithoutUuid.length} existing users...`
        );

        for (const user of usersWithoutUuid) {
          const uuid = randomUUID();
          await this.userSchema.updateUserUuid(uuid, user.id);
        }

        await this.userSchema.createUuidIndex();
      }
    } catch (error) {
      console.error("Error generating UUIDs for existing users:", error);
    }
  }

  /**
   * Migrate plain text passwords to hashed passwords
   */
  async migratePasswordsToHashed() {
    try {
      console.log("Vérification des mots de passe à migrer...");
      const usersWithPlainPasswords =
        await this.userSchema.getUsersWithPlainPasswords();

      if (usersWithPlainPasswords.length > 0) {
        console.log(
          `Migration de ${usersWithPlainPasswords.length} mots de passe...`
        );
        const saltRounds = 12;

        for (const user of usersWithPlainPasswords) {
          const hashedPassword = await bcrypt.hash(user.password, saltRounds);
          await this.userSchema.updateUserPassword(hashedPassword, user.id);
          console.log(
            `Mot de passe hashé pour l'utilisateur: ${user.username}`
          );
        }

        console.log("Migration des mots de passe terminée !");
      } else {
        console.log("Tous les mots de passe sont déjà hashés.");
      }
    } catch (error) {
      console.error("Erreur lors de la migration des mots de passe:", error);
    }
  }

  /**
   * Run all user migrations
   */
  async runAllMigrations() {
    await this.userSchema.addUuidColumn();
    await this.generateUuidsForExistingUsers();
    await this.migratePasswordsToHashed();
  }
}

/**
 * Database Initializer - Orchestrates all database setup
 */
class DatabaseInitializer {
  constructor() {
    this.db = null;
    this.userSchema = null;
    this.categorySchema = null;
    this.postSchema = null;
    this.userMigrations = null;
  }

  /**
   * Initialize all database components
   */
  async initialize() {
    this.db = await dbConnection.initialize();

    this.userSchema = new UserSchema(this.db);
    this.categorySchema = new CategorySchema(this.db);
    this.postSchema = new PostSchema(this.db);
    this.userMigrations = new UserMigrations(this.userSchema);

    await this.setupDatabase();

    return this.db;
  }

  /**
   * Setup complete database structure
   */
  async setupDatabase() {
    await this.createTables();

    await this.runMigrations();

    await this.seedData();
  }

  /**
   * Create all database tables
   */
  async createTables() {
    await this.userSchema.createTable();
    await this.categorySchema.createTable();
    await this.postSchema.createAllTables();
  }

  /**
   * Run all migrations
   */
  async runMigrations() {
    await this.userMigrations.runAllMigrations();
    await this.postSchema.addCategoryColumn();
    await this.updatePostsWithoutCategory();
  }

  /**
   * Seed default data
   */
  async seedData() {
    const categoriesExist = await this.categorySchema.categoriesExist();
    if (!categoriesExist) {
      await this.categorySchema.insertDefaultCategories();
    }
  }

  /**
   * Update posts without category to use "Autres" category
   */
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
