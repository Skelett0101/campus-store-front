const kpi = (t, v) => `<div class="bg-white rounded-2xl p-5 shadow-sm"><span class="text-xs uppercase text-gray-500">${t}</span><div class="font-head text-3xl font-extrabold text-primary">${v}</div></div>`;

(async () => {
  const stockEl = document.getElementById('admin-stock') || document.getElementById('stock-list');

  // 1. Obtener la lista de productos desde el microservicio :3002
  let productosMap = {};
  try {
    const prods = await API.productos.get('/productos');
    if (Array.isArray(prods)) {
      prods.forEach(p => { 
        // Aseguramos que la llave sea Number para evitar descalces entre "1" y 1
        productosMap[Number(p.id)] = p.nombre; 
      });
    }
  } catch (e) {
    console.warn('No se pudieron obtener los productos de :3002', e);
  }

  // 2. Obtener el inventario desde :3005
  let inv = [];
  try {
    const rawInv = await API.inventario.get('/inventario');
    inv = Array.isArray(rawInv) ? rawInv.map(i => {
      const pId = Number(i.productoId !== undefined ? i.productoId : (i.producto_id !== undefined ? i.producto_id : i.id));
      const cant = Number(i.cantidad !== undefined ? i.cantidad : (i.existencia !== undefined ? i.existencia : 0));
      return {
        productoId: pId,
        cantidad: cant,
        // Asigna el nombre cruzado desde productosMap
        nombre: productosMap[pId] || `Producto #${pId}`
      };
    }) : [];
  } catch (e) {
    console.error('Error al cargar inventario:', e);
  }

  // 3. Renderizar en la interfaz
  if (stockEl) {
    if (inv.length > 0) {
      stockEl.innerHTML = inv.map(i => `
        <div class="flex justify-between items-center bg-soft rounded-xl p-3 text-sm my-1">
          <span class="font-medium text-gray-700">${i.nombre}</span>
          <b class="${i.cantidad < 5 ? 'text-red-600 font-bold' : 'text-gray-900'}">${i.cantidad} uds</b>
        </div>
      `).join('');
    } else {
      stockEl.innerHTML = `<p class="text-xs text-gray-400 p-2">Sin registros de inventario.</p>`;
    }
  }
  // --- 2. SECCIÓN DE PEDIDOS (INTACTA SIN MODIFICAR) ---
  try {
    const pedidos = await API.pedidos.get('/pedidos');
    const rawInvForKpi = await API.inventario.get('/inventario').catch(() => []);
    const critico = Array.isArray(rawInvForKpi) ? rawInvForKpi.filter(i => (i.cantidad ?? i.existencia ?? 0) < 5) : [];

    const kpisEl = document.getElementById('kpis');
    if (kpisEl) {
      kpisEl.innerHTML = kpi('Pedidos', pedidos.length) 
        + kpi('Pendientes', pedidos.filter(p => p.estado !== 'ENTREGADO').length)
        + kpi('Stock crítico', critico.length) 
        + kpi('Ventas', fmt(pedidos.reduce((a, p) => a + Number(p.total || 0), 0)));
    }

    const ordersEl = document.getElementById('admin-orders');
    if (ordersEl) {
      ordersEl.innerHTML = pedidos.map(o => 
        `<tr class="border-t">
          <td class="p-2 font-mono">#${o.id}</td>
          <td>${o.cliente || o.clienteId}</td>
          <td>${fmt(o.total)}</td>
          <td>${o.estado}</td>
          <td><button data-id="${o.id}" class="deliver bg-primary text-white text-xs px-3 py-1 rounded-lg">Entregar</button></td>
        </tr>`
      ).join('');
    }
  } catch (e) {
    const kpisEl = document.getElementById('kpis');
    if (kpisEl && !kpisEl.children.length) {
      kpisEl.innerHTML = typeof empty === 'function' ? empty('No se pudo cargar pedidos: ' + e.message) : e.message;
    }
  }
})();

// Evento listener de Entregar Pedidos intacto
document.addEventListener('click', async e => {
  const b = e.target.closest('.deliver'); if (!b) return;
  await API.pedidos.put(`/pedidos/${b.dataset.id}`, { estado: 'ENTREGADO' });
  b.textContent = '✓';
});