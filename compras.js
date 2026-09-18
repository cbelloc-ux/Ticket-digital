/* ══════════════════════════════════════════════════════════════════════════
   compras.js — Listado de "Mis compras": filtros, paginación y navegación
   al detalle del pedido.
   ══════════════════════════════════════════════════════════════════════════ */

const PAGE_SIZE = 10;

/* Estado aplicado y borrador (el borrador sólo se confirma con "Aplicar",
   igual que en el diseño: el panel de desktop también tiene su botón). */
const DEFAULT_FILTERS = { tipo: 'todos', estatus: 'todos', rango: '12m' };

let filters = { ...DEFAULT_FILTERS };
let draft   = { ...DEFAULT_FILTERS };
let visible = PAGE_SIZE;

const FILTER_GROUPS = [
  {
    key: 'tipo', title: 'Tipo de pedido',
    options: [
      { value: 'domicilio', label: 'Envío a domicilio' },
      { value: 'pickgo',    label: 'Pick & Go' },
      { value: 'tienda',    label: 'En tienda' },
      { value: 'todos',     label: 'Todos' }
    ]
  },
  {
    key: 'estatus', title: 'Estatus de pedido',
    options: [
      { value: 'entregado', label: 'Entregado' },
      { value: 'proceso',   label: 'En proceso' },
      { value: 'cancelado', label: 'Cancelado' },
      { value: 'todos',     label: 'Todos' }
    ]
  },
  {
    key: 'rango', title: 'Fecha de pedido',
    options: Object.entries(DATE_RANGES).map(([value, r]) => ({ value, label: r.label }))
  }
];

/* ── Filtrado ──────────────────────────────────────────────────────────── */
function filteredOrders() {
  const today = new Date();
  const limit = DATE_RANGES[filters.rango].days;

  return ORDERS.filter(o => {
    if (filters.tipo !== 'todos' && o.type !== filters.tipo) return false;
    if (filters.estatus !== 'todos' && STATUSES[o.status].group !== filters.estatus) return false;
    if (daysBetween(today, o.date) > limit) return false;
    return true;
  });
}

/* ── Miniaturas por breakpoint ─────────────────────────────────────────── */
function thumbCount() {
  if (window.matchMedia('(min-width: 1200px)').matches) return 7;
  if (window.matchMedia('(min-width: 768px)').matches)  return 6;
  return 4;
}

/* ── Render ────────────────────────────────────────────────────────────── */
function orderCardHTML(order) {
  const type = ORDER_TYPES[order.type];
  const st = STATUSES[order.status];

  const max = thumbCount();
  const shown = order.items.slice(0, max);
  const rest = order.items.length - shown.length;

  const thumbs = shown.map(it => {
    const p = CATALOG_BY_ID[it.productId];
    return `<span class="order-thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></span>`;
  }).join('') + (rest > 0 ? `<span class="order-thumb-more">+${rest}</span>` : '');

  return `
    <article class="order-card" data-id="${order.id}">
      <div class="order-card-top">
        <div class="order-type">
          <img class="order-type-icon" src="${type.img}" alt="" aria-hidden="true">
          <span class="order-type-label">${type.label}</span>
        </div>
        <span class="status-badge ${st.cls}">
          <span class="msi msi-fill" aria-hidden="true">${statusIcon(order)}</span>${statusLabel(order)}
        </span>
      </div>

      <p class="order-id">Pedido ${order.id}</p>

      <div class="order-meta">
        <span>Fecha del pedido: <strong>${formatDateLong(order.date)}</strong></span>
        <span>Total: <strong>${money(order.total)}</strong></span>
      </div>

      <div class="order-thumbs">${thumbs}</div>

      <div class="order-card-actions">
        <button class="btn btn-secondary btn-sm" data-detalles="${order.id}">Ver detalles</button>
      </div>
    </article>`;
}

function render() {
  const list = document.getElementById('comprasList');
  const empty = document.getElementById('comprasEmpty');
  const more = document.getElementById('comprasMore');
  const count = document.getElementById('comprasCount');

  const results = filteredOrders();
  const page = results.slice(0, visible);

  count.textContent = `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`;
  list.innerHTML = page.map(orderCardHTML).join('');
  empty.classList.toggle('show', results.length === 0);
  more.hidden = results.length <= visible;

  staggerIn([...list.children]);

  /* Marca el botón de filtros cuando hay algo distinto al estado inicial */
  const btn = document.getElementById('filtrosBtn');
  const dirty = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);
  btn.classList.toggle('has-filters', dirty);
}

/* Navegación al detalle — delegada para no re-enlazar en cada render */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-detalles]');
  if (!btn) return;
  const card = btn.closest('.order-card');
  navigateFromCard(card, `pedido.html?id=${encodeURIComponent(btn.dataset.detalles)}`);
});

function showMore() {
  visible += PAGE_SIZE;
  render();
}

/* ── Filtros ───────────────────────────────────────────────────────────── */
function filterGroupsHTML(scope) {
  return FILTER_GROUPS.map(g => `
    <div class="filter-group">
      <h3 id="${scope}-${g.key}-label">${g.title}</h3>
      <div role="radiogroup" aria-labelledby="${scope}-${g.key}-label">
        ${g.options.map(o => `
          <button type="button" class="filter-opt" role="radio"
                  aria-checked="${draft[g.key] === o.value}"
                  data-group="${g.key}" data-value="${o.value}">
            <span class="filter-radio" aria-hidden="true"></span>${o.label}
          </button>`).join('')}
      </div>
    </div>`).join('');
}

function renderFilters() {
  document.getElementById('filtrosSheetBody').innerHTML = filterGroupsHTML('sheet');
  document.getElementById('filtrosPanelBody').innerHTML = filterGroupsHTML('panel');
}

document.addEventListener('click', (e) => {
  const opt = e.target.closest('.filter-opt');
  if (!opt) return;
  draft[opt.dataset.group] = opt.dataset.value;
  renderFilters();
});

function openFiltros() {
  draft = { ...filters };
  renderFilters();
  openModal('filtrosModal', 'filtrosOverlay');
}

function closeFiltros() {
  closeModal('filtrosModal', 'filtrosOverlay');
}

function applyFiltros() {
  filters = { ...draft };
  visible = PAGE_SIZE;
  render();

  if (document.getElementById('filtrosModal').classList.contains('open')) closeFiltros();

  const n = filteredOrders().length;
  showToast(`${n} ${n === 1 ? 'compra' : 'compras'} con estos filtros`, 'tune');
  document.getElementById('comprasList').scrollIntoView({ block: 'nearest' });
}

function resetFiltros() {
  filters = { ...DEFAULT_FILTERS };
  draft = { ...DEFAULT_FILTERS };
  visible = PAGE_SIZE;
  renderFilters();
  render();
}

/* ── Re-render al cambiar de breakpoint (cambia el número de miniaturas) ── */
let resizeTimer = null;
let lastThumbs = thumbCount();
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const n = thumbCount();
    if (n !== lastThumbs) { lastThumbs = n; render(); }
  }, 150);
});

/* ── Init ──────────────────────────────────────────────────────────────── */
renderFilters();
render();
