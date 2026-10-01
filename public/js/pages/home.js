(async () => {
  const el = document.getElementById('featured');
  try {
    const list = await API.productos.get('/productos?destacados=true'); // TODO: endpoint real
    el.innerHTML = list.slice(0, 4).map(p => `<a href="/catalogo" class="bg-white rounded-2xl p-4 shadow-sm"><b>${p.nombre}</b><div class="text-primary font-bold">${fmt(p.precio)}</div></a>`).join('');
  } catch { el.innerHTML = empty('Productos no disponibles (:3002).'); }
})();
