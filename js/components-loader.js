/**
 * @file components-loader.js
 * @description Dynamically loads shared HTML components like navbar, footer, and popups into their container elements.
 */

/**
 * Loads an external HTML component into a specified container.
 * 
 * @param {string} containerId - The ID of the element to inject into.
 * @param {string} filePath - Path to the HTML file to be loaded.
 */
async function loadComponent(containerId, filePath) {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    try {
      const response = await fetch(filePath);
      const html = await response.text();
      container.innerHTML = html;
    } catch (error) {
      console.error(`❌ Failed to load ${filePath}:`, error);
    }
  }
  
  /**
   * Loads all UI components globally used in the project.
   */
  export function loadComponents() {
    loadComponent("navbar-container", "../components/navbar.html");
    loadComponent("footer-container", "../components/footer.html");
    loadComponent("hamburgermenu-container", "../components/hamburgermenu.html");
    loadComponent("search-popup-container", "../components/search-popup.html");
  }