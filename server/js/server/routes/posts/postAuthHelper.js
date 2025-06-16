import db from "../../../database.js";

export class PostAuthHelper {
  async verifyUser(userId) {
    const user = await db.get("SELECT id FROM users WHERE id = ?", [userId]);
    return !!user;
  }
}
