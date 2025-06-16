import { postPageOrchestrator } from "../services/client/index.js";


document.addEventListener("DOMContentLoaded", async () => {
  await postPageOrchestrator.initialize();
});
