import { ServerConfig } from "./config/serverConfig.js";
import { PageRoutes } from "./routes/pageRoutes.js";
import { AuthRoutes } from "./routes/authRoutes.js";
import { PostRoutes } from "./routes/postRoutes.js";
import { VoteRoutes } from "./routes/voteRoutes.js";
import { ReplyRoutes } from "./routes/replyRoutes.js";
import { CategoryRoutes } from "./routes/categoryRoutes.js";
import { ErrorRoutes } from "./routes/errorRoutes.js";

class ServerOrchestrator {
  constructor() {
    this.config = new ServerConfig();
    this.app = this.config.getApp();
    this.port = this.config.getPort();
    this.htmlDir = this.config.getHtmlDir();
  }

  async initialize() {
    this.setupConfiguration();
    this.setupAllRoutes();
    await this.setupErrorHandling();
    this.startServer();
  }

  setupConfiguration() {
    this.config.setupMiddleware();
    this.config.setupStaticFiles();
  }

  setupAllRoutes() {
    const pageRoutes = new PageRoutes(this.app, this.htmlDir);
    const authRoutes = new AuthRoutes(this.app);
    const postRoutes = new PostRoutes(this.app);
    const voteRoutes = new VoteRoutes(this.app);
    const replyRoutes = new ReplyRoutes(this.app);
    const categoryRoutes = new CategoryRoutes(this.app);

    pageRoutes.setupRoutes();
    authRoutes.setupRoutes();
    postRoutes.setupRoutes();
    voteRoutes.setupRoutes();
    replyRoutes.setupRoutes();
    categoryRoutes.setupRoutes();
  }

  async setupErrorHandling() {
    const errorRoutes = new ErrorRoutes(this.app, this.htmlDir);
    await errorRoutes.setupErrorHandling();
  }

  startServer() {
    this.app.listen(this.port, () => {
      console.log(
        "\x1b[36m%s\x1b[0m",
        `Server is running on port ${this.port}`
      );
    });
  }
}

const server = new ServerOrchestrator();
server.initialize();

export default server;
