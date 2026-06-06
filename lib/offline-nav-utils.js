/**
 * Hash-route helpers for Docsify under file:// (no server).
 */
(function () {
  function pathFromFileUrl(href) {
    var s = decodeURI(String(href || '')).replace(/\\/g, '/');
    var layersIdx = s.toLowerCase().indexOf('/layers/');
    if (layersIdx !== -1) return s.slice(layersIdx).replace(/\.md$/i, '');
    var refIdx = s.toLowerCase().indexOf('/reference/');
    if (refIdx !== -1) return s.slice(refIdx).replace(/\.md$/i, '');
    if (/\/readme\.md$/i.test(s)) return '/';
    return null;
  }

  function toHashHref(href) {
    if (!href || /^https?:/i.test(href) || /^mailto:/i.test(href)) return href;
    if (/^file:/i.test(href)) {
      var fromFile = pathFromFileUrl(href);
      if (fromFile) return '#' + (fromFile.charAt(0) === '/' ? fromFile : '/' + fromFile);
    }
    if (href.indexOf('#/') === 0) return href;
    if (href === '/' || href === '' || href === 'index.html' || href === './index.html') {
      return '#/';
    }
    if (href.charAt(0) === '/') return '#' + href;
    if (/\.md$/i.test(href)) return '#/' + href.replace(/\.md$/i, '');
    return '#/' + href.replace(/^\.\//, '');
  }

  function routeFromHashHref(href) {
    if (!href) return '/';
    if (href.indexOf('#/') === 0) return href.slice(1) || '/';
    if (href.charAt(0) === '#') return href.slice(1) || '/';
    if (href.charAt(0) === '/') return href;
    return '/' + href;
  }

  function navigateToRoute(route) {
    var path = route || '/';
    if (path.charAt(0) !== '/') path = '/' + path;
    if (window.Docsify && window.Docsify.vm && window.Docsify.vm.$router) {
      try {
        window.Docsify.vm.$router.to(path);
        return;
      } catch (e) {
        /* fall through to hash */
      }
    }
    window.location.hash = path;
  }

  function fixLinks(root) {
    if (!root) return;
    root.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!h || /^https?:/i.test(h) || /^mailto:/i.test(h)) return;
      var fixed = toHashHref(h);
      if (fixed !== h) a.setAttribute('href', fixed);
    });
  }

  window.__DOCSIFY_NAV__ = {
    toHashHref: toHashHref,
    routeFromHashHref: routeFromHashHref,
    navigateToRoute: navigateToRoute,
    fixLinks: fixLinks,
  };
})();
