(async () => {
  const el = document.getElementById('notifs');
  if (!el) return;

  // Revisa si existe la variable global de usuario o un fallback por defecto
  const clienteId = typeof USER !== 'undefined' && USER && USER.id ? USER.id : 1;

  try {
    // 1. Obtener notificaciones del cliente desde el microservicio (:3006)
    const list = await API.notificaciones.get(`/notificaciones?clienteId=${clienteId}`);

    if (!list || list.length === 0) {
      el.innerHTML = typeof empty === 'function' 
        ? empty('Sin notificaciones por el momento.') 
        : '<p class="text-gray-500 text-center py-8">Sin notificaciones por el momento.</p>';
      return;
    }

    // 2. Renderizar tarjetas de notificaciones
    el.innerHTML = list.map(n => {
      const fechaFormateada = n.fecha ? new Date(n.fecha).toLocaleString('es-MX') : '';
      const bgEstado = n.leida ? 'bg-white border-gray-100 opacity-80' : 'bg-blue-50/60 border-blue-200';
      
      return `
        <article class="${bgEstado} border rounded-2xl p-4 shadow-sm flex flex-col gap-2 transition-all">
          <div class="flex justify-between items-start gap-2">
            <h3 class="font-bold text-gray-800">${n.titulo || 'Notificación'}</h3>
            ${!n.leida ? '<span class="inline-block w-2.5 h-2.5 bg-primary rounded-full" title="No leída"></span>' : ''}
          </div>
          <p class="text-sm text-gray-600">${n.mensaje}</p>
          <div class="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span class="uppercase tracking-wider font-medium text-gray-500">${n.tipo.replace(/_/g, ' ')}</span>
            <time>${fechaFormateada}</time>
          </div>
        </article>
      `;
    }).join('');

    // 3. Marcar las notificaciones personales como leídas en segundo plano
    API.notificaciones.patch(`/notificaciones/leidas?clienteId=${clienteId}`)
      .catch(err => console.warn('No se pudieron marcar como leídas:', err));

  } catch (err) {
    console.error('Error cargando notificaciones:', err);
    el.innerHTML = typeof empty === 'function' 
      ? empty('Servicio de notificaciones no disponible (:3006).') 
      : '<p class="text-red-500 text-center py-8">Servicio de notificaciones no disponible (:3006).</p>';
  }
})();