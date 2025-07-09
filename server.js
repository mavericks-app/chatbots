const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/faq-entry', async (req, res) => {
  try {
    const response = await fetch('https://procesos.inmovilla.com/peticionesexternas/chatbot/postFaqRapida.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await response.text();
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error forwarding request');
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
