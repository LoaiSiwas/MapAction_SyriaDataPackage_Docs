/**
 * Fix in-page markdown links on file:// (Overview layer list, cross-links, etc.).
 */
(function () {
  var nav = window.__DOCSIFY_NAV__;
  if (!nav) return;

  function onContentClick(e) {
    var a = e.target.closest('.markdown-section a[href]');
    if (!a) return;

    var href = a.getAttribute('href');
    if (!href || /^https?:/i.test(href) || /^mailto:/i.test(href)) return;

    var hashHref = nav.toHashHref(href);
    if (hashHref.indexOf('#/') !== 0 && hashHref !== '#/') return;

    e.preventDefault();
    e.stopImmediatePropagation();
    nav.navigateToRoute(nav.routeFromHashHref(hashHref));
  }

  function fixMainContentLinks() {
    var section = document.querySelector('main .markdown-section') || document.querySelector('.markdown-section');
    if (section) nav.fixLinks(section);
  }

  var plugin = function (hook) {
    hook.doneEach(fixMainContentLinks);
    hook.mounted(function () {
      document.addEventListener('click', onContentClick, true);
      fixMainContentLinks();
    });
  };

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], plugin);
})();
