const REVIEW_STORAGE_KEY = "apnaGharReviewProperties";

function getReviewProperties() {
  try {
    return JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveReviewProperties(properties) {
  localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(properties));
}

function updateReviewCount() {
  const badge = document.getElementById("reviewCountBadge");
  if (badge) badge.textContent = getReviewProperties().length;
}

function getPropertyFromCard(card, index) {
  const image = card.querySelector(".carousel-item.active img, img");
  const title = card.querySelector(".card-title");
  const description = card.querySelector(".card-text");

  return {
    id: card.dataset.reviewId || `property-${index + 1}`,
    image: image ? image.getAttribute("src") : "",
    imageAlt: image ? image.getAttribute("alt") : "Property image",
    title: title ? title.textContent.trim() : "Property",
    description: description ? description.textContent.trim() : "",
  };
}

function setButtonState(button, isAdded) {
  button.textContent = isAdded ? "Added to review" : "Add to review";
  button.classList.toggle("btn-success", isAdded);
  button.classList.toggle("btn-primary", !isAdded);
}

function setupReviewButtons() {
  const savedProperties = getReviewProperties();

  document.querySelectorAll(".property-card").forEach((card, index) => {
    const property = getPropertyFromCard(card, index);
    card.dataset.reviewId = property.id;
    const button = card.querySelector(".add-to-review");
    if (!button) return;

    setButtonState(button, savedProperties.some((item) => item.id === property.id));

    button.addEventListener("click", (event) => {
      event.preventDefault();
      const properties = getReviewProperties();

      if (!properties.some((item) => item.id === property.id)) {
        properties.push(property);
        saveReviewProperties(properties);
      }

      setButtonState(button, true);
      updateReviewCount();
    });
  });
}

function renderReviewProperties() {
  const container = document.getElementById("reviewCardsContainer");
  const emptyState = document.getElementById("reviewEmptyState");
  if (!container) return;

  const properties = getReviewProperties();
  container.replaceChildren();
  emptyState.hidden = properties.length > 0;

  properties.forEach((property) => {
    const column = document.createElement("div");
    column.className = "col-12 col-md-6 col-lg-4 review-card-col";

    const card = document.createElement("article");
    card.className = "card property-card";

    if (property.image) {
      const image = document.createElement("img");
      image.className = "card-img-top";
      image.src = property.image;
      image.alt = property.imageAlt || property.title;
      card.append(image);
    }

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";
    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = property.title;
    const description = document.createElement("p");
    description.className = "card-text";
    description.textContent = property.description;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-outline-danger mt-auto align-self-start";
    removeButton.textContent = "Remove from review";
    removeButton.addEventListener("click", () => {
      saveReviewProperties(getReviewProperties().filter((item) => item.id !== property.id));
      renderReviewProperties();
      updateReviewCount();
    });

    body.append(title, description, removeButton);
    card.append(body);
    column.append(card);
    container.append(column);
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  const message = document.getElementById("contactFormMessage");
  if (!form || !message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;

    const name = form.elements.name.value.trim();
    message.textContent = `Thanks, ${name}! Your message has been sent. We will contact you soon.`;
    message.hidden = false;
    form.reset();
    form.classList.remove("was-validated");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateReviewCount();
  setupReviewButtons();
  renderReviewProperties();
  setupContactForm();
});
