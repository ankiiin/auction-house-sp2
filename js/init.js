import { loadComponents } from "./components-loader.js";
import { displayUserCredits, logoutUser } from "./utils.js";
import { initSearchPopup } from "./search.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents(); 

  displayUserCredits(); 

  initSearchPopup(); 

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", logoutUser);
  }
});