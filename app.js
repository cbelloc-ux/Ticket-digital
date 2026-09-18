/* ══════════════════════════════════════════════════════════════════════════
   app.js — Utilidades compartidas: modales, toasts, transiciones de página,
   logo H-E-B y generación de códigos de barras.
   ══════════════════════════════════════════════════════════════════════════ */

const MODAL_ANIM_MS = 220;

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Modales ───────────────────────────────────────────────────────────── */
let lastFocused = null;

function openModal(modalId, overlayId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(overlayId);
  if (!modal || !overlay) return;

  lastFocused = document.activeElement;

  overlay.hidden = false;
  modal.hidden = false;
  /* Reflow para que el navegador registre el estado cerrado antes de animar */
  void modal.offsetHeight;
  overlay.classList.add('open');
  modal.classList.add('open');

  lockScroll(true);

  const first = modal.querySelector('[data-autofocus]') || modal.querySelector('.modal-close');
  if (first) setTimeout(() => first.focus({ preventScroll: true }), MODAL_ANIM_MS);
}

function closeModal(modalId, overlayId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById(overlayId);
  if (!modal || !overlay) return;

  overlay.classList.remove('open');
  modal.classList.remove('open');
  lockScroll(false);

  setTimeout(() => {
    overlay.hidden = true;
    modal.hidden = true;
  }, prefersReducedMotion() ? 0 : MODAL_ANIM_MS);

  if (lastFocused && document.contains(lastFocused)) lastFocused.focus({ preventScroll: true });
}

function lockScroll(on) {
  document.documentElement.style.overflow = on ? 'hidden' : '';
  document.body.style.overflow = on ? 'hidden' : '';
}

/* Cierra el modal abierto con Escape */
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = document.querySelector('.modal.open');
  if (!open) return;
  const overlay = document.querySelector('.overlay.open');
  closeModal(open.id, overlay ? overlay.id : '');
});

/* ── Toast ─────────────────────────────────────────────────────────────── */
let toastTimer = null;

function showToast(message, icon = 'check_circle') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.innerHTML = `<span class="msi msi-fill" aria-hidden="true">${icon}</span><span>${message}</span>`;
  void el.offsetHeight;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

/* ── Transición entre páginas ──────────────────────────────────────────────
   Antes de navegar marcamos la tarjeta origen con `view-transition-name`
   para que el navegador la interpole contra el bloque equivalente de la
   página destino. Sin soporte, la navegación es la de siempre.            */
function navigateFromCard(cardEl, href) {
  if (cardEl && !prefersReducedMotion() && 'startViewTransition' in document) {
    cardEl.style.viewTransitionName = 'order-hero';
  }
  window.location.href = href;
}

/* Limpia el nombre al volver con el botón atrás (bfcache) */
window.addEventListener('pageshow', () => {
  document.querySelectorAll('[style*="view-transition-name"]').forEach(el => {
    el.style.viewTransitionName = '';
  });
});

/* ── Logo H-E-B rojo (Assets/Logo-single-color.svg) — usado en el ticket ── */
const HEB_LOGO_RATIO = 30 / 82;   /* alto / ancho del SVG original */

function hebLogoMarkup(width = 118) {
  const h = Math.round(width * HEB_LOGO_RATIO);
  return `<img class="heb-mark" src="Assets/Logo-single-color.svg"
               width="${width}" height="${h}" alt="H-E-B">`;
}

/* ── Código de barras ──────────────────────────────────────────────────────
   Patrón determinista derivado de la cadena: no es Code128 real, pero es
   estable (el mismo texto siempre dibuja el mismo código) y visualmente
   equivalente para efectos del prototipo.                                  */
function barcodeSVG(text, { height = 56, width = 260 } = {}) {
  const clean = String(text).replace(/\D/g, '') || '0';
  let seed = 7;
  for (const ch of clean) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;

  const rnd = mulberry32(seed);
  const bars = [];
  let x = 0;
  const unit = 2;

  /* Guardas de inicio */
  const guard = [1, 1, 1];
  guard.forEach((w, i) => { if (i % 2 === 0) bars.push([x, w * unit]); x += w * unit; });

  while (x < width - 12) {
    const w = 1 + Math.floor(rnd() * 4);
    const gap = 1 + Math.floor(rnd() * 3);
    bars.push([x, w * unit]);
    x += (w + gap) * unit;
  }
  /* Guardas de cierre */
  bars.push([width - 8, unit], [width - 4, unit]);

  const rects = bars
    .filter(([bx, bw]) => bx + bw <= width)
    .map(([bx, bw]) => `<rect x="${bx}" y="0" width="${bw}" height="${height}" fill="#221f19"/>`)
    .join('');

  return `<svg class="barcode" viewBox="0 0 ${width} ${height}" width="100%" height="${height}"
               preserveAspectRatio="none" role="img" aria-label="Código de barras ${clean}">${rects}</svg>`;
}

/* ── Animación de entrada escalonada ───────────────────────────────────── */
function staggerIn(nodes, step = 35, max = 12) {
  if (prefersReducedMotion()) return;
  nodes.forEach((el, i) => {
    el.classList.add('enter');
    el.style.animationDelay = `${Math.min(i, max) * step}ms`;
  });
}
