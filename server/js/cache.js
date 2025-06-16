const sessions = new Map();

export function createSession(userId, userData) {
  const sessionId = Math.random().toString(36).substring(2, 15);
  sessions.set(sessionId, {
    userId,
    userData,
    createdAt: Date.now(),
  });
  return sessionId;
}

export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

export function removeSession(sessionId) {
  sessions.delete(sessionId);
}

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
