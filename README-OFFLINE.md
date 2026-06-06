# Offline documentation (Docsify)

This folder is a **standalone** copy of the Syria IHDP documentation. It does not use the Starlight/Astro build — open it directly on your machine with no Node.js or local server.

## How to open

1. Go to this folder in File Explorer.
2. **Double-click `index.html`**.
3. Your browser opens the site at a `file://` URL. Use the sidebar to browse layers.
4. Use **Light mode** / **Dark mode** (top-right) to switch themes. Your choice is remembered locally.

Works fully offline after the folder is copied (USB, Dropbox, etc.).

## Contents

| Path | Purpose |
| --- | --- |
| `index.html` | Docsify shell (vendored scripts in `lib/`) |
| `README.md` | Home page |
| `_sidebar.md` | Navigation |
| `layers/` | Overview, vector, and raster layer pages |
| `reference/` | Data naming convention |
| `assets/thumbnails/` | Layer preview images |
| `assets/partners/` | Partner logos (home page) |

## Thumbnails missing?

Layer preview PNGs are copied from `public/assets/thumbnails/` in the main project. If previews do not show, run `generate_docs.py` on a machine with the GeoPackage, then copy `public/assets/thumbnails/*.png` into `docsify-offline/assets/thumbnails/`.

## Primary site

The main documentation site remains the Starlight project at the repository root (`npm run dev` / `npm run build`).

## Technical note

- **Sidebar** is embedded in `index.html` (`<script id="_sidebar">`) so all pages appear in the left navigation without a network request.
- **Page content** is served from `lib/content-bundle.js` via `lib/offline-fetch.js` (and Docsify routes) so `file://` navigation works.
- On-disk `.md` files in `layers/` match the bundle for reading or portability.

If you update `_sidebar.md`, copy its contents into the `<script id="_sidebar">` block in `index.html` as well.

### If you see “404 - Not Found” or sidebar links do nothing

The offline copy stores all pages in `lib/content-bundle.js`. If that file is incomplete (for example missing `README.md`), the home page shows 404 and navigation fails. From the `docsify-offline` folder, run:

```bash
node -e "
const fs=require('fs'),path=require('path');
function collect(dir,base=''){const m={};for(const n of fs.readdirSync(dir)){
  if(n==='lib')continue;const f=path.join(dir,n),k=base?base+'/'+n:n;
  if(fs.statSync(f).isDirectory())Object.assign(m,collect(f,k));
  else if(n.endsWith('.md')&&n!=='README-OFFLINE.md')m[k.replace(/\\\\/g,'/')]=fs.readFileSync(f,'utf8');
}return m;}
const b=collect('.');
fs.writeFileSync('lib/content-bundle.js','window.__DOCSIFY_CONTENT__ = '+JSON.stringify(b)+';\\n');
console.log('Rebundled',Object.keys(b).length,'files');
"
```

Then hard-refresh the browser (Ctrl+F5).
