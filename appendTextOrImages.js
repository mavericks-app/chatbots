(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.appendTextOrImages = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  function appendTextOrImages(el, text) {
    const regex = /(https?:\/\/academy\.inmovilla\.com\/\S+)|(https?:\/\/\S+\.(?:png|jpe?g|gif|webp))/gi;
    let last = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) {
        el.appendChild(document.createTextNode(text.slice(last, match.index)));
      }
      const url = match[0];
      if (match[1]) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = 'text-blue-500 underline';
        a.textContent = 'link';
        el.appendChild(a);
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        const img = document.createElement('img');
        img.src = url;
        img.className = 'inline-block max-w-xs rounded-lg cursor-pointer';
        a.appendChild(img);
        el.appendChild(a);
      }
      last = match.index + url.length;
    }
    if (last < text.length) {
      el.appendChild(document.createTextNode(text.slice(last)));
    }
  }
  return appendTextOrImages;
}));
