const sessions = new Map();

/**
 * Store a user session in cache
 * @param {string} userId - The user ID
 * @param {Object} userData - The user data to store
 * @returns {string} The session ID
 */
export function createSession(userId, userData) {
  const sessionId = Math.random().toString(36).substring(2, 15);
  sessions.set(sessionId, {
    userId,
    userData,
    createdAt: Date.now(),
  });
  return sessionId;
}

/**
 * Get a user session from cache
 * @param {string} sessionId - The session ID
 * @returns {Object|null} The session data or null if not found
 */
export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 * Remove a user session from cache
 * @param {string} sessionId - The session ID
 */
export function removeSession(sessionId) {
  sessions.delete(sessionId);
}

/**
 * Clean up expired sessions (older than 24 hours)
 */
export function cleanupSessions() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.createdAt > oneDay) {
      sessions.delete(sessionId);
    }
  }
}

setInterval(cleanupSessions, 60 * 60 * 1000);
