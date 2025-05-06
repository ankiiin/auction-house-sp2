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
 * Fetches all active listings and updates the UI.
 */
async function loadAndRenderListings() {
  const listings = await loadListings();

  const feedContainer = document.getElementById("listing-feed");
  feedContainer.innerHTML = "";

  for (const listing of listings) {
    const listingCard = document.createElement("div");
    listingCard.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-lg";

    const imageUrl = listing.media && listing.media.length > 0 ? listing.media[0].url : null;
    const isValidImage = imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("https"));
    const finalImageUrl = isValidImage ? imageUrl : "https://picsum.photos/400/300?text=No+Image";

    const endDate = new Date(listing.endsAt);
    const timeLeft = formatTimeLeft(endDate);

    let highestBid = await getHighestBid(listing.id);

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
 * @returns {string} The formatted time left (e.g., "3 hours left").
 */
function formatTimeLeft(endDate) {
  const now = new Date();
  const timeDiff = endDate - now;

  if (timeDiff <= 0) {
    return "Auction ended";
  }

  const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

  if (hoursLeft > 0) {
    return `${hoursLeft} hours left`;
  } else if (minutesLeft > 0) {
    return `${minutesLeft} minutes left`;
  } else {
    return "Less than a minute left";
  }
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

  placeBidButton.addEventListener("click", async () => {
    const bidAmount = parseInt(bidAmountInput.value, 10);

    if (bidAmount <= currentBid) {
      bidErrorMessage.classList.remove("hidden");
    } else {
      bidErrorMessage.classList.add("hidden");
      await placeBid(listingId, bidAmount);
      updateUserCredits(bidAmount);
      bidModal.classList.add("hidden");
    }
  });
}

loadAndRenderListings();