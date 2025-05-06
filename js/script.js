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
   * Updates the user's credits in the backend and updates the local storage and UI.
   * @param {number} amount - The amount of credits to add or subtract.
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
   * Fetches the user's credits from the API.
   * @async
   * @function getUserCredits
   * @returns {Promise<number>} The user's current credits.
   */
  export async function getUserCredits() {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      alert("You need to be logged in to fetch credits.");
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
    const options = {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
      },
    };
  
    try {
      const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/credits`, options);
      const data = await response.json();
      return data.data.credits || 0;
    } catch (error) {
      console.error("Error fetching user credits:", error);
      alert("Failed to fetch credits.");
    }
  }
  
  /**
   * Fetches all active listings from the API.
   * @async
   * @function loadListings
   * @returns {Promise<Object>} The fetched listings data.
   */
  export async function loadListings() {
    const token = localStorage.getItem("accessToken");
  
    const options = {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": "1d6d6a25-2013-4a8e-9a20-f8e10b64f3a8",
      },
    };
  
    try {
        const response = await fetch("https://v2.api.noroff.dev/auction/listings?_seller=true", options);
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching listings:", error);
      return [];
    }
  }
  
  /**
   * Fetches the highest bid for a listing.
   * @async
   * @function getHighestBid
   * @param {string} listingId - The ID of the listing.
   * @returns {Promise<number>} - The highest bid amount or 0 if no bids.
   */
  export async function getHighestBid(listingId) {
    const token = localStorage.getItem("accessToken");
    const options = {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": "1d6d6a25-2013-4a8e-9a20-f8e10b64f3a8",
      },
    };
  
    const data = await fetchFromAPI(`https://v2.api.noroff.dev/auction/listings/${listingId}?_bids=true&_seller=true`, options);
    if (data && data.data && data.data.bids && data.data.bids.length > 0) {
      const highestBid = data.data.bids.sort((a, b) => b.amount - a.amount)[0].amount;
      return highestBid;
    }
    return 0;
  }
  
  /**
   * Fetches data from the API and handles errors.
   * @async
   * @function fetchFromAPI
   * @param {string} url - The API URL.
   * @param {Object} options - The fetch options.
   * @returns {Promise<Object>} The response data or an error object.
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
   * Updates the user's profile information.
   * @async
   * @function updateProfile
   * @param {Event} event - The event triggered by the form submission.
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
      avatar: {
        url: avatarUrl,
        alt: ""
      },
      banner: {
        url: bannerUrl,
        alt: ""
      },
      bio: bio
    };
  
    try {
      const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        alert("Failed to update profile: " + result.errors[0].message);
      } else {
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  }
  
  /**
   * Creates a new listing.
   * @param {Object} listingData - The listing details.
   * @returns {Promise<Object>} - The response from the API.
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
          "Authorization": `Bearer ${token}`,
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
      console.error("Error creating listing:", error);
      alert(error.message);
    }
  }