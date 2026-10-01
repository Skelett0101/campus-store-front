const kpi = (t, v) => `<div class="bg-white rounded-2xl p-5 shadow-sm"><span class="text-xs uppercase text-gray-500">${t}</span><div class="font-head text-3xl font-extrabold text-primary">${v}</div></div>`;
(async () => {
  try {
    const pedidos = await API.pedidos.get('/pedidos');        // TODO: endpoint
    const inv = await API.inventario.get('/inventario');      // TODO: endpoint
    const critico = inv.filter(i => i.cantidad < 5);
    document.getElementById('kpis').innerHTML = kpi('Pedidos', pedidos.length) + kpi('Pendientes', pedidos.filter(p => p.estado !== 'ENTREGADO').length)
      + kpi('Stock crítico', critico.length) + kpi('Ventas', fmt(pedidos.reduce((a, p) => a + Number(p.total || 0), 0)));
    document.getElementById('admin-orders').innerHTML = pedidos.map(o => `<tr class="border-t"><td class="p-2 font-mono">#${o.id}</td><td>${o.cliente || o.clienteId}</td><td>${fmt(o.total)}</td><td>${o.estado}</td>
      <td><button data-id="${o.id}" class="deliver bg-primary text-white text-xs px-3 py-1 rounded-lg">Entregar</button></td></tr>`).join('');
    document.getElementById('admin-stock').innerHTML = inv.map(i => `<div class="flex justify-between bg-soft rounded-xl p-3 text-sm"><span>${i.nombre || i.productoId}</span><b class="${i.cantidad < 5 ? 'text-red-600' : ''}">${i.cantidad}</b></div>`).join('');
  } catch (e) { document.getElementById('kpis').innerHTML = empty('No se pudo cargar el panel: ' + e.message); }
})();
document.addEventListener('click', async e => {
  const b = e.target.closest('.deliver'); if (!b) return;
  await API.pedidos.put(`/pedidos/${b.dataset.id}`, { estado: 'ENTREGADO' }); // TODO: endpoint
  b.textContent = '✓';
});
