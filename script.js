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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateBannerDots);
} else {
  updateBannerDots();
}

const PRODUCTS = [
  { id: 1, marca: "Lattafa", 
    nombre: "YARA PINK", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "femenino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/yara pink.png", 
      "./imagenes/img/yara1.png", 
      "./imagenes/img/yara2.png"], 
      notas: "Almizcle · Sandalo · Vainilla"
     },

  { id: 2, 
    marca: "Lattafa", 
    nombre: "YARA CANDY", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "femenino", 
    badge: "new", 
    imagenes: [
      "./imagenes/yara candy.png", 
      "./imagenes/img/candy1.png", 
      "./imagenes/img/candy2.png"
    ], 
    notas: "Vainilla · Mandarina · Sandalo" 
  },

  { id: 3, 
    marca: "Al Wataniah", 
    nombre: "DURRAT AL AROOS", 
    descripcion: "EDP 85ML", 
    precio: 58517.56, 
    descuentoEfectivo: 20,
    genero: "femenino", 
    badge: null, 
    imagenes: [
      "./imagenes/durrat.png", 
      "./imagenes/img/durrat1.png", 
      "./imagenes/img/durrat2.png"
    ], 
    notas: "Vainilla · Azafran · Cardamomo" 
  },

  { id: 4, 
    marca: "Lattafa", 
    nombre: "KHAMRAH BLACK", 
    descripcion: "EDP 100ML", 
    precio: 78023, 
    descuentoEfectivo: 25,
    genero: "masculino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/khamrah.png", 
      "./imagenes/img/khamrah1.png", 
      "./imagenes/img/khamrah2.png"
    ], 
    notas: "Canela · Nuez Moscada · Bergamota" },

  { id: 5, 
    marca: "Lattafa", 
    nombre: "KHAMRAH QHAWA", 
    descripcion: "EDP 100ML", 
    precio: 78023, 
    descuentoEfectivo: 25,
    genero: "masculino", 
    badge: null, 
    imagenes: [
      "./imagenes/qhawa.png", 
      "./imagenes/img/qhawa1.png", 
      "./imagenes/img/qhawa2.png"
    ], 
    notas: "Bergamota · Cuero · Sándalo" },

  { id: 6, 
    marca: "Lattafa", 
    nombre: "KHAMRAH DUKHAN", 
    descripcion: "EDP 100ML", 
    precio: 78023, 
    descuentoEfectivo: 25,
    genero: "masculino", 
    badge: "oferta", 
    imagenes: [
      "./imagenes/dukhan.png", 
      "./imagenes/img/dukhan1.png", 
      "./imagenes/img/dukhan2.png"
    ], 
    notas: "Inicienso · Tabaco · Pachuli" },

  { id: 11, 
    marca: "Lattafa", 
    nombre: "THE KINGDOM", 
    descripcion: "EDP 100ML", 
    precio: 81924.58, 
    descuentoEfectivo: 23,
    genero: "unisex", 
    badge: "new", 
    imagenes: [
      "./imagenes/kingdom.png", 
      "./imagenes/img/kingdom2.png", 
      "./imagenes/img/kingdom3.png"
    ], 
    notas: "Lavanda · Vainilla · Tabaco" },

  { id: 10, 
    marca: "Lattafa", 
    nombre: "MAAHIR BLACK", 
    descripcion: "EDP 100ML", 
    precio: 67041.61, 
    descuentoEfectivo: 18,
    genero: "masculino", 
    badge: "oferta", 
    imagenes: [
      "./imagenes/maahir.png", 
      "./imagenes/img/maahir1.png", 
      "./imagenes/img/maahir2.png"
    ], 
    notas: "Oud · Rosa · Ambar" },

  { id: 9, 
    marca: "Armaf", 
    nombre: "MANDARIN SKY", 
    descripcion: "EDP 100ML", 
    precio: 91027.31, 
    descuentoEfectivo: 30,
    genero: "masculino", 
    badge: "new", 
    imagenes: [
      "./imagenes/mandarin.png", 
      "./imagenes/img/mandarin1.png", 
      "./imagenes/img/mandarin2.png"
    ], 
    notas: "Mandarina · Naranja · Caramelo" },

  { id: 8, marca: "Armaf", 
    nombre: "ODYSSEY HOMME BLACK", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "masculino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/homme.png", 
      "./imagenes/img/homme11.png", 
      "./imagenes/img/homme2.png"
    ], 
    notas: "Vainilla Negra · Cuero · Amaderado" },

  { id: 7, marca: "Armaf", 
    nombre: "ODYSSEY CANDEE WOMAN",
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "femenino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/candee.png", 
      "./imagenes/img/candee1.png", 
      "./imagenes/img/candee2.png"
    ], 
    notas: "Frambuesa · Caramelo · Ambar" },

  { id: 12, 
    marca: "Afnan", 
    nombre: "9 PM", 
    descripcion: "EDP 100ML", 
    precio: 73042.91, 
    descuentoEfectivo: 20,
    genero: "masculino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/9pm.png",
       "./imagenes/img/9pm1.png", 
       "./imagenes/img/9pm2.png"
      ], 
      notas: "Manzana · Canela · Lavanda" },

  { id: 13, 
    marca: "French Avenue", 
    nombre: "LIQUID BRUN", 
    descripcion: "EDP 100ML", 
    precio: 123537.06, 
    descuentoEfectivo: 23,
    genero: "masculino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/liquidbrun.png", 
      "./imagenes/img/liquid2.png", 
      "./imagenes/liquid3.png"
    ], 
    notas: "Canela · Vainilla · Elemi" },

  { id: 14, 
    marca: "Lattafa", 
    nombre: "MAYAR PINK", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "femenino", 
    badge: "new", 
    imagenes: [
      "./imagenes/mayarpink.png", 
      "./imagenes/img/mayar1.png", 
      "./imagenes/img/mayar2.png"
    ], 
    notas: "Sandalo · Almizcle · Vainilla" },

  { id: 15, 
    marca: "Lattafa", 
    nombre: "MAYAR CHERRY INTENSE", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "femenino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/mayarcherry.png", 
      "./imagenes/img/cherry.png", 
      "./imagenes/img/cherry2.png"
    ], 
    notas: "Cherry Jam · Fresa · Vainilla" },

  { id: 16, 
    marca: "Lattafa", 
    nombre: "BADE'E AL OUD HONOR & GLORY", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "masculino", 
    badge: null, 
    imagenes: [
      "./imagenes/honor.png", 
      "./imagenes/img/badeblanco1.png", 
      "./imagenes/img/badeblanco2.png"
    ], 
    notas: "Canela · Creme Brulee · Vainilla" },

  { id: 17, 
    marca: "Lattafa", 
    nombre: "BADE'E AL OUD AMETHYST", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "unisex", 
    badge: "hot", 
    imagenes: [
      "./imagenes/badeevioleta.png", 
      "./imagenes/img/badevioleta1.png", 
      "./imagenes/img/badevioleta2.png"
    ], 
    notas: "Pimienta Rosa · Jazmin · Bergamota" },

  { id: 18, 
    marca: "Lattafa", 
    nombre: "BADE'E AL OUD FOR GLORY", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "masculino", 
    badge: "new", 
    imagenes: [
      "./imagenes/badeenegro.png", 
      "./imagenes/img/badeblack.png", 
      "./imagenes/img/badeblack1.png"
    ], 
    notas: "Azafran · Nuez Moscada · Lavanda" },

  { id: 19, 
    marca: "Lattafa", 
    nombre: "BADE'E SUBLIME", 
    descripcion: "EDP 100ML", 
    precio: 71521.46, 
    descuentoEfectivo: 20,
    genero: "femenino", 
    badge: "new", 
    imagenes: [
      "./imagenes/badeered.png", 
      "./imagenes/img/baderojo1.png", 
      "./imagenes/img/baderojo2.png"
    ], 
    notas: "Manzana · Lichi · Rosa" },

  { id: 20, 
    marca: "Lattafa",
    nombre: "QAED AL FURSAN UNLIMITED", 
    descripcion: "EDP 90ML", 
    precio: 58517.56, 
    descuentoEfectivo: 17,
    genero: "unisex", 
    badge: "new", 
    imagenes: [
      "./imagenes/qaed.png", 
      "./imagenes/img/qaedblanco.png", 
      "./imagenes/img/qaedblanco2.png"
    ], 
    notas: "Coco · Almizcle · Vainilla" },

  { id: 21, 
    marca: "Lattafa", 
    nombre: "QAED AL FURSAN", 
    descripcion: "EDP 90ML", 
    precio: 58517.56, 
    descuentoEfectivo: 17,
    genero: "masculino", 
    badge: "new", 
    imagenes: [
      "./imagenes/qaedblack.png", 
      "./imagenes/img/qaednegro1.png", 
      "./imagenes/img/qaednegro2.png"
    ], 
    notas: "Ambar Gris · Almizcle · Vainilla" },

  { id: 22, 
    marca: "Lattafa", 
    nombre: "ANA ABIYEDH ROUGE", 
    descripcion: "EDP 60ML", 
    precio: 45513.65, 
    descuentoEfectivo: 15, 
    genero: "femenino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/ana.png", 
      "./imagenes/img/ana2.png", 
      "./imagenes/img/ana3.png"
    ], 
    notas: "Pera · Caramelo · Ambar" },

  { id: 24, 
    marca: "Lattafa", 
    nombre: "RAVE NOW", 
    descripcion: "EDP 100ML", 
    precio: 64889.47, 
    descuentoEfectivo: 15,
    genero: "masculino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/rave.png", 
      "./imagenes/img/rave1.png", 
      "./imagenes/img/rave2.png"
    ], 
    notas: "Piña · Bergamota · Pachuli" },

  { id: 25, 
    marca: "Lattafa", 
    nombre: "24 CARAT PURE GOLD", 
    descripcion: "EDP 100ML", 
    precio: 59557.87, 
    descuentoEfectivo: 15,
    genero: "masculino", 
    badge: "hot", 
    imagenes: [
      "./imagenes/carat.png", 
      "./imagenes/img/carat1.png", 
      "./imagenes/img/carat2.png"
    ], 
    notas: "Ambar · Canela · Cuero" },
];

let filteredProducts = [...PRODUCTS];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12;

function formatPrice(n) { return "$" + n.toLocaleString("es-AR"); }
function installmentPrice(price, cuotas = 3) { return formatPrice(Math.ceil(price / cuotas)); }

function buildWaLink(producto) {
  const msg = encodeURIComponent(`Hola quiero comprar ${producto.marca} ${producto.nombre}`);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
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

  return `
    <div class="product-card" data-genero="${p.genero}" data-marca="${p.marca}" data-precio="${p.precio}">
      ${badgeHTML(p.badge)}
      <div class="product-img-wrap">
        <img src="${productImgSrc(p, 0)}" alt="${p.marca} ${p.nombre}" loading="lazy" class="product-main-img" data-product-id="${p.id}" />
        ${hasMultipleImages ? `
          <button class="img-nav prev" onclick="changeProductImage(event, ${p.id}, -1)">◀</button>
          <button class="img-nav next" onclick="changeProductImage(event, ${p.id}, 1)">▶</button>
          <div class="img-counter" data-product-id="${p.id}">1/${imageCount}</div>
        ` : ''}
        <a href="${waLink}" target="_blank" class="quick-wa">Comprar por WhatsApp</a>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.marca}</div>
        <div class="product-name">${p.nombre}</div>
        <div class="product-pricing">
          <div class="product-price">${formatPrice(p.precio)}</div>
          <div class="product-installment">3 cuotas ${installmentPrice(p.precio)}</div>
          <div class="payment-methods">
            <span>💳 ${formatPrice(p.precio)}</span>
            <span>💵 -${p.descuentoEfectivo}% ${formatPrice(Math.floor(p.precio * (1 - p.descuentoEfectivo / 100)))}</span>
          </div>
        </div>
      </div>
      <div class="product-actions">
        <a href="${waLink}" target="_blank" class="btn-wa">Comprar por WhatsApp</a>
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
  const maxPrice = parseInt(document.getElementById("priceMax").value) || 999999;

  filteredProducts = PRODUCTS.filter((p) => {
    const generoOk = checkedGeneros.length === 0 || checkedGeneros.includes(p.genero);
    const marcaOk = checkedMarcas.length === 0 || checkedMarcas.includes(p.marca);
    const precioOk = p.precio <= maxPrice;
    return generoOk && marcaOk && precioOk;
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
  document.getElementById("priceMax").value = parseInt(val).toLocaleString("es-AR");
  applyFilters();
}

const productImageIndex = {};

function changeProductImage(event, productId, direction) {
  event.stopPropagation();
  const product = PRODUCTS.find(p => p.id === productId);
  const images = product?.imagenes || (product?.imagen ? [product.imagen] : []);
  if (!product || images.length === 0) return;
  if (!productImageIndex[productId]) productImageIndex[productId] = 0;
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

renderProducts(PRODUCTS);
