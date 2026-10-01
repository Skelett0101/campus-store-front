const $ = (id) => document.getElementById(id);
function renderSummary() {
  const c = Cart.get(), sub = c.reduce((a, i) => a + i.precio * i.qty, 0), desc = sub * (USER.descuento || 0);
  $('items').innerHTML = c.length ? c.map(i => `<div class="flex justify-between text-sm"><span>${i.qty}× ${i.nombre}</span><b>${fmt(i.precio * i.qty)}</b></div>`).join('') : empty('Carrito vacío.');
  $('subtotal').textContent = fmt(sub); $('descuento').textContent = '-' + fmt(desc); $('total').textContent = fmt(sub - desc);
  return { c, total: sub - desc };
}
renderSummary();

document.querySelectorAll('[name=pago]').forEach(r => r.addEventListener('change', () => {
  $('pay-card').classList.toggle('hidden', r.value !== 'tarjeta' || !r.checked);
  $('pay-spei').classList.toggle('hidden', r.value !== 'spei' || !r.checked);
}));

$('btn-pay').addEventListener('click', async () => {
  const { c, total } = renderSummary(), msg = $('pay-msg');
  if (!c.length) return;
  $('btn-pay').disabled = true; msg.textContent = 'Procesando…';
  try {
    const entrega = document.querySelector('[name=entrega]:checked').value;
    const metodo = document.querySelector('[name=pago]:checked').value;
    // 1) Crear pedido (pedidos :3003) — TODO: ajustar payload
    const pedido = await API.pedidos.post('/pedidos', { clienteId: USER.id, entrega, items: c.map(i => ({ productoId: i.id, cantidad: i.qty })) });
    // 2) Pagar (pagos :3004) — TODO: ajustar payload
    await API.pagos.post('/pagos', { pedidoId: pedido.id, metodo, monto: total });
    // inventario y notificaciones los dispara el backend (:3005 / :3006)
    Cart.clear(); msg.textContent = '¡Pago aprobado!'; setTimeout(() => location.href = '/mis-pedidos', 1200);
  } catch (e) { msg.textContent = 'Error: ' + e.message; $('btn-pay').disabled = false; }
});
