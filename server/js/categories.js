import db from "./database.js";

/**
 * Get all categories
 * @returns {Promise<Object>} The categories
 */
export async function getAllCategories() {
  try {
    const categories = await db.all(`
      SELECT * FROM categories 
      ORDER BY name ASC
    `);
    return { success: true, categories };
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de la récupération des catégories",
    };
  }
}

/**
 * Get category by ID
 * @param {number} categoryId - The category ID
 * @returns {Promise<Object>} The category
 */
export async function getCategoryById(categoryId) {
  try {
    const category = await db.get("SELECT * FROM categories WHERE id = ?", [
      categoryId,
    ]);

    if (!category) {
      return {
        success: false,
        message: "Catégorie non trouvée",
      };
    }

    return { success: true, category };
  } catch (error) {
    console.error("Erreur lors de la récupération de la catégorie:", error);
    return {
      success: false,
      message:
        "Une erreur est survenue lors de la récupération de la catégorie",
    };
  }
}

/**
 * Get the "Autres" category ID
 * @returns {Promise<number>} The "Autres" category ID
 */
export async function getAutresCategoryId() {
  try {
    const category = await db.get(
      "SELECT id FROM categories WHERE name = 'Autres'"
    );
    return category ? category.id : null;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la catégorie 'Autres':",
      error
    );
    return null;
  }
}
