import { products } from "/scripts/products.js";
import {cart, removeItemFromCart, updateCartQuantity} from "/scripts/cart.js";


export function calculateAmount(cart) {
return cart.reduce((total,item) => total + (item.price * item.quantity), 0);
}

export function getFutureDates(dateToAdd) {
const today = new Date();
today.setDate(today.getDate() + dateToAdd);
const options = {weekday: 'long', month: 'long', day: 'numeric'};
return today.toLocaleDateString('en-US', options);
}


updateCartQuantity();
let checkoutHTML='';
let matchingId;

cart.forEach((cartItem) => {

  const addedProductId = cartItem.addedProductId;

  products.forEach((product) => {
    if (product.id === addedProductId)  {
      matchingId = product;  
    }
  });

  checkoutHTML+= `
  <div class="cart-item-container js-cart-item-container">
    <div class="delivery-date">
      Delivery date: ${getFutureDates(2)}
    </div>

    <div class="cart-items-details-grid">
      <img class="product-image" 
      src="${matchingId.image}">

      <div class="cart-items-details">
        <div class="product-name">
          ${matchingId.name}
        </div>

        <div class="product-price">
          $${(matchingId.priceCents / 100).toFixed(2)}
        </div>

        <div class="product-quantity">
          <span>
          Quantity: <span class="quantity-label">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity primary-link update-cart-js"
        data-product-id="${matchingId.id}">
          Update
        </span>
        <span class="delete-quantity primary-link delete-from-cart-js"
        data-delete-from-cart="${matchingId.id}">
          Delete
        </span>
        </div>
      </div>

      <div class="deliver-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>

        <div class="deliver-option">
          <input type="radio" checked
          class="delivery-option-input"
          name="delivery-option-${matchingId.id}"
          data-date = "${getFutureDates(7)}"
          data-price = "0.00">
          <div>
            <div class="delivery-option-date">
              ${getFutureDates(7)}
            </div>
            <div class="delivery-option-price">
              FREE shipping
            </div>
          </div>
        </div>

        <div class="deliver-option">
          <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingId.id}"
          data-date = "${getFutureDates(4)}"
          data-price = "4.99">
          <div>
            <div class="delivery-option-date">
              ${getFutureDates(4)}
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>

        <div class="deliver-option">
          <input type="radio"
          class="delivery-option-input"
          name="delivery-option-${matchingId.id}"
          data-date = "${getFutureDates(2)}"
          data-price = "9.99">
          <div>
            <div class="delivery-option-date">
              ${getFutureDates(2)}
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
});

document.addEventListener('DOMContentLoaded', () => {
  const orderSummaryContainer = document.querySelector(".js-order-summary");
  if (orderSummaryContainer) {
    orderSummaryContainer.innerHTML = checkoutHTML;
  } else {
    console.error("Element with class '.js-order-summary' not found!");
  }

  // You can safely run the rest of your DOM manipulation here too
});


document.querySelectorAll(".delete-from-cart-js").forEach(link => {
  link.addEventListener('click', () => {
    const removeItemId = link.dataset.deleteFromCart;
    removeItemFromCart(removeItemId);
    console.log(cart);
    location.reload();
  })
})

document.addEventListener('DOMContentLoaded', () => {
  updateCartQuantity();  // Update cart quantity in the header on page load
  let total = 0;
  // Make the cart quantity clickable to redirect to the homepage
  document.querySelector('.cart-quantity').addEventListener('click', () => {
    window.location.href = 'amazon.html';  // Redirect to the homepage
  });
});

updateCartQuantity();

document.querySelectorAll('.update-cart-js').forEach(updateLink => {
  updateLink.addEventListener('click', () => {
    const productId = updateLink.dataset.productId;
    const newQuantity = prompt("Enter new quantity (1 - 10): ");
    const quantityNumber = Number(newQuantity);

    if (quantityNumber >= 1 && quantityNumber <= 10){

      const matchingCartItem = cart.find(item => item.addedProductId === productId);
      if(matchingCartItem){
        matchingCartItem.quantity = quantityNumber;
        localStorage.setItem('cart-saved', JSON.stringify(cart));
        updateCartQuantity();
        location.reload();
      }
      }
      else{
        alert("Please enter a valid number (1 - 10)");
      }
  });
}); 

document.querySelectorAll('.delivery-option-input').forEach(radio => {
  radio.addEventListener('click', () => {
    const selectedDate = radio.closest('.deliver-option').querySelector('.delivery-option-date').innerText;
    const updateDate = radio.closest('.cart-item-container').querySelector('.delivery-date');

    updateDate.innerText = `Delivery date: ${selectedDate}`;
  });
});

document.querySelectorAll('.delivery-option-input').forEach(option => {
  option.addEventListener('change', () => {

    const selectedDate = option.getAttribute('data-date');
    const selectedPrice = option.getAttribute('data-price');

    const orderSummaryDate = document.querySelector('.order-summary-date');
    const orderSummaryPrice = document.querySelector('.order-summary-price');

    orderSummaryDate.textContent = selectedDate;
    orderSummaryPrice = `$${parseFloat(selectedPrice).toFloat(2)}`;
    updateTotalPrice();
  });
});

function updateTotalPrice () {
  let total = 0;
  cart.forEach (item => {
    total = item.quantity * (priceCents/100);
  });
  const shippingCost = parseFloat(document.querySelector('.order-summary-price').textContent.replace("$", " "));
  total += shippingCost;

  document.querySelector('.order-summary-price').textContent = `${total.Tofixed(2)}`;
}

function updatePaymentSummary() {
  const loadingSpinner = document.querySelector('.payment-summary-loading');
  loadingSpinner.style.display = 'block'; // show spinner first

  setTimeout(() => {
    const cartItems = document.querySelectorAll('.cart-item-container');
    let subTotal = 0;
    let shipping = 0;

    cartItems.forEach(item => {
      const price = parseFloat(item.querySelector('.product-price').innerText.replace("$", ""));
      const quantity = parseFloat(item.querySelector('.quantity-label').innerText);
      const selectedShipping = item.querySelector('input[type="radio"]:checked').nextElementSibling.querySelector('.delivery-option-price').innerText;

      subTotal += price * quantity;

      if (selectedShipping.includes("FREE")) {
        shipping += 0;
      } else {
        shipping += parseFloat(selectedShipping.replace("$", "").replace("- Shipping", "").trim());
      }
    });

    const beforeTax = subTotal + shipping;
    const tax = beforeTax * 0.10;
    const total = tax + beforeTax;

    document.querySelector('.payment-summary-subtotal').innerText = `$${subTotal.toFixed(2)}`;
    document.querySelector('.payment-summary-shipping').innerText = `$${shipping.toFixed(2)}`;
    document.querySelector('.payment-summary-before-tax').innerText = `$${beforeTax.toFixed(2)}`;
    document.querySelector('.payment-summary-tax').innerText = `$${tax.toFixed(2)}`;
    document.querySelector('.payment-summary-total').innerText = `$${total.toFixed(2)}`;

    loadingSpinner.style.display = 'none'; // hide spinner after everything is calculated
  }, 1000);
}
updatePaymentSummary();

document.querySelectorAll('.quantity-input').forEach(input => {
  input.addEventListener('change', () => {
    updatePaymentSummary();
  });
});

document.querySelectorAll('.delivery-option-input').forEach(radio => {
  radio.addEventListener('change', () => {
    updatePaymentSummary();
  });
})

function placeOrder(){
  const loadingSpinner = document.querySelector('.payment-summary-loading');
  loadingSpinner.style.display = 'block';

  let cart = JSON.parse(localStorage.getItem('cart-saved')) || [];

  if (cart.length > 0) {
    let order = {
      orderId: `order-${Date.now()}`,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: getFutureDates(5),
      totalAmount: calculateAmount(cart),
      products: cart.map(product => ({
        id: product.id,
        name: product.name,
        image: product.image,
        quantity: product.quantity,
        price: product.price
      }))
    };
    
  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(order);
  localStorage.setItem('orders',JSON.stringify(orders));
  }

  const cartItems = document.querySelectorAll('.cart-item-container');
  cartItems.forEach(items => {
    items.remove()
    }
  );

  localStorage.removeItem('cart-saved');

  document.querySelector('.payment-summary-subtotal').innerText = '$0.00';
  document.querySelector('.payment-summary-shipping').innerText = '$0.00';
  document.querySelector('.payment-summary-before-tax').innerText = '$0.00';
  document.querySelector('.payment-summary-tax').innerText = '$0.00';
  document.querySelector('.payment-summary-total').innerText = '$0.00';

  setTimeout(() => {
    loadingSpinner.style.display = 'none';
    alert("Order placed successfully!");
    window.location.href = "orders.html";
  }, 1500);
} 

document.querySelector('.place-order-button').addEventListener('click', placeOrder);

