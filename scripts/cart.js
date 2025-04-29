export let cart = [];

const savedCart = localStorage.getItem('cart-saved');

if (savedCart) {
  cart = JSON.parse(savedCart);
}

export function addToCart(addedProductName, addedProductId) {
  let matchingItem;

    cart.forEach((item) => {
      if (addedProductId === item.addedProductId){
        matchingItem = item;
      }
    });

    const quantitySelection = document.querySelector(`.added-product-quantity-id-${addedProductId}`);
    const quantityValue = Number(quantitySelection.value);

    if(matchingItem) {
      matchingItem.quantity+=quantityValue;
    }
    else {
      cart.push({
        addedProductName: addedProductName,
        addedProductId: addedProductId,
        quantity: quantityValue
      });
    }

    //storing the values of the cart in local storage, 
    // so that they are not refreshed everytime the page is refreshed.
    localStorage.setItem('cart-saved', JSON.stringify(cart));
}

export function cartMessageTimeout (addedProductId) {
  let addedMessageTimeoutId;
  const addedMessage = document.querySelector(`.js-added-to-cart-${addedProductId}`);

  addedMessage.classList.add("added-to-cart-visible");


  setTimeout(() => {
    if (addedMessageTimeoutId) {
      clearTimeout(addedMessageTimeoutId);
    }
    addedMessageTimeoutId = setTimeout(() => {
      addedMessage.classList.remove("added-to-cart-visible");
    }, 1500);
  });     
}

export function updateCartQuantity() {
 let total = 0;
  cart.forEach(item => {
    total += item.quantity;
  });
  document.querySelector('.cart-quantity').innerHTML = `${total} items`;
};

export function removeItemFromCart(removeItemId) {
  const index = cart.findIndex(cartItem => cartItem.addedProductId === removeItemId);

  if (index !== -1) { 
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1; 
    } else {
      cart.splice(index, 1); 
    }

    localStorage.setItem('cart-saved', JSON.stringify(cart));
  }
}