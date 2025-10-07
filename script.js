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
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    data.forEach(function (coffee) {
      const ingredients = Array.isArray(coffee.ingredients)
        ? coffee.ingredients.join(", ")
        : "Okänd";

      const price = 30 + (Array.isArray(coffee.ingredients)
        ? coffee.ingredients.length * 2
        : 0);

      const item = document.createElement("li");
      item.innerHTML = `
        <h3>${coffee.title}</h3>
        <img src="${coffee.image}" alt="${coffee.title}" width="150">
        <p>${coffee.description}</p>
        <p><strong>Ingredienser:</strong> ${ingredients}</p>
        <button onclick="addToCart('${coffee.title.replace(/'/g, "\\'")}', ${price})">
          Lägg till i varukorg (${price} kr)
        </button>
      `;
      productList.appendChild(item);
    });
  })
  .catch(function (error) {
    productList.innerHTML = "<li>Kunde inte hämta kaffemenyn.</li>";
    console.error("API error:", error);
  });

// Add Item to Cart
function addToCart(name, price) {
  cart.push({ name, price });
  renderCartItem(name, price);
  updateTotal();
  saveCart();
}

// Render Cart Item
function renderCartItem(name, price) {
  const item = document.createElement("li");
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

// Feedback Form Validation
function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Fyll i alla fält!");
    return false;
  }

  alert("Tack för din feedback!");
  return true;
}