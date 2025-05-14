import { getUserCredits } from "./script.js";
import { logout } from "./auth.js";
import { initSearchPopup } from "./search.js"; // 👈 viktig for å re-koble input-lytter

/**
 * @file components-loader.js
 * @description Loads reusable components like navbar, footer, and modals into the page.
 */

/**
 * Loads the navbar and attaches event listeners.
 * @async
 */
export async function loadNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  try {
    const response = await fetch("../components/navbar.html");
    const html = await response.text();
    container.innerHTML = html;

    const credits = await getUserCredits();
    const creditsDisplay = document.getElementById("credits-display");
    if (creditsDisplay) {
      creditsDisplay.textContent = `Credits: ${credits}`;
    }

    const hamburgerButton = document.getElementById("hamburger-toggle");
    if (hamburgerButton) {
      hamburgerButton.addEventListener("click", async () => {
        await loadHamburgerMenu();
      });
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", logout);
    }
  } catch (error) {
    console.error("Failed to load navbar:", error);
  }
}

/**
 * Loads the hamburger menu and sets up events for logout and search modal.
 * @async
 */
export async function loadHamburgerMenu() {
  try {
    const response = await fetch("../components/hamburgermenu.html");
    const html = await response.text();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const modal = wrapper.querySelector("#hamburger-modal");
    document.body.appendChild(wrapper);

    const closeButton = wrapper.querySelector("#close-menu");
    if (closeButton) {
      closeButton.addEventListener("click", removeModal);
    }

    const logoutButton = wrapper.querySelector("#logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", logout);
    }

    const searchIcon = wrapper.querySelector("#open-mobile-search");
    if (searchIcon) {
      searchIcon.addEventListener("click", async () => {
        await loadMobileSearchModal();
      });
    }

    function handleOutsideClick(e) {
      if (!modal) return;
      if (!modal.contains(e.target) && !e.target.closest("#hamburger-toggle")) {
        removeModal();
      }
    }

    function removeModal() {
      wrapper.remove();
      document.removeEventListener("click", handleOutsideClick);
    }

    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 0);
  } catch (error) {
    console.error("Failed to load hamburger menu:", error);
  }
}

/**
 * Loads the footer.
 * @async
 */
export async function loadFooter() {
  const container = document.getElementById("footer-container");
  if (!container) return;

  try {
    const response = await fetch("../components/footer.html");
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error("Failed to load footer:", error);
  }
}

/**
 * Loads the desktop search popup.
 * @async
 */
export async function loadSearchPopup() {
  try {
    const response = await fetch("../components/search-popup.html");
    const html = await response.text();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
  } catch (error) {
    console.error("Failed to load search popup:", error);
  }
}

/**
 * Loads the mobile search modal and sets up events.
 * @async
 */
export async function loadMobileSearchModal() {
  try {
    const response = await fetch("../components/search-modal.html");
    const html = await response.text();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    const closeBtn = wrapper.querySelector("#close-search-modal");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        wrapper.remove();
      });
    }

    function handleOutsideClick(e) {
      const modal = wrapper.querySelector("#search-modal");
      if (!modal) return;
      if (!modal.contains(e.target)) {
        wrapper.remove();
        document.removeEventListener("click", handleOutsideClick);
      }
    }

    setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 0);

    // 🆕 Trigger søkefunksjonalitet når modal er lagt inn
    import("./search.js").then((module) => {
      module.initSearchPopup();
    });

  } catch (error) {
    console.error("Failed to load mobile search modal:", error);
  }
}

/**
 * Loads all layout components.
 * @async
 */
export async function loadComponents() {
  await loadNavbar();
  await loadFooter();
  await loadSearchPopup();
}