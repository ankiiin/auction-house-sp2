/**
 * Sends a PUT request to the API to update data.
 * @async
 * @param {string} url - The API endpoint.
 * @param {Object} data - The data to be updated.
 * @param {string} token - The user's access token.
 * @returns {Promise<Object>} - The updated resource or error object.
 */
export async function sendPutRequest(url, data, token) {
    try {
      const response = await fetch(`https://v2.api.noroff.dev/${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
   * Updates the user's credits in localStorage and UI.
   * @async
   * @param {number} amount - The amount to subtract from credits.
   * @returns {number|undefined} - New credit value, or undefined if insufficient.
   */
  export async function updateUserCredits(amount) {
    const currentCredits = parseInt(localStorage.getItem("userCredits"), 10) || 0;
    const newCredits = currentCredits - amount;
  
    if (newCredits < 0) {
      alert("Insufficient credits for placing this bid.");
      return;
    }
  
    localStorage.setItem("userCredits", newCredits);
    const creditsDisplay = document.getElementById("credits-display");
  
    if (creditsDisplay) {
      creditsDisplay.textContent = `Credits: ${newCredits}`;
    }
  
    return newCredits;
  }
  
  /**
   * Fetches the current user's credits from the API.
   * @async
   * @returns {Promise<number|undefined>} - User's credits or undefined if failed.
   */
  export async function getUserCredits() {
    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user"));
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
      },
    };
  
    try {
      const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/credits`, options);
      const data = await response.json();
      return data.data.credits || 0;
    } catch {
      return;
    }
  }
  
  /**
   * Fetches a page of listings from the API.
   * @async
   * @param {number} [page=1] - The page number.
   * @param {number} [limit=18] - Listings per page.
   * @returns {Promise<{listings: Object[], totalCount: number}>}
   */
  export async function loadListings(page = 1, limit = 18) {
    const token = localStorage.getItem("accessToken");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
      },
    };
  
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/auction/listings?page=${page}&limit=${limit}&sort=created&sortOrder=desc&_seller=true&_bids=true`,
        options
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        return { listings: [], totalCount: 0 };
      }
  
      return {
        listings: data.data || [],
        totalCount: data.meta?.totalCount || 0,
      };
    } catch {
      return { listings: [], totalCount: 0 };
    }
  }
  
  /**
   * Retrieves the highest bid from a listing's bid array.
   * @async
   * @param {string} listingId - The ID of the listing.
   * @returns {Promise<number>} - Highest bid or 0 if none found.
   */
  export async function getHighestBid(listingId) {
    const token = localStorage.getItem("accessToken");
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
      },
    };
  
    const data = await fetchFromAPI(
      `https://v2.api.noroff.dev/auction/listings/${listingId}?_bids=true&_seller=true`,
      options
    );
  
    if (data?.data?.bids?.length > 0) {
      return data.data.bids.sort((a, b) => b.amount - a.amount)[0].amount;
    }
  
    return 0;
  }
  
  /**
   * Wraps a fetch call with error handling.
   * @async
   * @param {string} url - The API URL.
   * @param {Object} options - Fetch options with headers.
   * @returns {Promise<Object>} - Parsed response JSON or error object.
   */
  export async function fetchFromAPI(url, options) {
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }
  
  /**
   * Updates the user's profile with avatar, banner, and bio.
   * @async
   * @param {Event} event - Form submit event.
   * @returns {Promise<void>}
   */
  export async function updateProfile(event) {
    event.preventDefault();
  
    const avatarUrl = document.getElementById("avatar-url").value;
    const bannerUrl = document.getElementById("banner-url").value;
    const bio = document.getElementById("bio").value;
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("accessToken");
  
    if (!avatarUrl || !bannerUrl) {
      alert("Please enter valid URLs for avatar and banner.");
      return;
    }
  
    const data = {
      avatar: { url: avatarUrl, alt: "" },
      banner: { url: bannerUrl, alt: "" },
      bio,
    };
  
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/auction/profiles/${user.name}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        alert("Failed to update profile: " + result.errors[0].message);
      }
    } catch {
      alert("An error occurred while updating the profile.");
    }
  }
  
  /**
   * Creates a new listing via the API.
   * @async
   * @param {Object} listingData - The new listing data.
   * @returns {Promise<Object|undefined>} - Created listing or error.
   */
  export async function createListing(listingData) {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      alert("You must be logged in to create a listing.");
      return;
    }
  
    try {
      const response = await fetch("https://v2.api.noroff.dev/auction/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
        },
        body: JSON.stringify(listingData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.errors?.[0]?.message || "Failed to create listing");
      }
  
      return result;
    } catch (error) {
      alert(error.message);
    }
  }