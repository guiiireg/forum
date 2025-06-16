import path from "path";
import { errorHandler } from "../../middleware/errorHandler.js";

export class ErrorRoutes {
  constructor(app, htmlDir) {
    this.app = app;
    this.htmlDir = htmlDir;
  }

  async setupErrorHandling() {
    try {
      this.app.use((req, res) => {
        res.status(404).sendFile(path.join(this.htmlDir, "404.html"));
      });

      this.app.use(errorHandler);
    } catch (error) {
      console.error("Error setting up error routes:", error);
    }
  }
}
