(function() {
  const APP_VERSION = '1.0.0';
  const style = document.createElement('style');
  style.textContent = '.version-info{position:fixed;bottom:5px;left:5px;font-size:10px;color:#555;}';
  document.head.appendChild(style);
  function addVersionInfo() {
    const info = document.createElement('div');
    info.className = 'version-info';
    const date = new Date(document.lastModified);
    info.textContent = 'v' + APP_VERSION + ' - ' + date.toLocaleString();
    document.body.appendChild(info);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addVersionInfo);
  } else {
    addVersionInfo();
  }
})();
