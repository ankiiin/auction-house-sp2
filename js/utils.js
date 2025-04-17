/**
 * Fetches and displays the logged-in user's available credits in the navbar.
 * 
 * This function retrieves the user object from localStorage, 
 * makes an authenticated GET request to the Noroff API, 
 * and updates the inner text of the #credits-display element 
 * with the current credit value.
 *
 * @async
 * @function displayUserCredits
 * @returns {Promise<void>} Updates the UI with the user's credits or logs an error if the fetch fails.
 */
export async function displayUserCredits() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.name) return;
  
    try {
      const response = await fetch(`https://v2.api.noroff.dev/auction/profiles/${user.name}/credits`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
        },
      });
  
      const result = await response.json();
  
      const creditsDisplay = document.getElementById("credits-display");
      if (creditsDisplay && result.data?.credits !== undefined) {
        creditsDisplay.textContent = `Credits: ${result.data.credits}`;
      }
    } catch (error) {
      console.error("Could not load user credits:", error);
    }
  }