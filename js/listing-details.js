/**
 * @file listing-details.js
 * @description Displays detailed information about a specific listing including image, description, seller name, and bidding functionality.
 */

const API_URL = "https://v2.api.noroff.dev";
const API_KEY = "e6f16bc6-a633-40af-ad6b-db10b065d4e2";

document.addEventListener("DOMContentLoaded", () => {
  renderListingDetails();
});

/**
 * Fetches the listing data by ID from the API.
 * @async
 * @param {string} id - The listing ID from the query parameter.
 * @returns {Promise<Object>} The listing data.
 */
async function fetchListingById(id) {
  const response = await fetch(`${API_URL}/auction/listings/${id}?_bids=true&_seller=true`, {
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  });
  const data = await response.json();
  return data.data;
}

/**
 * Renders the listing details and bidding UI.
 * @async
 */
async function renderListingDetails() {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");
  if (!listingId) return;

  const listing = await fetchListingById(listingId);
  if (!listing) return;

  const imageElement = document.getElementById("listing-image");
  const titleElement = document.getElementById("listing-title");
  const descriptionElement = document.getElementById("listing-description");
  const sellerName = document.getElementById("seller-name");
  const timeLeft = document.getElementById("time-left");
  const currentBid = document.getElementById("current-bid");
  const placeBidBtn = document.getElementById("place-bid-btn");
  const bidAmountInput = document.getElementById("bid-amount");
  const bidError = document.getElementById("bid-error");
  const bidHistory = document.getElementById("bid-history");

  imageElement.src = listing.media?.[0]?.url || "";
  imageElement.alt = listing.title;
  titleElement.textContent = listing.title;
  descriptionElement.textContent = listing.description || "No description provided.";
  sellerName.textContent = listing.seller?.name || "Unknown Seller";

  const endDate = new Date(listing.endsAt);
  const now = new Date();
  const timeDiff = endDate - now;
  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  timeLeft.textContent =
    timeDiff <= 0
      ? "Auction ended"
      : hoursLeft > 0
      ? `Time left: ${hoursLeft} hours`
      : `Time left: ${minutesLeft} minutes`;

  const sortedBids = listing.bids.sort((a, b) => new Date(b.created) - new Date(a.created));
  const highestBid = sortedBids[0]?.amount || 0;
  currentBid.textContent = highestBid;

  bidHistory.innerHTML = "";
  if (sortedBids.length === 0) {
    bidHistory.innerHTML = "<p class='text-sm text-gray-500'>No bids yet.</p>";
  } else {
    sortedBids.forEach((bid) => {
      const li = document.createElement("li");
      const date = new Date(bid.created).toLocaleString();
      const bidderName = bid.bidder?.name || "Unknown";
      li.textContent = `@${bidderName} – ${bid.amount} credits – ${date}`;
      bidHistory.appendChild(li);
    });
  }

  placeBidBtn.addEventListener("click", async () => {
    const bidAmount = parseInt(bidAmountInput.value, 10);
    if (isNaN(bidAmount) || bidAmount <= highestBid) {
      bidError.classList.remove("hidden");
      return;
    }

    bidError.classList.add("hidden");

    const token = localStorage.getItem("accessToken");
    const bidData = { amount: bidAmount };

    try {
      const response = await fetch(`${API_URL}/auction/listings/${listingId}/bids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(bidData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.[0]?.message || "Failed to place bid");
      }

      const { subtractCredits, displayUserCredits } = await import("./utils.js");
      subtractCredits(bidAmount);
      displayUserCredits();

      window.location.reload();
    } catch (error) {
      bidError.textContent = error.message;
      bidError.classList.remove("hidden");
    }
  });
}