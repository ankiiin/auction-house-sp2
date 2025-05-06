import { loadListings, getHighestBid, updateUserCredits } from "./script.js";

/**
 * Renders the highest bid in the UI.
 * @param {string} listingId - The ID of the listing.
 * @param {number} bidAmount - The highest bid amount.
 */
function updateHighestBid(listingId, bidAmount) {
  const currentBidElement = document.getElementById(`current-bid-${listingId}`);
  if (currentBidElement) {
    currentBidElement.textContent = bidAmount;
  }
}

/**
 * Fetches active listings not owned by the user, sorts them by creation date, and renders them.
 * @async
 * @function loadAndRenderListings
 */
async function loadAndRenderListings() {
  const listings = await loadListings();
  const now = new Date();
  const user = JSON.parse(localStorage.getItem("user"));

  const activeListings = listings
    .filter(listing => new Date(listing.endsAt) > now && listing.seller?.name !== user?.name)
    .sort((a, b) => new Date(b.created) - new Date(a.created));

  const feedContainer = document.getElementById("listing-feed");
  feedContainer.innerHTML = "";

  for (const listing of activeListings) {
    const listingCard = document.createElement("div");
    listingCard.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-lg";

    const imageUrl = listing.media?.[0]?.url;
    const isValidImage = imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("https"));
    const finalImageUrl = isValidImage ? imageUrl : "https://picsum.photos/400/300?text=No+Image";

    const endDate = new Date(listing.endsAt);
    const timeLeft = formatTimeLeft(endDate);
    const highestBid = await getHighestBid(listing.id);

    listingCard.innerHTML = `
      <div class="w-full h-48 rounded-lg mb-4">
        <img src="${finalImageUrl}" alt="${listing.title}" class="w-full h-full object-cover rounded-lg" onerror="this.src='https://picsum.photos/400/300?text=No+Image';">
      </div>
      <h3 class="text-lg font-semibold text-gray-900">${listing.title}</h3>
      <p class="text-gray-600">Highest bid: <span id="current-bid-${listing.id}">${highestBid}</span></p>
      <p class="text-sm text-gray-500 mb-4">${timeLeft}</p>
      <div class="flex flex-col justify-between items-center">
        <button class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-2" id="bid-btn-${listing.id}">BID</button>
        <a href="listing-details.html?id=${listing.id}" class="text-indigo-500 hover:no-underline py-2 px-4 rounded-md border-2 border-indigo-500">VIEW LISTING</a>
      </div>
    `;

    feedContainer.appendChild(listingCard);

    const bidButton = document.getElementById(`bid-btn-${listing.id}`);
    bidButton.addEventListener("click", () => {
      openBidModal(listing.id, highestBid);
    });
  }
}

/**
 * Formats the remaining time between now and the auction end time.
 * @param {Date} endDate - The end date of the auction.
 * @returns {string} The formatted time left.
 */
function formatTimeLeft(endDate) {
  const now = new Date();
  const timeDiff = endDate - now;

  if (timeDiff <= 0) return "Auction ended";

  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (hoursLeft > 0) return `${hoursLeft} hours left`;
  if (minutesLeft > 0) return `${minutesLeft} minutes left`;
  return "Less than a minute left";
}

/**
 * Opens the bid modal and sets up the current bid for validation.
 * @function openBidModal
 * @param {string} listingId - The ID of the listing.
 * @param {number} currentBid - The current bid value for the auction.
 */
function openBidModal(listingId, currentBid) {
  const bidModal = document.getElementById("bid-modal");
  const bidAmountInput = document.getElementById("bid-amount");
  const placeBidButton = document.getElementById("place-bid");
  const closeModalButton = document.getElementById("close-bid-modal");
  const bidErrorMessage = document.getElementById("bid-error");
  const currentBidText = document.getElementById("current-bid-value");

  currentBidText.textContent = currentBid;
  bidModal.classList.remove("hidden");

  closeModalButton.addEventListener("click", () => {
    bidModal.classList.add("hidden");
  });

  window.addEventListener("click", (e) => {
    if (e.target === bidModal) {
      bidModal.classList.add("hidden");
    }
  });

  placeBidButton.onclick = async () => {
    const bidAmount = parseInt(bidAmountInput.value, 10);

    if (bidAmount <= currentBid) {
      bidErrorMessage.classList.remove("hidden");
    } else {
      bidErrorMessage.classList.add("hidden");
      await placeBid(listingId, bidAmount);
      updateUserCredits(-bidAmount);
      bidModal.classList.add("hidden");
    }
  };
}

/**
 * Places a bid for a listing.
 * @async
 * @function placeBid
 * @param {string} listingId - The ID of the listing.
 * @param {number} bidAmount - The amount to bid.
 */
async function placeBid(listingId, bidAmount) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    alert("You need to be logged in to place a bid.");
    return;
  }

  const data = { amount: bidAmount };

  try {
    const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listingId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      updateHighestBid(listingId, bidAmount);
    } else {
      alert("Failed to place bid: " + result.errors[0].message);
    }
  } catch {
    alert("An error occurred while placing the bid.");
  }
}

loadAndRenderListings();