import db from "../../database.js";
import { BaseModel } from "../../models/base.js";
import {
  POST_QUERIES,
  buildPostQuery,
} from "../../models/queries/postQueries.js";
import { categoryService } from "../categoryService.js";

export class PostCrudService extends BaseModel {
  constructor() {
    super("posts");
  }

  async getPosts(filters = {}) {
    return this.executeQuery(async () => {
      let whereClause = "";
      let params = [];

      if (filters.userId) {
        whereClause = POST_QUERIES.WHERE_USER;
        params = [filters.userId];
      } else if (filters.categoryId) {
        whereClause = POST_QUERIES.WHERE_CATEGORY;
        params = [filters.categoryId];
      }

      const query = buildPostQuery(POST_QUERIES.BASE_SELECT, whereClause);
      const posts = await db.all(query, params);

      return { posts };
    }, "la récupération des posts");
  }

  async getById(postId) {
    return this.executeQuery(async () => {
      const query = buildPostQuery(
        POST_QUERIES.BASE_SELECT,
        POST_QUERIES.WHERE_POST_ID,
        ""
      );
      const post = await db.get(query, [postId]);

      if (!post) {
        return { success: false, message: "Post non trouvé" };
      }

      return { post };
    }, "la récupération du post");
  }

  async create({ title, content, userId, categoryId = null }) {
    return this.executeQuery(async () => {
      const finalCategoryId = await categoryService.validateCategoryId(
        categoryId
      );

      const result = await db.run(
        "INSERT INTO posts (title, content, user_id, category_id) VALUES (?, ?, ?, ?)",
        [title, content, userId, finalCategoryId]
      );

      return {
        message: "Post créé avec succès",
        postId: result.lastID,
      };
    }, "la création du post");
  }

  async updatePost(postId, { title, content, categoryId = null }) {
    return this.executeQuery(async () => {
      let query, params;

      if (categoryId !== null) {
        const finalCategoryId = await categoryService.validateCategoryId(
          categoryId
        );
        query =
          "UPDATE posts SET title = ?, content = ?, category_id = ? WHERE id = ?";
        params = [title, content, finalCategoryId, postId];
      } else {
        query = "UPDATE posts SET title = ?, content = ? WHERE id = ?";
        params = [title, content, postId];
      }

      const result = await db.run(query, params);

      return {
        message:
          result.changes > 0
            ? "Post modifié avec succès"
            : "Aucune modification effectuée",
      };
    }, "la modification du post");
  }

  async deletePost(postId) {
    return this.executeQuery(async () => {
      const result = await db.run("DELETE FROM posts WHERE id = ?", [postId]);

      return {
        message:
          result.changes > 0
            ? "Post supprimé avec succès"
            : "Aucune suppression effectuée",
      };
    }, "la suppression du post");
  }
}

export const postCrudService = new PostCrudService();
