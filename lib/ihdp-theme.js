/** Theme toggle control — registers before Docsify boots. */
(function () {
  var KEY = 'ihdp-docsify-theme';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    var btn = document.getElementById('ihdp-theme-toggle');
    if (btn) {
      var dark = theme === 'dark';
      btn.textContent = dark ? 'Light mode' : 'Dark mode';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  function ensureToggle() {
    if (document.getElementById('ihdp-theme-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'ihdp-theme-toggle';
    btn.type = 'button';
    btn.className = 'ihdp-theme-toggle';
    btn.setAttribute('aria-label', 'Toggle color theme');
    btn.addEventListener('click', function () {
      var next =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
    document.body.appendChild(btn);
    var current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }

  var plugin = function (hook) {
    hook.mounted(ensureToggle);
  };

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], plugin);
})();
