/**
 * Message Handler for displaying user feedback
 */
export class MessageHandler {
  constructor(messageElementId) {
    this.messageElement = document.getElementById(messageElementId);
  }

  /**
   * Display a message with specified type
   * @param {string} message - Message to display
   * @param {string} type - Message type (success, error, info)
   * @param {number} duration - Auto-hide duration in ms (0 = no auto-hide)
   */
  show(message, type = "info", duration = 0) {
    if (!this.messageElement) return;

    this.messageElement.textContent = message;
    this.messageElement.style.color = this.getColorForType(type);
    this.messageElement.style.display = "block";

    if (duration > 0) {
      setTimeout(() => this.hide(), duration);
    }
  }

  /**
   * Show success message
   * @param {string} message - Success message
   * @param {number} duration - Auto-hide duration
   */
  success(message, duration = 3000) {
    this.show(message, "success", duration);
  }

  /**
   * Show error message
   * @param {string} message - Error message
   * @param {number} duration - Auto-hide duration
   */
  error(message, duration = 5000) {
    this.show(message, "error", duration);
  }

  /**
   * Show info message
   * @param {string} message - Info message
   * @param {number} duration - Auto-hide duration
   */
  info(message, duration = 3000) {
    this.show(message, "info", duration);
  }

  /**
   * Hide the message
   */
  hide() {
    if (this.messageElement) {
      this.messageElement.style.display = "none";
    }
  }

  /**
   * Get color for message type
   * @param {string} type - Message type
   * @returns {string} Color value
   */
  getColorForType(type) {
    const colors = {
      success: "green",
      error: "red",
      info: "blue",
      warning: "orange",
    };
    return colors[type] || colors.info;
  }
}
