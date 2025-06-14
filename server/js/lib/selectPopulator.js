/**
 * Select Populator for handling dropdown menus
 */
export class SelectPopulator {
  /**
   * Populate a select element with options
   * @param {string} selectId - ID of the select element
   * @param {Array} items - Array of items to populate
   * @param {Object} config - Configuration options
   */
  static populate(selectId, items, config = {}) {
    const select = document.getElementById(selectId);
    if (!select) return;

    const {
      valueField = "id",
      textField = "name",
      defaultOption = null,
      clearExisting = true,
    } = config;

    if (clearExisting) {
      select.innerHTML = "";
    }

    if (defaultOption) {
      const defaultOptionElement = document.createElement("option");
      defaultOptionElement.value = defaultOption.value || "";
      defaultOptionElement.textContent = defaultOption.text;
      select.appendChild(defaultOptionElement);
    }

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item[valueField];
      option.textContent = item[textField];
      select.appendChild(option);
    });
  }

  /**
   * Populate categories select
   * @param {string} selectId - ID of the select element
   * @param {Array} categories - Array of categories
   * @param {string} defaultText - Default option text
   */
  static populateCategories(
    selectId,
    categories,
    defaultText = "Sélectionnez une catégorie"
  ) {
    this.populate(selectId, categories, {
      defaultOption: { value: "", text: defaultText },
    });
  }

  /**
   * Populate category filter select
   * @param {string} selectId - ID of the select element
   * @param {Array} categories - Array of categories
   */
  static populateCategoryFilter(selectId, categories) {
    this.populate(selectId, categories, {
      defaultOption: { value: "", text: "Toutes les catégories" },
    });
  }
}
