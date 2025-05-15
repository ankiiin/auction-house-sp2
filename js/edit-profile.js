import { sendPutRequest } from "./script.js";

/**
 * Handles the profile update process when the DOM is fully loaded.
 * Allows the user to update their banner image, profile picture, and bio.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("edit-profile-form");
  const bannerImageInput = document.getElementById("banner-image");
  const profileImageInput = document.getElementById("profile-image");
  const bioInput = document.getElementById("bio");
  const saveButton = document.getElementById("save-button");

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    bannerImageInput.value = user.banner || "";
    profileImageInput.value = user.avatar || "";
    bioInput.value = user.bio || "";
  }

  /**
   * Handles the save button click event. It collects the updated data
   * from the form and sends a PUT request to update the user's profile.
   * @param {Event} event - The event triggered by clicking the save button.
   */
  saveButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const bannerImage = bannerImageInput.value.trim();
    const profileImage = profileImageInput.value.trim();
    const bio = bioInput.value.trim();

    const updatedData = {
      banner: {
        url: bannerImage || user.banner,
      },
      avatar: {
        url: profileImage || user.avatar,
      },
      bio: bio || user.bio,
    };

    try {
      const result = await sendPutRequest(
        `auction/profiles/${user.name}`,
        updatedData,
        localStorage.getItem("accessToken"),
      );

      user.banner = updatedData.banner.url;
      user.avatar = updatedData.avatar.url;
      user.bio = updatedData.bio;
      localStorage.setItem("user", JSON.stringify(user));

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  });
});
