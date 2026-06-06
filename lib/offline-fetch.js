/**
 * Serve all local .md requests from the content bundle (file:// blocks real XHR/fetch).
 */
(function () {
  function normalizeRoute(route) {
    if (!route) return '/';
    var path = String(route).split('#')[0].split('?')[0];
    if (path.indexOf('.md') !== -1 && path.charAt(0) !== '/') {
      path = '/' + path;
    }
    return path || '/';
  }

  function resolveBundleKeys(route) {
    var path = normalizeRoute(route);
    if (path === '/' || path === '/README' || path === '/README.md') {
      return ['README.md'];
    }
    var r = path.replace(/^\//, '').replace(/\/+$/, '');
    if (!r) return ['README.md'];
    if (r === '_sidebar.md' || r.slice(-11) === '/_sidebar.md') {
      return ['_sidebar.md'];
    }
    if (r.slice(-3) === '.md') return [r];
    return [r + '.md', r + '/index.md', r + '/README.md'];
  }

  function lookupBundle(urlOrRoute) {
    var bundle = window.__DOCSIFY_CONTENT__;
    if (!bundle) return null;

    var s = decodeURI(String(urlOrRoute || '')).split('?')[0].split('#')[0];
    var path = s;

    var marker = 'docsify-offline/';
    var idx = s.toLowerCase().indexOf(marker);
    if (idx !== -1) {
      path = '/' + s.slice(idx + marker.length).replace(/\\/g, '/');
    } else if (/^file:/i.test(s)) {
      var normalized = decodeURI(s).replace(/^file:\/\//i, '').replace(/\\/g, '/');
      var layersIdx = normalized.toLowerCase().indexOf('/layers/');
      var refIdx = normalized.toLowerCase().indexOf('/reference/');
      if (layersIdx !== -1) {
        path = normalized.slice(layersIdx);
      } else if (refIdx !== -1) {
        path = normalized.slice(refIdx);
      } else if (/\/readme\.md$/i.test(normalized)) {
        path = '/README.md';
      } else if (/\/_sidebar\.md$/i.test(normalized)) {
        path = '/_sidebar.md';
      } else {
        var parts = normalized.split('/');
        var file = parts[parts.length - 1] || '';
        if (file.endsWith('.md')) path = '/' + file;
      }
    } else if (s.charAt(0) === '/') {
      path = s;
    } else if (s && s.indexOf('/') === -1 && !s.endsWith('.md')) {
      path = '/' + s;
    }

    var keys = resolveBundleKeys(path);
    for (var i = 0; i < keys.length; i++) {
      if (bundle[keys[i]]) return bundle[keys[i]];
      if (bundle['/' + keys[i]]) return bundle['/' + keys[i]];
    }
    return null;
  }

  window.__DOCSIFY_LOOKUP__ = lookupBundle;

  var xhrOpen = XMLHttpRequest.prototype.open;
  var xhrSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__offlineUrl = url;
    return xhrOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    var content = lookupBundle(this.__offlineUrl);
    if (content != null) {
      var xhr = this;
      setTimeout(function () {
        xhr.readyState = 4;
        xhr.status = 200;
        xhr.response = content;
        xhr.responseText = content;
        if (typeof xhr.onreadystatechange === 'function') xhr.onreadystatechange();
        if (typeof xhr.onload === 'function') xhr.onload();
      }, 0);
      return;
    }
    return xhrSend.apply(this, arguments);
  };

  if (typeof window.fetch === 'function') {
    var nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : input && input.url;
      var content = lookupBundle(url);
      if (content != null) {
        return Promise.resolve(
          new Response(content, {
            status: 200,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        );
      }
      return nativeFetch(input, init);
    };
  }
})();
