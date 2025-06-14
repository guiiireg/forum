import { postPageOrchestrator } from "../services/client/index.js";

/**
 * Posts page main entry point
 * Ultra-simplified using modular architecture
 */
document.addEventListener("DOMContentLoaded", async () => {
  await postPageOrchestrator.initialize();
});
