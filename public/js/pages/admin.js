const kpi = (t, v) => `<div class="bg-white rounded-2xl p-5 shadow-sm"><span class="text-xs uppercase text-gray-500">${t}</span><div class="font-head text-3xl font-extrabold text-primary">${v}</div></div>`;

(async () => {
  const stockEl = document.getElementById('admin-stock') || document.getElementById('stock-list');

  // 1. Obtener la lista de productos (Equipo 1) para traducir los IDs a Nombres
  let productosMap = {};
  try {
    const prods = await window.API.productos.get('/productos');
    if (Array.isArray(prods)) {
      prods.forEach(p => productosMap[Number(p.id)] = p.nombre);
    }
  } catch (e) {
    console.warn('Aviso: No se pudieron obtener los productos de :3002', e);
  }

  // 2. Obtener el inventario (Equipo 3)
  let inv = [];
  try {
    const rawInv = await window.API.inventario.get('/inventario');
    inv = Array.isArray(rawInv) ? rawInv.map(i => {
      const pId = Number(i.productoId !== undefined ? i.productoId : (i.producto_id !== undefined ? i.producto_id : i.id));
      const cant = Number(i.cantidad !== undefined ? i.cantidad : (i.existencia !== undefined ? i.existencia : 0));
      return { productoId: pId, cantidad: cant, nombre: productosMap[pId] || `Producto #${pId}` };
    }) : [];
  } catch (e) {
    console.error('Error al cargar inventario:', e);
  }

  if (stockEl) {
    stockEl.innerHTML = inv.length > 0 ? inv.map(i => `
      <div class="flex justify-between items-center bg-soft rounded-xl p-3 text-sm my-1">
        <span class="font-medium text-gray-700">${i.nombre}</span>
        <b class="${i.cantidad < 5 ? 'text-red-600 font-bold' : 'text-gray-900'}">${i.cantidad} uds</b>
      </div>
    `).join('') : `<p class="text-xs text-gray-400 p-2">Sin registros de inventario.</p>`;
  }

  // --- 3. SECCIÓN DE PEDIDOS ---
  try {
    const pedidos = await window.API.pedidos.get('/pedidos');
    const rawInvForKpi = await window.API.inventario.get('/inventario').catch(() => []);
    const critico = Array.isArray(rawInvForKpi) ? rawInvForKpi.filter(i => (i.cantidad ?? i.existencia ?? 0) < 5) : [];

    const kpisEl = document.getElementById('kpis');
    if (kpisEl) {
      kpisEl.innerHTML = kpi('Pedidos', pedidos.length) 
        + kpi('Pendientes', pedidos.filter(p => !p.pago_id).length)
        + kpi('Stock crítico', critico.length) 
        + kpi('Ventas', window.fmt(pedidos.reduce((a, p) => a + Number(p.monto_total || 0), 0)));
    }

    const ordersEl = document.getElementById('admin-orders');
    if (ordersEl) {
      ordersEl.innerHTML = pedidos.map(o => {
        const estadoCalculado = o.pago_id ? 'PAGADO' : 'PENDIENTE';
        
        // Lógica para mostrar la lista de productos del pedido
        const detalles = o.detalles || o.items || o.productos || [];
        
        let productosHtml = '<span class="text-xs text-gray-400">Sin detalles</span>';
        if (detalles.length > 0) {
          productosHtml = detalles.map(d => {
            const pId = d.producto_id || d.productoId || d.id; 
            const cant = d.cantidad || 1;
            const nombre = productosMap[Number(pId)] || `Prod #${pId}`;
            return `<div class="text-sm text-gray-700">${cant}x ${nombre}</div>`;
          }).join('');
        }

        return `<tr class="border-t">
          <td class="p-2 font-mono">#${o.id}</td>
          <td>${productosHtml}</td>
          <td>${window.fmt(o.monto_total)}</td>
          <td><span class="text-xs bg-soft px-2 py-1 rounded-full font-bold">${estadoCalculado}</span></td>
          <td><button class="bg-soft text-gray-500 text-xs px-3 py-1 rounded-lg" disabled>Ver detalle</button></td>
        </tr>`;
      }).join('');
    }
  } catch (e) {
    const kpisEl = document.getElementById('kpis');
    if (kpisEl && !kpisEl.children.length) {
      kpisEl.innerHTML = typeof window.empty === 'function' ? window.empty('No se pudo cargar pedidos: ' + e.message) : e.message;
    }
  }
})();