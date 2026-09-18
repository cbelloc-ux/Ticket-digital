/* ══════════════════════════════════════════════════════════════════════════
   data.js — Catálogo y generación determinista de compras.

   Todo se genera con un PRNG sembrado (mulberry32) para que la lista y el
   detalle muestren exactamente lo mismo entre navegaciones, sin backend.
   ══════════════════════════════════════════════════════════════════════════ */

const CATALOG = [
  { id: 'p01', name: 'Plátano Chiapas',                    img: 'Assets/platano.webp',              unit: 'kg',  price:  24.90 },
  { id: 'p02', name: 'Aguacate Hass',                      img: 'Assets/aguacate.webp',             unit: 'kg',  price:  89.00 },
  { id: 'p03', name: 'Limón sin semilla',                  img: 'Assets/Limon.webp',                unit: 'kg',  price:  32.50 },
  { id: 'p04', name: 'Naranja Valencia',                   img: 'Assets/naranja.webp',              unit: 'kg',  price:  27.90 },
  { id: 'p05', name: 'Mandarina Murcott',                  img: 'Assets/mandarina.webp',            unit: 'kg',  price:  39.90 },
  { id: 'p06', name: 'Toronja en malla 2.5 kg',            img: 'Assets/toronja.webp',              unit: 'Pza', price:  64.00 },
  { id: 'p07', name: 'Uva roja sin semilla',               img: 'Assets/uva-roja.webp',             unit: 'kg',  price: 119.00 },
  { id: 'p08', name: 'Fresa 454 g',                        img: 'Assets/fresas.webp',               unit: 'Pza', price:  54.90 },
  { id: 'p09', name: 'Zarzamora 170 g',                    img: 'Assets/mora.webp',                 unit: 'Pza', price:  49.90 },
  { id: 'p10', name: 'Frambuesa 170 g',                    img: 'Assets/frambuesa.webp',            unit: 'Pza', price:  62.00 },
  { id: 'p11', name: 'Blueberry 125 g',                    img: 'Assets/blueberry.webp',            unit: 'Pza', price:  58.50 },
  { id: 'p12', name: 'Durazno amarillo',                   img: 'Assets/durazno.webp',              unit: 'kg',  price:  59.90 },
  { id: 'p13', name: 'Nectarina',                          img: 'Assets/nectarina.webp',            unit: 'kg',  price:  64.90 },
  { id: 'p14', name: 'Mango Ataulfo',                      img: 'Assets/mango.webp',                unit: 'kg',  price:  44.90 },
  { id: 'p15', name: 'Manzana Red Delicious',              img: 'Assets/product-manzana-red.png',   unit: 'kg',  price:  52.90 },
  { id: 'p16', name: 'Manzana Granny Smith',               img: 'Assets/product-manzana-verde.png', unit: 'kg',  price:  56.90 },
  { id: 'p17', name: 'Leche Entera HEB 1 L',               img: 'Assets/leche.webp',                unit: 'Pza', price:  26.50 },
  { id: 'p18', name: 'Huevo Blanco HEB 18 pzas',           img: 'Assets/huevo.webp',                unit: 'Pza', price:  72.00 },
  { id: 'p19', name: 'Café Chiapas HEB 500 g',             img: 'Assets/cafe.webp',                 unit: 'Pza', price: 125.00 },
  { id: 'p20', name: 'Queso Oaxaca HEB 400 g',             img: 'Assets/queso-oaxaca.webp',         unit: 'Pza', price:  98.00 },
  { id: 'p21', name: 'Yoghurt Griego Natural 900 g',       img: 'Assets/yogurt.webp',               unit: 'Pza', price:  62.50 },
  { id: 'p22', name: 'Pan Blanco Bimbo Grande',            img: 'Assets/pan-bimbo.webp',            unit: 'Pza', price:  49.50 },
  { id: 'p23', name: 'Pasta Barilla Spaghetti 500 g',      img: 'Assets/pasta-barilla.webp',        unit: 'Pza', price:  32.90 },
  { id: 'p24', name: 'Arroz Verde Valle 1 kg',             img: 'Assets/arroz-verde-valle.webp',    unit: 'Pza', price:  38.90 },
  { id: 'p25', name: 'Frijol La Costeña Refrito 580 g',    img: 'Assets/frijol-costena.webp',       unit: 'Pza', price:  27.50 },
  { id: 'p26', name: 'Atún Tuny en agua 140 g',            img: 'Assets/atun-tuny.webp',            unit: 'Pza', price:  22.90 },
  { id: 'p27', name: 'Aceite 1-2-3 Vegetal 1 L',           img: 'Assets/aceite-123.webp',           unit: 'Pza', price:  46.90 },
  { id: 'p28', name: 'Cereal Zucaritas 730 g',             img: 'Assets/cereal-zucaritas.webp',     unit: 'Pza', price:  99.00 },
  { id: 'p29', name: 'Galletas Oreo 456 g',                img: 'Assets/oreo.webp',                 unit: 'Pza', price:  59.90 },
  { id: 'p30', name: 'Sabritas Original 240 g',            img: 'Assets/sabritas.webp',             unit: 'Pza', price:  69.00 },
  { id: 'p31', name: 'Coca-Cola Sin Azúcar 2.5 L',         img: 'Assets/coca-cola.webp',            unit: 'Pza', price:  44.00 },
  { id: 'p32', name: 'Agua Ciel Natural 1.5 L',            img: 'Assets/agua-ciel.webp',            unit: 'Pza', price:  16.50 },
  { id: 'p33', name: 'Néctar Jumex Durazno 1 L',           img: 'Assets/nectar-durazno.webp',       unit: 'Pza', price:  28.90 },
  { id: 'p34', name: 'Detergente Ariel Líquido 2.8 L',     img: 'Assets/ariel.webp',                unit: 'Pza', price: 189.00 },
  { id: 'p35', name: 'Papel Higiénico Pétalo 12 rollos',   img: 'Assets/papel-petalo.webp',         unit: 'Pza', price: 112.00 },
  { id: 'p36', name: 'Shampoo Head & Shoulders 700 ml',    img: 'Assets/shampoo-hs.webp',           unit: 'Pza', price: 138.00 },
  { id: 'p37', name: 'Pechuga de Pollo sin hueso',         img: 'Assets/pechuga-pollo.webp',        unit: 'kg',  price: 159.00 }
];

const CATALOG_BY_ID = Object.fromEntries(CATALOG.map(p => [p.id, p]));

/* ── Contexto de tienda / entrega ──────────────────────────────────────── */
const STORES = [
  { name: 'HEB Cerradas de Anáhuac', address: 'Av. Concordia Oriente #100, Cerradas de Anáhuac', short: 'Cerradas de Anáhuac', suc: '66059' },
  { name: 'HEB Gómez Morín',         address: 'Avenida Manuel Gómez Morín #300, Col. Valle Campestre', short: 'Gómez Morín', suc: '66254' },
  { name: 'HEB Valle Oriente',       address: 'Av. Lázaro Cárdenas #2400, Col. Valle Oriente', short: 'Valle Oriente', suc: '66269' },
  { name: 'HEB Cumbres',             address: 'Av. Paseo de los Leones #2500, Col. Cumbres', short: 'Cumbres', suc: '64619' },
  { name: 'HEB Contry',              address: 'Av. Eugenio Garza Sada #3820, Col. Contry', short: 'Contry', suc: '64860' }
];

const ADDRESSES = [
  { label: 'Casa',    line: 'Zimapán #302, Col. Mitras Centro, Monterrey, N.L.' },
  { label: 'Oficina', line: 'Av. Ricardo Margáin #440, Valle del Campestre, San Pedro, N.L.' }
];

const PAYMENTS = [
  { label: 'Super tarjeta HEB', kind: 'Tarjeta', mask: '**** **** **** 1234' },
  { label: 'Visa terminación 4021', kind: 'Tarjeta', mask: '**** **** **** 4021' },
  { label: 'Mastercard terminación 8890', kind: 'Tarjeta', mask: '**** **** **** 8890' },
  { label: 'Efectivo', kind: 'Efectivo', mask: '' }
];

/* Los iconos de tipo de entrega son los SVG de marca exportados de Figma
   (Delivery Icons - HEB · Delivery - HEB · in-store small). */
const ORDER_TYPES = {
  domicilio: { key: 'domicilio', label: 'Envío a domicilio', img: 'Assets/icon-envio-domicilio.svg' },
  pickgo:    { key: 'pickgo',    label: 'Pick & Go',         img: 'Assets/icon-pick-go.svg' },
  tienda:    { key: 'tienda',    label: 'En tienda',         img: 'Assets/icon-en-tienda.svg' }
};

/* Pasos del seguimiento. Una compra "En tienda" no tiene progreso: se cierra
   en caja, así que no aparece la barra. */
const PROGRESS_STEPS = {
  domicilio: [
    { key: 'ordenado',   label: 'Ordenado' },
    { key: 'preparando', label: 'Preparando' },
    { key: 'camino',     label: 'En camino' },
    { key: 'entregado',  label: 'Entregado' }
  ],
  pickgo: [
    { key: 'ordenado',   label: 'Ordenado' },
    { key: 'preparando', label: 'Preparando' },
    { key: 'camino',     label: 'Listo para recoger' },
    { key: 'entregado',  label: 'Entregado' }
  ],
  tienda: null
};

const STATUSES = {
  entregado:  { key: 'entregado',  group: 'entregado', label: 'Entregado',  icon: 'check_circle', cls: 'is-entregado' },
  camino:     { key: 'camino',     group: 'proceso',   label: 'En camino',  icon: 'local_shipping', cls: 'is-camino' },
  preparando: { key: 'preparando', group: 'proceso',   label: 'Preparando', icon: 'inventory_2', cls: 'is-preparando' },
  ordenado:   { key: 'ordenado',   group: 'proceso',   label: 'Ordenado',   icon: 'receipt_long', cls: 'is-ordenado' },
  cancelado:  { key: 'cancelado',  group: 'cancelado', label: 'Cancelado',  icon: 'cancel', cls: 'is-cancelado' }
};

/* ── PRNG determinista ─────────────────────────────────────────────────── */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

function formatDateLong(d) {
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}
function formatDateTime(d) {
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${formatDateLong(d)}, ${hh}:${mm}`;
}
function money(n) {
  return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Generación de compras ─────────────────────────────────────────────── */
const TOTAL_ORDERS = 61;

function buildOrders() {
  const rnd = mulberry32(20260824);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const orders = [];

  for (let i = 0; i < TOTAL_ORDERS; i++) {
    /* Distribución en el tiempo: densa en las últimas semanas y más rala
       hacia atrás, hasta cubrir 12 meses. */
    const spread = Math.pow(i / (TOTAL_ORDERS - 1), 1.45);
    const daysAgo = Math.round(spread * 358) + (i === 0 ? 0 : Math.floor(rnd() * 3));

    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(9 + Math.floor(rnd() * 11), [0, 15, 30, 45][Math.floor(rnd() * 4)], 0, 0);

    /* Tipo de compra */
    const tr = rnd();
    let type = tr < 0.45 ? 'domicilio' : tr < 0.72 ? 'tienda' : 'pickgo';

    /* Las 6 compras más recientes se siembran a mano para que la lista siempre
       muestre los cinco estados y los dos tipos con seguimiento —incluido el
       Pick & Go en "Listo para recoger"— sin depender del azar. Una compra
       "En tienda" nunca queda en proceso porque se cierra en caja. */
    const SEED_RECENT = [
      { status: 'camino',     type: 'domicilio' },
      { status: 'preparando', type: 'pickgo' },
      { status: 'entregado',  type: 'tienda' },
      { status: 'ordenado',   type: 'domicilio' },
      { status: 'camino',     type: 'pickgo' },
      { status: 'cancelado',  type: 'pickgo' }
    ];

    let status;
    if (i < SEED_RECENT.length) {
      status = SEED_RECENT[i].status;
      type = SEED_RECENT[i].type;
    } else if (rnd() < 0.08 && type !== 'tienda') {
      status = 'cancelado';
    } else {
      status = 'entregado';
    }

    /* Productos */
    const nItems = 2 + Math.floor(rnd() * 9);
    const used = new Set();
    const items = [];
    for (let k = 0; k < nItems; k++) {
      let p;
      do { p = CATALOG[Math.floor(rnd() * CATALOG.length)]; } while (used.has(p.id) && used.size < CATALOG.length);
      used.add(p.id);
      const qty = p.unit === 'kg'
        ? [0.5, 1, 1.5, 2, 2.5, 3][Math.floor(rnd() * 6)]
        : 1 + Math.floor(rnd() * 3);
      items.push({ productId: p.id, qty, unit: p.unit, price: p.price });
    }

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const freeShipping = type !== 'domicilio' || subtotal >= 599;
    const envio = freeShipping ? 0 : 49;
    const savings = Math.round(subtotal * (0.02 + rnd() * 0.06) * 100) / 100;
    const total = Math.round((subtotal + envio - savings) * 100) / 100;

    const store = STORES[Math.floor(rnd() * STORES.length)];
    const address = ADDRESSES[Math.floor(rnd() * ADDRESSES.length)];
    const payment = PAYMENTS[Math.floor(rnd() * (type === 'tienda' ? PAYMENTS.length : PAYMENTS.length - 1))];

    /* Fecha de entrega / recolección */
    const delivery = new Date(date);
    if (type === 'domicilio') delivery.setHours(delivery.getHours() + 2 + Math.floor(rnd() * 4));
    else if (type === 'pickgo') delivery.setHours(delivery.getHours() + 1 + Math.floor(rnd() * 3));

    const digits = (base) => String(base).padStart(13, '0').slice(-13);
    const id = `${digits(1600000000000 + Math.floor(rnd() * 99999999999))}-01`;
    const ticketNumber = `${digits(1300000000000 + Math.floor(rnd() * 99999999999))}-0`;

    orders.push({
      id,
      ticketNumber,
      type,
      status,
      date,
      delivery,
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      envio,
      savings,
      total,
      store,
      address,
      payment,
      caja: 1 + Math.floor(rnd() * 12),
      cajero: 1 + Math.floor(rnd() * 40),
      afiliacion: 4784914 + Math.floor(rnd() * 900),
      folio: 600000 + Math.floor(rnd() * 99999),
      auth: String(Math.floor(rnd() * 899999) + 100000),
      /* El ticket digital se puede consultar en cualquier pedido */
      hasTicket: true
    });
  }

  return orders;
}

const ORDERS = buildOrders();
const ORDERS_BY_ID = Object.fromEntries(ORDERS.map(o => [o.id, o]));

/* ── Helpers de dominio ────────────────────────────────────────────────── */
/* En Pick & Go el tercer paso no es "En camino" sino "Listo para recoger". */
function statusLabel(order) {
  if (order.type === 'pickgo' && order.status === 'camino') return 'Listo para recoger';
  return STATUSES[order.status].label;
}

function statusIcon(order) {
  if (order.type === 'pickgo' && order.status === 'camino') return 'shopping_bag';
  return STATUSES[order.status].icon;
}

function orderItemCount(order) {
  return order.items.length;
}
function qtyLabel(item) {
  return item.unit === 'kg' ? `${item.qty} kg` : `${item.qty} ${item.qty === 1 ? 'Pza' : 'Pzas'}`;
}
function daysBetween(a, b) {
  return Math.round((a - b) / 86400000);
}

const DATE_RANGES = {
  '15d':  { label: 'Últimos 15 días',  days: 15 },
  '1m':   { label: 'Último mes',       days: 31 },
  '3m':   { label: 'Últimos 3 meses',  days: 92 },
  '6m':   { label: 'Últimos 6 meses',  days: 183 },
  '12m':  { label: 'Últimos 12 meses', days: 366 }
};
