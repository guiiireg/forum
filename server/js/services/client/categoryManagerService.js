import { apiService } from "../apiService.js";
import { SelectPopulator } from "../../lib/selectPopulator.js";

/**
 * Category Manager Service - Handles category loading and filtering
 */
export class CategoryManagerService {
  constructor() {
    this.categories = [];
    this.onCategoryChange = null;
  }

  /**
   * Load and populate all category selects
   */
  async loadAndPopulateCategories() {
    try {
      const result = await apiService.getAllCategories();

      if (result.success && result.data.success) {
        this.categories = result.data.categories;

        SelectPopulator.populateCategories("category", this.categories);
        SelectPopulator.populateCategoryFilter(
          "category-filter-select",
          this.categories
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  }

  /**
   * Setup category filter event listener
   * @param {Function} onFilterChange - Callback when filter changes
   */
  setupCategoryFilter(onFilterChange) {
    const filterSelect = document.getElementById("category-filter-select");
    if (!filterSelect) return;

    this.onCategoryChange = onFilterChange;

    filterSelect.addEventListener("change", async () => {
      const categoryId = filterSelect.value || null;
      if (this.onCategoryChange) {
        await this.onCategoryChange(categoryId);
      }
    });
  }

  /**
   * Get category by ID
   * @param {number} categoryId - Category ID
   * @returns {Object|null} Category object or null
   */
  getCategoryById(categoryId) {
    return this.categories.find((cat) => cat.id === categoryId) || null;
  }

  /**
   * Get category name by ID
   * @param {number} categoryId - Category ID
   * @returns {string} Category name or "Aucune"
   */
  getCategoryName(categoryId) {
    const category = this.getCategoryById(categoryId);
    return category?.name || "Aucune";
  }

  /**
   * Get currently selected category from filter
   * @returns {string|null} Selected category ID or null
   */
  getSelectedCategoryId() {
    const filterSelect = document.getElementById("category-filter-select");
    return filterSelect?.value || null;
  }

  /**
   * Set selected category in filter
   * @param {string|null} categoryId - Category ID to select
   */
  setSelectedCategory(categoryId) {
    const filterSelect = document.getElementById("category-filter-select");
    if (filterSelect) {
      filterSelect.value = categoryId || "";
    }
  }

  /**
   * Reset category filter to show all categories
   */
  resetFilter() {
    this.setSelectedCategory(null);
  }

  /**
   * Get all categories
   * @returns {Array} Array of categories
   */
  getCategories() {
    return this.categories;
  }
}

export const categoryManagerService = new CategoryManagerService();
