const http = require('http');
const express = require('express');
// Prefer the built-in fetch when available to reduce dependencies
// and fall back to the node-fetch package for older Node versions
const fetch = global.fetch || require('node-fetch');
const cors = require('cors');

async function handleFaqEntry(req, res) {
  const data = req.body || {};
  try {
    const response = await fetch('https://procesos.inmovilla.com/peticionesexternas/chatbot/n8n/postFaqRapida.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const text = await response.text();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(text);
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end('Error forwarding request');
  }
}

const app = express();
app.use(cors());
app.use(express.json());

app.get(['/proxy/inmovilla', '/api/proxy/inmovilla'], async (req, res) => {
  try {
    const response = await fetch('https://api.inmovilla.com/v3/bot/test');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la API de Inmovilla' });
  }
});

app.all(['/proxy/inmovilla', '/api/proxy/inmovilla'], async (req, res) => {
  try {
    const target = req.query.target;
    if (!target) {
      return res.status(400).json({ error: 'Falta el parámetro target' });
    }
    const method = req.method;
    const headers = { ...req.headers };
    delete headers['host'];
    delete headers['origin'];
    delete headers['referer'];
    const options = {
      method,
      headers,
    };
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      options.body = JSON.stringify(req.body);
    }
    const response = await fetch(target, options);
    const contentType = response.headers.get('content-type');
    res.set('content-type', contentType);
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la API de Inmovilla' });
  }
});

app.post('/api/faq-entry', handleFaqEntry);

const httpServer = http.createServer(app);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
