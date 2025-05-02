/**
 * Fetches and displays the logged-in user's available credits
 * in both the navbar and the dashboard.
 *
 * @async
 * @function displayUserCredits
 * @returns {Promise<void>} Updates UI elements or logs an error.
 */
export async function displayUserCredits() {
  let credits = parseInt(localStorage.getItem("userCredits"), 10);

  if (!credits) {
      credits = 2000; // Set default to 2000 credits
      localStorage.setItem("userCredits", credits);
  }

  const creditsDisplay = document.getElementById("credits-display");
  const currentCredit = document.getElementById("current-credit");

  if (creditsDisplay && credits !== null) {
      creditsDisplay.textContent = `Credits: ${credits}`;
  }

  if (currentCredit && credits !== null) {
      currentCredit.textContent = `Current credit: ${credits}`;
  }
}

/**
 * Subtracts credits from the user's balance and updates the UI.
 *
 * @function subtractCredits
 * @param {number} amount - The amount of credits to subtract.
 */
export function subtractCredits(amount) {
  let currentCredits = parseInt(localStorage.getItem("userCredits"), 10) || 2000;

  if (currentCredits < amount) {
      alert("You do not have enough credits to place this bid.");
      return;
  }

  currentCredits -= amount;

  localStorage.setItem("userCredits", currentCredits);
  displayUserCredits(); // Update the UI with new credits
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

// Initialize the credits if they aren't set
if (!localStorage.getItem("userCredits")) {
  localStorage.setItem("userCredits", 2000);  // Set initial value
}