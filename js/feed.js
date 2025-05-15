import { loadListings, getHighestBid, updateUserCredits } from "./script.js";

let currentPage = 1;
let isLoading = false;

/**
 * Loads and renders a page of active listings.
 * Filters out expired and own listings. Appends them to the DOM.
 * @async
 */
async function loadAndRenderListings() {
  isLoading = true;
  const { listings } = await loadListings(currentPage, 36);
  currentPage++;

  const now = new Date();
  const user = JSON.parse(localStorage.getItem("user"));
  const feedContainer = document.getElementById("listing-feed");

  const bids = await Promise.all(
    listings.map(listing => getHighestBid(listing.id))
  );

  let renderedCount = 0;

  for (let i = 0; i < listings.length; i++) {
    const listing = listings[i];

    if (new Date(listing.endsAt) <= now || listing.seller?.name === user?.name) {
      continue;
    }

    const highestBid = bids[i];
    const listingCard = document.createElement("div");
    listingCard.className = "bg-white p-4 rounded-lg shadow-md hover:shadow-lg";

    const imageUrl = listing.media?.[0]?.url;
    const finalImageUrl = imageUrl && (imageUrl.startsWith("http") || imageUrl.startsWith("https"))
      ? imageUrl
      : "https://picsum.photos/400/300?text=No+Image";

    const endDate = new Date(listing.endsAt);
    const timeLeft = formatTimeLeft(endDate);

    listingCard.innerHTML = `
      <div class="w-full h-48 rounded-lg mb-4">
        <img src="${finalImageUrl}" alt="${listing.title}" class="w-full h-full object-cover rounded-lg">
      </div>
      <h3 class="text-lg font-semibold text-gray-900">${listing.title}</h3>
      <p class="text-gray-600">Highest bid: <span id="current-bid-${listing.id}">${highestBid}</span></p>
      <p class="text-sm text-gray-500 mb-4">${timeLeft}</p>
      <div class="flex flex-col justify-between items-center">
        <button class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 mb-2" id="bid-btn-${listing.id}">BID</button>
        <a href="listing-details.html?id=${listing.id}" class="text-indigo-500 py-2 px-4 rounded-md border-2 border-indigo-500">VIEW LISTING</a>
      </div>
    `;

    feedContainer.appendChild(listingCard);

    const bidButton = document.getElementById(`bid-btn-${listing.id}`);
    bidButton.addEventListener("click", () => {
      openBidModal(listing.id, highestBid);
    });

    renderedCount++;
  }

  if (renderedCount === 0) {
    await loadAndRenderListings();
  }

  isLoading = false;
}

/**
 * Keeps loading until content fills the screen initially.
 * @async
 */
async function initialLoad() {
  await loadAndRenderListings();

  while (document.body.offsetHeight < window.innerHeight + 100 && !isLoading) {
    await loadAndRenderListings();
  }
}

/**
 * Formats time left until auction ends into a readable string.
 */
function formatTimeLeft(endDate) {
  const now = new Date();
  const diff = endDate - now;
  if (diff <= 0) return "Auction ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours} hours left`;
  if (minutes > 0) return `${minutes} minutes left`;
  return "Less than a minute left";
}

/**
 * Opens bid modal and sets current value + listeners.
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
 * Sends bid to API.
 */
async function placeBid(listingId, bidAmount) {
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    alert("You need to be logged in to place a bid.");
    return;
  }

  try {
    await fetch(`https://v2.api.noroff.dev/auction/listings/${listingId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": "e6f16bc6-a633-40af-ad6b-db10b065d4e2",
      },
      body: JSON.stringify({ amount: bidAmount }),
    });
  } catch {
    // Intentionally silent to avoid false alert even if the bid goes through
  }
}

// Scroll event to trigger loading more listings
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
    loadAndRenderListings();
  }
});

// Initial render
initialLoad();