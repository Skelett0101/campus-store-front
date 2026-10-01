document.getElementById('user-name').textContent = USER.nombre;
document.getElementById('user-fac').textContent = 'Fac. ' + USER.facultad;
const upd = () => document.getElementById('cart-count').textContent = Cart.get().reduce((a, i) => a + i.qty, 0);
upd(); document.addEventListener('cart', upd);

// Semáforo de microservicios (502 del proxy = caído)
(async () => {
  const box = document.getElementById('svc-status'); if (!box) return;
  for (const [name, port] of Object.entries(SERVICES)) {
    let ok = false; try { ok = (await fetch(`/api/${name}/health`)).status < 500; } catch {}
    box.insertAdjacentHTML('beforeend', `<span class="px-2 py-1 rounded-full bg-soft ${ok ? 'text-emerald-700' : 'text-red-600'}">:${port} ${name.slice(0,4).toUpperCase()}</span>`);
  }
})();
