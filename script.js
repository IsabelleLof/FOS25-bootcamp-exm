fetch("https://api.sampleapis.com/coffee/hot")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("productList");
    data.forEach(coffee => {
      const item = document.createElement("li");
      item.innerHTML = `
        <h3>${coffee.title}</h3>
        <p>${coffee.description}</p>
        <p><strong>Ingredienser:</strong> ${coffee.ingredients.join(", ")}</p>
        <img src="${coffee.image}" alt="${coffee.title}" width="200">
      `;
      list.appendChild(item);
    });
  })
  .catch(error => console.error("API error:", error));