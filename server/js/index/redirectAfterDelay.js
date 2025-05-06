/**
 * Redirect to a URL after a delay
 * @param {string} url - The URL to redirect to
 * @param {number} delay - The delay in milliseconds
 */
export function redirectAfterDelay(url, delay) {
  setTimeout(() => {
    window.location.href = url;
  }, delay);
}
