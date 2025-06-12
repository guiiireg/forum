// Re-export the new modular post service
export { postService } from "./posts/index.js";

export {
  postCrudService,
  postOwnershipService,
  postQueryService,
} from "./posts/index.js";
