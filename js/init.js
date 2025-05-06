/**
 * Checks if the user credits are set in localStorage, if not, sets the initial value to 1000.
 */
if (!localStorage.getItem("userCredits")) {
  localStorage.setItem("userCredits", 1000); 
}

import { loadComponents } from "./components-loader.js";
import { displayUserCredits } from "./utils.js";
import { initSearchPopup } from "./search.js";
import { debounce } from "./utils.js";

/**
 * Initializes the app after the DOM is fully loaded.
 * This function loads the necessary components (navbar, footer, search popup)
 * and updates the user credits display.
 *
 * @async
 * @function document.addEventListener
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  displayUserCredits();
  initSearchPopup();

  const savedCredits = parseInt(localStorage.getItem("userCredits"), 10);
  if (savedCredits) {
  }

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", debounce(() => {
    }, 500));
  }
});

/**
 * Logs out the user by removing all relevant data from localStorage.
 * Then redirects to the index page.
 *
 * @function logout
 */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("username");
  localStorage.removeItem("userBids");

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('highestBid-')) {
      localStorage.removeItem(key);
    }
  }

  localStorage.removeItem("accessToken");
  window.location.href = "../index.html";  
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById('search-input');
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(function() {
    }, 300)); 
  }
});