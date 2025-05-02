/**
 * Initializes the bid modal by setting up event listeners and logic for placing a bid.
 * 
 * @function initBidModal
 * @param {number} currentBid - The current highest bid of the listing
 */
export function initBidModal(currentBid) {
    const bidButton = document.getElementById("place-bid");
    const closeModalButton = document.getElementById("close-bid-modal");
    const bidModal = document.getElementById("bid-modal");
    const bidAmountInput = document.getElementById("bid-amount");
    const bidError = document.getElementById("bid-error");
    const currentBidValue = document.getElementById("current-bid-value");

    currentBidValue.textContent = currentBid;

    bidButton.addEventListener("click", () => {
      bidModal.classList.remove("hidden");
    });

    closeModalButton.addEventListener("click", () => {
      bidModal.classList.add("hidden");
    });

    window.addEventListener("click", (event) => {
      if (event.target === bidModal) {
        bidModal.classList.add("hidden");
      }
    });

    bidButton.addEventListener("click", () => {
      const bidAmount = parseInt(bidAmountInput.value, 10);

      if (bidAmount <= currentBid) {
        bidError.classList.remove("hidden");
      } else {
        bidError.classList.add("hidden");
        bidModal.classList.add("hidden");
      }
    });
}