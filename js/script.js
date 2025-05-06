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
   * Updates the user's credits by subtracting the bid amount.
   * @param {number} amount - The amount of credits to subtract.
   */
  export function updateUserCredits(amount) {
    let currentCredits = parseInt(localStorage.getItem("userCredits"), 10) || 0;
  
    if (currentCredits < amount) {
      alert("You do not have enough credits to place this bid.");
      return;
    }
  
    currentCredits -= amount;
    localStorage.setItem("userCredits", currentCredits);
    displayUserCredits(currentCredits); // You can use this function to update the UI if needed.
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
  
    const data = await fetchFromAPI("https://v2.api.noroff.dev/auction/listings", options);
    return data.data || [];
  }
  
  /**
   * Fetches the user's credits from the API.
   * @async
   * @function getUserCredits
   * @returns {Promise<number>} The user's current credits.
   */
  export async function getUserCredits() {
    const token = localStorage.getItem("accessToken");
  
    const options = {
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": "1d6d6a25-2013-4a8e-9a20-f8e10b64f3a8",
      },
    };
  
    const data = await fetchFromAPI("https://v2.api.noroff.dev/auction/user/credits", options);
    return data.credits || 0;
  }