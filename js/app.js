const products = [
  {id:1, name:"1/4 de Pollo con Papas y Ensalada", local:22, delivery:24, emoji:"🍗"},
  {id:2, name:"1/2 Pollo con Papas y Ensalada", local:42, delivery:45, emoji:"🍗"},
  {id:3, name:"1 Pollo Entero con Papas y Ensalada", local:75, delivery:78, emoji:"🍗"}
];

let selectedId = 1;
let quantity = 1;
let cart = [];

const $ = id => document.getElementById(id);
const money = n => `S/ ${n.toFixed(2)}`;

function renderProducts(){
  $("products").innerHTML = products.map(p => `
    <article class="product">
      <div class="product-img">${p.emoji}</div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>Incluye papas y ensalada.</p>
        <div class="price">Desde ${money(p.local)}</div>
        <button class="btn primary" onclick="selectProduct(${p.id})">Elegir producto</button>
      </div>
    </article>
  `).join("");
}

function renderSelect(){
  $("productSelect").innerHTML = products.map(p =>
    `<option value="${p.id}">${p.name}</option>`).join("");
  $("productSelect").value = selectedId;
}

function getMode(){
  return document.querySelector('input[name="mode"]:checked').value;
}

function getCurrent(){
  return products.find(p => p.id === Number(selectedId));
}

function getExtras(){
  return [...document.querySelectorAll('.extras input:checked')].map(x => ({
    name:x.dataset.extra, price:Number(x.dataset.price)
  }));
}

function calculate(){
  const p = getCurrent();
  const mode = getMode();
  const unit = mode === "local" ? p.local : p.delivery;
  const extras = getExtras();
  const extraTotal = extras.reduce((s,e)=>s+e.price,0) * quantity;
  const subtotal = unit * quantity + extraTotal;
  const discount = subtotal > 120 ? subtotal * .10 : 0;
  const delivery = mode === "delivery" ? (subtotal > 80 ? 0 : 8) : 0;
  const total = subtotal - discount + delivery;
  return {p,mode,unit,extras,subtotal,discount,delivery,total};
}

function renderSummary(){
  const c = calculate();
  $("quantity").textContent = quantity;
  $("summaryContent").innerHTML = `
    <div style="padding:18px 0">
      <strong>${c.p.name}</strong>
      <div class="summary-line"><span>Cantidad</span><span>${quantity}</span></div>
      <div class="summary-line"><span>Modalidad</span><span>${c.mode === "local" ? "Consumo en local" : "Delivery"}</span></div>
      ${c.extras.length ? `<div class="summary-line"><span>Complementos</span><span>${c.extras.map(e=>e.name).join(", ")}</span></div>` : ""}
    </div>
    <div class="summary-line"><span>Subtotal</span><span>${money(c.subtotal)}</span></div>
    <div class="summary-line"><span>Descuento 10%</span><span>-${money(c.discount)}</span></div>
    <div class="summary-line"><span>Delivery</span><span>${c.delivery === 0 && c.mode === "delivery" ? "GRATIS" : money(c.delivery)}</span></div>
    <div class="summary-total"><span>TOTAL</span><strong>${money(c.total)}</strong></div>
  `;
}

function selectProduct(id){
  selectedId = id; quantity = 1;
  $("productSelect").value = id;
  document.querySelector("#pedido").scrollIntoView({behavior:"smooth"});
  renderSummary();
}

function addToCart(){
  const c = calculate();
  cart.push({
    id:Date.now(), name:c.p.name, quantity, mode:c.mode,
    extras:c.extras.map(e=>e.name), total:c.total
  });
  updateCart();
  openCart();
}

function updateCart(){
  $("cartCount").textContent = cart.reduce((s,i)=>s+i.quantity,0);
  $("cartItems").innerHTML = cart.length ? cart.map((i,index)=>`
    <div class="cart-item">
      <strong>${i.quantity} × ${i.name}</strong>
      <small>${i.mode === "delivery" ? "Delivery" : "Local"}${i.extras.length ? " · " + i.extras.join(", ") : ""}</small>
      <div style="display:flex;justify-content:space-between;margin-top:7px">
        <span>${money(i.total)}</span>
        <button onclick="removeItem(${index})" style="border:0;background:none;color:#b51f2a;cursor:pointer">Eliminar</button>
      </div>
    </div>`).join("") : `<p style="color:#766e68;text-align:center;padding:30px 0">Tu carrito está vacío.</p>`;
  $("cartTotal").textContent = money(cart.reduce((s,i)=>s+i.total,0));
}
function removeItem(i){cart.splice(i,1);updateCart();}
function openCart(){$("cartPanel").classList.add("open");$("overlay").classList.add("open")}
function closeCart(){$("cartPanel").classList.remove("open");$("overlay").classList.remove("open")}

$("productSelect").addEventListener("change",e=>{selectedId=e.target.value;quantity=1;renderSummary()});
$("plus").addEventListener("click",()=>{quantity++;renderSummary()});
$("minus").addEventListener("click",()=>{if(quantity>1)quantity--;renderSummary()});
document.querySelectorAll('input[name="mode"]').forEach(x=>x.addEventListener("change",renderSummary));
document.querySelectorAll('.extras input').forEach(x=>x.addEventListener("change",renderSummary));
$("addToCart").addEventListener("click",addToCart);
$("cartButton").addEventListener("click",openCart);
$("closeCart").addEventListener("click",closeCart);
$("overlay").addEventListener("click",closeCart);

$("checkout").addEventListener("click",()=>{
  if(!cart.length){alert("Agrega al menos un producto al carrito.");return;}
  const total = cart.reduce((s,i)=>s+i.total,0);
  const order = "NK-" + Math.floor(10000 + Math.random()*90000);
  $("cartItems").innerHTML = `<div class="success">¡Pedido confirmado!<br><br>Número: <b>${order}</b><br>Total: <b>${money(total)}</b></div>`;
  cart=[]; updateCart(); openCart();
});

renderProducts();
renderSelect();
renderSummary();
updateCart();
