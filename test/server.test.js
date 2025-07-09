const request = require('supertest');
const fetch = require('node-fetch');
const app = require('../server');

jest.mock('node-fetch');

test('POST /api/faq-entry forwards data and returns response', async () => {
  fetch.mockResolvedValue({
    text: () => Promise.resolve('ok'),
  });

  await request(app)
    .post('/api/faq-entry')
    .send({ foo: 'bar' })
    .expect(200, 'ok');

  expect(fetch).toHaveBeenCalledWith(
    'https://procesos.inmovilla.com/peticionesexternas/chatbot/postFaqRapida.php',
    expect.objectContaining({ method: 'POST' })
  );
});
