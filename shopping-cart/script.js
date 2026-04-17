// CENTRALIZED STATE

const state = {
  products: [
    { id: 1, name: "Laptop",       price: 95000, emoji: "💻", category: "Electronics" },
    { id: 2, name: "Phone",        price: 69000, emoji: "📱", category: "Electronics" },
    { id: 3, name: "Headphones",   price: 8500,  emoji: "🎧", category: "Audio"       },
    { id: 4, name: "Keyboard",     price: 12000, emoji: "⌨️",  category: "Accessories" },
    { id: 5, name: "Mouse",        price: 4500,  emoji: "🖱️",  category: "Accessories" },
    { id: 6, name: "Monitor",      price: 38000, emoji: "🖥️",  category: "Electronics" },
    { id: 7, name: "USB Hub",      price: 3200,  emoji: "🔌", category: "Accessories" },
    { id: 8, name: "Webcam",       price: 7800,  emoji: "📷", category: "Electronics" }
  ],
  cart: []  // { productId, quantity }
};

// PERSISTENCE HELPERS

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(state.cart));
}

function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) state.cart = JSON.parse(saved);
}

// CART FUNCTIONS

function addToCart(productId) {
  const existing = state.cart.find(item => item.productId === productId);

  if (existing) {
    existing.quantity++;
  } else {
    state.cart.push({ productId, quantity: 1 });
  }

  saveCart();
  renderCart();
  renderProducts(); // update button states
}

function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const item = state.cart.find(i => i.productId === productId);
  if (item) {
    item.quantity = quantity;
    saveCart();
    renderCart();
  }
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.productId !== productId);
  saveCart();
  renderCart();
  renderProducts(); // update button states
}

function clearCart() {
  if (state.cart.length === 0) return;
  if (confirm("Clear all items from cart?")) {
    state.cart = [];
    saveCart();
    renderCart();
    renderProducts();
  }
}

function getCartTotal() {
  return state.cart.reduce((total, item) => {
    const product = state.products.find(p => p.id === item.productId);
    return total + (product.price * item.quantity);
  }, 0);
}

function getCartCount() {
  return state.cart.reduce((count, item) => count + item.quantity, 0);
}

function checkout() {
  if (state.cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  const total = getCartTotal().toLocaleString();
  alert(`🎉 Order placed!\nTotal: KES ${total}\nThank you for shopping!`);
  state.cart = [];
  saveCart();
  renderCart();
  renderProducts();
}

function toggleCart() {
  const sidebar = document.getElementById("cartSidebar");
  sidebar.classList.toggle("hidden");
}

// RENDER FUNCTIONS

function renderProducts() {
  const grid = document.getElementById("productsGrid");

  grid.innerHTML = state.products.map(product => {
    const inCart = state.cart.find(i => i.productId === product.id);
    return `
      <div class="product-card">
        <div class="emoji">${product.emoji}</div>
        <h3>${product.name}</h3>
        <span class="category">${product.category}</span>
        <p class="price">KES ${product.price.toLocaleString()}</p>
        <button
          class="add-btn ${inCart ? "added" : ""}"
          onclick="addToCart(${product.id})"
        >
          ${inCart ? `✅ In Cart (${inCart.quantity})` : "🛒 Add to Cart"}
        </button>
      </div>
    `;
  }).join("");
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartCount = document.getElementById("cartCount");

  // Update header badge
  cartCount.textContent = getCartCount();

  // Update total
  cartTotal.textContent = `KES ${getCartTotal().toLocaleString()}`;

  // Empty state
  if (state.cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-cart">🛒 Your cart is empty</div>';
    return;
  }

  cartItems.innerHTML = state.cart.map(item => {
    const product = state.products.find(p => p.id === item.productId);
    const subtotal = product.price * item.quantity;
    return `
      <div class="cart-item">
        <div class="cart-item-name">${product.emoji} ${product.name}</div>
        <div class="cart-item-price">
          KES ${product.price.toLocaleString()} × ${item.quantity}
          = <strong>KES ${subtotal.toLocaleString()}</strong>
        </div>
        <div class="quantity-controls">
          <button class="qty-btn" onclick="updateQuantity(${product.id}, ${item.quantity - 1})">−</button>
          <span class="qty-display">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${product.id}, ${item.quantity + 1})">+</button>
          <button class="remove-btn" onclick="removeFromCart(${product.id})">🗑 Remove</button>
        </div>
      </div>
    `;
  }).join("");
}

// INITIALIZE

document.addEventListener("DOMContentLoaded", () => {
  loadCart();      // restore cart from localStorage
  renderProducts();
  renderCart();
});