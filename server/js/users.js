import db from "./database.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

// Session cache management
const sessions = new Map();

/**
 * Store a user session in cache
 * @param {string} userId - The user ID
 * @param {Object} userData - The user data to store
 * @returns {string} The session ID
 */
function createSession(userId, userData) {
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
function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

/**
 * Remove a user session from cache
 * @param {string} sessionId - The session ID
 */
function removeSession(sessionId) {
  sessions.delete(sessionId);
}

/**
 * Clean up expired sessions (older than 24 hours)
 */
function cleanupSessions() {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.createdAt > oneDay) {
      sessions.delete(sessionId);
    }
  }
}

setInterval(cleanupSessions, 60 * 60 * 1000);

/**
 * Register a user
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<Object>} The result of the registration
 */
export async function registerUser(username, password) {
  try {
    const existUser = await db.get("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (existUser) {
      return { success: false, message: "Nom d'utilisateur déjà utilisé" };
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userUuid = randomUUID();

    const result = await db.run(
      "INSERT INTO users (username, password, uuid) VALUES (?, ?, ?)",
      [username, hashedPassword, userUuid]
    );
    return {
      success: true,
      message: "Inscription réussie",
      userId: result.lastID,
      username: username,
      uuid: userUuid,
    };
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de l'inscription",
    };
  }
}

/**
 * Login a user
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<Object>} The result of the login
 */
export async function loginUser(username, password) {
  try {
    const user = await db.get("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    if (!user) {
      return {
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      };
    }

    const sessionId = createSession(user.id, {
      username: user.username,
      id: user.id,
      uuid: user.uuid,
    });

    return {
      success: true,
      message: "Connexion réussie",
      userId: user.id,
      username: user.username,
      uuid: user.uuid,
      sessionId: sessionId,
    };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la connexion",
    };
  }
}

/**
 * Get user data from session
 * @param {string} sessionId - The session ID
 * @returns {Object|null} The user data or null if session not found
 */
export function getUserFromSession(sessionId) {
  const session = getSession(sessionId);
  return session ? session.userData : null;
}

/**
 * Get user by UUID
 * @param {string} uuid - The user UUID
 * @returns {Promise<Object|null>} The user data or null if not found
 */
export async function getUserByUuid(uuid) {
  try {
    const user = await db.get(
      "SELECT id, username, uuid, created_at FROM users WHERE uuid = ?",
      [uuid]
    );
    return user || null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur par UUID:",
      error
    );
    return null;
  }
}

/**
 * Get user by ID with UUID
 * @param {number} userId - The user ID
 * @returns {Promise<Object|null>} The user data or null if not found
 */
export async function getUserById(userId) {
  try {
    const user = await db.get(
      "SELECT id, username, uuid, created_at FROM users WHERE id = ?",
      [userId]
    );
    return user || null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur par ID:",
      error
    );
    return null;
  }
}

/**
 * Remove a user session
 * @param {string} sessionId - The session ID
 */
export function removeUserSession(sessionId) {
  return removeSession(sessionId);
}
