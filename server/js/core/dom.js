export function createElementFromHTML(htmlString) {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstChild;
}

export function populateSelect(selectId, options, defaultText = null) {
  const select = document.getElementById(selectId);
  if (!select) {
    console.error(`Select element ${selectId} not found!`);
    return;
  }

  if (defaultText) {
    select.innerHTML = `<option value="">${defaultText}</option>`;
  } else {
    select.innerHTML = "";
  }

  options.forEach((option, index) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value || option.id;
    optionElement.textContent = option.text || option.name;
    select.appendChild(optionElement);
  });
}

export function getFormData(form) {
  const formElement =
    typeof form === "string" ? document.getElementById(form) : form;
  if (!formElement) return {};

  const formData = new FormData(formElement);
  const data = {};

  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  return data;
}

export function resetForm(form) {
  const formElement =
    typeof form === "string" ? document.getElementById(form) : form;
  if (!formElement) return;

  formElement.reset();

  const errorElements = formElement.querySelectorAll(
    ".error-message, #error-message"
  );
  errorElements.forEach((el) => (el.textContent = ""));
}

export function showError(message, elementId = "error-message") {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = "block";
  }
}

export function showSuccess(message, elementId = "success-message") {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.display = "block";
  }
}

export function clearMessages(
  elementIds = ["error-message", "success-message"]
) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = "";
      element.style.display = "none";
    }
  });
}

export function showLoading(element, loadingText = "Chargement...") {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;
  if (!el) return;

  el.dataset.originalText = el.textContent;
  el.textContent = loadingText;
  el.disabled = true;
}

export function hideLoading(element) {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;
  if (!el) return;

  if (el.dataset.originalText) {
    el.textContent = el.dataset.originalText;
    delete el.dataset.originalText;
  }
  el.disabled = false;
}

export function toggleVisibility(element, show) {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;
  if (!el) return;

  el.style.display = show ? "block" : "none";
}

export function showElement(element) {
  toggleVisibility(element, true);
}

export function hideElement(element) {
  toggleVisibility(element, false);
}

export function addEventListenerWithCleanup(element, event, handler) {
  const el =
    typeof element === "string" ? document.getElementById(element) : element;
  if (!el) return () => {};

  el.addEventListener(event, handler);

  return () => {
    el.removeEventListener(event, handler);
  };
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function initSidebarToggle() {
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mobileOverlay = document.querySelector(".mobile-overlay");

  if (sidebarToggle && sidebar && mobileOverlay) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
    });

    mobileOverlay.addEventListener("click", () => {
      sidebar.classList.remove("active");
      mobileOverlay.classList.remove("active");
    });
  }
}
