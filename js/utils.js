/**
 * Fetches and displays the logged-in user's available credits
 * in both the navbar and the dashboard.
 *
 * @async
 * @function displayUserCredits
 * @returns {Promise<void>} Updates UI elements or logs an error.
 */
export async function displayUserCredits() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.name) return;
  
    try {
      const response = await fetch(
        `https://v2.api.noroff.dev/auction/profiles/${user.name}/credits`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
          },
        }
      );
  
      const result = await response.json();
      const credits = result.data?.credits;
  
      const creditsDisplay = document.getElementById("credits-display");
      if (creditsDisplay && credits !== undefined) {
        creditsDisplay.textContent = `Credits: ${credits}`;
      }
  
      const currentCredit = document.getElementById("current-credit");
      if (currentCredit && credits !== undefined) {
        currentCredit.textContent = `Current credit: ${credits}`;
      }
    } catch (error) {
      console.error("Could not load user credits:", error);
    }
  }
  
  /**
   * Fetches profile data for a given username.
   *
   * @async
   * @function getUserProfile
   * @param {string} name - The username
   * @returns {Promise<Object>} Profile data
   */
  export async function getUserProfile(name) {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${name}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
        },
      }
    );
  
    const result = await response.json();
    return result.data;
  }
  
  /**
   * Fetches all listings created by a specific user.
   *
   * @async
   * @function getUserListings
   * @param {string} name - The username
   * @returns {Promise<Array>} List of user's listings
   */
  export async function getUserListings(name) {
    const response = await fetch(
      `https://v2.api.noroff.dev/auction/profiles/${name}/listings?_bids=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
        },
      }
    );
  
    const result = await response.json();
    return result.data;
  }
  
  /**
   * Logs out the current user by clearing auth data and redirecting to homepage.
   *
   * @function logoutUser
   * @param {Event} event - The click event (optional)
   */
  export function logoutUser(event) {
  
    if (event) event.preventDefault();
  
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    } catch (err) {
      console.error("⚠️ Error clearing localStorage", err);
    }
  
    window.location.href = "../index.html"; 
  }