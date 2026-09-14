const products = [
  { id: 1, name: "1/4 de Pollo con Papas y Ensalada", local: 22, delivery: 24, emoji: "🍗", description: "Porción personal con papas y ensalada." },
  { id: 2, name: "1/2 Pollo con Papas y Ensalada", local: 42, delivery: 45, emoji: "🍗", description: "Una opción ideal para compartir." },
  { id: 3, name: "1 Pollo Entero con Papas y Ensalada", local: 75, delivery: 78, emoji: "🍗", description: "Para disfrutar en familia." }
];

let selectedProduct = 1;
let quantity = 1;
let cart = [];

const money = value => `S/ ${value.toFixed(2)}`;
const getMode = () => document.querySelector('input[name="mode"]:checked').value;

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = products.map(p => `
    <article class="product">
      <div class="product-visual">${p.emoji}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="price-row">
          <span class="price">Desde ${money(p.local)}</span>
          <button class="mini-btn" onclick="selectProduct(${p.id})">Elegir</button>
        </div>
      </div>
    </article>
  `).join("");
}

function populateSelect() {
  document.getElementById("productSelect").innerHTML = products
    .map(p => `<option value="${p.id}">${p.name}</option>`).join("");
}

function calculateCurrent() {
  const product = products.find(p => p.id === Number(selectedProduct));
  const mode = getMode();
  const base = mode === "delivery" ? product.delivery : product.local;
  let extras = 0;
  document.querySelectorAll(".extras input:checked").forEach(input => extras += Number(input.dataset.price));
  const subtotal = (base + extras) * quantity;
  const discount = subtotal > 120 ? subtotal * 0.10 : 0;
  const deliveryFee = mode === "delivery" ? (subtotal > 80 ? 0 : 8) : 0;
  const total = subtotal - discount + deliveryFee;
  return { product, mode, base, extras, subtotal, discount, deliveryFee, total };
}

function renderSummary() {
  const c = calculateCurrent();
  document.getElementById("summaryContent").innerHTML = `
    <div class="summary-item">
      <strong>${c.product.name}</strong>
      <div class="summary-line"><span>Cantidad</span><span>${quantity}</span></div>
      <div class="summary-line"><span>Modalidad</span><span>${c.mode === "delivery" ? "Delivery" : "Local"}</span></div>
      <div class="summary-line"><span>Precio unitario</span><span>${money(c.base)}</span></div>
      ${c.extras ? `<div class="summary-line"><span>Complementos</span><span>+ ${money(c.extras)}</span></div>` : ""}
    </div>
    <div class="summary-line"><span>Subtotal</span><strong>${money(c.subtotal)}</strong></div>
    <div class="summary-line"><span>Descuento 10%</span><strong>- ${money(c.discount)}</strong></div>
    <div class="summary-line"><span>Delivery</span><strong>${c.deliveryFee ? money(c.deliveryFee) : "GRATIS"}</strong></div>
    <div class="total"><span>Total</span><span>${money(c.total)}</span></div>
  `;
}

function selectProduct(id) {
  selectedProduct = id;
  document.getElementById("productSelect").value = id;
  quantity = 1;
  document.getElementById("quantity").textContent = quantity;
  renderSummary();
  document.getElementById("pedido").scrollIntoView({ behavior: "smooth" });
}

function addToCart() {
  const c = calculateCurrent();
  clearOrderMessage();
  const extras = [...document.querySelectorAll(".extras input:checked")].map(i => i.dataset.extra);
  cart.push({
    name: c.product.name,
    quantity,
    mode: c.mode,
    total: c.total,
    extras
  });
  renderCart();
  openCart();
}

function showOrderMessage(order, total) {
  const message = document.getElementById("orderMessage");
  message.hidden = false;
  message.innerHTML = `<strong>✓ Pedido ${order} registrado correctamente.</strong><span>Total: ${money(total)}</span>`;
}

function clearOrderMessage() {
  const message = document.getElementById("orderMessage");
  message.hidden = true;
  message.innerHTML = "";
}

function renderCart() {
  const items = document.getElementById("cartItems");
  document.getElementById("cartCount").textContent = cart.length;
  if (!cart.length) {
    items.innerHTML = `<p style="color:#66736a">Tu carrito está vacío.</p>`;
  } else {
    items.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-top">
          <strong>${item.quantity} × ${item.name}</strong>
          <b>${money(item.total)}</b>
        </div>
        <div class="summary-line"><span>${item.mode === "delivery" ? "Delivery" : "Local"}</span><button onclick="removeItem(${index})" style="border:0;background:none;color:#b42318;cursor:pointer">Eliminar</button></div>
        ${item.extras.length ? `<small>Extras: ${item.extras.join(", ")}</small>` : ""}
      </div>
    `).join("");
  }
  const total = cart.reduce((sum, item) => sum + item.total, 0);
  document.getElementById("cartTotal").textContent = money(total);
}

function removeItem(index) {
  clearOrderMessage();
  cart.splice(index, 1);
  renderCart();
}

function openCart() {
  document.getElementById("cartPanel").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}
function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

document.getElementById("productSelect").addEventListener("change", e => {
  selectedProduct = Number(e.target.value);
  quantity = 1;
  document.getElementById("quantity").textContent = quantity;
  renderSummary();
});
document.getElementById("plus").addEventListener("click", () => {
  quantity++;
  document.getElementById("quantity").textContent = quantity;
  renderSummary();
});
document.getElementById("minus").addEventListener("click", () => {
  if (quantity > 1) quantity--;
  document.getElementById("quantity").textContent = quantity;
  renderSummary();
});
document.querySelectorAll('input[name="mode"], .extras input').forEach(input => {
  input.addEventListener("change", renderSummary);
});
document.getElementById("addToCart").addEventListener("click", addToCart);
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) {
    clearOrderMessage();
    const message = document.getElementById("orderMessage");
    message.hidden = false;
    message.innerHTML = `<strong>Tu carrito está vacío.</strong><span>Agrega al menos un producto antes de confirmar.</span>`;
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.total, 0);
  const order = `NK-${Math.floor(10000 + Math.random() * 90000)}`;
  showOrderMessage(order, total);
});

renderProducts();
populateSelect();
renderSummary();
renderCart();
