/**
 * @file search.js
 * @description Handles the search popup functionality: open/close and live search of listings.
 */

let allListings = []; 

/**
 * Fetches all listings from the API
 */
async function fetchListings() {
  try {
    const response = await fetch("https://api.noroff.dev/api/v1/auction/listings");
    if (!response.ok) throw new Error("Failed to fetch listings");
    const data = await response.json();
    allListings = data;
  } catch (error) {
    console.error("Error fetching listings:", error);
  }
}

/**
 * Filters listings based on search query
 * @param {string} query
 * @returns {Array}
 */
function searchListings(query) {
  return allListings.filter(listing =>
    listing.title.toLowerCase().includes(query.toLowerCase())
  );
}

/**
 * Renders search results into the DOM
 * @param {Array} results
 * @param {HTMLElement} container
 */
function displaySearchResults(results, container) {
  if (results.length === 0) {
    container.innerHTML = `<li class="text-gray-500 text-sm">Ingen treff.</li>`;
    return;
  }

  container.innerHTML = results
    .slice(0, 10)
    .map(
      listing => `
      <li class="border-b py-1">
        <a href="listing-details.html?id=${listing.id}">
          ${listing.title}
        </a>
      </li>
    `
    )
    .join("");
}

/**
 * Initializes the search popup modal and functionality.
 */
export function initSearchPopup() {
  const toggleBtn = document.getElementById("search-toggle");
  const popup = document.getElementById("search-popup");
  const closeBtn = document.getElementById("close-search-popup");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");

  if (!toggleBtn || !popup || !closeBtn || !input || !results) return;

  toggleBtn.addEventListener("click", async () => {
    const rect = toggleBtn.getBoundingClientRect();
    popup.style.position = "absolute";
    popup.style.top = `${rect.bottom + window.scrollY + 8}px`;
    popup.style.left = `${rect.left + window.scrollX}px`;

    popup.classList.remove("hidden");
    popup.classList.add("block");
    input.focus();

    if (allListings.length === 0) {
      await fetchListings();
    }
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.remove("block");
    popup.classList.add("hidden");
    input.value = "";
    results.innerHTML = "";
  });

  input.addEventListener("input", () => {
    const query = input.value.trim();
    if (query.length < 2) {
      results.innerHTML = "";
      return;
    }

    const filtered = searchListings(query);
    displaySearchResults(filtered, results);
  });
}