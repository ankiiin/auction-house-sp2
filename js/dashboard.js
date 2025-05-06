import { loadNavbar, loadFooter } from "./components-loader.js";

const API_KEY = "e6f16bc6-a633-40af-ad6b-db10b065d4e2";

/**
 * Initializes the dashboard when the DOM is ready.
 * Fetches and displays the user's profile and listings, and handles the Add Credits functionality.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
  await loadFooter();
  initDashboard();
  handleAddCredits();
});

/**
 * Initializes the dashboard by fetching the user's profile and listings from the API.
 * @async
 * @function initDashboard
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
        "X-Noroff-API-Key": API_KEY,
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
 * Renders the user's profile information on the dashboard.
 * @param {Object} data - The user's profile data.
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
 * @param {Array} listings - The user's listings.
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

/**
 * Handles the logic for showing and closing the Add Credits modal.
 * @function handleAddCredits
 */
function handleAddCredits() {
  const addCreditsButton = document.getElementById("add-credits-btn");
  const modal = document.getElementById("add-credits-modal");
  const closeModalButton = document.getElementById("close-modal");
  const addAmountButton = document.getElementById("add-amount-button");
  const creditsInput = document.getElementById("credits-input");

  addCreditsButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  addAmountButton.addEventListener("click", () => {
    const amount = parseInt(creditsInput.value, 10);

    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    updateUserCredits(amount);

    modal.classList.add("hidden");
  });
}

/**
 * Updates the user's credits by sending the data to the API.
 * @param {number} amount - The amount of credits to add.
 */
async function updateUserCredits(amount) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user || !user.name) {
    alert("You need to be logged in to add credits.");
    return;
  }

  const options = {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ credits: amount }),
  };

  try {
    const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/credits`, options);
    const data = await response.json();

    if (response.ok) {
      alert("Credits added successfully!");
      displayUserCredits();
    } else {
      alert("Failed to add credits: " + data.errors[0].message);
    }
  } catch (error) {
    console.error("Error updating user credits:", error);
    alert("An error occurred while adding credits.");
  }
}

/**
 * Fetches and displays the logged-in user's available credits.
 */
async function displayUserCredits() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("You need to be logged in to fetch credits.");
    return;
  }

  try {
    const response = await fetch("https://v2.api.noroff.dev/auction/user/credits", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const data = await response.json();
    const creditsDisplay = document.getElementById("credits-display");
    creditsDisplay.textContent = `Credits: ${data.credits || 0}`;
  } catch (error) {
    console.error("Error fetching user credits:", error);
    alert("Failed to load credits.");
  }
}