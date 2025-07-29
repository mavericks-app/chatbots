const assert = require('assert');
const appFactory = () => require('../server');

async function testApi() {
  let capturedArgs;
  const mockFetch = async (...args) => {
    capturedArgs = args;
    return {
      text: async () => 'ok'
    };
  };

  // Replace global fetch with a mock so server.js uses it
  const originalFetch = global.fetch;
  global.fetch = mockFetch;

  const app = appFactory();
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const res = await originalFetch(`http://localhost:${port}/api/faq-entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foo: 'bar' })
    });
    const text = await res.text();

    assert.strictEqual(res.status, 200);
    assert.strictEqual(text, 'ok');
    assert.strictEqual(capturedArgs[0], 'https://procesos.inmovilla.com/peticionesexternas/chatbot/n8n/postFaqRapida.php');
    assert.strictEqual(capturedArgs[1].method, 'POST');
    console.log('✓ POST /api/faq-entry');
  } finally {
    global.fetch = originalFetch;
    server.close();
  }
}

(async () => {
  try {
    await testApi();
    console.log('All tests passed');
  } catch (err) {
    console.error('Test failed');
    console.error(err);
    process.exit(1);
  }
})();
