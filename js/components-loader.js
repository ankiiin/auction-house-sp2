/**
 * @file components-loader.js
 * @description Loads reusable components like navbar, footer, and search popup into the page.
 */

export async function loadNavbar() {
    const container = document.getElementById("navbar-container");
    if (!container) return;
  
    try {
      const response = await fetch("../components/navbar.html");
      const html = await response.text();
      container.innerHTML = html;
    } catch (error) {
      console.error("Failed to load navbar:", error);
    }
  }
  
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
   * Loads all shared layout components (navbar + footer + popup)
   * @async
   * @function loadComponents
   * @returns {Promise<void>}
   */
  export async function loadComponents() {
    await loadNavbar();
    await loadFooter();
    await loadSearchPopup();
  }