import { loadComponents } from "./components-loader.js";
import { displayUserCredits } from "./utils.js";
import { initSearchPopup } from "./search.js";
import { logout } from "./auth.js";

if (!localStorage.getItem("userCredits")) {
  localStorage.setItem("userCredits", 1000);
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponents();
  displayUserCredits();
  initSearchPopup();

  const token = localStorage.getItem("accessToken");

  const profileLink = document.getElementById("profile-link");
  const logoutButton = document.getElementById("logout-button");
  const createListingLink = document.getElementById("create-listing-link");

  if (!token) {
    if (profileLink) {
      profileLink.textContent = "Register";
      profileLink.href = "/html/register.html";
    }

    if (logoutButton) {
      logoutButton.textContent = "Log in";
      logoutButton.href = "/html/login.html";
      logoutButton.removeEventListener("click", logout);
    }

    if (createListingLink) {
      createListingLink.classList.add("hidden");
    }
  } else {
    if (profileLink) {
      profileLink.textContent = "My Profile";
      profileLink.href = "/html/dashboard.html";
    }

    if (logoutButton) {
      logoutButton.textContent = "Logout";
      logoutButton.href = "#";
      logoutButton.addEventListener("click", logout);
    }

    if (createListingLink) {
      createListingLink.classList.remove("hidden");
    }
  }
});