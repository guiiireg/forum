
export class CategorySchema {
  constructor(db) {
    this.db = db;
  }

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

  async categoriesExist() {
    const categoriesCount = await this.db.get(
      "SELECT COUNT(*) as count FROM categories"
    );
    return categoriesCount.count > 0;
  }

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

  async getAutresCategory() {
    return await this.db.get("SELECT id FROM categories WHERE name = 'Autres'");
  }
}
