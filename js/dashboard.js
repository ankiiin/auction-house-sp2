import { loadNavbar, loadFooter } from "./components-loader.js";

const API_KEY = "e6f16bc6-a633-40af-ad6b-db10b065d4e2";

/**
 * Initializes the dashboard when the DOM is ready.
 * This function fetches and displays the user's profile and listings.
 * 
 * @async
 * @function document.addEventListener
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
  await loadFooter();
  initDashboard();
});

/**
 * Fetches the user's profile and listings from the API and renders them.
 * 
 * @async
 * @function initDashboard
 */
async function initDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.name) {
    return;
  }

  try {
    const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}?_listings=true`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const { data } = await response.json();
    renderProfile(data);
    renderListings(data.listings);
  } catch (error) {
    return;
  }
}

/**
 * Renders the user's profile information on the dashboard.
 * 
 * @param {Object} data - The user's profile data.
 * @param {string} data.name - The user's name.
 * @param {string} data.bio - The user's bio.
 * @param {Object} data.avatar - The user's avatar image.
 * @param {string} data.avatar.url - The URL for the avatar image.
 * @param {Object} data.banner - The user's profile banner.
 * @param {string} data.banner.url - The URL for the banner image.
 */
function renderProfile(data) {
  const nameEl = document.getElementById("profile-name");
  const avatarEl = document.getElementById("profile-avatar");
  const bannerEl = document.getElementById("profile-banner");
  const bioEl = document.getElementById("profile-bio");

  if (nameEl) nameEl.textContent = data.name;
  if (bioEl) bioEl.textContent = data.bio || "No bio yet";

  if (avatarEl && data.avatar && data.avatar.url) {
    avatarEl.src = data.avatar.url;
  } else {
    avatarEl.src = "https://via.placeholder.com/150";
  }

  if (bannerEl && data.banner && data.banner.url) {
    bannerEl.style.backgroundImage = `url('${data.banner.url}')`;
  } else {
    bannerEl.style.backgroundImage = "url('https://via.placeholder.com/1500x500')";
  }
}

/**
 * Renders the user's listings or shows a fallback message if no listings are available.
 * 
 * @param {Array} listings - The user's listings.
 * @param {Object} listing - A single listing object.
 * @param {string} listing.id - The ID of the listing.
 * @param {string} listing.title - The title of the listing.
 * @param {string} listing.description - The description of the listing.
 * @param {Array} listing.media - The media associated with the listing.
 * @param {Object} listing.media[0] - The media object containing URL and alt text.
 * @param {string} listing.media[0].url - The URL for the listing's main image.
 * @param {string} listing.media[0].alt - The alt text for the listing image.
 */
function renderListings(listings = []) {
  const listingsContainer = document.getElementById("my-listings");
  const emptyState = document.getElementById("no-listings");

  if (!listingsContainer || !emptyState) return;

  listingsContainer.innerHTML = "";

  if (listings.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  listings.forEach((listing) => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow-sm border border-gray-200";

    const imageUrl = listing.media?.[0]?.url || "https://via.placeholder.com/400x300";
    const imageAlt = listing.media?.[0]?.alt || listing.title;

    card.innerHTML = `
      <img src="${imageUrl}" alt="${imageAlt}" class="w-full h-40 object-cover rounded mb-2">
      <h4 class="text-md font-semibold text-gray-800 mb-1">${listing.title}</h4>
      <p class="text-sm text-gray-600 mb-2">${listing.description || "No description"}</p>
      <div class="flex justify-between items-center mt-4">
        <a href="listing-details.html?id=${listing.id}" class="text-indigo-500 text-sm hover:underline">View Listing</a>
        <button class="text-red-500 text-sm hover:underline" data-id="${listing.id}">Delete</button>
      </div>
    `;

    listingsContainer.appendChild(card);

    const deleteBtn = card.querySelector("button[data-id]");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const listingId = deleteBtn.getAttribute("data-id");
        deleteListing(listingId);
      });
    }
  });
}

/**
 * Deletes a listing by ID and refreshes the dashboard.
 * 
 * @param {string} id - The ID of the listing to delete.
 * @async
 * @function deleteListing
 */
async function deleteListing(id) {
  const confirmed = confirm("Are you sure you want to delete this listing?");
  if (!confirmed) return;

  try {
    const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete listing");
    }

    alert("Listing deleted");
    initDashboard();
  } catch (error) {
    console.error("Error deleting listing:", error);
    alert("Could not delete the listing. Try again.");
  }
}