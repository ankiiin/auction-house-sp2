import { createListing } from "./script.js";

/**
 * @file create-listing.js
 * @description Handles listing creation form logic and API submission.
 */

/**
 * Initializes the create listing form when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-listing-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const mediaUrl = document.getElementById("media").value.trim();
    const endsAt = document.getElementById("endsAt").value;

    if (!title || !description || !endsAt) {
      alert("Please fill out all required fields.");
      return;
    }

    if (description.length > 280) {
      alert("Description cannot be more than 280 characters.");
      return;
    }

    const now = new Date();
    const selectedDate = new Date(endsAt);
    const maxDate = new Date();
    maxDate.setFullYear(now.getFullYear() + 1);

    if (selectedDate <= now) {
      alert("End date must be in the future.");
      return;
    }

    if (selectedDate > maxDate) {
      alert("End date cannot be more than one year from now.");
      return;
    }

    const media = [];
    if (mediaUrl) {
      try {
        const url = new URL(mediaUrl);
        media.push({
          url: url.href,
          alt: title || "Auction image",
        });
      } catch {
        alert("Please enter a valid image URL.");
        return;
      }
    }

    const listingData = {
      title,
      description,
      media,
      endsAt: selectedDate.toISOString(),
    };

    try {
      const result = await createListing(listingData);
      if (result && result.data) {
        window.location.href = "dashboard.html";
      }
    } catch {
      alert("Something went wrong. Please try again.");
    }
  });
});