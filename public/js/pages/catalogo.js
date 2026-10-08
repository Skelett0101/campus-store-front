let productos = [], stock = {}, cat = '';
const $ = (id) => document.getElementById(id);

const card = (p) => `<article class="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-2">
 <div class="aspect-square rounded-xl bg-soft overflow-hidden">${p.imagen ? `<img src="${p.imagen}" class="w-full h-full object-cover">` : ''}</div>
 ${p.categoria ? `<span class="text-xs uppercase text-gray-500">${p.categoria}</span>` : ''}
 <h3 class="font-bold">${p.nombre}</h3>
 <p class="text-xs text-gray-500">${p.descripcion || ''}</p>
 ${stock[p.id] !== undefined ? `<span class="text-xs ${stock[p.id] > 0 ? 'text-emerald-700' : 'text-red-600'}">${stock[p.id]} uds</span>` : ''}
 <div class="flex justify-between items-center mt-auto"><b class="text-xl text-primary">${fmt(p.precio)}</b>
 <button data-id="${p.id}" class="add w-10 h-10 rounded-full bg-primary text-white"><span class="material-symbols-outlined">add_shopping_cart</span></button></div></article>`;

function render() {
  const q = $('f-search').value.toLowerCase(), sort = $('f-sort').value;
  let l = productos.filter(p => (!cat || p.categoria === cat) && p.nombre.toLowerCase().includes(q) && (!$('f-stock').checked || stock[p.id] > 0));
  if (sort) l.sort((a, b) => sort === 'asc' ? a.precio - b.precio : b.precio - a.precio);
  $('count').textContent = `(${l.length})`;
  $('grid').innerHTML = l.length ? l.map(card).join('') : empty('Sin resultados.');
}

(async () => {
  try { productos = await API.productos.get('/productos'); }
  catch (e) { console.warn(e); $('grid').innerHTML = empty('No se pudo cargar el catálogo.'); return; }
  try { (await API.inventario.get('/inventario')).forEach(i => stock[i.productoId] = i.cantidad); }
  catch { console.warn('Inventario aún no disponible'); }
  const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
  $('f-categorias').innerHTML = cats.length ? ['', ...cats].map(c => `<button data-c="${c}" class="cat block w-full text-left px-2 py-1 rounded hover:bg-line">${c || 'Todas'}</button>`).join('') : '';
  render();
})();

document.addEventListener('click', e => {
  const a = e.target.closest('.add'); if (a) Cart.add(productos.find(p => String(p.id) === a.dataset.id));
  const c = e.target.closest('.cat'); if (c) { cat = c.dataset.c; render(); }
});
['f-search', 'f-sort', 'f-stock'].forEach(id => $(id).addEventListener('input', render));
