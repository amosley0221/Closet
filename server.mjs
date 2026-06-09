// server.mjs — serves the built static app from dist/ and proxies live product
// search through /api/search so the API key stays on the server.
//
// Live search uses SerpAPI's Google Shopping engine when SERPAPI_KEY is set.
// Without a key it returns no results and the app falls back to its built-in
// catalog, so the app always works. No third-party npm deps.
import http from 'node:http';
import { promises as fs, createReadStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const PORT = process.env.PORT || 8000;
const SERPAPI_KEY = process.env.SERPAPI_KEY || '';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.map': 'application/json', '.woff2': 'font/woff2',
};

// ── live search ──────────────────────────────────────────────
const cache = new Map(); // q -> { t, results }
const TTL = 10 * 60 * 1000;

function guessCat(title = '') {
  const t = title.toLowerCase();
  if (/(shoe|sneaker|trainer|jordan|dunk|air max|air force|samba|gazelle|990|1906|cleat|boot|runner|low|high)/.test(t)) return 'Footwear';
  if (/(hoodie|tee|t-shirt|shirt|polo|sweater|knit|crew|jersey|sweatshirt)/.test(t)) return 'Tops';
  if (/(jacket|coat|parka|windbreaker|overcoat|bomber|outerwear|vest|anorak)/.test(t)) return 'Outerwear';
  if (/(jean|pant|trouser|short|cargo|jogger|chino|sweatpant)/.test(t)) return 'Bottoms';
  if (/(\bhat\b|cap|beanie|snapback|59fifty)/.test(t)) return 'Hats';
  if (/(sock|bag|tote|belt|scarf|glove|wallet)/.test(t)) return 'Accessories';
  return 'Footwear';
}
const BRANDS = ['Jordan', 'Nike', 'Adidas', 'New Balance', 'Asics', 'Converse', 'Vans', 'Puma', 'Reebok', 'Carhartt', 'Uniqlo', 'COS', 'Stüssy', 'Stussy', 'Mitchell & Ness', 'Fred Perry', 'The North Face', 'Levi'];
function guessBrand(title = '', source = '') {
  const t = title.toLowerCase();
  for (const b of BRANDS) if (t.includes(b.toLowerCase())) return b === 'Levi' ? "Levi's" : (b === 'Stussy' ? 'Stüssy' : b);
  return source || (title.split(/\s+/)[0] || 'Store');
}

async function searchProducts(q) {
  const key = q.toLowerCase().trim();
  const hit = cache.get(key);
  if (hit && Date.now() - hit.t < TTL) return { results: hit.results, source: 'live', cached: true };
  if (!SERPAPI_KEY) return { results: [], source: 'catalog', reason: 'no_key' };

  const url = `https://serpapi.com/search.json?engine=google_shopping&gl=us&hl=en&num=24&q=${encodeURIComponent(q)}&api_key=${SERPAPI_KEY}`;
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 9000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return { results: [], source: 'catalog', reason: 'http_' + r.status };
    const data = await r.json();
    const raw = data.shopping_results || [];
    const results = raw.map((x, i) => {
      const price = typeof x.extracted_price === 'number' ? x.extracted_price
        : (parseFloat(String(x.price || '').replace(/[^0-9.]/g, '')) || 0);
      const cat = guessCat(x.title);
      return {
        id: 'live' + i,
        name: x.title || 'Product',
        priceText: x.price || (price ? '$' + price : ''),
        price,
        image: x.thumbnail || '',
        store: x.source || 'Store',
        brand: guessBrand(x.title, x.source),
        cat,
        link: x.product_link || x.link || '',
        sneaker: cat === 'Footwear',
      };
    }).filter((p) => p.image).slice(0, 24);
    cache.set(key, { t: Date.now(), results });
    return { results, source: 'live' };
  } catch (e) {
    return { results: [], source: 'catalog', reason: e.name === 'AbortError' ? 'timeout' : 'error' };
  } finally {
    clearTimeout(to);
  }
}

// ── static files ─────────────────────────────────────────────
function send(res, code, body, type = 'application/json') {
  res.writeHead(code, { 'Content-Type': type });
  res.end(body);
}

async function serveStatic(req, res, pathname) {
  let urlPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.normalize(path.join(DIST, urlPath));
  if (!filePath.startsWith(DIST)) return send(res, 403, 'Forbidden', 'text/plain');
  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) throw new Error('is-dir');
    const ext = path.extname(filePath).toLowerCase();
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    if (urlPath === '/sw.js') headers['Cache-Control'] = 'no-cache';
    res.writeHead(200, headers);
    createReadStream(filePath).pipe(res);
  } catch (e) {
    // SPA fallback for navigations
    if ((req.headers.accept || '').includes('text/html')) {
      try {
        const html = await fs.readFile(path.join(DIST, 'index.html'));
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        return res.end(html);
      } catch (_) {}
    }
    send(res, 404, 'Not found', 'text/plain');
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost');
    if (u.pathname === '/api/health') return send(res, 200, JSON.stringify({ ok: true, liveSearch: !!SERPAPI_KEY }));
    if (u.pathname === '/api/search') {
      const q = (u.searchParams.get('q') || '').trim();
      if (!q) return send(res, 200, JSON.stringify({ results: [], source: 'catalog', reason: 'empty' }));
      return send(res, 200, JSON.stringify(await searchProducts(q)));
    }
    return serveStatic(req, res, u.pathname);
  } catch (e) {
    send(res, 500, JSON.stringify({ error: 'server_error' }));
  }
});

server.listen(PORT, () => {
  console.log(`Closet on :${PORT} — live search ${SERPAPI_KEY ? 'ENABLED' : 'OFF (set SERPAPI_KEY)'}`);
});
