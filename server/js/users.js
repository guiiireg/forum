import db from "./database.js";

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
    const result = await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      password,
    ]);
    return { 
      success: true, 
      message: "Inscription réussie",
      userId: result.lastID,
      username: username
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
    if (!user || user.password !== password) {
      return {
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      };
    }
    return {
      success: true,
      message: "Connexion réussie",
      userId: user.id,
      username: user.username,
    };
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la connexion",
    };
  }
}
