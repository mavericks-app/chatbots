const http = require('http');

async function handleFaqEntry(req, res) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  const data = body ? JSON.parse(body) : {};
  try {
    const response = await fetch('https://procesos.inmovilla.com/peticionesexternas/chatbot/postFaqRapida.php', {
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

const app = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/faq-entry') {
    handleFaqEntry(req, res);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
