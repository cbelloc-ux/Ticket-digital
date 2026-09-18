/* ══════════════════════════════════════════════════════════════════════════
   pedido.js — Detalle de la compra y ticket digital.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Resolución del pedido ─────────────────────────────────────────────── */
const params = new URLSearchParams(location.search);
const order = ORDERS_BY_ID[params.get('id')] || ORDERS.find(o => o.hasTicket) || ORDERS[0];

/* ── Cabecera ──────────────────────────────────────────────────────────── */
document.getElementById('pedidoTitle').textContent = `Pedido ${order.id}`;
document.title = `Pedido ${order.id} — H-E-B`;

/* ── Seguimiento del pedido ────────────────────────────────────────────────
   Los pasos dependen del tipo de entrega. Una compra "En tienda" no muestra
   barra. El tramo en curso se dibuja a la mitad —igual que en el frame de
   Figma— salvo "Ordenado" y "Entregado", que son hitos y se completan al
   llegar a ellos. Un pedido cancelado pinta los cuatro tramos en rojo.      */
function renderProgress() {
  const steps = PROGRESS_STEPS[order.type];
  if (!steps) return;

  const row = document.getElementById('progressRow');
  row.hidden = false;

  const cancelled = order.status === 'cancelado';
  const current = cancelled ? -1 : steps.findIndex(s => s.key === order.status);

  const track = document.getElementById('orderProgress');
  track.classList.toggle('is-cancelled', cancelled);
  track.innerHTML = steps.map((step, i) => {
    let fill;
    if (cancelled)          fill = 100;
    else if (i < current)   fill = 100;
    else if (i === current) fill = step.key === 'entregado' ? 100 : 50;
    else                    fill = 0;

    const reached = !cancelled && i <= current;
    return `
      <div class="progress-step${reached ? ' is-reached' : ''}">
        <span class="progress-bar"><i style="width:${fill}%"></i></span>
        <span class="progress-label">${step.label}</span>
      </div>`;
  }).join('');

  /* Modificar pedido sólo antes de que entre a preparación */
  const btn = document.getElementById('modificarBtn');
  btn.disabled = order.status !== 'ordenado';
  btn.title = btn.disabled
    ? 'Este pedido ya no se puede modificar'
    : 'Edita los productos de tu pedido';

  if (cancelled) document.getElementById('titleStatus').hidden = false;
}

/* ── Detalles de entrega ───────────────────────────────────────────────── */
function renderHero() {
  const type = ORDER_TYPES[order.type];
  const st = STATUSES[order.status];

  const isTienda = order.type === 'tienda';
  const entregaLabel = isTienda ? 'Compra realizada'
                     : order.type === 'pickgo' ? 'Recolección'
                     : 'Entrega';

  const lugarLabel = order.type === 'domicilio' ? 'Dirección' : 'Tienda';
  const lugarTitulo = order.type === 'domicilio' ? order.address.label : order.store.name;
  const lugarDetalle = order.type === 'domicilio' ? order.address.line : order.store.address;

  document.getElementById('pedidoHero').innerHTML = `
    <div class="pedido-status">
      <span class="pedido-type">
        <img class="order-type-icon" src="${type.img}" alt="" aria-hidden="true">
        ${type.label}
      </span>
      <span class="status-badge ${st.cls}">
        <span class="msi msi-fill" aria-hidden="true">${statusIcon(order)}</span>${statusLabel(order)}
      </span>
    </div>

    <div class="delivery-row">
      <span class="msi" aria-hidden="true">calendar_month</span>
      <div>
        <div class="delivery-label">${entregaLabel}</div>
        <div class="delivery-value">${formatDateTime(order.delivery)}</div>
      </div>
    </div>

    <div class="delivery-row">
      <span class="msi" aria-hidden="true">${order.type === 'domicilio' ? 'home_pin' : 'storefront'}</span>
      <div>
        <div class="delivery-label">${lugarLabel}</div>
        <div class="delivery-value">${lugarTitulo}</div>
        <div class="delivery-sub">${lugarDetalle}</div>
      </div>
    </div>`;
}

/* ── Productos ─────────────────────────────────────────────────────────── */
function renderProducts() {
  const n = order.items.length;
  document.getElementById('prodCount').textContent = `${n} ${n === 1 ? 'producto' : 'productos'}`;

  const list = document.getElementById('productList');
  list.innerHTML = order.items.map(it => {
    const p = CATALOG_BY_ID[it.productId];
    return `
      <article class="product-row">
        <span class="product-row-img"><img src="${p.img}" alt="" loading="lazy"></span>
        <div class="product-row-info">
          <div class="product-row-name">${p.name}</div>
          <div class="product-row-qty">${qtyLabel(it)}</div>
        </div>
        <div class="product-row-price">${money(it.price * it.qty)}</div>
      </article>`;
  }).join('');

  staggerIn([...list.children], 30);
}

/* ── Resumen ───────────────────────────────────────────────────────────── */
function renderResumen() {
  const envioVal = order.envio === 0
    ? '<span class="val free">Gratis</span>'
    : `<span class="val">${money(order.envio)}</span>`;

  /* Una compra en tienda no lleva línea de envío. */
  const envioLine = order.type === 'tienda'
    ? ''
    : `<div class="sum-line"><span class="lbl">Envío</span>${envioVal}</div>`;

  document.getElementById('resumen').innerHTML = `
    <div class="sum-line"><span class="lbl">Subtotal</span><span class="val">${money(order.subtotal)}</span></div>
    ${envioLine}
    <div class="sum-line"><span class="lbl">Ahorro con tu App</span><span class="val save">−${money(order.savings)}</span></div>
    <div class="sum-line total"><span class="lbl">Total</span><span class="val">${money(order.total)}</span></div>
    <div class="sum-line pay"><span class="lbl">Método de pago</span><span class="val">${order.payment.label}</span></div>`;
}

/* ── Comprar de nuevo ──────────────────────────────────────────────────── */
document.getElementById('rebuyBtn').addEventListener('click', () => {
  const n = order.items.length;
  showToast(`${n} ${n === 1 ? 'producto agregado' : 'productos agregados'} a tu carrito`, 'shopping_cart');
});

/* ══════════════════════════════════════════════════════════════════════════
   TICKET DIGITAL
   ══════════════════════════════════════════════════════════════════════════ */
function ticketRows() {
  /* Cada artículo imprime dos renglones: el nombre con cantidad, precio
     unitario y total, y debajo su código, alineado en la columna ARTICULO. */
  return order.items.map((it, i) => {
    const p = CATALOG_BY_ID[it.productId];
    const total = it.price * it.qty;
    const sku = String(27010000000000000 + (i + 1) * 1681754).slice(0, 17);

    return `
      <tr>
        <td>${p.name}</td>
        <td>${it.unit === 'kg' ? it.qty.toFixed(2) : it.qty}</td>
        <td>${it.price.toFixed(2)}</td>
        <td>${total.toFixed(2)}</td>
      </tr>
      <tr><td colspan="4" class="tk-sku">${sku}</td></tr>`;
  }).join('');
}

function ticketHTML() {
  const ventaTotal = order.subtotal + order.envio;
  const totalAhorro = ventaTotal - order.savings;
  const fecha = order.delivery;
  const fechaCorta = `${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}-${String(fecha.getFullYear()).slice(-2)}`;
  const hora12 = (() => {
    const h = fecha.getHours();
    const ampm = h >= 12 ? 'P' : 'A';
    const hh = h % 12 === 0 ? 12 : h % 12;
    return `${hh}:${String(fecha.getMinutes()).padStart(2, '0')}${ampm}`;
  })();

  const folio = order.ticketNumber.replace(/\D/g, '');
  /* El "Numero del pedido" impreso es más largo que el folio del ticket:
     se compone del folio + el consecutivo del pedido, en grupos de 4. */
  const folioLargo = (folio + order.id.replace(/\D/g, '')).slice(0, 23);
  const folioAgrupado = folioLargo.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  const barcodeCode = 'L' + folio.slice(0, 10) + 'B';

  return `
  <div class="ticket" id="ticketPaper">

    <div class="tk-logo">${hebLogoMarkup(126)}</div>

    <div class="tk-sec tk-center">
      <div class="tk-hello">¡Hola Mariana!</div>
      <div class="tk-thanks">Gracias por tu compra en ${order.store.name}</div>
    </div>

    <div class="tk-sec tk-center">
      <div class="tk-label">Numero del pedido</div>
      <div class="tk-folio">${folioAgrupado}</div>
    </div>

    <div class="tk-sec tk-center">
      <div class="tk-phone">Comentarios al: <strong>+52 1 81 8252 8316</strong></div>
    </div>

    <div class="tk-sec tk-items">
      <table class="tk-table">
        <thead>
          <tr>
            <th>ARTICULO</th>
            <th class="tk-col-qty">CANT.</th>
            <th class="tk-col-unit">PRE.UNIT</th>
            <th class="tk-col-tot">TOTAL</th>
          </tr>
        </thead>
        <tbody>${ticketRows()}</tbody>
      </table>
    </div>

    <div class="tk-sec">
      <div class="tk-totals-head">
        <span>Articulos Comprados: ${order.items.length}</span>
        <span>Venta Subtotal <span class="tk-v">${order.subtotal.toFixed(2)}</span></span>
      </div>
      <div class="tk-row"><span>***Venta Total</span><span class="tk-v">${ventaTotal.toFixed(2)}</span></div>
      <div class="tk-row"><span>Descuento</span><span class="tk-v">${order.savings.toFixed(2)}</span></div>
      <div class="tk-row"><span>Total después del Ahorro</span><span class="tk-v">${totalAhorro.toFixed(2)}</span></div>
    </div>

    <div class="tk-sec">
      <div class="tk-pay">
        <span class="tk-k">Forma de pago</span>
        <span class="tk-v">${order.payment.kind} <span class="tk-mask">${order.payment.mask}</span></span>
      </div>
    </div>

    <div class="tk-sec">
      <div class="tk-pay">
        <span class="tk-k">Ahorra con tu App</span>
        <span class="tk-v"><strong>${money(order.savings)}</strong></span>
      </div>
    </div>

    <div class="tk-sec">
      <span class="tk-savings-pill">Hoy Ahorraste: ${money(order.savings)}</span>
    </div>

    <div class="tk-sec">
      <div class="tk-barcode-box">
        ${barcodeSVG(folio, { height: 54, width: 280 })}
        <div class="tk-barcode-text">${barcodeCode}</div>
      </div>
    </div>

    <div class="tk-sec tk-center">
      <div class="tk-caja">Atención en Cajero Autocobro #${String(order.caja).padStart(2, '0')}</div>
    </div>

    <div class="tk-sec">
      <div class="tk-invoice">
        <button type="button" class="tk-invoice-btn" onclick="facturar()">Facturar ticket digital</button>
        <span class="tk-invoice-url">facturacion.heb.com.mx</span>
      </div>
    </div>

    <div class="tk-sec tk-legal">
      <p>SUPERMERCADOS INTERNACIONALES. HEB, SA de CV</p>
      <p>RFC: SIH951127917</p>
      <p>HIDALGO #2405 COL OBISPADO, MONTERREY, N.L. C.P. 64060</p>
      <p>${order.store.name.toUpperCase()}</p>
      <p>${order.store.address}</p>
      <p>General Escobedo N.L. C.P. ${order.store.suc}</p>
      <p>Tel. 8153-9645</p>
      <p>Solicite su factura durante el mes de su compra en</p>
      <p>Servicio al Cliente de cualquier sucursal o en</p>
      <p>www.facturacion.heb.com.mx</p>
      <p>POR SEGURIDAD NO SE ACEPTAN DEVOLUCIONES DE</p>
      <p>MEDICAMENTOS GENERALES Y CONTROLADOS</p>
    </div>

    <div class="tk-sec tk-promo">
      <p>Nueva tarjeta de credito H-E-B AFIRME</p>
      <p>obten un 4% de cashback</p>
      <p>en todas tus compras en H-E-B o heb.com.mx</p>
    </div>

    <div class="tk-sec">
      <div class="tk-afil"># Afil ${order.afiliacion} AMEX 9352331426</div>
      <div class="tk-afil-nums">
        <span>${order.folio}</span>
        <span>${fechaCorta}</span>
        <span>${hora12}</span>
        <span>${order.auth}/${order.caja}/${String(order.cajero).padStart(2, '0')}943</span>
      </div>
    </div>

    <div class="tk-sec">
      ${barcodeSVG(order.id.replace(/\D/g, ''), { height: 42, width: 280 })}
    </div>

  </div>`;
}

function facturar() {
  showToast('Te llevaremos a facturacion.heb.com.mx', 'receipt_long');
}

let ticketRendered = false;

function openTicket() {
  if (!ticketRendered) {
    document.getElementById('ticketNo').textContent = `No. de Ticket ${order.ticketNumber}`;
    document.getElementById('ticketHost').innerHTML = ticketHTML();
    ticketRendered = true;
  }
  openModal('ticketModal', 'ticketOverlay');
}

function closeTicket() {
  closeModal('ticketModal', 'ticketOverlay');
}

/* ── Descarga: se imprime sólo el papel del ticket (Guardar como PDF) ──── */
function downloadTicket() {
  const paper = document.getElementById('ticketPaper');
  if (!paper) return;

  document.getElementById('printRoot').innerHTML = paper.outerHTML;
  document.body.classList.add('printing');
  showToast('Elige “Guardar como PDF” para descargar tu ticket', 'download');

  setTimeout(() => window.print(), 150);
}

window.addEventListener('afterprint', () => {
  document.body.classList.remove('printing');
  document.getElementById('printRoot').innerHTML = '';
});

/* ── Modificar pedido ──────────────────────────────────────────────────── */
document.getElementById('modificarBtn').addEventListener('click', () => {
  showToast('Abriremos tu pedido para editarlo', 'edit');
});

/* ── Init ──────────────────────────────────────────────────────────────── */
renderProgress();
renderHero();
renderProducts();
renderResumen();
