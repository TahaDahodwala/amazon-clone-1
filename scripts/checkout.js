import { products } from "/scripts/products.js";
import { cart, removeItemFromCart, updateCartQuantity } from "/scripts/cart.js";

function getFutureDates(days) {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

function calculateAmount(cart) {
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.addedProductId);
    return total + (product ? (product.priceCents / 100) * item.quantity : 0);
  }, 0);
}

function renderCheckoutPage() {
  const container = document.querySelector(".js-order-summary");
  if (!container) {
    console.error("Element with class '.js-order-summary' not found!");
    return;
  }

  let html = '';
  cart.forEach(item => {
    const product = products.find(p => p.id === item.addedProductId);
    if (!product) return;

    html += `
      <div class="cart-item-container">
        <div class="delivery-date">Delivery date: ${getFutureDates(2)}</div>
        <div class="cart-items-details-grid">
          <img class="product-image" src="${product.image}">
          <div class="cart-items-details">
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${(product.priceCents / 100).toFixed(2)}</div>
            <div class="product-quantity">
              Quantity: <span class="quantity-label">${item.quantity}</span>
              <span class="update-cart-js" data-product-id="${product.id}">Update</span>
              <span class="delete-from-cart-js" data-delete-from-cart="${product.id}">Delete</span>
            </div>
          </div>
          <div class="deliver-options">
            <div>Choose a delivery option:</div>
            ${[7, 4, 2].map(day => `
              <label>
                <input type="radio" class="delivery-option-input" name="delivery-option-${product.id}"
                  data-date="${getFutureDates(day)}" data-price="${(9 - (day * 1.5)).toFixed(2)}" ${day === 7 ? 'checked' : ''}>
                ${getFutureDates(day)} - $${(9 - (day * 1.5)).toFixed(2)} Shipping
              </label>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  document.querySelectorAll('.delete-from-cart-js').forEach(btn => {
    btn.addEventListener('click', () => {
      removeItemFromCart(btn.dataset.deleteFromCart);
      location.reload();
    });
  });

  document.querySelectorAll('.update-cart-js').forEach(btn => {
    btn.addEventListener('click', () => {
      const newQty = Number(prompt("Enter new quantity (1–10):"));
      const cartItem = cart.find(i => i.addedProductId === btn.dataset.productId);
      if (cartItem && newQty >= 1 && newQty <= 10) {
        cartItem.quantity = newQty;
        localStorage.setItem('cart-saved', JSON.stringify(cart));
        location.reload();
      } else {
        alert("Invalid quantity!");
      }
    });
  });

  document.querySelectorAll('.delivery-option-input').forEach(input => {
    input.addEventListener('change', updatePaymentSummary);
  });
}

function updatePaymentSummary() {
  const loading = document.querySelector('.payment-summary-loading');
  if (!loading) return;

  loading.style.display = 'block';

  setTimeout(() => {
    let subTotal = 0, shipping = 0;
    cart.forEach(item => {
      const product = products.find(p => p.id === item.addedProductId);
      if (!product) return;

      subTotal += (product.priceCents / 100) * item.quantity;

      const deliveryInput = document.querySelector(`input[name="delivery-option-${product.id}"]:checked`);
      if (deliveryInput) {
        shipping += parseFloat(deliveryInput.dataset.price);
        document.querySelector('.order-summary-date').textContent = deliveryInput.dataset.date;
        document.querySelector('.order-summary-price').textContent = `$${deliveryInput.dataset.price}`;
      }
    });

    const beforeTax = subTotal + shipping;
    const tax = beforeTax * 0.10;
    const total = beforeTax + tax;

    document.querySelector('.payment-summary-subtotal').textContent = `$${subTotal.toFixed(2)}`;
    document.querySelector('.payment-summary-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.querySelector('.payment-summary-before-tax').textContent = `$${beforeTax.toFixed(2)}`;
    document.querySelector('.payment-summary-tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.payment-summary-total').textContent = `$${total.toFixed(2)}`;

    loading.style.display = 'none';
  }, 1000);
}

function placeOrder() {
  const loading = document.querySelector('.payment-summary-loading');
  if (loading) loading.style.display = 'block';

  const order = {
    id: `order-${Date.now()}`,
    date: new Date().toISOString(),
    items: cart,
    total: calculateAmount(cart)
  };

  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
  localStorage.removeItem('cart-saved');

  setTimeout(() => {
    if (loading) loading.style.display = 'none';
    alert('Order placed!');
    window.location.href = '/orders.html';
  }, 1500);
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartQuantity();
  renderCheckoutPage();
  updatePaymentSummary();
  const placeBtn = document.querySelector('.place-order-button');
  if (placeBtn) placeBtn.addEventListener('click', placeOrder);
});
