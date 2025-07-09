export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  try {
    const response = await fetch('https://procesos.inmovilla.com/peticionesexternas/chatbot/postFaqRapida.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.text();
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error forwarding request');
  }
}
