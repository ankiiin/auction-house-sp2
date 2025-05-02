/**
 * Checks if the user credits are set in localStorage, if not, sets the initial value to 1000.
 */
if (!localStorage.getItem("userCredits")) {
  localStorage.setItem("userCredits", 1000); 
}

import { loadComponents } from "./components-loader.js";
import { displayUserCredits } from "./utils.js";
import { initSearchPopup } from "./search.js";

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
});