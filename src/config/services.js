require('dotenv').config();

module.exports = {
  clientes: {
    url: process.env.URL_CLIENTES || 'http://localhost:3001'
  },
  productos: {
    url: process.env.URL_PRODUCTOS || 'http://localhost:3002'
  },
  pedidos: {
    url: process.env.URL_PEDIDOS || 'http://localhost:4001'
  },
  inventario: {
    url: process.env.URL_INVENTARIO || 'http://localhost:4002'
  },
  pagos: {
    url: process.env.URL_PAGOS || 'http://localhost:5001'
  },
  notificaciones: {
    url: process.env.URL_NOTIFICACIONES || 'http://localhost:5002'
  }
};