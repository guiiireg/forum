import db from "./database.js";
import { createSession, getSession, COOKIE_OPTIONS } from "./cache.js";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

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

export async function loginUser(username, password, res) {
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

    const token = createSession(user.id, {
      username: user.username,
      id: user.id,
      uuid: user.uuid,
    });

    res.cookie('authToken', token, COOKIE_OPTIONS);

    return {
      success: true,
      message: "Connexion réussie",
      userId: user.id,
      username: user.username,
      uuid: user.uuid,
    };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la connexion",
    };
  }
}

export function logoutUser(res) {
  res.clearCookie('authToken');
  return {
    success: true,
    message: "Déconnexion réussie",
  };
}

export function getUserFromSession(token) {
  const session = getSession(token);
  return session ? session.userData : null;
}

export function getUserFromRequest(req) {
  const token = req.cookies.authToken;
  if (!token) return null;
  
  const session = getSession(token);
  return session ? session.userData : null;
}

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
