import { displayUserCredits, updateUserCredits, debounce } from "./utils.js";

const BEARER_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYW5raWlpbiIsImVtYWlsIjoiYW5uaGFtNDkzNDRAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3NDYxODQ5OTR9._PHUomf_NV37fvhQBeEFtHVz2xPUnahUE3VjpyRJuaU';
const API_KEY = '1d6d6a25-2013-4a8e-9a20-f8e10b64f3a8';

let debounceTimer;

/**
 * Fetches data from the API and handles errors.
 * 
 * @async
 * @function fetchFromAPI
 * @param {string} url - The API URL
 * @param {Object} options - The fetch options
 * @returns {Promise<Object>} The response data or an error object
 */
async function fetchFromAPI(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Fetches the highest bid for a listing.
 *
 * @async
 * @function getHighestBid
 * @param {string} listingId - The ID of the listing
 * @returns {Promise<number>} The highest bid amount or 0 if no bids
 */
async function getHighestBid(listingId) {
  try {
    const options = {
      headers: {
        'Authorization': BEARER_TOKEN,
        'X-Noroff-API-Key': API_KEY
      }
    };

    const data = await fetchFromAPI(`https://v2.api.noroff.dev/auction/listings/${listingId}?_bids=true&_seller=true`, options);

    if (data && data.data && data.data.bids && data.data.bids.length > 0) {
      const highestBid = data.data.bids.sort((a, b) => b.amount - a.amount)[0].amount;
      return highestBid;
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Places a bid for a listing and updates the UI.
 *
 * @async
 * @function placeBid
 * @param {string} listingId - The ID of the listing
 * @param {number} bidAmount - The amount of the bid
 */
async function placeBid(listingId, bidAmount) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("You need to be logged in to place a bid.");
    return;
  }

  const options = {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: bidAmount
    })
  };

  try {
    const response = await fetch(`https://v2.api.noroff.dev/auction/listings/${listingId}/bids`, options);
    const data = await response.json();

    if (response.ok) {
      const highestBid = await getHighestBid(listingId);
      updateHighestBid(listingId, highestBid);
    }
  } catch (error) {
    return;
  }
}

/**
 * Updates the highest bid in the UI.
 * 
 * @function updateHighestBid
 * @param {string} listingId - The ID of the listing
 * @param {number} bidAmount - The amount of the highest bid
 */
function updateHighestBid(listingId, bidAmount) {
  const currentBidElement = document.getElementById(`current-bid-${listingId}`);
  if (currentBidElement) {
    currentBidElement.textContent = bidAmount;
  }
}

/**
 * Fetches all active listings from the API and displays them on the feed page.
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

    for (const listing of listings) {
      const listingCard = document.createElement('div');
      listingCard.className = 'bg-white p-4 rounded-lg shadow-md hover:shadow-lg';

      const imageUrl = listing.media && listing.media.length > 0 ? listing.media[0].url : null;
      const isValidImage = imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('https'));
      const finalImageUrl = isValidImage ? imageUrl : 'https://picsum.photos/400/300?text=No+Image';

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

  } catch (error) {
    return;
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

loadListings();