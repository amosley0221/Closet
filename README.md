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
npm start         # builds, then serves dist/ at http://localhost:8000
# or, after a build:
npm run serve
```

Open `http://localhost:8000/` (redirects to `Closet.html`). Serve over HTTP, not
`file://` — the service worker needs a real origin.

> For a zero-build preview, the repo root also has the original prototype
> (`Closet.html` loading `.jsx` via in-browser Babel). The production path is the
> esbuild build above.

## Deploy to Render

This repo includes a [`render.yaml`](./render.yaml) Blueprint.

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to **[render.com](https://render.com) → New → Blueprint** and select this repo.
   Render reads `render.yaml` and creates a **Static Site** that runs
   `npm install && npm run build` and publishes `dist/`.
   - Or do it manually: **New → Static Site**, Build Command
     `npm install && npm run build`, Publish Directory `dist`.
3. Render gives you an HTTPS URL like `https://closet-xxxx.onrender.com`.

## Install on your phone

Open the Render URL on your phone:

- **iPhone (Safari):** tap **Share** → **Add to Home Screen**
- **Android (Chrome):** menu → **Install app**

It launches full-screen with the Closet icon, works offline, and keeps your
wardrobe on-device.

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
frames/ios-frame.jsx     scalable iPhone device frame
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
