# Closet

A smart digital wardrobe — photograph your clothes, build outfits on an avatar
that looks like you, track wear & laundry, and stay ahead of sneaker drops.

This is the **Studio** direction (clean, editorial, warm-white) built as an
installable PWA. `Closet.html` is the app entry point.

## Features

- **Closet** — your real, drag-and-drop cutout photos per item, on colored product tiles
- **Avatar** — a likeness of you (skin tone, hair, build, face & hands) that wears stylized versions of your items
- **Mood-driven Builder** — pick a mood ("all black", "interview", "first date"…) and get an outfit suggested from what you own, with per-slot swapping
- **Wear log** — every logged fit captures a date + occasion (Work, Night out, Wedding…), grouped by month and filterable
- **Laundry awareness** — logged wears advance an item's freshness; once past a per-category threshold it's flagged *Needs wash* and hidden from suggestions
- **Drops** — release calendar with retailer price comparison + recommendations
- **Discover / import** — search a catalog or paste a product link to add items without photographing everything; owned vs. wishlist
- **On-device persistence** — wardrobe, fits, wear log, wishlist, and avatar persist in `localStorage` (Settings → Reset all data to start clean)
- **Responsive** — full-screen bottom-tab layout on phones; a left **sidebar** nav + centered content column on tablet/desktop (no device-frame mockup)
- **Installable PWA** — web manifest, app icon, and an offline (network-first) service worker

## Build

The app's source is JSX modules (`studio/*.jsx`, `frames/`, `screens/`). The
build pre-transpiles them to plain browser scripts with [esbuild] — no
in-browser Babel — and vendors React/ReactDOM locally so the app has **no CDN
dependency** and works offline. Output goes to `dist/`.

```sh
npm install
npm run build     # -> dist/
```

## Running locally

```sh
npm run dev       # builds, then runs the Node server at http://localhost:8000
# or, after a build:
npm start
```

Open `http://localhost:8000/`. Serve over HTTP, not `file://` — the service
worker needs a real origin. `npm start` runs `server.mjs`, which serves `dist/`
and exposes `/api/search` (live search; see below).

> For a zero-build preview, the repo root also has the original prototype
> (`Closet.html` loading `.jsx` via in-browser Babel). The production path is the
> esbuild build above.

## Live product search

`server.mjs` exposes `/api/search?q=…`, which proxies **SerpAPI's Google
Shopping** engine so real products (photos + prices) appear in **Add items**.
The API key stays on the server.

- Set `SERPAPI_KEY` (get a key at [serpapi.com] — free tier ~100 searches/mo).
- **Without a key the app still works** — it falls back to the built-in catalog,
  so search never breaks.
- Results are cached in-memory for 10 min to conserve quota.

## Deploy to Render

This repo includes a [`render.yaml`](./render.yaml) Blueprint that deploys a
**Node web service** (it serves the app *and* runs the search proxy).

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to **[render.com](https://render.com) → New → Blueprint** and select this
   repo. Render reads `render.yaml` and creates a **Web Service** that runs
   `npm install && npm run build` and starts `node server.mjs`.
3. In the service: **Environment → add `SERPAPI_KEY`** = your key, then redeploy.
4. Render gives you an HTTPS URL like `https://closet-xxxx.onrender.com`.

> **Migrating from the old static site:** Render can't convert a Static Site
> into a Web Service. Delete the old `closet` static site first, then re-apply
> the Blueprint (or create **New → Web Service** manually with the build/start
> commands above). On Render's free tier a web service sleeps after inactivity,
> so the first load after idle can take ~30–60s.

[serpapi.com]: https://serpapi.com

## Install on your phone

Open the Render URL on your phone:

- **iPhone (Safari):** tap **Share** → **Add to Home Screen**
- **Android (Chrome):** menu → **Install app**

It launches full-screen with the Closet icon, works offline, and keeps your
wardrobe on-device.

## Troubleshooting a blank screen

The app shows any startup/render error on-screen (handy on a phone with no dev
console). If you still get a blank page:

- **Confirm Render is serving the build.** On the Static Site, Build Command must
  be `npm install && npm run build` and Publish Directory must be `dist`. If the
  publish directory is the repo root, you're serving the unbuilt prototype.
- **Clear a stale service worker.** On the deployed URL: iOS Safari → Settings →
  clear website data for the site (or use a Private tab once); desktop Chrome →
  DevTools → Application → Service Workers → Unregister, then reload.
- A failed deploy build shows in Render's deploy logs — check there first.

[esbuild]: https://esbuild.github.io

## Structure

```
build.mjs                esbuild build -> dist/ (transpile JSX, vendor React, emit HTML/SW)
package.json             deps + build/serve scripts
render.yaml              Render Static Site blueprint
dist/                    build output (gitignored) — what gets deployed

Closet.html              dev (no-build) entry — loads .jsx via in-browser Babel
index.html               redirects to Closet.html
manifest.webmanifest     PWA manifest
sw.js                    offline service worker (network-first)
icons/                   app icons (192 / 512 / Apple touch)
screens/Figure.jsx       the avatar / outfit figure
studio/                  app modules (source)
  core.jsx               theme tokens, icons, UI primitives, ItemPhoto
  data.jsx               wardrobe model, moods, outfit logic, drops, catalog
  App.jsx                shell — state, navigation stack, tab bar, persistence
  Home / Closet / Builder / ItemDetail / AddItem / Drops / Profile
  LogSheet / WearLog / Laundry / Discover / Wishlist / AvatarSheet
  image-slot.js          <image-slot> web component for droppable photos
```

> Note: this began as an HTML/CSS/JS prototype from Claude Design. It runs
> as-is; for production you'd typically move the in-browser Babel transpile to a
> build step.
