import { loadComponents } from "./components-loader.js";
import { displayUserCredits } from "./utils.js";
import { initSearchPopup } from "./search.js";
import { logout } from "./auth.js";

/**
 * Sets default user credits in localStorage if not already present.
 */
if (!localStorage.getItem("userCredits")) {
  localStorage.setItem("userCredits", 1000);
}

/**
 * Initializes the app after the DOM is fully loaded.
 * @event DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  displayUserCredits();
  initSearchPopup();

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});