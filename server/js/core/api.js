/**
 * API Utilities Module - Common API request functions
 */

// ==================== BASE REQUEST FUNCTIONS ====================

/**
 * Make a GET request
 * @param {string} url - URL to fetch
 * @returns {Promise<Object>} Response data
 */
export async function get(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`GET ${url} error:`, error);
    throw error;
  }
}

/**
 * Make a POST request
 * @param {string} url - URL to post to
 * @param {Object} data - Data to send
 * @returns {Promise<Object>} Response data
 */
export async function post(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`POST ${url} error:`, error);
    throw error;
  }
}

/**
 * Make a PUT request
 * @param {string} url - URL to put to
 * @param {Object} data - Data to send
 * @returns {Promise<Object>} Response data
 */
export async function put(url, data) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error(`PUT ${url} error:`, error);
    throw error;
  }
}

/**
 * Make a DELETE request
 * @param {string} url - URL to delete
 * @param {Object} data - Data to send (optional)
 * @returns {Promise<Object>} Response data
 */
export async function del(url, data = null) {
  try {
    const options = {
      method: "DELETE",
    };
    
    if (data) {
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(url, options);
    return await response.json();
  } catch (error) {
    console.error(`DELETE ${url} error:`, error);
    throw error;
  }
}

// ==================== SPECIALIZED API FUNCTIONS ====================

/**
 * Fetch categories from the server
 * @returns {Promise<Object>} Response containing categories data
 */
export async function fetchCategories() {
  return await get("/categories");
}

/**
 * Fetch posts from the server
 * @param {number|null} categoryId - Category ID to filter by (null for all posts)
 * @returns {Promise<Object>} Response containing posts data
 */
export async function fetchPosts(categoryId = null) {
  const url = categoryId ? `/api/posts/category/${categoryId}` : "/api/posts";
  return await get(url);
}

/**
 * Create a new post
 * @param {Object} postData - Post data containing title, content, userId, categoryId
 * @returns {Promise<Object>} Response from server
 */
export async function createPost(postData) {
  return await post("/posts", postData);
}

/**
 * Update an existing post
 * @param {number} postId - Post ID
 * @param {Object} postData - Updated post data
 * @returns {Promise<Object>} Response from server
 */
export async function updatePost(postId, postData) {
  return await put(`/posts/${postId}`, postData);
}

/**
 * Delete a post
 * @param {number} postId - Post ID to delete
 * @param {number} userId - User ID for authorization
 * @returns {Promise<Object>} Response from server
 */
export async function deletePost(postId, userId) {
  return await del(`/posts/${postId}`, { userId });
}

/**
 * Submit a vote for a post
 * @param {number} postId - Post ID
 * @param {number} voteType - Vote type (1 for upvote, -1 for downvote)
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Response from server
 */
export async function submitVote(postId, voteType, userId) {
  return await post("/votes", { postId, voteType, userId });
}

/**
 * Fetch votes for a post
 * @param {number} postId - Post ID
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Response containing vote data
 */
export async function fetchVotes(postId, userId) {
  return await get(`/votes/${postId}?userId=${userId}`);
}

/**
 * Fetch replies for a post
 * @param {number} postId - Post ID
 * @returns {Promise<Object>} Response containing replies data
 */
export async function fetchReplies(postId) {
  return await get(`/api/replies/${postId}`);
}

/**
 * Create a new reply
 * @param {Object} replyData - Reply data containing content, postId, userId
 * @returns {Promise<Object>} Response from server
 */
export async function createReply(replyData) {
  return await post("/replies", replyData);
}

// ==================== ERROR HANDLING ====================

/**
 * Handle API errors consistently
 * @param {Error} error - Error object
 * @param {string} operation - Description of the operation that failed
 */
export function handleApiError(error, operation) {
  console.error(`API Error during ${operation}:`, error);

  const errorMessage =
    error.message || `Une erreur est survenue lors de ${operation}`;

  window.dispatchEvent(
    new CustomEvent("api-error", {
      detail: { error, operation, message: errorMessage },
    })
  );

  return {
    success: false,
    message: errorMessage,
  };
}

/**
 * Wrapper for API calls with consistent error handling
 * @param {Function} apiCall - The API function to call
 * @param {string} operation - Description of the operation
 * @returns {Promise<Object>} Result with consistent structure
 */
export async function safeApiCall(apiCall, operation) {
  try {
    return await apiCall();
  } catch (error) {
    return handleApiError(error, operation);
  }
}
