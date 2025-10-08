console.log("JavaScript is working!");


// DOM Elements
const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");

// Cart Array
let cart = [];

// Load Saved Cart
document.addEventListener("DOMContentLoaded", function () {
  let savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    cart.forEach(function (item) {
      renderCartItem(item.name, item.price);
    });
    updateTotal();
  }
});

// Fetch Coffee Menu
fetch("https://api.sampleapis.com/coffee/hot")
  .then(response => response.json())
  .then(data => {
    data.forEach(coffee => {
      // ✅ Skip items with missing image, title, or ingredients
      if (
        !coffee.title ||
        coffee.title.toLowerCase() === "unknown" ||
        !coffee.image ||
        !Array.isArray(coffee.ingredients) ||
        coffee.ingredients.length === 0
      ) {
        return; // Skip this item
      }

      const ingredients = coffee.ingredients.join(", ");
      const price = 30 + coffee.ingredients.length * 2;

      const item = document.createElement("li");
      item.className = "product-card";
      item.innerHTML = `
        <h3>${coffee.title}</h3>
        <img src="${coffee.image}" alt="${coffee.title}" width="150">
        <p>${coffee.description}</p>
        <p><strong>Ingredienser:</strong> ${ingredients}</p>
        <button class="add-btn" onclick="addToCart('${coffee.title.replace(/'/g, "\\'")}', ${price}, this)">
          Lägg till i varukorg (${price} kr)
        </button>
      `;
      productList.appendChild(item);
    });
  })
  .catch(error => {
    productList.innerHTML = "<li>Kunde inte hämta kaffemenyn.</li>";
    console.error("API error:", error);
  });

// Add Item to Cart
function addToCart(name, price, button) {
  cart.push({ name, price });
  renderCartItem(name, price);
  updateTotal();
  saveCart();

  button.classList.add("added");
  button.textContent = "Tillagd ✔";

    setTimeout(() => {
    button.classList.remove("added");
    button.textContent = `Lägg till i varukorg (${price} kr)`;
  }, 3000);
}


// Render Cart Item
function renderCartItem(name, price) {
  const item = document.createElement("li");
  item.className = "product-card";
  item.innerHTML = `
    ${name} – ${price} kr
    <button onclick="removeFromCart('${name.replace(/'/g, "\\'")}', ${price})">Ta bort</button>
  `;
  cartItems.appendChild(item);
}

// Remove Item from Cart
function removeFromCart(name, price) {
  cart = cart.filter(function (item) {
    return !(item.name === name && item.price === price);
  });
  cartItems.innerHTML = "";
  cart.forEach(function (item) {
    renderCartItem(item.name, item.price);
  });
  updateTotal();
  saveCart();
}

// Update Total Price
function updateTotal() {
  const total = cart.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);
  totalPriceEl.textContent = `Totalt: ${total} kr`;
}

// Save Cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Clear Cart
function clearCart() {
  cart = [];
  cartItems.innerHTML = "";
  updateTotal();
  saveCart();
}

function sendOrder() {
  if (cart.length === 0) {
    alert("Varukorgen är tom. Lägg till produkter först.");
    return;
  }

  const orderNumber = "ORD-" + Date.now(); // Unique timestamp-based ID
  const order = {
    orderNumber: orderNumber,
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price, 0),
    timestamp: new Date().toLocaleString()
  };

  // Save to localStorage
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear cart
  cart = [];
  cartItems.innerHTML = "";
  updateTotal();
  saveCart();

  // Confirmation
  alert(`Tack! Din beställning (${orderNumber}) har skickats.`);
}

// Feedback Form Validation
// seprate file