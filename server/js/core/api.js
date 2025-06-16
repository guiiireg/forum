export async function get(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(`GET ${url} error:`, error);
    throw error;
  }
}

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

export async function fetchCategories() {
  return await get("/categories");
}

export async function fetchPosts(categoryId = null) {
  const url = categoryId ? `/api/posts/category/${categoryId}` : "/api/posts";
  return await get(url);
}

export async function fetchPost(postId) {
  return await get(`/api/posts/${postId}`);
}

export async function createPost(postData) {
  return await post("/posts", postData);
}

export async function updatePost(postId, postData) {
  return await put(`/posts/${postId}`, postData);
}

export async function deletePost(postId, userId) {
  return await del(`/posts/${postId}`, { userId });
}

export async function submitVote(postId, voteType, userId) {
  return await post("/votes", { postId, voteType, userId });
}

export async function fetchVotes(postId, userId) {
  return await get(`/votes/${postId}?userId=${userId}`);
}

export async function fetchReplies(postId) {
  return await get(`/api/replies/${postId}`);
}

export async function createReply(replyData) {
  return await post("/api/replies", replyData);
}

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

export async function safeApiCall(apiCall, operation) {
  try {
    return await apiCall();
  } catch (error) {
    return handleApiError(error, operation);
  }
}
