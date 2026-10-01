(async () => {
  const el = document.getElementById('notifs');
  try {
    const list = await API.notificaciones.get(`/notificaciones?clienteId=${USER.id}`); // TODO: endpoint
    el.innerHTML = list.length ? list.map(n => `<div class="bg-white rounded-xl p-4 shadow-sm"><b>${n.titulo}</b><p class="text-sm text-gray-600">${n.mensaje}</p></div>`).join('') : empty('Sin notificaciones.');
  } catch { el.innerHTML = empty('Servicio de notificaciones no disponible (:3006).'); }
})();
