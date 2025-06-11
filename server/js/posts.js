import db from "./database.js";

/**
 * Create a post
 * @param {string} title - The post title
 * @param {string} content - The post content
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} The result of the creation
 */
export async function createPost(title, content, userId) {
  try {
    const result = await db.run(
      "INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)",
      [title, content, userId]
    );
    return {
      success: true,
      message: "Post créé avec succès",
      postId: result.lastID,
    };
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la création du post",
    };
  }
}

/**
 * Get all posts
 * @returns {Promise<Array>} The posts
 */
export async function getAllPosts() {
  try {
    const posts = await db.all(`
      SELECT p.*, u.username 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    return { success: true, posts };
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des posts",
    };
  }
}

/**
 * Get posts by user ID
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} The posts
 */
export async function getPostsByUser(userId) {
  try {
    const posts = await db.all(
      `
      SELECT p.*, u.username 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
      `,
      [userId]
    );
    return { success: true, posts };
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des posts",
    };
  }
}

/**
 * Get a post by ID
 * @param {number} postId - The post ID
 * @returns {Promise<Object>} The post
 */
export async function getPostById(postId) {
  try {
    const post = await db.get(
      `
      SELECT p.*, u.username 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
      `,
      [postId]
    );

    if (!post) {
      return {
        success: false,
        message: "Post non trouvé",
      };
    }

    return { success: true, post };
  } catch (error) {
    console.error("Erreur lors de la récupération du post:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération du post",
    };
  }
}

/**
 * Update a post
 * @param {number} postId - The post ID
 * @param {string} title - The new post title
 * @param {string} content - The new post content
 * @param {number} userId - The user ID (for ownership verification)
 * @returns {Promise<Object>} The result of the update
 */
export async function updatePost(postId, title, content, userId) {
  try {
    const post = await db.get("SELECT user_id FROM posts WHERE id = ?", [
      postId,
    ]);

    if (!post) {
      return {
        success: false,
        message: "Post non trouvé",
      };
    }

    if (post.user_id !== userId) {
      return {
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce post",
      };
    }

    const result = await db.run(
      "UPDATE posts SET title = ?, content = ? WHERE id = ?",
      [title, content, postId]
    );

    if (result.changes > 0) {
      return {
        success: true,
        message: "Post modifié avec succès",
      };
    } else {
      return {
        success: false,
        message: "Aucune modification effectuée",
      };
    }
  } catch (error) {
    console.error("Erreur lors de la modification du post:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la modification du post",
    };
  }
}

/**
 * Delete a post
 * @param {number} postId - The post ID
 * @param {number} userId - The user ID (for ownership verification)
 * @returns {Promise<Object>} The result of the deletion
 */
export async function deletePost(postId, userId) {
  try {
    const post = await db.get("SELECT user_id FROM posts WHERE id = ?", [
      postId,
    ]);

    if (!post) {
      return {
        success: false,
        message: "Post non trouvé",
      };
    }

    if (post.user_id !== userId) {
      return {
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce post",
      };
    }

    await db.run("DELETE FROM votes WHERE post_id = ?", [postId]);

    await db.run("DELETE FROM replies WHERE post_id = ?", [postId]);

    const result = await db.run("DELETE FROM posts WHERE id = ?", [postId]);

    if (result.changes > 0) {
      return {
        success: true,
        message: "Post supprimé avec succès",
      };
    } else {
      return {
        success: false,
        message: "Aucune suppression effectuée",
      };
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la suppression du post",
    };
  }
}
