(async () => {
  const el = document.getElementById('featured');
  if (!el) return;

  try {
    const list = await API.productos.get('/productos');
    el.innerHTML = list.slice(0, 4).map(p => {
      const imgUrl = p.imagen_url || p.imagen;
      return `
        <a href="/catalogo" class="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
          <div class="aspect-square rounded-xl bg-soft overflow-hidden">
            ${imgUrl ? `<img src="${imgUrl}" class="w-full h-full object-cover" alt="${p.nombre}">` : ''}
          </div>
          <div>
            <b class="block font-bold text-gray-800">${p.nombre}</b>
            <div class="text-primary font-bold mt-1">${fmt(p.precio)}</div>
          </div>
        </a>
      `;
    }).join('');
  } catch { 
    el.innerHTML = empty('Productos no disponibles (:3002).'); 
  }
})();