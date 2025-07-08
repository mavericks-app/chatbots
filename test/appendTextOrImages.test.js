const { JSDOM } = require('jsdom');
const appendTextOrImages = require('../appendTextOrImages');

test('replaces academy URL with link text', () => {
  const dom = new JSDOM('<div id="root"></div>');
  const el = dom.window.document.getElementById('root');
  appendTextOrImages(el, 'hola https://academy.inmovilla.com/foo bar');
  const a = el.querySelector('a');
  expect(a).not.toBeNull();
  expect(a.href).toBe('https://academy.inmovilla.com/foo');
  expect(a.textContent).toBe('link');
  expect(a.target).toBe('_blank');
});

test('wraps image URL in anchor with img element', () => {
  const dom = new JSDOM('<div id="root"></div>');
  const el = dom.window.document.getElementById('root');
  appendTextOrImages(el, 'hola https://example.com/image.png');
  const a = el.querySelector('a');
  expect(a).not.toBeNull();
  expect(a.href).toBe('https://example.com/image.png');
  expect(a.target).toBe('_blank');
  expect(a.getAttribute('rel')).toBe('noopener noreferrer');
  const img = a.querySelector('img');
  expect(img).not.toBeNull();
  expect(img.src).toBe('https://example.com/image.png');
});
