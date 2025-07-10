export default async function handler(req, res) {
  const target = req.query.target;
  if (!target) {
    res.status(400).json({ error: 'Falta el parámetro target' });
    return;
  }
  const method = req.method;
  const headers = { ...req.headers };
  delete headers.host;
  delete headers.origin;
  delete headers.referer;
  const options = { method, headers };
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    options.body = JSON.stringify(req.body);
  }
  try {
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

    res.status(response.status).json({
      data,
      meta: {
        method,
        target,
        status: response.status,
        durationMs,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al conectar con la API de Inmovilla' });
  }
}
