import db from "../../../database.js";

/**
 * Post Authentication Helper
 */
export class PostAuthHelper {
  /**
   * Verify user authentication
   * @param {number} userId - The user ID to verify
   * @returns {Promise<boolean>} True if user exists and is authenticated
   */
  async verifyUser(userId) {
    const user = await db.get("SELECT id FROM users WHERE id = ?", [userId]);
    return !!user;
  }
}
