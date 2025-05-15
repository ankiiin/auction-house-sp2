import { sendPutRequest } from "./script.js";

/**
 * @file edit-profile.js
 * @description Allows the user to update their banner image, avatar, and bio using the API.
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
   * Updates the user's profile based on form input.
   * @param {Event} event
   * @returns {Promise<void>}
   */
  saveButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const bannerImage = bannerImageInput.value.trim();
    const profileImage = profileImageInput.value.trim();
    const bio = bioInput.value.trim();

    const updatedData = {
      banner: { url: bannerImage || user.banner },
      avatar: { url: profileImage || user.avatar },
      bio: bio || user.bio,
    };

    try {
      const result = await sendPutRequest(
        `auction/profiles/${user.name}`,
        updatedData,
        localStorage.getItem("accessToken")
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