/**
 * @file utils.js
 * @description Contains utility functions for handling API fetch, credits management, debouncing, and logout.
 */

/**
 * Fetches data from the API and handles errors.
 *
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
 * Adds credits to the user's balance and updates the UI.
 *
 * @function addCredits
 * @param {number} amount - The amount of credits to add.
 */
export function addCredits(amount) {
  let currentCredits = parseInt(localStorage.getItem("userCredits"), 10) || 0;
  currentCredits += amount;
  localStorage.setItem("userCredits", currentCredits);
  displayUserCredits(currentCredits);
}

/**
 * Displays the logged-in user's available credits.
 *
 * @function displayUserCredits
 * @param {number} [credits] - The amount of credits to display (optional).
 */
export function displayUserCredits(credits) {
  const display = document.getElementById("credits-display");
  const storedCredits = parseInt(localStorage.getItem("userCredits"), 10);
  const value = credits ?? storedCredits ?? 0;

  if (display) {
    display.textContent = `Credits: ${value}`;
  }
}

/**
 * Subtracts credits from the user's balance and updates the UI.
 *
 * @function subtractCredits
 * @param {number} amount - The amount of credits to subtract.
 */
export function subtractCredits(amount) {
  let currentCredits = parseInt(localStorage.getItem("userCredits"), 10) || 0;

  if (currentCredits < amount) {
    alert("You do not have enough credits to place this bid.");
    return;
  }

  currentCredits -= amount;
  localStorage.setItem("userCredits", currentCredits);
  displayUserCredits(currentCredits);
}

/**
 * Logs out the user by clearing session data and redirecting to login.
 *
 * @function logout
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  window.location.href = "login.html";
}

/**
 * Creates a debounced version of a given function.
 *
 * @function debounce
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds before calling the function.
 * @returns {Function} The debounced function.
 */
export function debounce(func, delay) {
  let debounceTimer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}