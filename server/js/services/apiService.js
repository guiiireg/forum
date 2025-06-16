class ApiService {
  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      console.error(`API Error for ${url}:`, error);
      return {
        success: false,
        data: { message: "Erreur de connexion au serveur" },
        error,
      };
    }
  }

  async get(url) {
    return this.request(url, { method: "GET" });
  }

  async post(url, body) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async getAllPosts() {
    return this.get("/api/posts");
  }

  async getPostsByCategory(categoryId) {
    return this.get(`/posts/category/${categoryId}`);
  }

  async createPost(postData) {
    return this.post("/posts", postData);
  }

  async getAllCategories() {
    return this.get("/categories");
  }
}

export const apiService = new ApiService();
