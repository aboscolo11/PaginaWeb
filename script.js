// ════════════════════════════════════════════════════════
// MODAL DE BIENVENIDA
// ════════════════════════════════════════════════════════

function closeWelcomeModal() {
  const modal = document.getElementById("welcomeModal");
  modal.classList.add("hidden");
  localStorage.setItem("welcomeModalClosed", new Date().getTime());
}

function checkWelcomeModal() {
  const lastClosed = localStorage.getItem("welcomeModalClosed");
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (lastClosed && (now - lastClosed) < oneDay) {
    const modal = document.getElementById("welcomeModal");
    modal.classList.add("hidden");
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkWelcomeModal);
} else {
  checkWelcomeModal();
}

const WA_NUMBER = "541134843360";

const BANNER_IMAGES = [
  "./imagenes/Banner2.png",
  "./imagenes/Banners.png",
  
];
let currentBannerIndex = 0;

function showBanner(index) {
  if (BANNER_IMAGES.length === 0) return;
  currentBannerIndex = (index + BANNER_IMAGES.length) % BANNER_IMAGES.length;
  document.getElementById("bannerImage").src = BANNER_IMAGES[currentBannerIndex];
  updateBannerDots();
}

function nextBanner() { showBanner(currentBannerIndex + 1); }
function prevBanner() { showBanner(currentBannerIndex - 1); }

function updateBannerDots() {
  const dotsDiv = document.getElementById("carouselDots");
  dotsDiv.innerHTML = BANNER_IMAGES.map(
    (_, i) => `<div class="dot ${i === currentBannerIndex ? "active" : ""}" onclick="showBanner(${i})"></div>`
  ).join("");
}

function initBanner() {
  if (BANNER_IMAGES.length === 0) return;
  showBanner(0);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    checkWelcomeModal();
    initBanner();
  });
} else {
  checkWelcomeModal();
  initBanner();
}

// ════════════════════════════════════════════════════════
// CONFIGURACIÓN SUPABASE (usando fetch - sin librería externa)
// ════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://lwkvcnusihajdyouexip.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qKePI3pCPxCJcGsJWSAfOg_zTm39iOP';

let PRODUCTS = [];
let isLoadingProducts = false;

async function cargarProductosDesdeSupabase() {
  isLoadingProducts = true;
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/Productos?select=*&order=id.asc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Productos cargados:', data);
    
    PRODUCTS = data.map(p => ({
      id: p.id,
      marca: p.marca,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: Number(p.precio),
      precio_usd: Number(p.precio_usd || 0),
      descuentoEfectivo: Number(p.descuento_efectivo || 0),
      genero: p.genero,
      badge: p.badge,
      notas: p.notas,
      imagenes: p.imagenes ? JSON.parse(p.imagenes) : []
    }));
    
    filteredProducts = [...PRODUCTS];
    
    const grid = document.getElementById("productGrid");
    if (grid) renderProducts(PRODUCTS);
    
  } catch (err) {
    console.error('Error al cargar productos:', err);
  } finally {
    isLoadingProducts = false;
  }
}

let filteredProducts = [...PRODUCTS];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12;
let cartItems = {};

function formatPrice(n) { return "$" + n.toLocaleString("es-AR"); }
function installmentPrice(price, cuotas = 3) { return formatPrice(Math.ceil(price / cuotas)); }

function saveCartState() {
  localStorage.setItem("tecnoadvanceCart", JSON.stringify(cartItems));
}

function loadCartState() {
  const saved = localStorage.getItem("tecnoadvanceCart");
  cartItems = saved ? JSON.parse(saved) : {};
}

function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (!countEl) return;
  const totalQty = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  countEl.textContent = totalQty;
}

function buildWaLink(producto) {
  const msg = encodeURIComponent(`Hola quiero comprar ${producto.marca} ${producto.nombre}`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function addToCart(productId) {
  cartItems[productId] = (cartItems[productId] || 0) + 1;
  saveCartState();
  renderCart();
  renderOrderPage();
}

function getCartTotal() {
  return Object.entries(cartItems).reduce((total, [id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    return total + (product ? product.precio * qty : 0);
  }, 0);
}

function buildCartWaLink() {
  const entries = Object.entries(cartItems);
  const lines = entries.map(([id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return "";
    return `${qty} x ${product.marca} ${product.nombre} - ${formatPrice(product.precio)}`;
  }).filter(Boolean);
  const total = formatPrice(getCartTotal());
  const msg = encodeURIComponent(`Hola, quiero hacer un pedido:\n${lines.join("\n")}\nTotal: ${total}`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

function renderCart() {
  updateCartCount();
  const panel = document.getElementById("cartPanel");
  if (!panel) return;

  const entries = Object.entries(cartItems);
  if (entries.length === 0) {
    panel.innerHTML = `<div class="cart-empty">Aún no hay productos en el carrito.</div>`;
    panel.classList.remove("active");
    updateCartCount();
    return;
  }

  panel.classList.add("active");
  updateCartCount();
  const itemsHtml = entries.map(([id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return "";
    return `
      <div class="cart-item">
        <div class="cart-item-details">
          <span>${qty}x ${product.marca} ${product.nombre}</span>
          <small>${formatPrice(product.precio)} c/u</small>
        </div>
        <div class="cart-item-actions">
          <span>${formatPrice(product.precio * qty)}</span>
          <button type="button" class="cart-item-remove" onclick="removeCartItem(${id})">Quitar</button>
        </div>
      </div>`;
  }).join("");

  panel.innerHTML = `
    <div class="cart-meta">
      <div><strong>Pedido en armado</strong> — ${entries.length} artículo${entries.length !== 1 ? "s" : ""}</div>
      <div class="cart-total">Total: ${formatPrice(getCartTotal())}</div>
    </div>
    <div class="cart-items">${itemsHtml}</div>
    <div class="cart-actions">
      <a href="${buildCartWaLink()}" target="_blank" class="btn-cart-send">Enviar pedido por WhatsApp</a>
      <button type="button" class="btn-clear-cart" onclick="clearCartItems()">Limpiar pedido</button>
    </div>
  `;
}

function renderOrderPage() {
  const orderContent = document.getElementById("orderContent");
  if (!orderContent) return;

  const entries = Object.entries(cartItems);
  if (entries.length === 0) {
    orderContent.innerHTML = `
      <div class="order-empty">
        <p>No hay productos en el pedido.</p>
        <a href="index.html" class="btn-secondary">Volver al catálogo</a>
      </div>`;
    return;
  }

  const itemsHtml = entries.map(([id, qty]) => {
    const product = PRODUCTS.find((p) => p.id === Number(id));
    if (!product) return "";
    return `
      <div class="order-row">
        <div class="order-item-info">
          <div>${qty}x ${product.marca} ${product.nombre}</div>
          <small>${formatPrice(product.precio)} c/u</small>
        </div>
        <div class="order-item-actions">
          <span>${formatPrice(product.precio * qty)}</span>
          <button type="button" class="cart-item-remove" onclick="removeCartItem(${id})">Quitar</button>
        </div>
      </div>`;
  }).join("");

  orderContent.innerHTML = `
    <div class="order-summary-box">
      <div class="order-meta">
        <div><strong>${entries.length}</strong> artículo${entries.length !== 1 ? "s" : ""}</div>
        <div>Total: <strong>${formatPrice(getCartTotal())}</strong></div>
      </div>
      <div class="order-items">${itemsHtml}</div>
      <div class="order-actions">
        <a href="${buildCartWaLink()}" target="_blank" class="btn-cart-send">Enviar pedido por WhatsApp</a>
        <button type="button" class="btn-clear-cart" onclick="clearCartItems()">Vaciar pedido</button>
      </div>
    </div>`;
}

function removeCartItem(productId) {
  if (!cartItems[productId]) return;
  delete cartItems[productId];
  saveCartState();
  renderCart();
  renderOrderPage();
}

function clearCartItems() {
  cartItems = {};
  saveCartState();
  renderCart();
  renderOrderPage();
}

function badgeHTML(badge) {
  if (!badge) return "";
  const labels = { new: "Nuevo", hot: "🔥 Popular", oferta: "Oferta" };
  return `<div class="product-badge badge-${badge}">${labels[badge]}</div>`;
}

function productImgSrc(p, index = 0) {
  if (p.imagenes && p.imagenes.length > 0) return p.imagenes[index];
  if (p.imagen) return p.imagen;
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='220'%3E%3Crect width='200' height='220' fill='%23f5f2ee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='72'%3E${p.emoji}%3C/text%3E%3C/svg%3E`;
}

function cardHTML(p) {
  const waLink = buildWaLink(p);
  const hasMultipleImages = p.imagenes && p.imagenes.length > 1;
  const imageCount = p.imagenes ? p.imagenes.length : 1;
  const volumen = (p.descripcion.match(/\d+\s?ML/i) || [""])[0];
  const precioFinal = p.precio * (1 - p.descuentoEfectivo / 100);

  return `
    <div class="product-card" data-genero="${p.genero}" data-marca="${p.marca}" data-precio="${p.precio}">
      ${badgeHTML(p.badge)}
      <div class="product-img-wrap">
        <img src="${productImgSrc(p, 0)}" alt="${p.marca} ${p.nombre}" loading="lazy" class="product-main-img" data-product-id="${p.id}" onclick="openProductModal(${p.id})" />
        ${hasMultipleImages ? `
          <button class="img-nav prev" onclick="changeProductImage(event, ${p.id}, -1)">◀</button>
          <button class="img-nav next" onclick="changeProductImage(event, ${p.id}, 1)">▶</button>
          <div class="img-counter" data-product-id="${p.id}">1/${imageCount}</div>
        ` : ''}
        <a href="${waLink}" target="_blank" class="quick-wa">Comprar por WhatsApp</a>
      </div>
      <div class="product-info">
        ${volumen ? `<div class="product-volume">${volumen}</div>` : ''}
        <div class="product-brand">${p.marca}</div>
        <div class="product-name">${p.nombre}</div>
        <p class="product-notes">${p.notas}</p>
        <div class="product-pricing">
          <div class="price-row">
            <span class="price-original">${formatPrice(p.precio)}</span>
            <span class="price-final">${formatPrice(precioFinal)}</span>
            <span class="price-off-badge">${p.descuentoEfectivo}% OFF</span>
          </div>
          <div class="product-installment">3 cuotas de ${installmentPrice(precioFinal)} sin interés</div>
        </div>
        <div class="product-shipping">🚚 Envío gratis en 24-48hs</div>
      </div>
      <div class="product-actions">
        <button type="button" class="btn-cart" onclick="addToCart(${p.id})">Agregar al carrito</button>
      </div>
    </div>`;
}

function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("productCount");

  if (list.length === 0) {
    grid.innerHTML = `<div class="no-results"><h3>No se encontraron productos</h3></div>`;
  } else {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const pageProducts = list.slice(startIndex, endIndex);
    grid.innerHTML = pageProducts.map(cardHTML).join("");
    const totalPages = Math.ceil(list.length / PRODUCTS_PER_PAGE);
    updatePagination(totalPages);
  }

  const n = list.length;
  count.innerHTML = `<strong>${n}</strong> producto${n !== 1 ? "s" : ""} encontrado${n !== 1 ? "s" : ""}`;
}

function updatePagination(totalPages) {
  const paginationDiv = document.getElementById("pagination");
  if (totalPages <= 1) { paginationDiv.style.display = "none"; return; }
  paginationDiv.style.display = "flex";
  
  let html = "";
  if (currentPage > 1) html += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    const activeClass = i === currentPage ? "active" : "";
    html += `<button class="page-btn ${activeClass}" onclick="goToPage(${i})">${i}</button>`;
  }
  if (currentPage < totalPages) html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">›</button>`;
  paginationDiv.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderProducts(filteredProducts);
  document.querySelector(".catalog").scrollIntoView({ behavior: "smooth" });
}

function applyFilters() {
  const checkedGeneros = [...document.querySelectorAll('[data-filter="genero"]:checked')].map((el) => el.value);
  const checkedMarcas = [...document.querySelectorAll('[data-filter="marca"]:checked')].map((el) => el.value);
  const minPrice = parseInt(document.getElementById("priceMin").value) || 0;
  const maxPrice = parseInt(document.getElementById("priceMax").value) || 999999;
  const searchTerm = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();

  filteredProducts = PRODUCTS.filter((p) => {
    const generoOk = checkedGeneros.length === 0 || checkedGeneros.includes(p.genero);
    const marcaOk = checkedMarcas.length === 0 || checkedMarcas.includes(p.marca);
    const precioOk = p.precio <= maxPrice && p.precio >= minPrice;
    const searchOk = searchTerm === "" || p.nombre.toLowerCase().includes(searchTerm);
    return generoOk && marcaOk && precioOk && searchOk;
  });

  currentPage = 1;
  renderProducts(filteredProducts);
  renderActiveTags(checkedGeneros, checkedMarcas);
}

function renderActiveTags(generos, marcas) {
  const container = document.getElementById("activeFilters");
  const tags = [...generos.map((g) => ({ label: g, type: "genero" })), ...marcas.map((m) => ({ label: m, type: "marca" }))];
  container.innerHTML = tags.map((t) => `<div class="filter-tag">${t.label} <button onclick="removeFilter('${t.type}','${t.label}')">×</button></div>`).join("");
}

function removeFilter(type, val) {
  const input = document.querySelector(`[data-filter="${type}"][value="${val}"]`);
  if (input) input.checked = false;
  applyFilters();
}

function clearFilters() {
  document.querySelectorAll("[data-filter]").forEach((el) => (el.checked = false));
  document.getElementById("searchInput").value = "";
  document.getElementById("priceMin").value = 0;
  document.getElementById("priceMax").value = 80000;
  document.getElementById("priceSlider").value = 80000;
  filteredProducts = [...PRODUCTS];
  currentPage = 1;
  renderProducts(filteredProducts);
  document.getElementById("activeFilters").innerHTML = "";
}

function sortProducts(val) {
  const arr = [...filteredProducts];
  if (val === "price-asc") arr.sort((a, b) => a.precio - b.precio);
  if (val === "price-desc") arr.sort((a, b) => b.precio - a.precio);
  if (val === "name") arr.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (val === "popular") arr.sort((a, b) => (b.badge === "hot" ? 1 : 0) - (a.badge === "hot" ? 1 : 0));
  filteredProducts = arr;
  currentPage = 1;
  renderProducts(filteredProducts);
}

function updatePrice(val) {
  document.getElementById("priceMax").value = val;
  applyFilters();
}

const productImageIndex = {};

function changeProductImage(event, productId, direction) {
  event.stopPropagation();
  const product = PRODUCTS.find(p => p.id === productId);
  const images = product?.imagenes || (product?.imagen ? [product.imagen] : []);
  if (!product || images.length === 0) return;
  if (productImageIndex[productId] === undefined) productImageIndex[productId] = 0;
  productImageIndex[productId] = (productImageIndex[productId] + direction + images.length) % images.length;
  const img = document.querySelector(`.product-main-img[data-product-id="${productId}"]`);
  if (img) img.src = images[productImageIndex[productId]];
  const counter = document.querySelector(`.img-counter[data-product-id="${productId}"]`);
  if (counter) counter.textContent = `${productImageIndex[productId] + 1}/${images.length}`;
}

const CHATBOT_RESPONSES = {
  default: "¿Buscás algún perfume en particular? 👀",
  hola: "¡Hola! 👋 Bienvenido a TecnoAdvance. Tenemos perfumes árabes originales 🔥",
  precio: "💸 Tenemos perfumes desde $19.500 hasta $90.000 aprox.",
  envio: "🚚 Enviamos a todo el país. CABA: 24-48hs",
  oferta: "🔥 Hay productos en oferta disponibles ahora.",
  marca: "💎 Trabajamos con Lattafa, Afnan, Armaf y más.",
  pago: "💳 Podés pagar con tarjeta, transferencia o efectivo.",
  whatsapp: "📲 Escribinos: https://wa.me/541134843360",
  recomendacion: "Te tiro los más seguros: Khamrah (dulce), Asad (fuerte), Badee (elegante)",
};

function toggleChatbot() {
  const container = document.querySelector(".chatbot-container");
  const toggle = document.querySelector(".chatbot-toggle");
  container.classList.toggle("open");
  toggle.classList.toggle("hidden");
  if (container.classList.contains("open")) {
    document.getElementById("chatbotInput").focus();
  }
}

function sendChatMessage() {
  const input = document.getElementById("chatbotInput");
  const message = input.value.trim();
  if (!message) return;
  addChatMessage(message, "user");
  input.value = "";
  setTimeout(() => {
    const response = getBotResponse(message);
    addChatMessage(response, "bot");
  }, 500);
}

function addChatMessage(text, sender) {
  const messagesDiv = document.getElementById("chatbotMessages");
  const messageEl = document.createElement("div");
  messageEl.className = `chatbot-message ${sender}`;
  messageEl.innerHTML = `<div class="chatbot-bubble">${text}</div>`;
  messagesDiv.appendChild(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function getBotResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes("hola") || msg.includes("buenas")) return CHATBOT_RESPONSES.hola;
  if (msg.includes("precio") || msg.includes("cuanto")) return CHATBOT_RESPONSES.precio;
  if (msg.includes("envio")) return CHATBOT_RESPONSES.envio;
  if (msg.includes("oferta")) return CHATBOT_RESPONSES.oferta;
  if (msg.includes("marca")) return CHATBOT_RESPONSES.marca;
  if (msg.includes("pago")) return CHATBOT_RESPONSES.pago;
  if (msg.includes("whatsapp")) return CHATBOT_RESPONSES.whatsapp;
  if (msg.includes("recomenda")) return CHATBOT_RESPONSES.recomendacion;
  return CHATBOT_RESPONSES.default;
}

loadCartState();
renderCart();
renderOrderPage();

// Cargar productos desde Supabase
cargarProductosDesdeSupabase();
// ════════════════════════════════════════════════════════
// MODAL DE PRODUCTO
// ════════════════════════════════════════════════════════

let currentProductModal = null;
let currentModalImageIndex = 0;
let modalQuantity = 1;

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentProductModal = product;
  currentModalImageIndex = 0;
  modalQuantity = 1;

  const modal = document.getElementById("productModal");
  const precio = getPriceByType(product);

  document.getElementById("modalBrand").textContent = product.marca;
  document.getElementById("modalName").textContent = product.nombre;
  document.getElementById("modalDesc").textContent = product.notas;
  document.getElementById("modalPrice").textContent = formatPrice(precio);
  document.getElementById("modalInstallment").textContent = `3 cuotas ${installmentPrice(precio)}`;
  
  const paymentHTML = `
    <span>💳 ${formatPrice(precio)}</span>
    <span>💵 -${product.descuentoEfectivo}% ${formatPrice(Math.floor(precio * (1 - product.descuentoEfectivo / 100)))}</span>
  `;
  document.getElementById("modalPayment").innerHTML = paymentHTML;
  document.getElementById("modalStock").textContent = "● Disponible — Stock en inventario";

  updateModalImage();
  updateModalPrice();

  const waLink = buildWaLink(product);
  document.getElementById("modalBuyBtn").href = waLink;

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("open");
  document.body.style.overflow = "auto";
  currentProductModal = null;
}

function changeModalImage(direction) {
  if (!currentProductModal || !currentProductModal.imagenes) return;
  const maxIndex = currentProductModal.imagenes.length - 1;
  currentModalImageIndex = (currentModalImageIndex + direction + currentProductModal.imagenes.length) % currentProductModal.imagenes.length;
  updateModalImage();
}

function updateModalImage() {
  if (!currentProductModal || !currentProductModal.imagenes) return;
  const img = currentProductModal.imagenes[currentModalImageIndex];
  document.getElementById("modalMainImg").src = img;
  document.getElementById("modalCounter").textContent = `${currentModalImageIndex + 1}/${currentProductModal.imagenes.length}`;
}

function increaseQty() {
  modalQuantity++;
  updateModalPrice();
}

function decreaseQty() {
  if (modalQuantity > 1) {
    modalQuantity--;
    updateModalPrice();
  }
}

function updateModalPrice() {
  const precio = getPriceByType(currentProductModal);
  const totalPrice = precio * modalQuantity;
  document.getElementById("qtyValue").textContent = modalQuantity;
  document.getElementById("modalPrice").textContent = formatPrice(totalPrice);
  document.getElementById("modalBuyBtn").textContent = `Comprar por WhatsApp — ${formatPrice(totalPrice)}`;
}
