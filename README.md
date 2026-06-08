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

## Running locally

The app is plain static HTML/CSS/JS — React + Babel are loaded from a CDN and
JSX is transpiled in the browser. Serve the folder over HTTP (a service worker
needs a real origin; opening the file directly won't work):

```sh
python3 -m http.server 8000
# then open http://localhost:8000/  (redirects to Closet.html)
```

## Install on your phone

- **iPhone:** open the URL in Safari → Share → **Add to Home Screen**
- **Android:** open in Chrome → menu → **Install app**

## Structure

```
Closet.html              app entry — loads modules, mounts <App> in an iPhone frame
index.html               redirects to Closet.html
manifest.webmanifest     PWA manifest
sw.js                    offline service worker (network-first)
icons/                   app icons (192 / 512 / Apple touch)
frames/ios-frame.jsx     scalable iPhone device frame
screens/Figure.jsx       the avatar / outfit figure
studio/                  app modules
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
