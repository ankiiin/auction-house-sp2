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
  
        listingCard.innerHTML = `
          <div class="w-full h-48 rounded-lg mb-4">
            <img src="${finalImageUrl}" alt="${listing.title}" class="w-full h-full object-cover rounded-lg" onerror="this.src='https://picsum.photos/400/300?text=No+Image';">
          </div>
          <h3 class="text-lg font-semibold text-gray-900">${listing.title}</h3>
          <p class="text-gray-600">Current bid: ${listing.bid}</p>
          <p class="text-sm text-gray-500 mb-4">${listing.time_left} left</p>
          <div class="flex justify-between items-center">
            <button class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">BID</button>
            <a href="listing-details.html?id=${listing.id}" class="text-indigo-500 hover:underline">VIEW LISTING</a>
          </div>
        `;
        
        feedContainer.appendChild(listingCard);
      });
  
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
}

/**
 * Calls the loadListings function to fetch and display the listings.
 */
loadListings();