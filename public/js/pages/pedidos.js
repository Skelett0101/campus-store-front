(async () => {
  const el = document.getElementById('orders');
  try {
    const list = await API.pedidos.get(`/pedidos?clienteId=${USER.id}`); // TODO: endpoint
    el.innerHTML = list.length ? list.map(o => `<div class="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
      <div><b class="font-mono text-primary">#${o.id}</b><div class="text-xs text-gray-500">${o.fecha || ''}</div></div>
      <span class="text-xs bg-soft px-3 py-1 rounded-full font-bold">${o.estado}</span><b>${fmt(o.total)}</b></div>`).join('') : empty('Aún no tienes pedidos.');
  } catch { el.innerHTML = empty('No se pudieron cargar los pedidos (:3003).'); }
})();
