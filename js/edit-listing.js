import { fetchFromAPI, sendPutRequest } from "./script.js";

/**
 * Initializes the edit form by loading listing data and setting up the form submission.
 * @async
 */
document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("edit-listing-form");
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");

  if (!listingId) {
    alert("Missing listing ID.");
    return;
  }

  const token = localStorage.getItem("accessToken");
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
    },
  };

  const response = await fetchFromAPI(
    `https://v2.api.noroff.dev/auction/listings/${listingId}`,
    options,
  );
  const data = response?.data;

  if (!data) {
    alert("Could not load listing details.");
    return;
  }

  document.getElementById("title").value = data.title || "";
  document.getElementById("description").value = data.description || "";
  document.getElementById("media").value = data.media?.[0]?.url || "";
  document.getElementById("endsAt").value = data.endsAt?.split("T")[0] || "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const mediaUrl = document.getElementById("media").value.trim();
    const endsAt = document.getElementById("endsAt").value;

    if (!title || !description) {
      alert("Please fill out all fields.");
      return;
    }

    if (description.length > 280) {
      alert("Description must be 280 characters or less.");
      return;
    }

    const updatedData = {
      title,
      description,
      media: [],
    };

    if (mediaUrl) {
      try {
        const url = new URL(mediaUrl);
        updatedData.media.push({ url: url.href, alt: title });
      } catch {
        alert("Invalid image URL.");
        return;
      }
    }

    const originalDate = data.endsAt?.split("T")[0];

    if (endsAt && endsAt !== originalDate) {
      const now = new Date();
      const selectedDate = new Date(endsAt);
      const maxDate = new Date();
      maxDate.setFullYear(now.getFullYear() + 1);

      if (selectedDate <= now || selectedDate > maxDate) {
        alert("End date must be in the future and within one year.");
        return;
      }

      updatedData.endsAt = selectedDate.toISOString();
    }

    try {
      const result = await sendPutRequest(
        `auction/listings/${listingId}`,
        updatedData,
        token,
      );
      if (result) {
        window.location.href = "dashboard.html";
      }
    } catch (error) {
      alert("Failed to update listing: " + error.message);
    }
  });
});
