const router = require('express').Router();
const services = require('../config/services');
// [ruta, vista, título]
const pages = [
  ['/', 'home', 'Inicio'],
  ['/catalogo', 'catalogo', 'Catálogo'],
  ['/checkout', 'checkout', 'Checkout seguro'],
  ['/mis-pedidos', 'pedidos', 'Mis Pedidos'],
  ['/notificaciones', 'notificaciones', 'Notificaciones'],
  ['/admin', 'admin', 'Panel Admin']
];
pages.forEach(([path, view, title]) =>
  router.get(path, (req, res) => res.render('pages/' + view, { title, active: view, script: view, services })));
module.exports = router;
