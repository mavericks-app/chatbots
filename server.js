const http = require('http');
const express = require('express');
// Prefer the built-in fetch when available to reduce dependencies
// and fall back to the node-fetch package for older Node versions
const fetch = global.fetch || require('node-fetch');
let cors;
try {
  cors = require('cors');
} catch {
  cors = () => (req, res, next) => next();
}

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
    const start = Date.now();
    const response = await fetch('https://api.inmovilla.com/v3/bot/test');
    const durationMs = Date.now() - start;
    const data = await response.json();
    const peticion = {
      method: 'GET',
      target: 'https://api.inmovilla.com/v3/bot/test',
      status: response.status,
      durationMs,
    };
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      res.status(response.status).json({ ...data, peticion });
    } else {
      res.status(response.status).json({ data, peticion });
    }
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
    const start = Date.now();
    const response = await fetch(target, options);
    const durationMs = Date.now() - start;

    const contentType = response.headers.get('content-type') || '';
    let data;
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    const peticion = { method, target, status: response.status, durationMs };
    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      res.status(response.status).json({ ...data, peticion });
    } else {
      res.status(response.status).json({ data, peticion });
    }
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
