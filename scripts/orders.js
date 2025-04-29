import { products } from "/scripts/products.js";
import { cart, removeItemFromCart, updateCartQuantity} from "/scripts/cart.js";
import { getFutureDates } from "/scripts/checkout.js";

let orderHTML = '';

console.log("cart data:", cart); // Check if cart is loading

cart.forEach((cartItem) => {
  const addedProductId = cartItem.addedProductId;
  let matchingId = products.find(product => product.id === cartItem.addedProductId);

  if (!matchingId) {
  console.error(`Product with ID ${cartItem.addedProductId} not found in products array.`);
  return; // Skip this cart item
}

  if (matchingId) {
    orderHTML += `
      <div class="product-image">
        <img src="${matchingId.image}" alt="${matchingId.name}">
      </div>

      <div class="product-details">
        <div class="product-name">${matchingId.name}</div>
        <div class="delivery-date">${getFutureDates(5)}</div>
        <div class="product-quantity">Quantity: ${cartItem.quantity}</div>
        <button class="buy-again-button primary-button">
          <img src="images/icons/buy-again.png" class="buy-again-image" alt="Buy Again">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="track.html">
          <button class="tracking-button secondary-button">Track package</button>
        </a>
      </div>`;
  }
});

const orderDetailsGrid = document.querySelector(".order-details-grid-js");
if (orderDetailsGrid) {
  orderDetailsGrid.innerHTML = orderHTML;
} else {
  console.error('Order details container not found.');
}

console.log("Github working.");
