/**
 * Fetches categories from the server
 * @returns {Promise<Object>} Response containing categories data
 */
export async function fetchCategories() {
  try {
    const response = await fetch("/categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * Creates a new post
 * @param {Object} postData - Post data containing title, content, userId, categoryId
 * @returns {Promise<Object>} Response from server
 */
export async function createPost(postData) {
  try {
    const response = await fetch("/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

/**
 * Updates an existing post
 * @param {number} postId - ID of the post to update
 * @param {Object} postData - Updated post data
 * @returns {Promise<Object>} Response from server
 */
export async function updatePost(postId, postData) {
  try {
    const response = await fetch(`/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

/**
 * Deletes a post
 * @param {number} postId - ID of the post to delete
 * @param {number} userId - ID of the user requesting deletion
 * @returns {Promise<Object>} Response from server
 */
export async function deletePost(postId, userId) {
  try {
    const response = await fetch(`/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: parseInt(userId) }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

/**
 * Fetches posts, optionally filtered by category
 * @param {number|null} categoryId - Category ID to filter by (null for all posts)
 * @returns {Promise<Object>} Response containing posts data
 */
export async function fetchPosts(categoryId = null) {
  try {
    const url = categoryId ? `/posts/category/${categoryId}` : "/posts";
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

/**
 * Submits a vote for a post
 * @param {Object} voteData - Vote data containing postId, userId, voteType
 * @returns {Promise<Object>} Response from server
 */
export async function submitVote(voteData) {
  try {
    const response = await fetch("/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(voteData),
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting vote:", error);
    throw error;
  }
}

/**
 * Fetches votes for a specific post
 * @param {number} postId - ID of the post
 * @param {number|null} userId - ID of the current user (null if not logged in)
 * @returns {Promise<Object>} Response containing vote data
 */
export async function fetchVotes(postId, userId = null) {
  try {
    const response = await fetch(
      `/votes/${postId}${userId ? `?userId=${userId}` : ""}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching votes:", error);
    throw error;
  }
} 