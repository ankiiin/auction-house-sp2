/**
 * @file search.js
 * @description Manages the search functionality for both desktop and mobile.
 */

export function initSearchPopup() {
  const desktopToggle = document.getElementById("search-toggle");
  const desktopPopup = document.getElementById("search-popup");
  const desktopClose = document.getElementById("close-search-popup");
  const desktopInput = document.getElementById("search-input");
  const desktopResults = document.getElementById("search-results");

  const mobileInput = document.getElementById("search-modal-input");
  const mobileResults = document.getElementById("search-modal-results");
  const mobileClose = document.getElementById("close-search-modal");
  const mobileOverlay = document.getElementById("search-modal-overlay");

  // --- DESKTOP SEARCH LOGIKK ---
  if (desktopToggle && desktopPopup && desktopClose) {
    desktopToggle.addEventListener("click", () => {
      desktopPopup.classList.remove("hidden");
      desktopPopup.classList.add("flex");
    });

    desktopClose.addEventListener("click", () => {
      desktopPopup.classList.add("hidden");
      desktopPopup.classList.remove("flex");
    });

    document.addEventListener("click", (e) => {
      if (
        !desktopPopup.contains(e.target) &&
        !desktopToggle.contains(e.target)
      ) {
        desktopPopup.classList.add("hidden");
        desktopPopup.classList.remove("flex");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        desktopPopup.classList.add("hidden");
        desktopPopup.classList.remove("flex");
      }
    });
  }

  if (desktopInput && desktopResults) {
    desktopInput.addEventListener("input", (e) =>
      handleSearch(e, desktopResults),
    );
  }

  // --- MOBIL SEARCH LOGIKK ---
  if (mobileInput && mobileResults) {
    mobileInput.addEventListener("input", (e) => {
      console.log("Mobile input:", e.target.value); // Debug
      handleSearch(e, mobileResults);
    });
  }

  if (mobileClose && mobileOverlay) {
    mobileClose.addEventListener("click", () => {
      mobileOverlay.classList.add("hidden");
    });

    document.addEventListener("click", (e) => {
      const modal = document.getElementById("search-modal");
      if (
        modal &&
        !modal.contains(e.target) &&
        !e.target.closest("#open-mobile-search")
      ) {
        mobileOverlay.classList.add("hidden");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        mobileOverlay.classList.add("hidden");
      }
    });
  }
}

/**
 * Fetches search results from the API and displays them.
 * @param {Event} e
 * @param {HTMLElement} container
 */
async function handleSearch(e, container) {
  const query = e.target.value.trim();

  if (!query) {
    container.innerHTML = "";
    container.classList.add("hidden");
    return;
  }

  try {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/listings?title=${query}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Noroff-API-Key": "9fe13230-12f3-4f0d-83c3-5703f9ff0bf6",
        },
      },
    );

    const { data } = await response.json();
    const filtered = data.filter((listing) =>
      listing.title.toLowerCase().includes(query.toLowerCase()),
    );

    displaySearchResults(filtered.slice(0, 5), container);
  } catch (error) {
    container.innerHTML = `<li class="p-2 text-red-500">Error loading results</li>`;
    container.classList.remove("hidden");
  }
}

/**
 * Renders the search results in a dropdown list.
 * @param {Array} listings
 * @param {HTMLElement} container
 */
function displaySearchResults(listings, container) {
  container.innerHTML = "";
  container.classList.remove("hidden");

  if (listings.length === 0) {
    container.innerHTML = `<li class="p-2 text-sm text-gray-600">No results found</li>`;
    return;
  }

  listings.forEach((listing) => {
    const item = document.createElement("li");
    item.className = "p-2 text-sm hover:bg-gray-100";

    item.innerHTML = `
      <a href="listing-details.html?id=${listing.id}" class="block text-indigo-600 hover:underline">
        ${listing.title}
      </a>
    `;

    container.appendChild(item);
  });
}
