export class SelectPopulator {
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

  static populateCategories(
    selectId,
    categories,
    defaultText = "Sélectionnez une catégorie"
  ) {
    this.populate(selectId, categories, {
      defaultOption: { value: "", text: defaultText },
    });
  }

  static populateCategoryFilter(selectId, categories) {
    this.populate(selectId, categories, {
      defaultOption: { value: "", text: "Toutes les catégories" },
    });
  }
}
