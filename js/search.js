/**
 * @file search.js
 * @description Manages the search popup functionality, including opening, closing, and fetching results from the API.
 */

/**
 * Initializes the search popup functionality.
 * Opens the popup when the search button is clicked, closes it when clicking outside or on the close button,
 * and fetches listings based on the search query.
 */
export function initSearchPopup() {
    const toggleBtn = document.getElementById("search-toggle");
    const popup = document.getElementById("search-popup");
    const closeBtn = document.getElementById("close-search-popup");
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
  
    if (!toggleBtn || !popup || !closeBtn || !searchInput || !searchResults) return;
  
    toggleBtn.addEventListener("click", () => {
      popup.classList.remove("hidden");
      popup.classList.add("flex");
    });
  
    closeBtn.addEventListener("click", () => {
      popup.classList.remove("flex");
      popup.classList.add("hidden");
    });
  
    document.addEventListener("click", (e) => {
      if (!popup.contains(e.target) && !toggleBtn.contains(e.target)) {
        popup.classList.remove("flex");
        popup.classList.add("hidden");
      }
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        popup.classList.remove("flex");
        popup.classList.add("hidden");
      }
    });
  
    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim();
  
      if (query === "") {
        searchResults.innerHTML = "";
        return;
      }
  
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/auction/listings?title=${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-Noroff-API-Key": "9fe13230-12f3-4f0d-83c3-5703f9ff0bf6",
            },
          }
        );
  
        const { data } = await response.json();
        const filteredResults = data.filter((listing) =>
          listing.title.toLowerCase().includes(query.toLowerCase())
        );
        displaySearchResults(filteredResults.slice(0, 3));
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    });
  
    /**
     * Displays the search results in the search popup.
     * @param {Array} listings - List of filtered listings to be displayed.
     */
    function displaySearchResults(listings) {
      searchResults.innerHTML = "";
  
      if (listings.length === 0) {
        searchResults.innerHTML = `<li>No results found</li>`;
        return;
      }
  
      listings.forEach((listing) => {
        const listItem = document.createElement("li");
        listItem.classList.add("p-2", "cursor-pointer", "hover:bg-gray-100");
  
        listItem.innerHTML = `
          <a href="listing-details.html?id=${listing.id}" class="text-indigo-500 hover:underline">
            ${listing.title}
          </a>
        `;
  
        searchResults.appendChild(listItem);
      });
    }
  }