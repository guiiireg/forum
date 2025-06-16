/**
 * Category Schema Operations
 */
export class CategorySchema {
  constructor(db) {
    this.db = db;
  }

  /**
   * Create categories table
   */
  async createTable() {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  /**
   * Check if categories exist
   * @returns {Promise<boolean>} True if categories exist
   */
  async categoriesExist() {
    const categoriesCount = await this.db.get(
      "SELECT COUNT(*) as count FROM categories"
    );
    return categoriesCount.count > 0;
  }

  /**
   * Insert default categories
   */
  async insertDefaultCategories() {
    await this.db.exec(`
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
   * Get "Autres" category ID
   * @returns {Promise<Object|null>} The "Autres" category or null
   */
  async getAutresCategory() {
    return await this.db.get("SELECT id FROM categories WHERE name = 'Autres'");
  }
}
