import { PostReadRoutes } from "./postReadRoutes.js";
import { PostCreateRoutes } from "./postCreateRoutes.js";
import { PostUpdateRoutes } from "./postUpdateRoutes.js";

export class PostRoutes {
  constructor(app) {
    this.readRoutes = new PostReadRoutes(app);
    this.createRoutes = new PostCreateRoutes(app);
    this.updateRoutes = new PostUpdateRoutes(app);
  }

  setupRoutes() {
    this.readRoutes.setupRoutes();
    this.createRoutes.setupRoutes();
    this.updateRoutes.setupRoutes();
  }
}

export { PostAuthHelper } from "./postAuthHelper.js";
export { PostReadRoutes } from "./postReadRoutes.js";
export { PostCreateRoutes } from "./postCreateRoutes.js";
export { PostUpdateRoutes } from "./postUpdateRoutes.js";
