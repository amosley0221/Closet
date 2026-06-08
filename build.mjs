// build.mjs — compile the Closet PWA into a static, self-contained `dist/`.
//
// What it does:
//  - transpiles every JSX module to a classic browser script (JSX -> React.createElement)
//    so there's no in-browser Babel at runtime
//  - vendors React/ReactDOM (production) locally so the app has no CDN dependency
//  - copies static assets and emits Closet.html, index.html, and the service worker
import * as esbuild from 'esbuild';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');

// Ordered list of JSX modules — same load order the prototype used. Each becomes
// a classic <script> sharing one global scope (components export via `window.X`).
const MODULES = [
  'screens/Figure.jsx',
  'studio/core.jsx',
  'studio/data.jsx',
  'studio/Home.jsx',
  'studio/Closet.jsx',
  'studio/Builder.jsx',
  'studio/ItemDetail.jsx',
  'studio/AddItem.jsx',
  'studio/Drops.jsx',
  'studio/Profile.jsx',
  'studio/LogSheet.jsx',
  'studio/WearLog.jsx',
  'studio/Laundry.jsx',
  'studio/Discover.jsx',
  'studio/Wishlist.jsx',
  'studio/AvatarSheet.jsx',
  'studio/App.jsx',
  'studio/bootstrap.jsx',
];

const toJs = (p) => p.replace(/\.jsx$/, '.js');

async function clean() {
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.mkdir(DIST, { recursive: true });
}

async function copy(rel, destRel = rel) {
  const dest = path.join(DIST, destRel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(path.join(ROOT, rel), dest);
}

async function transpile() {
  await esbuild.build({
    entryPoints: MODULES.map((m) => path.join(ROOT, m)),
    outdir: DIST,
    outbase: ROOT,
    bundle: false,
    minify: true,
    loader: { '.jsx': 'jsx' },
    jsx: 'transform', // classic runtime: React.createElement / React.Fragment
    logLevel: 'warning',
  });
}

async function vendorReact() {
  const dst = path.join(DIST, 'vendor');
  await fs.mkdir(dst, { recursive: true });
  const reactDir = path.dirname(require.resolve('react/package.json'));
  const reactDomDir = path.dirname(require.resolve('react-dom/package.json'));
  await fs.copyFile(path.join(reactDir, 'umd/react.production.min.js'), path.join(dst, 'react.production.min.js'));
  await fs.copyFile(path.join(reactDomDir, 'umd/react-dom.production.min.js'), path.join(dst, 'react-dom.production.min.js'));
}

const HEAD = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>Closet</title>
<link rel="manifest" href="manifest.webmanifest" />
<meta name="theme-color" content="#FBFAF7" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="Closet" />
<link rel="apple-touch-icon" href="icons/apple-touch-icon-180.png" />
<link rel="icon" type="image/png" href="icons/icon-192.png" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Cormorant+Garamond:wght@500;600;700&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; padding: 0; height: 100%; }
  body { background: #E7E2D9; overflow: hidden; }
  #root { position: fixed; inset: 0; }
  * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
  ::-webkit-scrollbar { display: none; }
  input::placeholder { color: #B7B2A9; }
  input[type="date"] { -webkit-appearance: none; }
  image-slot::part(frame) { background: var(--slot-tone, #ECE9E2) !important; }
  image-slot::part(empty) { color: rgba(28,26,23,0.5); }
  @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
  @keyframes pushIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes pushOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
</style>
</head>
<body>
<div id="root"></div>
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
</script>
<script>
  // Surface any boot/render failure on-screen (useful on phones with no console).
  (function () {
    function show(msg) {
      var el = document.getElementById('boot-error');
      if (!el) {
        el = document.createElement('pre');
        el.id = 'boot-error';
        el.style.cssText = 'position:fixed;inset:0;z-index:99999;margin:0;padding:18px;white-space:pre-wrap;word-break:break-word;font:12px/1.5 ui-monospace,Menlo,monospace;color:#7a1c1c;background:#FBFAF7;overflow:auto';
        (document.body || document.documentElement).appendChild(el);
        el.textContent = 'Closet failed to start:\n\n';
      }
      el.textContent += msg + '\n';
    }
    window.addEventListener('error', function (e) {
      show((e.message || 'Script error') + (e.filename ? ('  @ ' + e.filename + ':' + (e.lineno || 0)) : ''));
    });
    window.addEventListener('unhandledrejection', function (e) {
      var r = e.reason; show('Promise rejection: ' + ((r && (r.stack || r.message)) || r));
    });
    window.addEventListener('load', function () {
      setTimeout(function () {
        var root = document.getElementById('root');
        if (root && root.childNodes.length === 0 && !document.getElementById('boot-error')) {
          show('The app did not render. If reloading does not help, clear this site\\u2019s data / unregister the service worker, then reload.');
        }
      }, 6000);
    });
  })();
</script>
`;

function scriptTags() {
  const vendor = [
    '<script src="vendor/react.production.min.js"></script>',
    '<script src="vendor/react-dom.production.min.js"></script>',
    '<script src="studio/image-slot.js"></script>',
  ];
  const app = MODULES.map((m) => `<script src="${toJs(m)}"></script>`);
  return [...vendor, ...app].join('\n');
}

async function writeHtml() {
  const html = `${HEAD}\n${scriptTags()}\n</body>\n</html>\n`;
  // The full app is served at both the site root (index.html) and Closet.html,
  // so there is no redirect hop to fail on.
  await fs.writeFile(path.join(DIST, 'index.html'), html);
  await fs.writeFile(path.join(DIST, 'Closet.html'), html);
}

async function writeSw() {
  const assets = [
    'Closet.html', 'index.html', 'manifest.webmanifest',
    'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon-180.png',
    'vendor/react.production.min.js', 'vendor/react-dom.production.min.js',
    'studio/image-slot.js',
    ...MODULES.map(toJs),
  ];
  const sw = `// sw.js — offline cache for Closet. Network-first so updates always reach the
// user when online, with a cached fallback when offline. (generated by build.mjs)
const CACHE = 'closet-v5';
const ASSETS = ${JSON.stringify(assets, null, 2)};

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('Closet.html') : undefined)))
  );
});
`;
  await fs.writeFile(path.join(DIST, 'sw.js'), sw);
}

async function main() {
  await clean();
  await transpile();
  await vendorReact();
  await copy('manifest.webmanifest');
  await copy('studio/image-slot.js');
  for (const icon of ['apple-touch-icon-180.png', 'icon-192.png', 'icon-512.png']) {
    await copy(`icons/${icon}`);
  }
  await writeHtml();
  await writeSw();
  console.log('Built Closet -> dist/');
}

main().catch((err) => { console.error(err); process.exit(1); });
