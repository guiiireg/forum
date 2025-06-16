import db from "../database.js";

/**
 * Base model class with common database operations
 */
export class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Handle database errors consistently
   * @param {Error} error - The error object
   * @param {string} operation - The operation being performed
   * @returns {Object} Error response
   */
  handleError(error, operation) {
    console.error(`Erreur lors de ${operation}:`, error);
    return {
      success: false,
      message: `Une erreur est survenue lors de ${operation}`,
    };
  }

  /**
   * Execute a query with error handling
   * @param {Function} queryFn - The query function to execute
   * @param {string} operation - The operation being performed
   * @returns {Promise<Object>} The result
   */
  async executeQuery(queryFn, operation) {
    try {
      const result = await queryFn();
      return { success: true, ...result };
    } catch (error) {
      return this.handleError(error, operation);
    }
  }

  /**
   * Find a record by ID
   * @param {number} id - The record ID
   * @returns {Promise<Object>} The record
   */
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

  /**
   * Check if a record exists
   * @param {number} id - The record ID
   * @returns {Promise<boolean>} Whether the record exists
   */
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
