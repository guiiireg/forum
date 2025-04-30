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
      return { success: false, message: "Username already exists" };
    }
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      password,
    ]);
    return { success: true, message: "Registration successful" };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      success: false,
      message: "An error occurred during registration",
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
        message: "Username or password incorrect",
      };
    }
    return { success: true, message: "Login successful" };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: "An error occurred during login",
    };
  }
}
