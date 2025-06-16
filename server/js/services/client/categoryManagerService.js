import { apiService } from "../apiService.js";
import { SelectPopulator } from "../../modules/ui/selectPopulator.js";

export class CategoryManagerService {
  constructor() {
    this.categories = [];
    this.onCategoryChange = null;
  }

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

  getCategoryById(categoryId) {
    return this.categories.find((cat) => cat.id === categoryId) || null;
  }

  getCategoryName(categoryId) {
    const category = this.getCategoryById(categoryId);
    return category?.name || "Aucune";
  }

  getSelectedCategoryId() {
    const filterSelect = document.getElementById("category-filter-select");
    return filterSelect?.value || null;
  }

  setSelectedCategory(categoryId) {
    const filterSelect = document.getElementById("category-filter-select");
    if (filterSelect) {
      filterSelect.value = categoryId || "";
    }
  }

  resetFilter() {
    this.setSelectedCategory(null);
  }

  getCategories() {
    return this.categories;
  }
}

export const categoryManagerService = new CategoryManagerService();
