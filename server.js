const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('./src/config/services');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// /api/<servicio>/* -> microservicio (el proxy va ANTES de express.json)
for (const [name, s] of Object.entries(services)) {
  app.use(`/api/${name}`, createProxyMiddleware({
    target: s.url, changeOrigin: true, pathRewrite: { [`^/api/${name}`]: '' }
  }));
}
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./src/routes/pages'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Front Campus Store en http://localhost:${PORT}`));
r
