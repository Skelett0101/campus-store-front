# Campus Store — Front principal
```
npm install && cp .env.example .env && npm run dev   # http://localhost:3000
```
El front llama a `/api/<servicio>/...` y el proxy de `server.js` lo reenvía:
clientes :3001 · productos :3002 · pedidos :3003 · pagos :3004 · inventario :3005 · notificaciones :3006
Busca `TODO` en `public/js/pages/*.js` para ajustar endpoints y campos. Cada `SLOT` en `src/views/pages/*.ejs` es un apartado a rellenar.
