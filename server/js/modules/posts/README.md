# Posts Module Documentation

## Overview

This module has been refactored into a modular structure for better maintainability, reusability, and testing. Each file has a specific responsibility following the Single Responsibility Principle.

## File Structure

### `index.js`

Main entry point that exports all functionality from the posts module. Use this for importing multiple functions from different modules.

```javascript
import {
  initializePosts,
  handleCreatePost,
  validatePostForm,
} from "./modules/posts/index.js";
```

### `posts.js`

Main orchestration file that initializes the posts page and coordinates between different modules.

**Key Functions:**

- `initializePosts()` - Main initialization function
- `refreshPosts(categoryId)` - Refreshes the posts list
- `isUserAuthenticated()` - Checks if user is logged in
- `getCurrentUserId()` - Gets current user ID

### `postApi.js`

Contains all API calls related to posts, categories, and votes.

**Key Functions:**

- `fetchCategories()` - Get all categories
- `createPost(postData)` - Create a new post
- `updatePost(postId, postData)` - Update existing post
- `deletePost(postId, userId)` - Delete a post
- `fetchPosts(categoryId)` - Get posts (optionally filtered)
- `submitVote(voteData)` - Submit a vote
- `fetchVotes(postId, userId)` - Get vote data for a post

### `postActions.js`

Handles user actions on posts (create, edit, delete).

**Key Functions:**

- `handleEditPost(postElement)` - Initiates post editing
- `saveEditPost(postId, userId)` - Saves post edits
- `handleDeletePost(postId, userId)` - Handles post deletion
- `handleCreatePost(userId)` - Handles post creation
- `cancelEditPost(postId)` - Cancels post editing

### `postVotes.js`

Manages voting functionality for posts.

**Key Functions:**

- `handleVote(postId, userId, voteType)` - Process a vote
- `loadVotes(postId, userId)` - Load vote data
- `setupVoteListeners(postElement, postId, userId)` - Setup vote event listeners
- `updateVoteUI(postId, voteData)` - Update vote display

### `postValidation.js`

Contains validation logic for posts and user input.

**Key Functions:**

- `validatePostData(title, content)` - Validate post content
- `validateCategory(categoryId)` - Validate category selection
- `validateUserAuth(userId)` - Validate user authentication
- `validatePostForm(formData, userId)` - Complete form validation
- `sanitizeText(text)` - Sanitize user input

### `postDOMUtils.js`

DOM manipulation utilities for posts.

**Key Functions:**

- `getPostFormData()` - Extract data from create form
- `getEditFormData(postId)` - Extract data from edit form
- `clearPostForm()` - Clear the create post form
- `toggleEditMode(postElement, isEditing)` - Toggle between edit and view mode
- `populateCategorySelect(selectId, categories)` - Populate category dropdowns
- `findPostElement(postId)` - Find post element by ID
- `showError(message)` / `showSuccess(message)` - Display user messages

### `postsUI.js`

UI component creation for posts (HTML generation).

**Key Functions:**

- `createPostElement(post, isOwner, votes)` - Generate post HTML
- `createEditForm(postId, title, content, categories)` - Generate edit form HTML
- `createPostForm()` - Generate create post form HTML
- `createCategoryFilter()` - Generate category filter HTML

## Benefits of This Structure

1. **Single Responsibility**: Each file has one clear purpose
2. **Reusability**: Functions can be imported and reused elsewhere
3. **Testability**: Individual modules can be unit tested easily
4. **Maintainability**: Easier to locate and modify specific functionality
5. **Scalability**: New features can be added to appropriate modules
6. **Type Safety**: Better IDE support and error detection
7. **Parallel Development**: Multiple developers can work on different modules

## Usage Examples

### Basic Usage

```javascript
import { initializePosts } from "./modules/posts/index.js";

// Initialize the posts page
await initializePosts();
```

### Creating a Post Programmatically

```javascript
import { handleCreatePost, validatePostForm } from "./modules/posts/index.js";

const formData = { title: "Test", content: "Content", categoryId: 1 };
const userId = 123;

const validation = validatePostForm(formData, userId);
if (validation.isValid) {
  await handleCreatePost(userId);
}
```

### Custom Vote Handling

```javascript
import { handleVote, updateVoteUI } from "./modules/posts/index.js";

await handleVote(postId, userId, 1); // Upvote
```

## Error Handling

All modules include proper error handling with try-catch blocks and user-friendly error messages. Errors are logged to the console for debugging while showing appropriate messages to users.

## Future Improvements

- Add TypeScript for better type safety
- Implement proper notification system instead of alerts
- Add caching for API responses
- Implement optimistic UI updates
- Add comprehensive unit tests
