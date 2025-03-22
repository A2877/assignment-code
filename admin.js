document.addEventListener("DOMContentLoaded", function () {
  // --- Local Storage Helpers ---
  function loadGalleryItemsFromLocalStorage() {
    const stored = localStorage.getItem("galleryItems");
    return stored ? JSON.parse(stored) : [];
  }
  function saveGalleryItemsToLocalStorage(items) {
    localStorage.setItem("galleryItems", JSON.stringify(items));
  }

  // --- Initialize Gallery Data ---
  let galleryItems = loadGalleryItemsFromLocalStorage();
  if (galleryItems.length === 0) {
    galleryItems = [
      {
        id: Date.now(),
        url: "./image/sample-wedding.jpg",
        category: "wedding",
        timestamp: Date.now(),
      },
    ];
  }

  let currentFilter = "all";
  let modalMode = "add"; // "add" or "edit"
  let currentEditingId = null;

  // --- Get DOM Elements ---
  const galleryGrid = document.getElementById("galleryGrid");
  const addImageBtn = document.getElementById("addImageBtn");
  const imageForm = document.getElementById("imageForm");
  const sortSelect = document.getElementById("sortSelect");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const addImageFile = document.getElementById("addImageFile");

  // Bootstrap Modal instances
  const imageModalEl = document.getElementById("imageModal");
  const imageModal = new bootstrap.Modal(imageModalEl);
  const lightboxModalEl = document.getElementById("lightboxModal");
  const lightboxModal = new bootstrap.Modal(lightboxModalEl);

  const lightboxImage = document.getElementById("lightboxImage");

  // --- Render Gallery ---
  function renderGallery() {
    galleryGrid.innerHTML = "";
    let filteredItems = galleryItems.filter(
      (item) => currentFilter === "all" || item.category === currentFilter
    );

    if (sortSelect.value === "newest") {
      filteredItems.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      filteredItems.sort((a, b) => a.timestamp - b.timestamp);
    }

    filteredItems.forEach((item) => {
      // Create a column wrapper for Bootstrap grid
      const col = document.createElement("div");
      col.className = "col-md-4 col-lg-3";

      // Create card element for gallery item
      const card = document.createElement("div");
      card.className = "card gallery-item";

      // Image element
      const img = document.createElement("img");
      img.src = item.url;
      img.alt = `${item.category} image`;
      img.className = "card-img-top";

      // Overlay with category and date
      const overlay = document.createElement("div");
      overlay.className = "overlay";
      overlay.textContent =
        item.category.charAt(0).toUpperCase() +
        item.category.slice(1) +
        " | " +
        new Date(item.timestamp).toLocaleDateString();

      // Action buttons container
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "actions";

      // Edit button
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm";
      editBtn.innerHTML = '<i class="fa fa-pencil"></i>';
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        openModal("edit", item);
      });

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm";
      deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
      deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        deleteImage(item.id);
      });

      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      // Card click opens lightbox
      card.addEventListener("click", function () {
        openLightbox(item.url);
      });

      // Assemble card
      card.appendChild(img);
      card.appendChild(overlay);
      card.appendChild(actionsDiv);
      col.appendChild(card);
      galleryGrid.appendChild(col);
    });
  }

  // --- Modal Functions ---
  function openModal(mode, item = null) {
    modalMode = mode;
    if (mode === "add") {
      imageForm.reset();
      currentEditingId = null;
      document.getElementById("modalTitle").textContent = "Add New Image";
    } else if (mode === "edit" && item) {
      currentEditingId = item.id;
      document.getElementById("modalTitle").textContent = "Edit Image";
      document.getElementById("imageCategory").value = item.category;
      // For edit, file input remains empty; user must select a new image
    }
    imageModal.show();
  }

  function deleteImage(id) {
    galleryItems = galleryItems.filter((item) => item.id !== id);
    saveGalleryItemsToLocalStorage(galleryItems);
    renderGallery();
  }

  imageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const category = document.getElementById("imageCategory").value;
    if (addImageFile.files && addImageFile.files[0]) {
      const file = addImageFile.files[0];
      const reader = new FileReader();
      reader.onload = function (ev) {
        saveImage(ev.target.result, category);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image file.");
    }
  });

  function saveImage(imageUrl, category) {
    if (modalMode === "add") {
      const newItem = {
        id: Date.now(),
        url: imageUrl,
        category: category,
        timestamp: Date.now(),
      };
      galleryItems.push(newItem);
    } else if (modalMode === "edit" && currentEditingId !== null) {
      galleryItems = galleryItems.map((item) => {
        if (item.id === currentEditingId) {
          return {
            ...item,
            url: imageUrl,
            category: category,
            timestamp: item.timestamp, // Keep original timestamp
          };
        }
        return item;
      });
    }
    saveGalleryItemsToLocalStorage(galleryItems);
    imageModal.hide();
    renderGallery();
  }

  function openLightbox(url) {
    lightboxImage.src = url;
    lightboxModal.show();
  }

  // --- Filter & Sort Event Listeners ---
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      renderGallery();
    });
  });

  sortSelect.addEventListener("change", renderGallery);
  addImageBtn.addEventListener("click", function () {
    openModal("add");
  });

  // --- Initial Render ---
  renderGallery();
});
