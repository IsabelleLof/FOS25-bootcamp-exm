console.log("JavaScript is working!");

// DOM Elements
const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");
const searchInput = document.getElementById("searchInput");

// Cart Array
let cart = [];
let allProducts = []; // Lagrar alla produkter från API:t

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

// --- Hämta Coffee Menu ---
fetch("https://api.sampleapis.com/coffee/hot")
  .then(response => response.json())
  .then(data => {
    // Filtrera bort trasiga poster
    allProducts = data.filter(coffee =>
      coffee.title &&
      coffee.title.toLowerCase() !== "unknown" &&
      coffee.image &&
      Array.isArray(coffee.ingredients) &&
      coffee.ingredients.length > 0
    );
    renderProducts(allProducts);
  })
  .catch(error => {
    productList.innerHTML = "<li>Kunde inte hämta kaffemenyn.</li>";
    console.error("API error:", error);
  });

// --- Sökfunktion ---
searchInput.addEventListener("input", function (event) {
  const query = event.target.value.toLowerCase().trim();
  const filtered = allProducts.filter(coffee => {
    const title = coffee.title?.toLowerCase() || "";
    const desc = coffee.description?.toLowerCase() || "";
    const ingredients = (coffee.ingredients || []).join(", ").toLowerCase();
    return (
      title.includes(query) ||
      desc.includes(query) ||
      ingredients.includes(query)
    );
  });
  renderProducts(filtered);
});

// --- Rendera produkter ---
function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = "<li class='product-card'>Inget matchade din sökning.</li>";
    return;
  }

  products.forEach(coffee => {
    const ingredients = coffee.ingredients.join(", ");
    const price = 30 + coffee.ingredients.length * 2;

    const item = document.createElement("li");
    item.className = "product-card";
    item.innerHTML = `
      <h3>${coffee.title}</h3>
      <img src="${coffee.image}" alt="${coffee.title}" width="150">
      <p>${coffee.description || ""}</p>
      <p><strong>Ingredienser:</strong> ${ingredients}</p>
      <button class="add-btn" onclick="addToCart('${coffee.title.replace(/'/g, "\\'")}', ${price}, this)">
        Lägg till i varukorg (${price} kr)
      </button>
    `;
    productList.appendChild(item);
  });
}

// --- Lägg till i varukorg ---
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

// --- Render Cart Item ---
function renderCartItem(name, price) {
  const item = document.createElement("li");
  item.className = "product-card";
  item.innerHTML = `
    ${name} – ${price} kr
    <button onclick="removeFromCart('${name.replace(/'/g, "\\'")}', ${price})">Ta bort</button>
  `;
  cartItems.appendChild(item);
}

// --- Ta bort från varukorg ---
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

// --- Uppdatera totalpris ---
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalPriceEl.textContent = `Totalt: ${total} kr`;
}

// --- Spara varukorg ---
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Töm varukorg ---
function clearCart() {
  cart = [];
  cartItems.innerHTML = "";
  updateTotal();
  saveCart();
}

// --- Skicka beställning ---
function sendOrder() {
  if (cart.length === 0) {
    alert("Varukorgen är tom. Lägg till produkter först.");
    return;
  }

  const orderNumber = "ORD-" + Date.now();
  const order = {
    orderNumber: orderNumber,
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price, 0),
    timestamp: new Date().toLocaleString()
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  cart = [];
  cartItems.innerHTML = "";
  updateTotal();
  saveCart();

  alert(`Tack! Din beställning (${orderNumber}) har skickats.`);
}
