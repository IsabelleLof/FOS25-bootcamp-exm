console.log("JavaScript is working!");


const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const totalPriceEl = document.getElementById("totalPrice");


let cart = [];


document.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    cart.forEach(item => renderCartItem(item.name, item.price));
    updateTotal();
  }
  loadCoffeeMenu(); 
});


async function loadCoffeeMenu() {
  try {
    const response = await fetch("https://api.sampleapis.com/coffee/hot");
    const data = await response.json();

    data.forEach(coffee => {
      if (
        !coffee.title ||
        coffee.title.toLowerCase() === "unknown" ||
        !coffee.image ||
        !Array.isArray(coffee.ingredients) ||
        coffee.ingredients.length === 0
      ) return;

      const ingredients = coffee.ingredients.join(", ");
      const price = calculatePrice(coffee.ingredients);

      const item = document.createElement("li");
      item.className = "product-card";
      item.innerHTML = createCoffeeCard(coffee, price, ingredients);
      productList.appendChild(item);
    });
  } catch (error) {
    productList.innerHTML = "<li>Kunde inte hämta kaffemenyn.</li>";
    console.error("API error:", error);
  }
}


const calculatePrice = ingredients => 30 + ingredients.length * 2;

function createCoffeeCard(coffee, price, ingredients) {
  return `
    <h3>${coffee.title}</h3>
    <img src="${coffee.image}" alt="${coffee.title}" width="150">
    <p>${coffee.description}</p>
    <p><strong>Ingredienser:</strong> ${ingredients}</p>
    <button class="add-btn" onclick="addToCart('${coffee.title.replace(/'/g, "\\'")}', ${price}, this)">
      Lägg till i varukorg (${price} kr)
    </button>
  `;
}


const addToCart = (name, price, button) => {
  cart.push({ name, price });
  renderCartItem(name, price);
  updateTotal();
  saveCart();

  button.disabled = true;
  button.classList.add("added");
  button.textContent = "Tillagd ✔";

  setTimeout(() => {
    button.disabled = false;
    button.classList.remove("added");
    button.textContent = `Lägg till i varukorg (${price} kr)`;
  }, 3000);
};

const renderCartItem = (name, price) => {
  const item = document.createElement("li");
  item.className = "product-card";
  item.innerHTML = `
    ${name} – ${price} kr
    <button onclick="removeFromCart('${name.replace(/'/g, "\\'")}', ${price})">Ta bort</button>
  `;
  cartItems.appendChild(item);
};

const removeFromCart = (name, price) => {
  cart = cart.filter(item => !(item.name === name && item.price === price));
  cartItems.innerHTML = "";
  cart.forEach(item => renderCartItem(item.name, item.price));
  updateTotal();
  saveCart();
};

const updateTotal = () => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalPriceEl.textContent = `Totalt: ${total} kr`;
};

const saveCart = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const clearCart = () => {
  cart = [];
  cartItems.innerHTML = "";
  updateTotal();
  saveCart();
};


const sendOrder = () => {
  if (cart.length === 0) {
    alert("Varukorgen är tom. Lägg till produkter först.");
    return;
  }

  const orderNumber = "ORD-" + Date.now();
  const order = {
    orderNumber,
    items: [...cart],
    total: cart.reduce((sum, item) => sum + item.price, 0),
    timestamp: new Date().toLocaleString()
  };

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  clearCart();
  alert(`Tack! Din beställning (${orderNumber}) har skickats.`);
};