import {
  getAllPosts,
  getPostsByUser,
  getPostById,
  getPostsByCategory,
} from "../../../posts.js";

export class PostReadRoutes {
  constructor(app) {
    this.app = app;
  }

  setupRoutes() {
    this.setupGetAllPosts();
    this.setupGetPostsByUser();
    this.setupGetPostById();
    this.setupGetPostsByCategory();
  }

  setupGetAllPosts() {
    this.app.get("/api/posts", async (req, res) => {
      const result = await getAllPosts();

      if (result.success) {
        res.json({ success: true, posts: result.posts });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    });
  }

  setupGetPostsByUser() {
    this.app.get("/api/posts/user/:userId", async (req, res) => {
      const userId = req.params.userId;
      const result = await getPostsByUser(userId);

      if (result.success) {
        res.json({ success: true, posts: result.posts });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    });
  }

  setupGetPostById() {
    this.app.get("/api/posts/:postId", async (req, res) => {
      const postId = req.params.postId;
      const result = await getPostById(postId);

      if (result.success) {
        res.json({ success: true, post: result.post });
      } else {
        res.status(404).json({ success: false, message: result.message });
      }
    });
  }

  setupGetPostsByCategory() {
    this.app.get("/api/posts/category/:categoryId", async (req, res) => {
      const categoryId = req.params.categoryId;
      const result = await getPostsByCategory(categoryId);

      if (result.success) {
        res.json({ success: true, posts: result.posts });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    });
  }
}
