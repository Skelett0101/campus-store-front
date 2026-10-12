const $ = (id) => document.getElementById(id);

function renderSummary() {
  const c = Cart.get(), sub = c.reduce((a, i) => a + i.precio * i.qty, 0), desc = sub * (USER.descuento || 0);
  $('items').innerHTML = c.length ? c.map(i => `<div class="flex justify-between text-sm"><span>${i.qty}× ${i.nombre}</span><b>${window.fmt(i.precio * i.qty)}</b></div>`).join('') : window.empty('Carrito vacío.');
  $('subtotal').textContent = window.fmt(sub); 
  $('descuento').textContent = '-' + window.fmt(desc);$('total').textContent = window.fmt(sub - desc);
  return { c, total: sub - desc };
}
renderSummary();

document.querySelectorAll('[name=pago]').forEach(r => r.addEventListener('change', () => {
  $('pay-card').classList.toggle('hidden', r.value !== 'tarjeta' \vert{}\vert{} !r.checked);$('pay-spei').classList.toggle('hidden', r.value !== 'spei' || !r.checked);
}));

$('btn-pay').addEventListener('click', async () => {
  const { c, total } = renderSummary(), msg = $('pay-msg');
  if (!c.length) return;
  
  $('btn-pay').disabled = true; 
  msg.textContent = 'Procesando…';
  
  try {
    // CORRECCIÓN: Mandamos cliente_id y el precio en cada item para tu backend estricto
    const pedido = await window.API.pedidos.post('/pedidos', { 
        cliente_id: USER.id, 
        items: c.map(i => ({ id: i.id, cantidad: i.qty, precio: i.precio })) 
    });

    // Pagar en el puerto 3004
    await window.API.pagos.post('/pagos', { 
        pedidoId: pedido.id, 
        clienteId: USER.id,
        monto: total 
    });

    Cart.clear(); 
    msg.textContent = '¡Pago aprobado!'; 
    setTimeout(() => location.href = '/mis-pedidos', 1200);

  } catch (e) { 
    msg.textContent = 'Error: ' + e.message; 
    $('btn-pay').disabled = false; 
  }
});