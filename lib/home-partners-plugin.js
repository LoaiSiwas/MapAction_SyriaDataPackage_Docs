/**
 * Keep home-page partner logos on one row (Docsify sometimes wraps links in <p> tags).
 */
(function () {
  function isHomeRoute() {
    var hash = (location.hash || '').replace(/^#\/?/, '').split('?')[0];
    return !hash || hash === '/' || hash === 'README' || hash === 'README.md';
  }

  function fixPartnersRow() {
    if (!isHomeRoute()) return;

    var section = document.querySelector('main .markdown-section') || document.querySelector('.markdown-section');
    if (!section) return;

    var imgs = Array.prototype.slice.call(section.querySelectorAll('img[src*="partners/"]'));
    if (!imgs.length) return;

    var row = section.querySelector('.ihdp-partners');
    if (!row) {
      row = document.createElement('div');
      row.className = 'ihdp-partners partner-grid';
    }

    var seen = new Set();
    imgs.forEach(function (img) {
      var link = img.closest('a');
      var node = link || img;
      if (seen.has(node)) return;
      seen.add(node);
      row.appendChild(node);
    });

    var heading = Array.prototype.slice
      .call(section.querySelectorAll('h2, h3'))
      .find(function (h) {
        return /partners/i.test((h.textContent || '').trim());
      });

    if (heading && row.parentElement !== section) {
      heading.insertAdjacentElement('afterend', row);
    } else if (!row.parentElement) {
      section.appendChild(row);
    }

    section.querySelectorAll('p').forEach(function (p) {
      if (p.classList.contains('ihdp-partners-tagline')) return;
      if (!p.querySelector('img[src*="partners/"]') && !p.textContent.trim()) {
        p.remove();
      }
    });
  }

  var plugin = function (hook) {
    hook.doneEach(function () {
      fixPartnersRow();
      requestAnimationFrame(fixPartnersRow);
    });
  };

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], plugin);
})();
