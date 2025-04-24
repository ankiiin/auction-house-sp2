/**
 * @file dashboard.js
 * @description Displays the user profile and their listings using data fetched from the Noroff Auction API.
 */

import { loadNavbar, loadFooter } from "./components-loader.js";

/**
 * Initializes the dashboard when DOM is ready.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
  await loadFooter();
  initDashboard();
});

/**
 * Initializes dashboard by fetching user data and listings.
 */
async function initDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.name) {
    console.error("User not found in localStorage.");
    return;
  }

  try {
    const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}?_listings=true`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
      },
    });

    const { data } = await response.json();
    renderProfile(data);
    renderListings(data.listings);
  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

/**
 * Renders profile info on the dashboard.
 * @param {Object} data - Profile data
 */
function renderProfile(data) {
  const nameEl = document.getElementById("profile-name");
  const avatarEl = document.getElementById("profile-avatar");
  const bannerEl = document.getElementById("profile-banner");
  const bioEl = document.getElementById("profile-bio");

  if (nameEl) nameEl.textContent = data.name;
  if (bioEl) bioEl.textContent = data.bio || "No bio yet";

  if (avatarEl && typeof data.avatar === "string" && data.avatar.trim() !== "") {
    avatarEl.src = data.avatar;
  } else if (avatarEl) {
    avatarEl.removeAttribute("src");
  }

  if (bannerEl && typeof data.banner === "string" && data.banner.trim() !== "") {
    bannerEl.style.backgroundImage = `url('${data.banner}')`;
  }
}

/**
 * Renders the user's listings or shows a fallback message.
 * @param {Array} listings - Array of listings
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

    card.innerHTML = `
      <img src="${listing.media?.[0] || ""}" alt="${listing.title}" class="w-full h-40 object-cover rounded mb-2">
      <h4 class="text-md font-semibold text-gray-800 mb-1">${listing.title}</h4>
      <p class="text-sm text-gray-600 mb-2">${listing.description || "No description"}</p>
      <button class="text-indigo-500 text-sm hover:underline" data-id="${listing.id}">View Listing</button>
    `;

    listingsContainer.appendChild(card);
  });
}