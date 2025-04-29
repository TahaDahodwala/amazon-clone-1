document.addEventListener("DOMContentLoaded", () => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const container = document.getElementById('orders-container');

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  orders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");

    orderDiv.innerHTML = `
      <h3>Order ID: ${order.id}</h3>
      <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
      <p>Total: $${order.total.toFixed(2)}</p>
      <ul>
        ${order.items.map(item => `
          <li>
            ${item.addedProductName} — Quantity: ${item.quantity}
          </li>
        `).join('')}
      </ul>
      <hr>
    `;

    container.appendChild(orderDiv);
  });
});
