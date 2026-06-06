/** Apply saved theme before first paint (default: light). */
(function () {
  var KEY = 'ihdp-docsify-theme';
  var stored = localStorage.getItem(KEY);
  var theme = stored === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();
