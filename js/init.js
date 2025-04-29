import { loadComponents } from "./components-loader.js";
import { displayUserCredits } from "./utils.js";
import { initSearchPopup } from "./search.js";

/**
 * Initializes the app after the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();       
  displayUserCredits();         
  initSearchPopup();            
});