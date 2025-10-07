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
      const ingredients = Array.isArray(coffee.ingredients)
        ? coffee.ingredients.join(", ")
        : "Okänd";

      const price = 30 + (Array.isArray(coffee.ingredients)
        ? coffee.ingredients.length * 2
        : 0);

      // Skapa li-element för kortet
      const item = document.createElement("li");
      item.className = "product-card";

      // Bild
      const imgEl = document.createElement("img");
      imgEl.src = coffee.image;
      imgEl.alt = coffee.title;
      imgEl.width = 150;

      // Titel
      const titleEl = document.createElement("h3");
      titleEl.textContent = coffee.title;

      // Beskrivning (kortad till 100 tecken)
      const descEl = document.createElement("p");
      descEl.textContent = coffee.description.length > 25
        ? coffee.description.slice(0, 25) + "..."
        : coffee.description;

      // Ingredienser
      const ingEl = document.createElement("p");
      ingEl.innerHTML = `<strong>Ingredienser:</strong> ${ingredients}`;

      // Knapp med egen className
      const buttonEl = document.createElement("button");
      buttonEl.className = "buttonCard";
      buttonEl.textContent = "+";
      buttonEl.addEventListener("click", () => addToCart(coffee.title, price));

      // Lägg till alla delar i li
      item.append(imgEl, titleEl, descEl, ingEl, buttonEl);

      // Lägg till i listan
      productList.appendChild(item);
    });
  })
  .catch(error => {
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
// seprate file