import { subtractCredits, displayUserCredits } from "./utils.js"; 

/**
 * Fetches all active listings from the API and displays them on the feed page.
 * This function dynamically creates listing cards with title, bid, time left, and links to individual listing details.
 *
 * @async
 * @function loadListings
 * @returns {Promise<void>} Updates the listing feed with the fetched data
 */
async function loadListings() {
  try {
    const response = await fetch('https://v2.api.noroff.dev/auction/listings');
    const data = await response.json();

    const listings = data.data || [];
    const feedContainer = document.getElementById('listing-feed');
    feedContainer.innerHTML = '';

    listings.forEach(listing => {
      const listingCard = document.createElement('div');
      listingCard.className = 'bg-white p-4 rounded-lg shadow-md hover:shadow-lg';

      const imageUrl = listing.media && listing.media.length > 0 ? listing.media[0].url : null;
      const isValidImage = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('https'));
      const finalImageUrl = isValidImage ? imageUrl : 'https://picsum.photos/400/300?text=No+Image';

      const endDate = new Date(listing.endsAt);
      const timeLeft = formatTimeLeft(endDate);

      const highestBid = getHighestBid(listing.id);

      listingCard.innerHTML = `
        <div class="w-full h-48 rounded-lg mb-4">
          <img src="${finalImageUrl}" alt="${listing.title}" class="w-full h-full object-cover rounded-lg" onerror="this.src='https://picsum.photos/400/300?text=No+Image';">
        </div>
        <h3 class="text-lg font-semibold text-gray-900">${listing.title}</h3>
        <p class="text-gray-600">Current bid: <span id="current-bid-${listing.id}">${highestBid}</span></p>
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
    });

  } catch (error) {
    console.error('Error fetching listings:', error);
  }
}

/**
 * Formats the remaining time between now and the auction end time.
 *
 * @function formatTimeLeft
 * @param {Date} endDate - The end date of the auction
 * @returns {string} The formatted time left (e.g., "3 hours left")
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
 * Gets the highest bid from the localStorage or defaults to 0 if no bid has been placed.
 *
 * @function getHighestBid
 * @param {string} listingId - The ID of the listing
 * @returns {number} The highest bid value
 */
function getHighestBid(listingId) {
  let highestBid = localStorage.getItem(`highestBid-${listingId}`);

  if (!highestBid) {
    return 0;  
  }

  return parseInt(highestBid, 10);
}

/**
 * Opens the bid modal and sets up the current bid for validation.
 * 
 * @function openBidModal
 * @param {string} listingId - The ID of the listing
 * @param {number} currentBid - The current bid value for the auction
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

  placeBidButton.addEventListener("click", () => {
    const bidAmount = parseInt(bidAmountInput.value, 10);

    if (bidAmount <= currentBid) {
      bidErrorMessage.classList.remove("hidden");
    } else {
      bidErrorMessage.classList.add("hidden");
      updateCurrentBid(listingId, bidAmount); 
      updateUserCredits(bidAmount); 
      localStorage.setItem(`highestBid-${listingId}`, bidAmount);  
      bidModal.classList.add("hidden");
    }
  });
}

/**
 * Updates the displayed bid for the given listing.
 * 
 * @function updateCurrentBid
 * @param {string} listingId - The ID of the listing
 * @param {number} bidAmount - The amount of the bid
 */
function updateCurrentBid(listingId, bidAmount) {
  const currentBidElement = document.getElementById(`current-bid-${listingId}`);
  if (currentBidElement) {
    currentBidElement.textContent = bidAmount;
  }
}

/**
 * Updates the user's credits by subtracting the bid amount.
 * 
 * @function updateUserCredits
 * @param {number} bidAmount - The amount of the bid
 */
function updateUserCredits(bidAmount) {
  let currentCredits = parseInt(localStorage.getItem("userCredits")) || 2000;
  const newCredits = currentCredits - bidAmount;

  localStorage.setItem("userCredits", newCredits);

  displayUserCredits();
}

/**
 * Calls the loadListings function to fetch and display the listings.
 */
loadListings();