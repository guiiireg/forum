import db from "../database.js";

export class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  handleError(error, operation) {
    console.error(`Erreur lors de ${operation}:`, error);
    return {
      success: false,
      message: `Une erreur est survenue lors de ${operation}`,
    };
  }

  async executeQuery(queryFn, operation) {
    try {
      const result = await queryFn();
      return { success: true, ...result };
    } catch (error) {
      return this.handleError(error, operation);
    }
  }

  async findById(id) {
    return this.executeQuery(async () => {
      const record = await db.get(
        `SELECT * FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      if (!record) {
        return {
          success: false,
          message: `${this.tableName} non trouvé`,
        };
      }
      return { [this.tableName.slice(0, -1)]: record };
    }, `la récupération du ${this.tableName.slice(0, -1)}`);
  }

  async exists(id) {
    try {
      const record = await db.get(
        `SELECT id FROM ${this.tableName} WHERE id = ?`,
        [id]
      );
      return !!record;
    } catch (error) {
      console.error(`Erreur lors de la vérification d'existence:`, error);
      return false;
    }
  }
}
