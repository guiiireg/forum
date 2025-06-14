import db from "../../database.js";
import { BaseModel } from "../../lib/base.js";
import { categoryService } from "../categoryService.js";

/**
 * SQL queries for posts with common joins and aggregations
 */
const POST_QUERIES = {
  BASE_SELECT: `
    SELECT p.*, u.username, c.name as category_name, c.description as category_description,
           COALESCE(vote_totals.total_votes, 0) as total_votes,
           COALESCE(reply_counts.reply_count, 0) as reply_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN (
      SELECT post_id, SUM(vote_type) as total_votes
      FROM votes
      GROUP BY post_id
    ) vote_totals ON p.id = vote_totals.post_id
    LEFT JOIN (
      SELECT post_id, COUNT(*) as reply_count
      FROM replies
      GROUP BY post_id
    ) reply_counts ON p.id = reply_counts.post_id
  `,

  SIMPLE_SELECT: `
    SELECT p.*, u.username, c.name as category_name, c.description as category_description
    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
  `,

  ORDER_BY_DATE: "ORDER BY p.created_at DESC",

  WHERE_USER: "WHERE p.user_id = ?",
  WHERE_CATEGORY: "WHERE p.category_id = ?",
  WHERE_POST_ID: "WHERE p.id = ?",
};

/**
 * Build a complete post query
 * @param {string} baseQuery - Base SELECT query
 * @param {string} whereClause - WHERE clause (optional)
 * @param {string} orderClause - ORDER BY clause (optional)
 * @returns {string} Complete SQL query
 */
function buildPostQuery(
  baseQuery = POST_QUERIES.BASE_SELECT,
  whereClause = "",
  orderClause = POST_QUERIES.ORDER_BY_DATE
) {
  return `${baseQuery} ${whereClause} ${orderClause}`.trim();
}

/**
 * Post CRUD Service - Basic Create, Read, Update, Delete operations
 */
export class PostCrudService extends BaseModel {
  constructor() {
    super("posts");
  }

  /**
   * Get posts with optional filtering
   * @param {Object} filters - Filtering options
   * @returns {Promise<Object>} The posts
   */
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

  /**
   * Get a post by ID
   * @param {number} postId - The post ID
   * @returns {Promise<Object>} The post
   */
  async getById(postId) {
    return this.executeQuery(async () => {
      const query = buildPostQuery(
        POST_QUERIES.SIMPLE_SELECT,
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

  /**
   * Create a post
   * @param {Object} postData - Post data
   * @returns {Promise<Object>} The result of the creation
   */
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

  /**
   * Update a post (without ownership check - use PostOwnershipService for that)
   * @param {number} postId - The post ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} The result of the update
   */
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

  /**
   * Delete a post (without ownership check and related data cleanup)
   * @param {number} postId - The post ID
   * @returns {Promise<Object>} The result of the deletion
   */
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
