document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initCourseFilters();
  initPricingToggle();
  initRegisterForm();
});

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initCourseFilters() {
  const category = document.getElementById("categoryFilter");
  const level = document.getElementById("levelFilter");
  const search = document.getElementById("courseSearch");
  const items = document.querySelectorAll("#courseGrid .filter-item");
  const empty = document.getElementById("emptyCourses");

  if (!category || !level || !search || !items.length) return;

  const applyFilters = () => {
    const categoryValue = category.value;
    const levelValue = level.value;
    const searchValue = search.value.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach((item) => {
      const categoryMatch = categoryValue === "all" || item.dataset.category === categoryValue;
      const levelMatch = levelValue === "all" || item.dataset.level === levelValue;
      const searchMatch = item.dataset.title.includes(searchValue);
      const isVisible = categoryMatch && levelMatch && searchMatch;

      item.classList.toggle("hidden", !isVisible);
      if (isVisible) visibleCount += 1;
    });

    if (empty) {
      empty.classList.toggle("hidden", visibleCount !== 0);
    }
  };

  [category, level].forEach((select) => select.addEventListener("change", applyFilters));
  search.addEventListener("input", applyFilters);
}

function initPricingToggle() {
  const buttons = document.querySelectorAll(".billing-btn");
  const prices = document.querySelectorAll(".price");

  if (!buttons.length || !prices.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const period = button.dataset.period;
      prices.forEach((price) => {
        const value = period === "full" ? price.dataset.full : price.dataset.monthly;
        price.textContent = value;
      });
    });
  });
}

function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const success = document.getElementById("formSuccess");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const courseSelect = document.getElementById("course");
  const agreeCheckbox = document.getElementById("agree");

  const validators = [
    {
      input: nameInput,
      validate: (value) => value.trim().length >= 3,
      message: "Введите имя не короче 3 символов."
    },
    {
      input: emailInput,
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: "Введите корректный email."
    },
    {
      input: phoneInput,
      validate: (value) => value.replace(/\D/g, "").length >= 11,
      message: "Введите корректный номер телефона."
    },
    {
      input: courseSelect,
      validate: (value) => value.trim() !== "",
      message: "Выберите курс."
    }
  ];

  const setError = (input, message = "") => {
    const errorBox = input.closest(".form-group")?.querySelector(".error-text");
    if (errorBox) errorBox.textContent = message;
    input.style.borderColor = message ? "#dc2626" : "rgba(20, 33, 61, 0.14)";
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let isValid = true;

    validators.forEach(({ input, validate, message }) => {
      const valid = validate(input.value);
      setError(input, valid ? "" : message);
      if (!valid) isValid = false;
    });

    const checkboxError = document.querySelector(".checkbox-error");
    if (!agreeCheckbox.checked) {
      checkboxError.textContent = "Подтвердите согласие перед отправкой.";
      isValid = false;
    } else {
      checkboxError.textContent = "";
    }

    if (!isValid) {
      success.classList.add("hidden");
      return;
    }

    success.classList.remove("hidden");
    form.reset();
    validators.forEach(({ input }) => setError(input, ""));
  });
}
