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
  "./imagenes/IMG_7573.png",
  "./imagenes/Banner2.png",
];
let currentBannerIndex = 0;

function showBanner(index) {
  if (BANNER_IMAGES.length === 0) return;
  currentBannerIndex = (index + BANNER_IMAGES.length) % BANNER_IMAGES.length;
  const image = document.getElementById("bannerImage");
  if (!image) return;
  image.src = BANNER_IMAGES[currentBannerIndex];
  updateBannerDots();
}
function nextBanner() { showBanner(currentBannerIndex + 1); }
function prevBanner() { showBanner(currentBannerIndex - 1); }

function updateBannerDots() {
  const dotsDiv = document.getElementById("carouselDots");
  if (!dotsDiv) return;
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

const CATEGORY_CONFIG = {
  perfumes: { title: "Perfumes", description: "Descubrí fragancias originales con la calidad y el estilo de TecnoAdvance." },
  accesorios: { title: "Accesorios", description: "Encontrá accesorios seleccionados para acompañar tu día a día." },
  electronica: { title: "Electrónica", description: "Explorá productos electrónicos y tecnología importada." },
  juguetes: { title: "Juguetes", description: "Conocé opciones para jugar, regalar y compartir." }
};
const PAGE_CATEGORY = document.body.dataset.category || "";
const PAGE_MODE = document.body.dataset.page || "";

function normalizeCategory(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
function getProductCategory(product) {
  const raw = product.categoria || product.Categoria || product.category || product.rubro || product.tipo_producto || product.tipo || "";
  const value = normalizeCategory(raw);
  if (/perfume|fragancia/.test(value)) return "perfumes";
  if (/accesor|accessor|reloj|joya|gadget/.test(value)) return "accesorios";
  if (/electron|tecnolog|celular/.test(value)) return "electronica";
  if (/juguete|toy|infantil/.test(value)) return "juguetes";
  return "";
}
function getCategoryProducts() {
  if (!PAGE_CATEGORY) return [...PRODUCTS];
  return PRODUCTS.filter((product) => {
    const category = getProductCategory(product);
    return category === PAGE_CATEGORY;
  });
}
function parseProductVariants(value) {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}
function normalizeProductVariant(variant) {
  return {
    modelo: String(variant.modelo || variant.model || "").trim(),
    color: String(variant.color || variant.colour || "").trim(),
    stock: Math.max(0, Number(variant.stock) || 0),
    precio: Number(variant.precio ?? variant.price) || 0
  };
}
function applyCategoryPageContext() {
  const config = CATEGORY_CONFIG[PAGE_CATEGORY] || (PAGE_MODE === "catalogo" ? { title: "Catálogo completo", description: "Explorá todos los productos disponibles en TecnoAdvance." } : null);
  if (!config) return;
  document.title = config.title + " | TecnoAdvance";
  const title = document.getElementById("categoryTitle");
  const description = document.getElementById("categoryDescription");
  const breadcrumb = document.getElementById("breadcrumbCategory");
  const intro = document.getElementById("categoryIntro");
  if (title) title.textContent = config.title;
  if (description) description.textContent = config.description;
  if (breadcrumb) breadcrumb.textContent = config.title;
  if (intro) intro.hidden = false;
}


// ════════════════════════════════════════════════════════
// FUNCIÓN CORREGIDA PARA CARGAR PRODUCTOS
// ════════════════════════════════════════════════════════
async function cargarProductosDesdeSupabase() {
  isLoadingProducts = true;

  // Mostrar mensaje de carga
  const grid = document.getElementById("productGrid");
  if (grid) grid.innerHTML = '<div class="loading-message">⏳ Cargando productos...</div>';

  try {
    console.log('🔄 Iniciando carga de productos desde Supabase...');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/Productos?select=*&order=id.asc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('📡 Respuesta recibida:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Datos recibidos de Supabase:', data);
    console.log('📊 Total de productos:', data.length);

    if (!data || data.length === 0) {
      console.warn('⚠️ La tabla de Supabase está vacía o no devuelve datos');
      if (grid) grid.innerHTML = '<div class="no-results"><h3>No hay productos disponibles en la base de datos</h3></div>';
      filteredProducts = [];
      isLoadingProducts = false;
      return;
    }

    // ════════════════════════════════════════════════════════
    // MAPEAR CORRECTAMENTE LOS DATOS
    // ════════════════════════════════════════════════════════
    PRODUCTS = data.map((p, index) => {
      // Convertir string de imágenes a array
      let imagenesArray = ['./imagenes/sin-imagen.png'];
      if (p.imagenes && p.imagenes.trim().length > 0) {
        imagenesArray = p.imagenes.split('|').map(img => img.trim()).filter(img => img.length > 0);
      }

      const variantes = parseProductVariants(p.variantes).map(normalizeProductVariant);
      const stockTotal = variantes.length
        ? variantes.reduce((sum, variant) => sum + variant.stock, 0)
        : Number(p.stock || 0);
      return {
        id: p.id || index + 1,
        marca: p.marca || '',
        nombre: p.nombre || '',
        descripcion: p.descripcion || '',
        precio: Number(p.precio) || 0,
        precio_usd: Number(p.precio_usd || 0),
        descuentoEfectivo: Number(p.descuento_efectivo || 0),
        genero: p.genero || 'unisex',
        badge: p.badge || '',
        salesCount: Number(p.ventas ?? p.vendidos ?? p.sales_count ?? p.unidades_vendidas ?? 0),
        notas: p.notas || '',
        imagenes: imagenesArray,
        imagen: imagenesArray[0],
        categoria: p.categoria || p.Categoria || p.category || p.rubro || p.tipo_producto || p.tipo || "",
        stock: stockTotal,
        variantes
      };
    });

    console.log('✨ Productos procesados correctamente:', PRODUCTS);

      filteredProducts = getCategoryProducts();

    renderDynamicBrandFilters();
    syncPriceFilterBounds();

    if (grid) renderProducts(filteredProducts);
    if (PAGE_MODE === "home") {
      renderHomeCategoryImages();
      renderHomeCarousels();
    }
    updateCartCount();
    renderCart();
    renderOrderPage();

  } catch (err) {
    console.error('❌ Error al cargar productos:', err);
    if (grid) {
      grid.innerHTML = `
        <div class="no-results">
          <h3>Error al cargar productos</h3>
          <p>${err.message}</p>
          <small>Verifica la consola para más detalles</small>
        </div>
      `;
    }
  } finally {
    isLoadingProducts = false;
  }
}

let filteredProducts = [...PRODUCTS];
let currentPage = 1;
const PRODUCTS_PER_PAGE = 12;
let cartItems = {};

function formatPrice(n) { return "$" + Math.round(Number(n) || 0).toLocaleString("es-AR"); }

// ── PRECIOS: única fuente de verdad ──
function getListPrice(p) { return Math.round(Number(p && p.precio) || 0); }
function getDiscountPct(p) {
  const d = Number(p && p.descuentoEfectivo);
  return d > 0 && d < 100 ? d : 0;
}
function getSalePrice(p) { return Math.round(getListPrice(p) * (1 - getDiscountPct(p) / 100)); }

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

function addToCart(productId, quantity = 1, selectedVariantIndex = null) {
  const product = PRODUCTS.find((item) => item.id === Number(productId));
  if (!product) return;
  const amount = Math.max(1, Number(quantity) || 1);
  const key = selectedVariantIndex !== null && selectedVariantIndex !== undefined
    ? `${product.id}__v${Number(selectedVariantIndex)}`
    : String(product.id);
  const variantIndex = key.includes("__v") ? Number(key.split("__v")[1]) : null;
  const variant = variantIndex === null ? null : product.variantes[variantIndex];
  const available = variant ? variant.stock : product.stock;
  if (available <= 0) return;
  cartItems[key] = Math.min(available, (Number(cartItems[key]) || 0) + amount);
  saveCartState();
  renderCart();
  renderOrderPage();
}

function getCartLine(key, quantity) {
  const match = String(key).match(/^(\d+)(?:__v(\d+))?$/);
  if (!match) return null;
  const product = PRODUCTS.find((item) => item.id === Number(match[1]));
  if (!product) return null;
  const variantIndex = match[2] === undefined ? null : Number(match[2]);
  const variant = variantIndex === null ? null : product.variantes[variantIndex];
  if (variantIndex !== null && !variant) return null;
  const price = variant?.precio > 0 ? variant.precio : getSalePrice(product);
  const options = variant ? [variant.modelo, variant.color].filter(Boolean).join(" · ") : "";
  return { key: String(key), product, variant, variantIndex, quantity: Number(quantity) || 0, price, options };
}

function getCartTotal() {
  return Object.entries(cartItems).reduce((total, [key, qty]) => {
    const line = getCartLine(key, qty);
    return total + (line ? line.price * line.quantity : 0);
  }, 0);
}

function buildCartWaLink() {
  const entries = Object.entries(cartItems);
  const lines = entries.map(([key, qty]) => {
    const line = getCartLine(key, qty);
    if (!line) return "";
    const { product, options, price, quantity } = line;
    return `${quantity} x ${product.marca} ${product.nombre}${options ? ` (${options})` : ""} - ${formatPrice(price)}`;
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
  const itemsHtml = entries.map(([key, qty]) => {
    const line = getCartLine(key, qty);
    if (!line) return "";
    const { product, options, price, quantity } = line;
    return `
      <div class="cart-item">
        <div class="cart-item-details">
          <span>${quantity}x ${product.marca} ${product.nombre}</span>
          ${options ? `<small>${options}</small>` : ""}
          <small>${formatPrice(price)} c/u</small>
        </div>
        <div class="cart-item-actions">
          <span>${formatPrice(price * quantity)}</span>
          <button type="button" class="cart-item-remove" onclick="removeCartItem('${key}')">Quitar</button>
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
if (PRODUCTS.length === 0) {
    orderContent.innerHTML = `<div class="order-empty"><p>Cargando pedido…</p></div>`;
    return;
  }
  const itemsHtml = entries.map(([key, qty]) => {
    const line = getCartLine(key, qty);
    if (!line) return "";
    const { product, options, price, quantity } = line;
    return `
      <div class="order-row">
        <div class="order-item-info">
          <div>${quantity}x ${product.marca} ${product.nombre}</div>
          ${options ? `<small>${options}</small>` : ""}
          <small>${formatPrice(price)} c/u</small>
        </div>
        <div class="order-item-actions">
          <span>${formatPrice(price * quantity)}</span>
          <button type="button" class="cart-item-remove" onclick="removeCartItem('${key}')">Quitar</button>
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

function removeCartItem(cartKey) {
  if (!cartItems[cartKey]) return;
  delete cartItems[cartKey];
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

function productImgSrc(p) {
  return p.imagen || "./imagenes/sin-imagen.png";
}

function cardHTML(p) {
  const waLink = buildWaLink(p);
  const hasMultipleImages = p.imagenes && p.imagenes.length > 1;
  const imageCount = p.imagenes ? p.imagenes.length : 1;
  const volumen = (p.descripcion.match(/\d+\s?ML/i) || [""])[0];
  const sinStock = p.stock === 0; // ← Nuevo
  return `
    <div class="product-card ${sinStock ? 'sin-stock' : ''}"
         data-genero="${p.genero}" data-marca="${p.marca}" data-precio="${p.precio}">
      <div class="card-badges">
        ${getDiscountPct(p) > 0 ? `<span class="card-badge card-badge-discount">-${getDiscountPct(p)}%</span>` : ''}
        <span class="card-badge card-badge-exclusive">Exclusivo TecnoAdvance</span>
      </div>
      ${badgeHTML(p.badge)}
      ${sinStock ? '<div class="out-of-stock-badge">Sin stock</div>' : ''}  <!-- Badge nuevo -->
         <div class="product-img-wrap">
        <img src="${productImgSrc(p)}" alt="${p.marca} ${p.nombre}" loading="lazy"
             class="product-main-img" data-product-id="${p.id}"
        ${sinStock ? '' : `onclick="openProductModal(${p.id})"`} />  <!-- Deshabilitar clic si sin stock -->
        <a href="${waLink}" target="_blank" class="quick-wa">Comprar por WhatsApp</a>
      </div>
      <div class="product-info">
        ${volumen ? `<div class="product-volume">${volumen}</div>` : ''}
        <div class="product-brand">${p.marca}</div>
        <div class="product-name">${p.nombre}</div>
        <p class="product-notes">${p.notas}</p>
        <div class="product-pricing">
          <div class="price-row">
            <span class="price-final">${formatPrice(getSalePrice(p))}</span>
            ${getDiscountPct(p) > 0 ? `<span class="price-original">${formatPrice(getListPrice(p))}</span>` : ''}
          </div>
        </div>
        <div class="product-shipping">🚚 Envío gratis en 24-48hs</div>
      </div>
      <div class="product-actions">
        ${sinStock
          ? '<button type="button" class="btn-cart btn-disabled" disabled>Sin stock</button>'
          : `<button type="button" class="btn-cart" onclick="${p.variantes.length ? `openProductModal(${p.id})` : `addToCart(${p.id})`}">${p.variantes.length ? "Elegir opciones" : "Agregar al carrito"}</button>`}
      </div>
    </div>`;
}

function hasHomeCatalogFilters() {
  if (document.body.dataset.page !== "home") return true;
  const search = (document.getElementById("searchInput")?.value || "").trim();
  const checked = document.querySelectorAll("[data-filter]:checked").length > 0;
  const minPrice = Number(document.getElementById("priceMin")?.value || 0);
  const maxPrice = Number(document.getElementById("priceMax")?.value || 80000);
  return Boolean(search) || checked || minPrice > 0 || maxPrice < 80000;
}

function getHomeFeaturedProducts(list) {
  const available = list.filter((product) => Number(product.stock) > 0);
  const promoted = available.filter((product) => ["hot", "new"].includes(String(product.badge).toLowerCase()));
  const promotedIds = new Set(promoted.map((product) => product.id));
  const remaining = available.filter((product) => !promotedIds.has(product.id));
  return [...promoted, ...remaining].slice(0, 8);
}

function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  const count = document.getElementById("productCount");
  const isHomeFeatured = document.body.dataset.page === "home" && !hasHomeCatalogFilters();
  const displayList = isHomeFeatured ? getHomeFeaturedProducts(list) : list;
  const pagination = document.getElementById("pagination");
  if (isHomeFeatured && pagination) { pagination.innerHTML = ""; pagination.style.display = "none"; }

  if (displayList.length === 0) {
    grid.innerHTML = `<div class="no-results"><h3>No se encontraron productos</h3></div>`;
  } else {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const pageProducts = displayList.slice(startIndex, endIndex);
    grid.innerHTML = pageProducts.map(cardHTML).join("");
    const totalPages = Math.ceil(displayList.length / PRODUCTS_PER_PAGE);
    updatePagination(totalPages);
  }

  const n = displayList.length;
  count.innerHTML = isHomeFeatured
    ? `<strong>${n}</strong> productos destacados`
    : `<strong>${n}</strong> producto${n !== 1 ? "s" : ""} encontrado${n !== 1 ? "s" : ""}`;
}

function renderHomeCategoryImages() {
  if (PAGE_MODE !== "home") return;
  document.querySelectorAll("[data-category-image]").forEach((image) => {
    const category = image.dataset.categoryImage;
    const product = PRODUCTS.find((item) =>
      getProductCategory(item) === category &&
      item.imagen &&
      !String(item.imagen).includes("sin-imagen")
    );
    if (!product) return;
    image.src = product.imagen;
    image.addEventListener("error", () => image.classList.add("is-error"), { once: true });
  });
}

function renderHomeCarousels() {
  if (PAGE_MODE !== "home") return;
  const available = PRODUCTS.filter((product) => Number(product.stock) > 0);
  const newest = [...available].sort((a, b) => {
    const aNew = String(a.badge).toLowerCase() === "new" ? 1 : 0;
    const bNew = String(b.badge).toLowerCase() === "new" ? 1 : 0;
    return bNew - aNew || Number(b.id) - Number(a.id);
  }).slice(0, 8);
  const hasSalesData = available.some((product) => product.salesCount > 0);
  const bestSellers = [...available].filter((product) => hasSalesData
    ? product.salesCount > 0
    : String(product.badge).toLowerCase() === "hot")
    .sort((a, b) => b.salesCount - a.salesCount || (String(b.badge).toLowerCase() === "hot" ? 1 : 0) - (String(a.badge).toLowerCase() === "hot" ? 1 : 0))
    .slice(0, 8);

  const renderInto = (id, list, emptyMessage) => {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="home-empty">${emptyMessage}</p>`;
  };
  renderInto("newProductsGrid", newest, "Pronto vas a encontrar acá las últimas novedades.");
  renderInto("bestSellersGrid", bestSellers, "Todavía no hay productos marcados como más vendidos en el catálogo.");
}

document.querySelectorAll("[data-carousel-prev], [data-carousel-next]").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.carouselPrev || button.dataset.carouselNext;
    const carousel = document.getElementById(id);
    if (!carousel) return;
    const direction = button.hasAttribute("data-carousel-next") ? 1 : -1;
    carousel.scrollBy({ left: direction * Math.max(240, carousel.clientWidth * 0.8), behavior: "smooth" });
  });
});

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
// FUNCION PARA PASAR DE PAGINA //
function goToPage(page) {
  currentPage = page;

  const root = document.documentElement;
  const grid = document.getElementById("productGrid");
  const isMobile = window.matchMedia("(max-width: 560px)").matches;

  // Desactiva scroll suave global y scroll anchoring durante el cambio
  root.style.scrollBehavior = "auto";
  root.style.overflowAnchor = "none";

  renderProducts(filteredProducts);

  // Alinea el inicio de #productGrid justo debajo de header + promo-bar + breadcrumb
  const align = () => {
    if (!grid) return;
    const header = document.querySelector(".header");
    const breadcrumb = document.querySelector(".breadcrumb");
    const fixedH =
      (header ? header.getBoundingClientRect().height : 0) +
      (breadcrumb ? breadcrumb.getBoundingClientRect().height : 0);
    grid.style.scrollMarginTop = fixedH + 12 + "px";
    grid.scrollIntoView({ block: "start", behavior: "auto" });
  };

  const restore = () => {
    root.style.scrollBehavior = "";
    root.style.overflowAnchor = "";
  };

  align();

  // Desktop y tablet: comportamiento original, sin cambios
  if (!isMobile) {
    requestAnimationFrame(restore);
    return;
  }

  // Mobile: re-alinea mientras el layout se termina de asentar
  let active = true;
  const cancel = () => { active = false; };
  window.addEventListener("touchstart", cancel, { once: true, passive: true });

  const realign = () => { if (active) align(); };

  // Imágenes que terminan de cargar y mueven el layout
  grid.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", realign, { once: true });
  });

  requestAnimationFrame(() => requestAnimationFrame(realign));
  setTimeout(realign, 120);
  setTimeout(realign, 350);

  // Recién al final se devuelve el comportamiento original
  setTimeout(() => {
    active = false;
    window.removeEventListener("touchstart", cancel);
    restore();
  }, 700);
}


function renderDynamicBrandFilters() {
  const container = document.getElementById("brandFilters");
  if (!container) return;
  const selected = new Set([...container.querySelectorAll('[data-filter="marca"]:checked')].map((input) => input.value));
  const brands = [...new Set(getCategoryProducts().map((product) => product.marca).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "es"));
  container.innerHTML = brands.length ? brands.map((brand, index) => {
    const id = `filter-brand-${index}`;
    return `<label class="filter-option" for="${id}"><input id="${id}" type="checkbox" data-filter="marca" value="${escapeHtml(brand)}" ${selected.has(brand) ? "checked" : ""} onchange="applyFilters()"><span>${escapeHtml(brand)}</span></label>`;
  }).join("") : '<span class="filter-hint">No hay marcas para mostrar.</span>';
}

function syncPriceFilterBounds() {
  const maxInput = document.getElementById("priceMax");
  const slider = document.getElementById("priceSlider");
  if (!maxInput || !slider) return;
  const maxProductPrice = Math.max(0, ...getCategoryProducts().map((product) => getSalePrice(product)));
  const maxBound = Math.max(1000, Math.ceil(maxProductPrice / 1000) * 1000);
  slider.max = String(maxBound);
  if (Number(maxInput.value) === 80000 || Number(maxInput.value) > maxBound) maxInput.value = String(maxBound);
  slider.value = String(Math.min(Number(maxInput.value) || maxBound, maxBound));
}

function applyFilters() {
  const checkedGeneros = [...document.querySelectorAll('[data-filter="genero"]:checked')].map((el) => el.value);
  const checkedMarcas = [...document.querySelectorAll('[data-filter="marca"]:checked')].map((el) => el.value);
  const minPrice = parseInt(document.getElementById("priceMin").value) || 0;
  const maxPrice = parseInt(document.getElementById("priceMax").value) || 999999;
  const searchTerm = (document.getElementById("searchInput")?.value || "").trim().toLowerCase();
  const onlyAvailable = Boolean(document.querySelector('[data-filter="stock"]:checked'));

  filteredProducts = getCategoryProducts().filter((p) => {
    const generoOk = checkedGeneros.length === 0 || checkedGeneros.includes(p.genero);
    const marcaOk = checkedMarcas.length === 0 || checkedMarcas.includes(p.marca);
    const precioOk = p.precio <= maxPrice && p.precio >= minPrice;
    const searchOk = searchTerm === "" || [p.nombre, p.marca, p.notas, p.descripcion, p.categoria].join(" ").toLowerCase().includes(searchTerm);
    const stockOk = !onlyAvailable || p.stock > 0;
    return generoOk && marcaOk && precioOk && searchOk && stockOk;
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
  syncPriceFilterBounds();
  filteredProducts = getCategoryProducts();
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
// ─── ROTACIÓN AUTOMÁTICA DE FOTOS (cada 4s, en bucle) ───
const AUTO_SLIDE_MS = 4000;

function autoRotateProductImages() {
  if (document.hidden) return;
  document.querySelectorAll(".product-main-img").forEach((img) => {
    const id = Number(img.dataset.productId);
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product || !product.imagenes || product.imagenes.length < 2) return;
    const current = Number(img.dataset.idx || 0);
    const next = (current + 1) % product.imagenes.length; // última → vuelve a la 1
    img.dataset.idx = next;
    img.src = product.imagenes[next];
  });
}

setInterval(autoRotateProductImages, AUTO_SLIDE_MS);

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

applyCategoryPageContext();
loadCartState();
renderCart();
renderOrderPage();

// ════════════════════════════════════════════════════════
// CARGAR PRODUCTOS DESDE SUPABASE AL INICIAR
// ════════════════════════════════════════════════════════
console.log('🚀 Iniciando aplicación...');
cargarProductosDesdeSupabase();

// ════════════════════════════════════════════════════════
// MODAL DE PRODUCTO
// ════════════════════════════════════════════════════════

let currentProductModal = null;
let currentModalImageIndex = 0;
let modalQuantity = 1;
let currentVariantIndex = null;

function getPriceByType(product, variant = null) {
  if (!product) return 0;
  return variant?.precio > 0 ? variant.precio : getSalePrice(product);
}

function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  currentProductModal = product;
  currentModalImageIndex = 0;
  modalQuantity = 1;
  currentVariantIndex = product.variantes.length ? product.variantes.findIndex((variant) => variant.stock > 0) : null;

  const modal = document.getElementById("productModal");
  const precio = getPriceByType(product, selectedModalVariant());

  document.getElementById("modalBrand").textContent = product.marca;
  document.getElementById("modalName").textContent = product.nombre;
  document.getElementById("modalDesc").textContent = product.notas;
  document.getElementById("modalPrice").textContent = formatPrice(precio);
  document.getElementById("modalInstallment").textContent = "";

  const paymentHTML = getDiscountPct(product) > 0
    ? `<span class="price-original">${formatPrice(getListPrice(product))}</span><span>-${getDiscountPct(product)}% · Exclusivo TecnoAdvance</span>`
    : `<span>Exclusivo TecnoAdvance</span>`;
  document.getElementById("modalPayment").innerHTML = paymentHTML;
  renderModalVariants();
  updateModalStock();

  updateModalImage();
  updateModalPrice();

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  const modal = document.getElementById("productModal");
  modal.classList.remove("open");
  document.body.style.overflow = "auto";
  currentProductModal = null;
  currentVariantIndex = null;
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
  const precio = getPriceByType(currentProductModal, selectedModalVariant());
  document.getElementById("qtyValue").textContent = modalQuantity;
  document.getElementById("modalPrice").textContent = formatPrice(precio);
  document.getElementById("modalBuyBtn").textContent = "Agregar al carrito";
  const variant = selectedModalVariant();
  const maxQty = variant ? variant.stock : (currentProductModal?.stock || 1);
  document.querySelectorAll(".qty-btn").forEach((button) => {
    const decrement = button.textContent.trim() === "−";
    button.disabled = decrement ? modalQuantity <= 1 : modalQuantity >= maxQty;
  });
}

function addCurrentProductToCart() {
  if (!currentProductModal) return;
  if (currentProductModal.variantes.length && currentVariantIndex === null) return;
  addToCart(currentProductModal.id, modalQuantity, currentVariantIndex);
  closeProductModal();
}

function selectedModalVariant() {
  return currentVariantIndex === null ? null : currentProductModal?.variantes[currentVariantIndex] || null;
}

function renderModalVariants() {
  const container = document.getElementById("modalVariants");
  if (!container || !currentProductModal) return;
  const variants = currentProductModal.variantes;
  container.hidden = variants.length === 0;
  if (!variants.length) return;
  const options = variants.map((variant, index) => {
    const label = [variant.modelo, variant.color].filter(Boolean).join(" · ") || `Opción ${index + 1}`;
    const availability = variant.stock > 0 ? ` · ${variant.stock} disponibles` : " · Sin stock";
    return `<option value="${index}" ${index === currentVariantIndex ? "selected" : ""} ${variant.stock <= 0 ? "disabled" : ""}>${label}${availability}</option>`;
  }).join("");
  container.innerHTML = `<label for="modalVariantSelect">Elegí modelo y color</label><select id="modalVariantSelect" onchange="selectProductVariant(this.value)">${options}</select>`;
}

function selectProductVariant(index) {
  currentVariantIndex = Number(index);
  modalQuantity = 1;
  updateModalStock();
  updateModalPrice();
}

function updateModalStock() {
  const stock = document.getElementById("modalStock");
  if (!stock || !currentProductModal) return;
  const variant = selectedModalVariant();
  const available = variant ? variant.stock : currentProductModal.stock;
  stock.textContent = available > 0 ? `● Disponible — ${available} en stock` : "● Sin stock disponible";
  stock.classList.toggle("is-out-of-stock", available <= 0);
  const buyButton = document.getElementById("modalBuyBtn");
  if (buyButton) buyButton.disabled = available <= 0;
}
// [INICIO_CAMBIOS_NAV_DROPDOWN]
(function () {
  const dropdown = document.getElementById("navCatalogoDropdown");
  const toggleBtn = document.getElementById("navCatalogoBtn");
  const menu = document.getElementById("navCatalogoMenu");
  if (!dropdown || !toggleBtn || !menu) return;

  function openDropdown() {
    dropdown.classList.add("open");
    toggleBtn.setAttribute("aria-expanded", "true");
  }

  function closeDropdown() {
    dropdown.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  function isOpen() {
    return dropdown.classList.contains("open");
  }

  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen() ? closeDropdown() : openDropdown();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDropdown);
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) closeDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      closeDropdown();
      toggleBtn.focus();
    }
  });
})();
// [FIN_CAMBIOS_NAV_DROPDOWN]
// [INICIO_CAMBIOS_MOBILE_NAV]
(function () {
  const toggleBtn = document.getElementById("mobileNavToggle");
  const overlay = document.getElementById("mobileNavOverlay");
  const closeBtn = document.getElementById("mobileNavClose");
  const catalogoBtn = document.getElementById("mobileCatalogoBtn");
  const catalogoAccordion = catalogoBtn ? catalogoBtn.closest(".mobile-nav-accordion") : null;

  if (!toggleBtn || !overlay) return;

  function openMenu() {
    overlay.classList.add("open");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    overlay.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  toggleBtn.addEventListener("click", openMenu);
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeMenu();
  });

  overlay.querySelectorAll(".mobile-nav-link, .mobile-nav-sublink").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  if (catalogoBtn && catalogoAccordion) {
    catalogoBtn.addEventListener("click", () => {
      const isOpen = catalogoAccordion.classList.toggle("open");
      catalogoBtn.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeMenu();
      toggleBtn.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000 && overlay.classList.contains("open")) closeMenu();
  });
})();
// [FIN_CAMBIOS_MOBILE_NAV]


