export class MessageHandler {
  constructor(messageElementId) {
    this.messageElement = document.getElementById(messageElementId);
  }

  show(message, type = "info", duration = 0) {
    if (!this.messageElement) return;

    this.messageElement.textContent = message;
    this.messageElement.style.color = this.getColorForType(type);
    this.messageElement.style.display = "block";

    if (duration > 0) {
      setTimeout(() => this.hide(), duration);
    }
  }

  success(message, duration = 3000) {
    this.show(message, "success", duration);
  }

  error(message, duration = 5000) {
    this.show(message, "error", duration);
  }

  info(message, duration = 3000) {
    this.show(message, "info", duration);
  }

  hide() {
    if (this.messageElement) {
      this.messageElement.style.display = "none";
    }
  }

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
