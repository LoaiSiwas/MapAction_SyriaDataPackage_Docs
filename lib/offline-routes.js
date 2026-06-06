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

  function getContent(route) {
    if (typeof window.__DOCSIFY_LOOKUP__ === 'function') {
      return window.__DOCSIFY_LOOKUP__(route);
    }
    var bundle = window.__DOCSIFY_CONTENT__;
    if (!bundle) return null;
    var keys = resolveBundleKeys(route);
    for (var i = 0; i < keys.length; i++) {
      if (bundle[keys[i]]) return bundle[keys[i]];
      if (bundle['/' + keys[i]]) return bundle['/' + keys[i]];
    }
    return null;
  }

  window.$docsify = {
    name: 'Syria Data Package',
    loadSidebar: true,
    sidebarDisplayLevel: 1,
    relativePath: false,
    homepage: 'README.md',
    auto2top: true,
    subMaxLevel: 2,
    notFoundPage: [
      '## Page not found',
      '',
      'This page is missing from the offline bundle.',
      '',
      '[Back to home](#/)',
    ].join('\n'),
    alias: {
      '/.*/_sidebar.md': '/_sidebar.md',
      '/layers/?': '/layers/index',
      '/layers': '/layers/index',
    },
    routes: {
      '/': function () {
        return getContent('/');
      },
      '/README': function () {
        return getContent('/README');
      },
      '/README.md': function () {
        return getContent('/README.md');
      },
      '/_sidebar.md': function () {
        return getContent('/_sidebar.md');
      },
      '/(.+)': function (route) {
        var content = getContent(route);
        return content || false;
      },
    },
  };
})();
