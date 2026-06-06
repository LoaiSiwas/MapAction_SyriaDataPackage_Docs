/**
 * Force-render sidebar from embedded #_sidebar markdown (file:// often skips fetch).
 * Supports collapsible Vector / Raster folders and hash-based navigation.
 */
(function () {
  function getSidebarMarkdown() {
    var el = document.getElementById('_sidebar');
    if (el && el.textContent.trim()) return el.textContent.trim();
    var bundle = window.__DOCSIFY_CONTENT__;
    return bundle && bundle['_sidebar.md'] ? bundle['_sidebar.md'] : '';
  }

  var navUtil = window.__DOCSIFY_NAV__;

  function toHashHref(href) {
    return navUtil ? navUtil.toHashHref(href) : href;
  }

  function fixSidebarLinks(nav) {
    if (navUtil) navUtil.fixLinks(nav);
  }

  function parseSidebarTree(md) {
    var root = { children: [] };
    var stack = [{ indent: -1, node: root }];

    md.split('\n').forEach(function (raw) {
      if (!raw.trim()) return;
      var indent = raw.match(/^(\s*)/)[1].length;
      var t = raw.trim();

      var item = null;
      var link = t.match(/^-+\s+\[([^\]]+)\]\(([^)]+)\)/);
      if (link) {
        item = { type: 'link', text: link[1], href: link[2] };
      } else {
        var folder = t.match(/^-+\s+(.+)$/);
        if (folder) {
          item = { type: 'folder', text: folder[1].replace(/\*\*/g, ''), children: [] };
        }
      }
      if (!item) return;

      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }
      var parent = stack[stack.length - 1].node;
      parent.children.push(item);
      if (item.type === 'folder') {
        stack.push({ indent: indent, node: item });
      }
    });

    return root;
  }

  function renderTree(node) {
    var html = '<ul>';
    (node.children || []).forEach(function (ch) {
      if (ch.type === 'link') {
        html += '<li><a href="' + toHashHref(ch.href) + '">' + ch.text + '</a></li>';
      } else if (ch.type === 'folder') {
        html +=
          '<li class="folder open"><p class="sidebar-folder-title">' +
          ch.text +
          '</p>' +
          renderTree(ch) +
          '</li>';
      }
    });
    return html + '</ul>';
  }

  function markdownSidebarToHtml(md) {
    return renderTree(parseSidebarTree(md));
  }

  function initSidebarCollapse(nav) {
    nav.querySelectorAll('li.folder').forEach(function (folder) {
      if (folder.dataset.collapseBound) return;
      folder.dataset.collapseBound = '1';

      var title = folder.querySelector(':scope > p, :scope > .sidebar-folder-title');
      if (title) {
        title.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          folder.classList.toggle('open');
        });
        return;
      }

      folder.addEventListener('click', function (e) {
        if (e.target.closest('a[href^="#/"]')) return;
        folder.classList.toggle('open');
      });
    });
  }

  function renderSidebarNav() {
    var md = getSidebarMarkdown();
    if (!md) return false;

    var nav =
      document.querySelector('aside.sidebar .sidebar-nav') ||
      document.querySelector('.sidebar-nav');
    if (!nav) return false;

    if (window.Docsify && window.Docsify.compiler && window.Docsify.compiler.compile) {
      try {
        nav.innerHTML = window.Docsify.compiler.compile(md);
      } catch (e) {
        nav.innerHTML = markdownSidebarToHtml(md);
      }
    } else {
      nav.innerHTML = markdownSidebarToHtml(md);
    }

    fixSidebarLinks(nav);
    initSidebarCollapse(nav);

    nav.querySelectorAll('li.folder').forEach(function (folder) {
      if (!folder.classList.contains('open')) folder.classList.add('open');
    });

    return !!nav.querySelector('a[href^="#/"]');
  }

  var plugin = function (hook) {
    hook.mounted(function () {
      if (renderSidebarNav()) return;
      setTimeout(renderSidebarNav, 50);
      setTimeout(renderSidebarNav, 200);
    });
    hook.doneEach(function () {
      var nav = document.querySelector('.sidebar-nav');
      if (nav) {
        fixSidebarLinks(nav);
        initSidebarCollapse(nav);
      }
    });
  };

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], plugin);
})();
