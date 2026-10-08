(async () => {
  const el = document.getElementById('orders');
  try {
    const list = await window.API.pedidos.get(`/pedidos?cliente_id=${USER.id}`);
    
    el.innerHTML = list.length ? list.map(o => {
      // Calculamos el estado dinámicamente ya que la BD ya no tiene columna "estado"
      const estadoCalculado = o.pago_id ? 'PAGADO' : 'PENDIENTE';
      const fechaFormateada = new Date(o.fecha_creacion).toLocaleDateString();

      return `<div class="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
        <div>
          <b class="font-mono text-primary">#${o.id}</b>
          <div class="text-xs text-gray-500">${fechaFormateada}</div>
        </div>
        <span class="text-xs bg-soft px-3 py-1 rounded-full font-bold">${estadoCalculado}</span>
        <b>${window.fmt(o.monto_total)}</b>
      </div>`;
    }).join('') : window.empty('Aún no tienes pedidos.');
    
  } catch { 
    el.innerHTML = window.empty('No se pudieron cargar los pedidos del Equipo 2 (:3003).'); 
  }
})();