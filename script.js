/* ════════════════════════════════════════════════════════
   TecnoAdvance — Perfumes Árabes
   script.js
   ════════════════════════════════════════════════════════ */

/* ─── CONFIGURACIÓN ──────────────────────────────────────────
   Número de WhatsApp (sin +, con código de país)
   ──────────────────────────────────────────────────────── */
const WA_NUMBER = "541134843360";

/* ─── BANNER CAROUSEL ────────────────────────────────────── */
const BANNER_IMAGES = [
  "./imagenes/banner-1.jpg",
  "./imagenes/banner-2.jpg",
  "./imagenes/banner-3.jpg",
];
let currentBannerIndex = 0;

function showBanner(index) {
  if (BANNER_IMAGES.length === 0) return;
  currentBannerIndex = (index + BANNER_IMAGES.length) % BANNER_IMAGES.length;
  document.getElementById("bannerImage").src = BANNER_IMAGES[currentBannerIndex];
  updateBannerDots();
}

function nextBanner() {
  showBanner(currentBannerIndex + 1);
}

function prevBanner() {
  showBanner(currentBannerIndex - 1);
}

function updateBannerDots() {
  const dotsDiv = document.getElementById("carouselDots");
  dotsDiv.innerHTML = BANNER_IMAGES.map(
    (_, i) =>
      `<div class="dot ${i === currentBannerIndex ? "active" : ""}" onclick="showBanner(${i})"></div>`
  ).join("");
}

// Inicializar banner
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateBannerDots);
} else {
  updateBannerDots();
}

/* ─── BASE DE PRODUCTOS ──────────────────────────────────────
   Para agregar un producto, duplicar un objeto y completar:
     id       → número único
     marca    → nombre de la marca (debe coincidir con filtros)
     nombre   → nombre del perfume
     descripcion → texto corto con presentación
     precio   → precio en ARS (número, sin puntos ni $)
     genero   → "masculino" | "femenino" | "unisex"
     badge    → "new" | "hot" | "oferta" | null
     emoji    → emoji usado como imagen placeholder
     notas    → notas olfativas separadas por ·
   ──────────────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    marca: "Lattafa",
    nombre: "YARA PINK",
    descripcion: " EDP 100ML",
    precio: 55000,
    genero: "femenino",
    badge: "hot",
    emoji: "",
    imagen:"./imagenes/yara pink.png",
    notas: "Almizcle · Sandalo · Vainilla",
  },
  {
    id: 2,
    marca: "Lattafa",
    nombre: "YARA CANDY ",
    descripcion: "EDP 100ML",
    precio: 55000,
    genero: "femenino",
    badge: "new",
    emoji: "",
    imagen:"./imagenes/yara candy.png",
    notas: "Vainilla · Mandarina · Sandalo",
  },
  {
    id: 3,
    marca: "Al Wataniah",
    nombre: "DURRAT AL AROOS",
    descripcion: "EDP 85ML",
    precio: 48900,
    genero: "femenino",
    badge: null,
    imagen:"./imagenes/durrat.png",
    emoji: "🌙",
    notas: "Vainilla · Azafran · Cardamomo",
  },
  {
    id: 4,
    marca: "Lattafa",
    nombre: "KHAMRAH BLACK",
    descripcion: "EDP 100ML",
    precio: 60000,
    genero: "masculino",
    badge: "hot",
    emoji: "🖤",
    imagen:"./imagenes/khamrah.png",
    notas: "Canela · Nuez Moscada · Bergamota",
  },
  {
    id: 5,
    marca: "Lattafa",
    nombre: "KHAMRAH QHAWA",
    descripcion: "EDP 100ML",
    precio: 60000,
    genero: "masculino",
    badge: null,
    imagen:"./imagenes/qhawa.png",
    emoji: "👑",
    notas: "Bergamota · Cuero · Sándalo",
  },
  {
    id: 6,
    marca: "Lattafa",
    nombre: "KHAMRAH DUKHAN",
    descripcion: "EDP 100ML",
    precio: 60000,
    genero: "masculino",
    badge: "oferta",
    emoji: "⚓",
    imagen:"./imagenes/dukhan.png",
    notas: "Inicienso · Tabaco · Pachuli",
  },
  {
    id: 11,
    marca: "Lattafa",
    nombre: "THE KINGDOM ",
    descripcion: "EDP 100ml",
    precio: 63000,
    genero: "unisex",
    badge: "new",
    emoji: "",
    imagen:"./imagenes/kingdom.png",
    notas: "Lavanda · Vainilla · Tabaco",
  },
  {
    id: 10,
    marca: "Lattafa",
    nombre: "MAAHIR BLACK",
    descripcion: " EDP 100ml",
    precio: 49960,
    genero: "masculino",
    badge: "oferta",
    emoji: "🌿",
    imagen:"./imagenes/maahir.png",
    notas: "Oud · Rosa · Ambar",
  },
  {
    id: 9,
    marca: "Armaf",
    nombre: "MANDARIN SKY",
    descripcion: " EDP 100ML",
    precio: 68000,
    genero: "masculino",
    badge: "new",
    emoji: "🌃",
    imagen:"./imagenes/mandarin.png",
    notas: "Mandarina · Naranja · Caramelo",
  },
    {
    id: 8,
    marca: "Armaf",
    nombre: "ODYSSEY HOMME BLACK",
    descripcion: "EDP 100ML",
    precio: 65000,
    genero: "masculino",
    badge: "hot",
    emoji: "💎",
    imagen: "./imagenes/homme.png",
    notas: "Vainilla Negra · Cuero · Amaderado",
  },
    {
    id: 7,
    marca: "Armaf",
    nombre: "ODYSSEY CANDEE WOMAN",
    descripcion: "EDP 100ML",
    precio: 65000,
    genero: "femenino",
    badge: "hot",
    emoji: "💎",
    imagen: "./imagenes/candee.png",
    notas: "Frambuesa · Caramelo  · Ambar",
  },
  {
    id: 12,
    marca: "Afnan",
    nombre: "9 PM",
    descripcion: " EDP 100ml",
    precio: 57600,
    genero: "masculino",
    badge: "hot",
    emoji: "🏆",
    imagen:"./imagenes/9pm.png",
    notas: "Manzana · Canela · Lavanda",
  },
  {
    id: 13,
    marca: "French Avenue",
    nombre: "LIQUID BRUN",
    descripcion: "EDP 100ml",
    precio: 91990,
    genero: "masculino",
    badge: "hot",
    emoji: "",
    imagen:"./imagenes/liquidbrun.png",
    notas: "Canela · Vainilla · Elemi",
  },
  {
    id: 14,
    marca: "Lattafa",
    nombre: "MAYAR PINK",
    descripcion: "EDP 100ML",
    precio: 55960,
    genero: "femenino",
    badge: "new",
    emoji: "💎",
    imagen: "./imagenes/mayarpink.png",
    notas: "Sandalo · Almizcle · Vainilla",
  },
  {
    id: 15,
    marca: "Lattafa",
    nombre: "MAYAR CHERRY INTENSE",
    descripcion: "EDP 100ML",
    precio: 59560,
    genero: "femenino",
    badge: "hot",
    emoji: "💎",
    imagen: "./imagenes/mayarcherry.png",
    notas: "Cherry Jam  · Fresa · Vainilla",
  },
  {
    id: 16,
    marca: "Lattafa",
    nombre: "BADE'E AL OUD HONOR & GLORY",
    descripcion: "EDP 100ML",
    precio: 55900,
    genero: "masculino", 
    badge: null, 
    emoji: "🌟",
    imagen: "./imagenes/honor.png",
    notas: "Canela · Creme Brulee · Vainilla",
},
{
    id: 17,
    marca: "Lattafa",
    nombre: "BADE'E AL OUD AMETHYST",
    descripcion: "EDP 100ML",
    precio: 55900,
    genero: "unisex", 
    badge: "hot", 
    emoji: "🌟",
    imagen: "./imagenes/badeevioleta.png",
    notas: "Pimienta Rosa · Jazmin · Bergamota",
},
{
    id: 18,
    marca: "Lattafa",
    nombre: "BADE'E AL OUD FOR GLORY",
    descripcion: "EDP 100ML",
    precio: 55900,
    genero: "masculino", 
    badge: "new", 
    emoji: "hot",
    imagen: "./imagenes/badeenegro.png",
    notas: "Azafran · Nuez Moscada · Lavanda",
},
{
    id: 19,
    marca: "Lattafa",
    nombre: "BADE'E SUBLIME",
    descripcion: "EDP 100ML",
    precio: 55900,
    genero: "femenino", 
    badge: "new", 
    emoji: "hot",
    imagen: "./imagenes/badeered.png",
    notas: "Manzana · Lichi · Rosa",
},
{
    id: 20,
    marca: "Lattafa",
    nombre: "QAED AL FURSAN UNLIMITED ",
    descripcion: "EDP 90ML",
    precio: 48600,
    genero: "unisex",
    badge: "new",
    emoji: "💎",
    imagen: "./imagenes/qaed.png",
    notas: "Coco · Almizcle · Vainilla",
  },
  {
    id: 21,
    marca: "Lattafa",
    nombre: "QAED AL FURSAN",
    descripcion: "EDP 90ML",
    precio: 48600,
    genero: "masculino",
    badge: "new",
    emoji: "💎",
    imagen: "./imagenes/qaedblack.png",
    notas: "Ambar Gris · Almizcle · Vainilla",
  },
  {
    id: 22,
    marca: "Lattafa",
    nombre: "ANA ABIYEDH ROUGE",
    descripcion: "EDP 60ML",
    precio: 48900,
    genero: "femenino",
    badge: "hot",
    emoji: "💎",
    imagen: "./imagenes/ana.png",
    notas: "Pera · Caramelo · Ambar",
  },
    {
    id: 24,
    marca: "Lattafa",
    nombre: "RAVE NOW",
    descripcion: "EDP 100ML",
    precio: 49900,
    genero: "masculino",
    badge: "hot",
    emoji: "💎",
    imagen: "./imagenes/rave.png",
    notas: "Piña · Bergamota · Pachuli",
  },
  
  
];

/* ─── ESTADO ─────────────────────────────────────────────── */
let filteredProducts = [...PRODUCTS];

/* ─── HELPERS ────────────────────────────────────────────── */

/**
 * Formatea un número como precio ARS.
 * Ej: 28500 → "$28.500"
 */
function formatPrice(n) {
  return "$" + n.toLocaleString("es-AR");
}

/**
 * Calcula el precio de una cuota.
 * @param {number} price  - Precio total
 * @param {number} cuotas - Cantidad de cuotas (default 3)
 */
function installmentPrice(price, cuotas = 3) {
  return formatPrice(Math.ceil(price / cuotas));
}

/**
 * Genera el link de WhatsApp con el nombre del producto.
 * @param {Object} producto
 */
function buildWaLink(producto) {
  const msg = encodeURIComponent(
    `Hola quiero comprar ${producto.marca} ${producto.nombre}`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

/**
 * Genera el HTML del badge (Nuevo / Popular / Oferta).
 * @param {string|null} badge
 */
function badgeHTML(badge) {
  if (!badge) return "";
  const labels = { new: "Nuevo", hot: "🔥 Popular", oferta: "Oferta" };
  return `<div class="product-badge badge-${badge}">${labels[badge]}</div>`;
}

/**
 * Genera el SVG placeholder con emoji como imagen.
 * Reemplazar el src con la URL real de la imagen del producto.
 * @param {Object} p - Producto
 */
function productImgSrc(p) {
  if (p.imagen) {
    return p.imagen;  // usa la imagen real si existe
  }
}

/* ─── RENDERIZADO ────────────────────────────────────────── */

/**
 * Genera el HTML completo de una tarjeta de producto.
 * @param {Object} p - Producto
 */
function cardHTML(p) {
  const waLink = buildWaLink(p);
  return `
    <div class="product-card"
         data-genero="${p.genero}"
         data-marca="${p.marca}"
         data-precio="${p.precio}">

      ${badgeHTML(p.badge)}

      <div class="product-img-wrap">
        <img
          src="${productImgSrc(p)}"
          alt="${p.marca} ${p.nombre}"
          loading="lazy"
        />
        <a href="${waLink}" target="_blank" class="quick-wa">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Comprar por WhatsApp
        </a>
      </div>

      <div class="product-info">
        <div class="product-brand">${p.marca}</div>
        <div class="product-name">${p.nombre}</div>
        <div class="product-size">${p.descripcion} · ${p.notas}</div>
        <div class="product-pricing">
          <div class="product-price">${formatPrice(p.precio)}</div>
          <div class="product-installment">
            3 cuotas sin interés de ${installmentPrice(p.precio)}
          </div>
        </div>
      </div>

      <div class="product-actions">
        <a href="${waLink}" target="_blank" class="btn-wa">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Comprar por WhatsApp
        </a>
      </div>
    </div>`;
}

/**
 * Renderiza la lista de productos en el grid.
 * @param {Array} list - Array de productos a mostrar
 */
function renderProducts(list) {
  const grid  = document.getElementById("productGrid");
  const count = document.getElementById("productCount");

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <h3>No se encontraron productos</h3>
        <p>Probá con otros filtros o
           <a href="https://wa.me/${WA_NUMBER}?text=Hola%20quiero%20consultar%20por%20perfumes"
              target="_blank" style="color:var(--gold)">
             consultanos por WhatsApp
           </a>
        </p>
      </div>`;
  } else {
    grid.innerHTML = list.map(cardHTML).join("");
  }

  const n = list.length;
  count.innerHTML = `<strong>${n}</strong> producto${n !== 1 ? "s" : ""} encontrado${n !== 1 ? "s" : ""}`;
}

/* ─── FILTROS ────────────────────────────────────────────── */

/**
 * Lee los checkboxes activos y filtra el array de productos.
 * Llamada desde los onchange de los checkboxes del HTML.
 */
function applyFilters() {
  const checkedGeneros = [
    ...document.querySelectorAll('[data-filter="genero"]:checked'),
  ].map((el) => el.value);

  const checkedMarcas = [
    ...document.querySelectorAll('[data-filter="marca"]:checked'),
  ].map((el) => el.value);

  const maxPrice = parseInt(document.getElementById("priceMax").value) || 999999;

  filteredProducts = PRODUCTS.filter((p) => {
    const generoOk = checkedGeneros.length === 0 || checkedGeneros.includes(p.genero);
    const marcaOk  = checkedMarcas.length  === 0 || checkedMarcas.includes(p.marca);
    const precioOk = p.precio <= maxPrice;
    return generoOk && marcaOk && precioOk;
  });

  renderProducts(filteredProducts);
  renderActiveTags(checkedGeneros, checkedMarcas);
}

/**
 * Muestra los tags de filtros activos encima del grid.
 */
function renderActiveTags(generos, marcas) {
  const container = document.getElementById("activeFilters");
  const tags = [
    ...generos.map((g) => ({ label: g, type: "genero" })),
    ...marcas.map((m)  => ({ label: m, type: "marca"  })),
  ];
  container.innerHTML = tags
    .map(
      (t) =>
        `<div class="filter-tag">
           ${t.label}
           <button onclick="removeFilter('${t.type}','${t.label}')">×</button>
         </div>`
    )
    .join("");
}

/**
 * Quita un filtro individual al hacer clic en el tag.
 * @param {string} type - "genero" | "marca"
 * @param {string} val  - valor del checkbox
 */
function removeFilter(type, val) {
  const input = document.querySelector(`[data-filter="${type}"][value="${val}"]`);
  if (input) input.checked = false;
  applyFilters();
}

/**
 * Limpia todos los filtros y restaura el catálogo completo.
 */
function clearFilters() {
  document.querySelectorAll("[data-filter]").forEach((el) => (el.checked = false));
  document.getElementById("priceMax").value    = 80000;
  document.getElementById("priceSlider").value = 80000;
  filteredProducts = [...PRODUCTS];
  renderProducts(filteredProducts);
  document.getElementById("activeFilters").innerHTML = "";
}

/* ─── ORDENAMIENTO ───────────────────────────────────────── */

/**
 * Ordena los productos actualmente filtrados.
 * @param {string} val - valor del select de ordenamiento
 */
function sortProducts(val) {
  const arr = [...filteredProducts];

  if (val === "price-asc")  arr.sort((a, b) => a.precio - b.precio);
  if (val === "price-desc") arr.sort((a, b) => b.precio - a.precio);
  if (val === "name")       arr.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (val === "popular")    arr.sort((a, b) =>
    (b.badge === "hot" ? 1 : 0) - (a.badge === "hot" ? 1 : 0)
  );

  renderProducts(arr);
}

/* ─── SLIDER DE PRECIO ───────────────────────────────────── */

/**
 * Actualiza el campo de precio máximo al mover el slider.
 * @param {string|number} val - valor del range input
 */
function updatePrice(val) {
  document.getElementById("priceMax").value = parseInt(val).toLocaleString("es-AR");
  applyFilters();
}

/* ─── INIT ───────────────────────────────────────────────── */
// Renderizar todos los productos al cargar la página
renderProducts(PRODUCTS);
