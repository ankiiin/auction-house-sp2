/**
 * Sends a PUT request to the API to update data.
 * @param {string} url - The API URL.
 * @param {Object} data - The data to update.
 * @param {string} token - The authorization token.
 * @returns {Promise<Object>} - The response from the API.
 */
export async function sendPutRequest(url, data, token) {
    try {
      const response = await fetch(`https://v2.api.noroff.dev/${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.errors ? result.errors[0].message : "Unknown error");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Renders the user's profile data to the dashboard.
   * @param {Object} data - The user profile data.
   */
  export function renderProfile(data) {
    const nameEl = document.getElementById("profile-name");
    const avatarEl = document.getElementById("profile-avatar");
    const bannerEl = document.getElementById("profile-banner");
    const bioEl = document.getElementById("profile-bio");
  
    if (nameEl) nameEl.textContent = data.name;
    if (bioEl) bioEl.textContent = data.bio || "No bio yet";
  
    if (avatarEl && data.avatar && data.avatar.trim() !== "") {
      avatarEl.src = data.avatar;
    }
  
    if (bannerEl && data.banner && data.banner.trim() !== "") {
      bannerEl.style.backgroundImage = `url('${data.banner}')`;
    }
  }
  
  /**
   * Renders the user's listings or shows a fallback message.
   * @param {Array} listings - Array of listings.
   */
  export function renderListings(listings = []) {
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