import { getUserCredits } from "./script.js";

/**
 * @file components-loader.js
 * @description Loads reusable components like navbar, footer, and search popup into the page.
 */

/**
 * Fetches and loads the navbar into the page.
 *
 * @async
 * @function loadNavbar
 * @returns {Promise<void>} Updates the navbar container with the fetched HTML.
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
    } catch (error) {
    }
}

/**
 * Fetches and loads the search popup HTML into the page.
 *
 * @async
 * @function loadSearchPopup
 * @returns {Promise<void>} Updates the body with the loaded search popup HTML.
 */
export async function loadSearchPopup() {
    try {
        const response = await fetch("../components/search-popup.html");
        const html = await response.text();
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
    } catch (error) {
    }
}

/**
 * Fetches and loads the footer into the page.
 *
 * @async
 * @function loadFooter
 * @returns {Promise<void>} Updates the footer container with the fetched HTML.
 */
export async function loadFooter() {
    const container = document.getElementById("footer-container");
    if (!container) return;

    try {
        const response = await fetch("../components/footer.html");
        const html = await response.text();
        container.innerHTML = html;
    } catch (error) {
    }
}

/**
 * Loads all the shared layout components (navbar, footer, search popup) into the page.
 *
 * @async
 * @function loadComponents
 * @returns {Promise<void>} Loads all the layout components sequentially.
 */
export async function loadComponents() {
    await loadNavbar();
    await loadFooter();
    await loadSearchPopup();
}