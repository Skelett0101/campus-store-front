// Cliente único para TODOS los microservicios: API.<servicio>.get('/ruta')
async function request(svc, path, method = 'GET', body) {
  const res = await fetch(`/api/${svc}${path}`, {
    method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`${svc} ${method} ${path} → ${res.status}`);
  return res.status === 204 ? null : res.json();
}
const client = (svc) => ({
  get: (p) => request(svc, p), post: (p, b) => request(svc, p, 'POST', b),
  put: (p, b) => request(svc, p, 'PUT', b), del: (p) => request(svc, p, 'DELETE')
});
window.API = Object.fromEntries(['clientes','productos','pedidos','pagos','inventario','notificaciones'].map(s => [s, client(s)]));

window.fmt = (n) => '$' + Number(n || 0).toFixed(2);
window.empty = (msg) => `<p class="text-sm text-gray-500 p-4">${msg}</p>`;
window.Cart = {
  get: () => JSON.parse(localStorage.getItem('cart') || '[]'),
  set(c) { localStorage.setItem('cart', JSON.stringify(c)); document.dispatchEvent(new Event('cart')); },
  add(p) { const c = this.get(), i = c.find(x => x.id === p.id); i ? i.qty++ : c.push({ ...p, qty: 1 }); this.set(c); },
  clear() { this.set([]); }
};
// TODO (clientes :3001): reemplazar por la sesión real
window.USER = JSON.parse(localStorage.getItem('user') || '{"id":1,"nombre":"Sofía Ramírez","facultad":"Ingeniería","descuento":0.10}');
