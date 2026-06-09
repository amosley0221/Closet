// data.jsx — wardrobe items, categories, moods, drop calendar, and the
// outfit-building logic that powers the Mood-driven Builder.

const CATEGORIES = ['Hats', 'Tops', 'Outerwear', 'Bottoms', 'Footwear', 'Accessories'];

// Which figure slot each category fills (Accessories don't map to the figure).
const SLOT_OF = { Hats: 'beanie', Tops: 'shirt', Outerwear: 'jacket', Bottoms: 'pants', Footwear: 'shoes' };

// tone = dominant garment color (drives thumbnail + figure block)
const WARDROBE = [];
const _SEED_WARDROBE = [
  // Hats
  { id: 'h1', name: 'Ribbed Beanie', brand: 'Carhartt', cat: 'Hats', tone: '#26241F', tags: ['black', 'comfy', 'casual'], date: '2024-11-02', price: 22, wears: 28 },
  { id: 'h2', name: 'Wool Ballcap', brand: 'Mitchell & Ness', cat: 'Hats', tone: '#5C4632', tags: ['retro', 'casual', 'bold'], date: '2023-12-10', price: 38, wears: 11 },
  { id: 'h3', name: 'Cream Bucket Hat', brand: 'Uniqlo', cat: 'Hats', tone: '#D9CDB4', tags: ['casual', 'comfy', 'minimal'], date: '2025-04-19', price: 25, wears: 5 },
  // Tops
  { id: 't1', name: 'Heavy White Tee', brand: 'Uniqlo', cat: 'Tops', tone: '#F1ECE3', tags: ['minimal', 'casual', 'interview'], date: '2025-01-15', price: 15, wears: 41 },
  { id: 't2', name: 'Black Pocket Tee', brand: 'COS', cat: 'Tops', tone: '#1C1A17', tags: ['black', 'minimal', 'casual'], date: '2024-09-20', price: 29, wears: 33 },
  { id: 't3', name: 'Striped Knit', brand: 'H&M', cat: 'Tops', tone: '#B9A98F', tone2: '#7C6E55', tags: ['retro', 'bold', 'casual'], date: '2024-10-05', price: 35, wears: 12 },
  { id: 't4', name: 'Oxford Shirt', brand: 'Uniqlo', cat: 'Tops', tone: '#CAD4E0', tags: ['interview', 'minimal', 'formal'], date: '2023-08-12', price: 40, wears: 18 },
  { id: 't5', name: 'Burgundy Polo', brand: 'Fred Perry', cat: 'Tops', tone: '#6E2F33', tags: ['retro', 'bold', 'date'], date: '2024-06-30', price: 80, wears: 14 },
  // Outerwear
  { id: 'o1', name: 'Detroit Jacket', brand: 'Carhartt', cat: 'Outerwear', tone: '#7C7556', tags: ['casual', 'comfy'], date: '2024-03-01', price: 168, wears: 22 },
  { id: 'o2', name: 'Nylon Bomber', brand: 'H&M', cat: 'Outerwear', tone: '#201F1C', tags: ['black', 'bold', 'casual', 'date'], date: '2025-02-10', price: 79, wears: 14 },
  { id: 'o3', name: 'Denim Trucker', brand: "Levi's", cat: 'Outerwear', tone: '#566E86', tags: ['retro', 'casual', 'bold'], date: '2022-06-18', price: 98, wears: 30 },
  { id: 'o4', name: 'Wool Overcoat', brand: 'COS', cat: 'Outerwear', tone: '#2C2A26', tags: ['black', 'formal', 'interview', 'minimal'], date: '2023-11-22', price: 190, wears: 11 },
  // Bottoms
  { id: 'b1', name: '511 Indigo Jeans', brand: "Levi's", cat: 'Bottoms', tone: '#3A4252', tags: ['casual', 'retro', 'date'], date: '2024-05-09', price: 98, wears: 37 },
  { id: 'b2', name: 'Wool Trousers', brand: 'COS', cat: 'Bottoms', tone: '#1E1C19', tags: ['black', 'formal', 'interview', 'minimal'], date: '2024-07-14', price: 89, wears: 20 },
  { id: 'b3', name: 'Double-Knee Pant', brand: 'Carhartt', cat: 'Bottoms', tone: '#6B6553', tags: ['casual', 'bold', 'comfy'], date: '2025-01-30', price: 120, wears: 8 },
  { id: 'b4', name: 'Beige Chino', brand: 'Uniqlo', cat: 'Bottoms', tone: '#C8B89B', tags: ['minimal', 'casual', 'interview'], date: '2023-09-01', price: 40, wears: 16 },
  // Footwear
  { id: 'f1', name: 'Air Jordan 4 “Black Cat”', brand: 'Jordan', cat: 'Footwear', tone: '#1A1A1A', tags: ['black', 'bold', 'sneaker', 'date'], date: '2024-12-25', price: 215, wears: 6, sneaker: true },
  { id: 'f2', name: 'Air Jordan 1 “Chicago”', brand: 'Jordan', cat: 'Footwear', tone: '#B23A2E', tone2: '#E9E5DE', tags: ['retro', 'bold', 'sneaker', 'date'], date: '2023-02-14', price: 180, wears: 19, sneaker: true },
  { id: 'f3', name: 'Killshot 2', brand: 'Nike', cat: 'Footwear', tone: '#E9E5DE', tone2: '#9CA98C', tags: ['retro', 'minimal', 'casual', 'sneaker'], date: '2024-04-20', price: 90, wears: 25, sneaker: true },
  { id: 'f4', name: 'Dover Derby', brand: 'Grenson', cat: 'Footwear', tone: '#2A211B', tags: ['formal', 'interview'], date: '2022-10-10', price: 260, wears: 9 },
  // Accessories
  { id: 'a1', name: 'Figaro Chain', brand: '—', cat: 'Accessories', tone: '#C9CCD2', tags: ['bold', 'retro', 'date'], date: '2024-08-08', price: 60, wears: 22 },
  { id: 'a2', name: 'Leather Belt', brand: '—', cat: 'Accessories', tone: '#3A2A20', tags: ['formal', 'interview', 'minimal'], date: '2023-05-14', price: 45, wears: 31 },
];

// ── Moods ──────────────────────────────────────────────────
const MOODS = [
  { key: 'allblack', label: 'All black', tag: 'black', note: 'Head-to-toe blackout' },
  { key: 'retro', label: 'Retro party', tag: 'retro', note: 'Vintage-leaning, fun' },
  { key: 'interview', label: 'Interview', tag: 'interview', note: 'Sharp & put-together' },
  { key: 'date', label: 'Date night', tag: 'date', note: 'A little bolder' },
  { key: 'comfy', label: 'Comfy', tag: 'comfy', note: 'Soft & easy' },
  { key: 'minimal', label: 'Minimal', tag: 'minimal', note: 'Quiet & clean' },
];

// Occasions used when logging what you wore
const OCCASIONS = [
  { key: 'Work', color: '#6E7A63' },
  { key: 'Casual', color: '#9A6B4F' },
  { key: 'Night out', color: '#2C2A26' },
  { key: 'Wedding', color: '#7A5A6E' },
  { key: 'Date', color: '#B0734F' },
  { key: 'Gym', color: '#5E8A78' },
  { key: 'Travel', color: '#5A6E86' },
  { key: 'Errands', color: '#8B8780' },
];
function occColor(key) { const o = OCCASIONS.find((x) => x.key === key); return o ? o.color : '#8B8780'; }

// ── Laundry: wears-per-wash threshold by category ───────────
const WASH = { Hats: 6, Tops: 2, Outerwear: 10, Bottoms: 6, Footwear: 25, Accessories: 40 };
function washThreshold(it) { return WASH[it.cat] || 6; }
function freshness(it) { return Math.min(1, (it.fresh || 0) / washThreshold(it)); }
function needsWash(it) { return (it.fresh || 0) >= washThreshold(it); }
// `fresh` = wears since last wash. Seed a few items as due / overdue.
(function seedFresh() {
  const F = { t1: 2, t2: 2, b1: 7, o1: 5, h1: 3, t3: 1, b4: 4, f3: 8 };
  WARDROBE.forEach((i) => { i.fresh = F[i.id] || 0; });
})();

// Figure slot order, head-to-toe
const SLOTS = [
  { slot: 'beanie', cat: 'Hats', label: 'Hat' },
  { slot: 'jacket', cat: 'Outerwear', label: 'Outerwear' },
  { slot: 'shirt', cat: 'Tops', label: 'Top' },
  { slot: 'pants', cat: 'Bottoms', label: 'Bottom' },
  { slot: 'shoes', cat: 'Footwear', label: 'Shoes' },
];

const byCat = (cat, wardrobe = WARDROBE) => wardrobe.filter((i) => i.cat === cat);

// Pick one item per slot matching the mood tag; fall back to most-worn in cat.
function buildOutfit(moodKey, wardrobe = WARDROBE, seed = 0) {
  const mood = MOODS.find((m) => m.key === moodKey);
  const tag = mood && mood.tag;
  const out = {};
  SLOTS.forEach(({ slot, cat }, idx) => {
    const all = byCat(cat, wardrobe);
    const clean = all.filter((i) => !needsWash(i));
    const pool = clean.length ? clean : all; // avoid dirty items when possible
    if (!pool.length) { out[slot] = null; return; }
    const matches = tag ? pool.filter((i) => i.tags.includes(tag)) : pool;
    const list = matches.length ? matches : [...pool].sort((a, b) => b.wears - a.wears);
    out[slot] = list[(seed + idx) % list.length];
  });
  return out;
}

// Map a {slot: item} outfit to OutfitFigure color props. Absent slots → null
// so the figure shows the bare mannequin there instead of a phantom garment.
function figureColors(outfit) {
  const tone = (s) => (outfit[s] ? outfit[s].tone : null);
  return {
    form: '#D9D2C6', formEdge: 'rgba(0,0,0,0.05)',
    beanie: tone('beanie'),
    jacket: tone('jacket'),
    sleeve: outfit.jacket ? shade(outfit.jacket.tone, -14) : null,
    shirt: tone('shirt'),
    pants: tone('pants'),
    shoes: tone('shoes'),
    shadow: 'rgba(0,0,0,0.13)',
  };
}
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function outfitName(moodKey, outfit) {
  const map = { allblack: 'Blackout', retro: 'Throwback', interview: 'The Closer', date: 'Night Mode', comfy: 'Off-Duty', minimal: 'Quiet Layers' };
  return map[moodKey] || 'Off-Duty Layers';
}

function outfitPrice(outfit) {
  return SLOTS.reduce((s, { slot }) => s + (outfit[slot] ? outfit[slot].price : 0), 0);
}

// ── Drops calendar (upcoming releases) ──────────────────────
const DROPS = [
  { id: 'd1', name: 'Air Jordan 4 “Cool Grey”', brand: 'Jordan', date: '2026-06-13', day: 'Sat', time: '10:00 AM', price: 215, tone: '#9DA3AC', tone2: '#6F757E', reason: 'You wear your Jordan 4s most', retailers: [['SNKRS', 215], ['Foot Locker', 215], ['StockX', 238]], match: 96 },
  { id: 'd2', name: 'Air Jordan 1 Low “Mocha”', brand: 'Jordan', date: '2026-06-21', day: 'Sun', time: '08:00 AM', price: 145, tone: '#6B4A33', tone2: '#D9CDB4', reason: 'Pairs with your retro fits', retailers: [['SNKRS', 145], ['GOAT', 168]], match: 88 },
  { id: 'd3', name: 'Nike Killshot “Sail/Green”', brand: 'Nike', date: '2026-07-02', day: 'Wed', time: '10:00 AM', price: 95, tone: '#E9E5DE', tone2: '#9CA98C', reason: 'You own & love the Killshot 2', retailers: [['Nike', 95], ['END.', 100]], match: 92 },
  { id: 'd4', name: 'Carhartt WIP OG Detroit', brand: 'Carhartt', date: '2026-07-09', day: 'Wed', time: '12:00 PM', price: 198, tone: '#3A4252', tone2: '#566E86', reason: 'Restock of your most-worn jacket line', retailers: [['Carhartt WIP', 198]], match: 84 },
];

// ── Recommendations (based on closet) ───────────────────────
const RECS = [
  { id: 'r1', name: 'Charcoal Overshirt', brand: 'COS', cat: 'Outerwear', price: 110, tone: '#3B3A36', reason: 'Fills a gap between your tee & overcoat' },
  { id: 'r2', name: 'Selvedge Straight Jean', brand: 'A.P.C.', cat: 'Bottoms', price: 230, tone: '#2E3647', reason: 'Goes with 18 of your tops' },
  { id: 'r3', name: 'Suede Trainer', brand: 'New Balance', cat: 'Footwear', price: 140, tone: '#9A8C76', reason: 'A versatile 3rd sneaker', sneaker: true },
];

// ── Seed wear log (what you wore, with occasion + date) ─────
// outfit stored as {slot: itemId}; resolve against live wardrobe to render.
const WEARLOG_SEED = [];
const _SEED_LOG = [
  { id: 'w1', date: '2026-06-06', occasion: 'Casual', note: 'Coffee run + errands', items: { beanie: 'h1', jacket: 'o3', shirt: 't2', pants: 'b1', shoes: 'f3' } },
  { id: 'w2', date: '2026-06-05', occasion: 'Work', note: 'Client review', items: { beanie: null, jacket: 'o4', shirt: 't4', pants: 'b2', shoes: 'f4' } },
  { id: 'w3', date: '2026-06-02', occasion: 'Work', note: '', items: { beanie: null, jacket: 'o1', shirt: 't1', pants: 'b4', shoes: 'f3' } },
  { id: 'w4', date: '2026-05-23', occasion: 'Night out', note: "Leo's birthday", items: { beanie: null, jacket: 'o2', shirt: 't5', pants: 'b1', shoes: 'f2' } },
  { id: 'w5', date: '2026-05-10', occasion: 'Date', note: 'Dinner downtown', items: { beanie: null, jacket: 'o3', shirt: 't2', pants: 'b2', shoes: 'f1' } },
  { id: 'w6', date: '2026-04-12', occasion: 'Wedding', note: "Sam & Priya's wedding", items: { beanie: null, jacket: 'o4', shirt: 't4', pants: 'b2', shoes: 'f4' } },
  { id: 'w7', date: '2026-03-29', occasion: 'Travel', note: 'Flight to NYC', items: { beanie: 'h1', jacket: 'o1', shirt: 't1', pants: 'b3', shoes: 'f3' } },
];
function resolveOutfit(items, wardrobe = WARDROBE) {
  const out = {};
  SLOTS.forEach(({ slot }) => { const id = items[slot]; out[slot] = id ? wardrobe.find((i) => i.id === id) || null : null; });
  return out;
}
function outfitToIds(outfit) {
  const m = {};
  SLOTS.forEach(({ slot }) => { m[slot] = outfit[slot] ? outfit[slot].id : null; });
  return m;
}

// ── Importable catalog (so you don't upload everything) ─────
const IMPORT_STORES = ['All', 'SNKRS', 'GOAT', 'Nike', 'Adidas', 'Foot Locker', 'Stüssy', 'H&M', 'COS', "Levi's", 'Mitchell & Ness', 'Carhartt WIP', 'Uniqlo'];
const CATALOG = [
  // ── Footwear ──
  { id: 'c1', store: 'Nike', brand: 'Nike', name: 'Ja 3 “Day One”', cat: 'Footwear', tone: '#E7E3DC', tone2: '#1C1A17', price: 130, sneaker: true },
  { id: 'c2', store: 'Foot Locker', brand: 'Nike', name: 'Ja 3 “Let Me Be Ja”', cat: 'Footwear', tone: '#E8C93F', tone2: '#1C1A17', price: 130, sneaker: true },
  { id: 'c3', store: 'Nike', brand: 'Nike', name: 'Ja 3 “Kool-Aid”', cat: 'Footwear', tone: '#3A6EA5', tone2: '#C7402F', price: 130, sneaker: true },
  { id: 'c4', store: 'SNKRS', brand: 'Jordan', name: 'Air Jordan 3 “White Cement”', cat: 'Footwear', tone: '#E9E5DE', tone2: '#B23A2E', price: 210, sneaker: true },
  { id: 'c5', store: 'SNKRS', brand: 'Jordan', name: 'Air Jordan 1 High “Chicago”', cat: 'Footwear', tone: '#E7E3DC', tone2: '#B23A2E', price: 180, sneaker: true },
  { id: 'c6', store: 'SNKRS', brand: 'Jordan', name: 'Air Jordan 1 Mid “Royal”', cat: 'Footwear', tone: '#3A4252', tone2: '#1C1A17', price: 135, sneaker: true },
  { id: 'c7', store: 'GOAT', brand: 'Jordan', name: 'Air Jordan 4 “Bred”', cat: 'Footwear', tone: '#1C1A17', tone2: '#B23A2E', price: 230, sneaker: true },
  { id: 'c8', store: 'SNKRS', brand: 'Jordan', name: 'Air Jordan 11 “Concord”', cat: 'Footwear', tone: '#15140F', tone2: '#F1ECE3', price: 230, sneaker: true },
  { id: 'c9', store: 'Nike', brand: 'Nike', name: 'Dunk Low “Panda”', cat: 'Footwear', tone: '#F1ECE3', tone2: '#1C1A17', price: 120, sneaker: true },
  { id: 'c10', store: 'Nike', brand: 'Nike', name: "Air Force 1 '07", cat: 'Footwear', tone: '#F4F1EB', tone2: '#E2DDD3', price: 115, sneaker: true },
  { id: 'c11', store: 'GOAT', brand: 'Nike', name: 'Air Max 90 “Infrared”', cat: 'Footwear', tone: '#D8D3CA', tone2: '#B23A2E', price: 140, sneaker: true },
  { id: 'c12', store: 'Nike', brand: 'Nike', name: "Air Max 1 '86 OG", cat: 'Footwear', tone: '#E7E3DC', tone2: '#3A4252', price: 150, sneaker: true },
  { id: 'c13', store: 'Foot Locker', brand: 'Nike', name: 'Air Max 95 OG', cat: 'Footwear', tone: '#9CA3AA', tone2: '#6E7A63', price: 185, sneaker: true },
  { id: 'c14', store: 'GOAT', brand: 'Nike', name: 'Zoom Vomero 5', cat: 'Footwear', tone: '#B7B2A9', tone2: '#7C7556', price: 160, sneaker: true },
  { id: 'c15', store: 'GOAT', brand: 'Nike', name: 'Kobe 6 Protro “Grinch”', cat: 'Footwear', tone: '#3E6B3A', tone2: '#C7402F', price: 190, sneaker: true },
  { id: 'c16', store: 'GOAT', brand: 'New Balance', name: '1906R', cat: 'Footwear', tone: '#C9CCD2', tone2: '#9CA98C', price: 160, sneaker: true },
  { id: 'c17', store: 'Foot Locker', brand: 'New Balance', name: '990v6', cat: 'Footwear', tone: '#9A958C', tone2: '#6E665C', price: 200, sneaker: true },
  { id: 'c18', store: 'GOAT', brand: 'New Balance', name: '550 “White Green”', cat: 'Footwear', tone: '#F1ECE3', tone2: '#3E6B3A', price: 120, sneaker: true },
  { id: 'c19', store: 'GOAT', brand: 'New Balance', name: '2002R “Protection Pack”', cat: 'Footwear', tone: '#B7B2A9', tone2: '#5C4632', price: 150, sneaker: true },
  { id: 'c20', store: 'Adidas', brand: 'Adidas', name: 'Samba OG', cat: 'Footwear', tone: '#1C1A17', tone2: '#F1ECE3', price: 100, sneaker: true },
  { id: 'c21', store: 'Adidas', brand: 'Adidas', name: 'Gazelle', cat: 'Footwear', tone: '#3A4252', tone2: '#F1ECE3', price: 100, sneaker: true },
  { id: 'c22', store: 'Adidas', brand: 'Adidas', name: 'Campus 00s', cat: 'Footwear', tone: '#5C4632', tone2: '#F1ECE3', price: 110, sneaker: true },
  { id: 'c23', store: 'Adidas', brand: 'Adidas', name: 'Ultraboost Light', cat: 'Footwear', tone: '#1C1A17', tone2: '#3A3F44', price: 190, sneaker: true },
  { id: 'c24', store: 'GOAT', brand: 'Asics', name: 'Gel-Kayano 14', cat: 'Footwear', tone: '#C9CCD2', tone2: '#9CA3AA', price: 160, sneaker: true },
  { id: 'c25', store: 'GOAT', brand: 'Asics', name: 'Gel-1130', cat: 'Footwear', tone: '#D8D3CA', tone2: '#9CA98C', price: 110, sneaker: true },
  { id: 'c26', store: 'Foot Locker', brand: 'Converse', name: 'Chuck 70 Hi', cat: 'Footwear', tone: '#1C1A17', tone2: '#F1ECE3', price: 85, sneaker: true },
  { id: 'c27', store: 'Foot Locker', brand: 'Vans', name: 'Old Skool', cat: 'Footwear', tone: '#1C1A17', tone2: '#F1ECE3', price: 70, sneaker: true },
  // ── Tops ──
  { id: 'c28', store: 'H&M', brand: 'H&M', name: 'Relaxed Heavy Hoodie', cat: 'Tops', tone: '#3B3A36', price: 30 },
  { id: 'c29', store: 'H&M', brand: 'H&M', name: 'Oversized Tee 3-Pack', cat: 'Tops', tone: '#F1ECE3', price: 25 },
  { id: 'c30', store: 'Uniqlo', brand: 'Uniqlo', name: 'Supima Crew Tee', cat: 'Tops', tone: '#F1ECE3', price: 15 },
  { id: 'c31', store: 'Uniqlo', brand: 'Uniqlo', name: 'U Heavyweight Tee', cat: 'Tops', tone: '#9CA98C', price: 20 },
  { id: 'c32', store: 'Uniqlo', brand: 'Uniqlo', name: 'Oxford Shirt', cat: 'Tops', tone: '#CAD4E0', price: 40 },
  { id: 'c33', store: 'COS', brand: 'COS', name: 'Twin-Tipped Polo', cat: 'Tops', tone: '#1C4A3A', price: 80 },
  { id: 'c34', store: 'COS', brand: 'COS', name: 'Merino Rollneck', cat: 'Tops', tone: '#2C2A26', price: 110 },
  { id: 'c35', store: 'Stüssy', brand: 'Stüssy', name: '8-Ball Tee', cat: 'Tops', tone: '#1C1A17', tone2: '#F1ECE3', price: 45 },
  { id: 'c36', store: 'Stüssy', brand: 'Stüssy', name: 'Pigment-Dyed Hoodie', cat: 'Tops', tone: '#6B6553', price: 120 },
  { id: 'c37', store: 'Nike', brand: 'Nike', name: 'Sportswear Club Tee', cat: 'Tops', tone: '#1C1A17', price: 30 },
  { id: 'c38', store: 'Nike', brand: 'Nike', name: 'Tech Fleece Hoodie', cat: 'Tops', tone: '#3A3F44', price: 130 },
  // ── Bottoms ──
  { id: 'c39', store: "Levi's", brand: "Levi's", name: '501 Original Fit', cat: 'Bottoms', tone: '#3A4252', price: 98 },
  { id: 'c40', store: "Levi's", brand: "Levi's", name: '511 Slim', cat: 'Bottoms', tone: '#26303E', price: 90 },
  { id: 'c41', store: 'H&M', brand: 'H&M', name: 'Wide-Leg Cargo', cat: 'Bottoms', tone: '#6B6553', price: 40 },
  { id: 'c42', store: 'Carhartt WIP', brand: 'Carhartt', name: 'Double-Knee Pant', cat: 'Bottoms', tone: '#6B6553', price: 120 },
  { id: 'c43', store: 'Carhartt WIP', brand: 'Carhartt', name: 'Single Knee Pant', cat: 'Bottoms', tone: '#7C7556', price: 100 },
  { id: 'c44', store: 'Nike', brand: 'Nike', name: 'Tech Fleece Joggers', cat: 'Bottoms', tone: '#201F1C', price: 120 },
  { id: 'c45', store: 'Uniqlo', brand: 'Uniqlo', name: 'Pleated Wide Pant', cat: 'Bottoms', tone: '#2C2A26', price: 50 },
  { id: 'c46', store: 'Adidas', brand: 'Adidas', name: 'Firebird Track Pant', cat: 'Bottoms', tone: '#1C1A17', tone2: '#F1ECE3', price: 75 },
  // ── Outerwear ──
  { id: 'c47', store: 'COS', brand: 'COS', name: 'Boiled-Wool Overcoat', cat: 'Outerwear', tone: '#2C2A26', price: 225 },
  { id: 'c48', store: 'Carhartt WIP', brand: 'Carhartt', name: 'Detroit Jacket', cat: 'Outerwear', tone: '#7C7556', price: 168 },
  { id: 'c49', store: 'Carhartt WIP', brand: 'Carhartt', name: 'Nimbus Pullover', cat: 'Outerwear', tone: '#7C7556', price: 158 },
  { id: 'c50', store: "Levi's", brand: "Levi's", name: 'Denim Trucker', cat: 'Outerwear', tone: '#566E86', price: 98 },
  { id: 'c51', store: 'Nike', brand: 'Nike', name: 'Sportswear Windrunner', cat: 'Outerwear', tone: '#1C1A17', tone2: '#C7402F', price: 110 },
  { id: 'c52', store: 'Stüssy', brand: 'Stüssy', name: 'Work Jacket', cat: 'Outerwear', tone: '#5C4632', price: 230 },
  { id: 'c53', store: 'Mitchell & Ness', brand: 'Mitchell & Ness', name: 'Lakers Warm-Up Jacket', cat: 'Outerwear', tone: '#5B3A8E', tone2: '#F2A900', price: 120 },
  // ── Hats ──
  { id: 'c54', store: 'Mitchell & Ness', brand: 'Mitchell & Ness', name: 'Bulls Snapback', cat: 'Hats', tone: '#B23A2E', price: 34 },
  { id: 'c55', store: 'Mitchell & Ness', brand: 'Mitchell & Ness', name: 'Lakers Snapback', cat: 'Hats', tone: '#5B3A8E', tone2: '#F2A900', price: 34 },
  { id: 'c56', store: 'Mitchell & Ness', brand: 'New Era', name: 'Knicks 59FIFTY', cat: 'Hats', tone: '#1D428A', tone2: '#F58426', price: 42 },
  { id: 'c57', store: 'Nike', brand: 'Nike', name: 'Club Cap', cat: 'Hats', tone: '#1C1A17', price: 26 },
  { id: 'c58', store: 'Carhartt WIP', brand: 'Carhartt', name: 'Acrylic Watch Beanie', cat: 'Hats', tone: '#26241F', price: 22 },
  { id: 'c59', store: 'Uniqlo', brand: 'Uniqlo', name: 'Bucket Hat', cat: 'Hats', tone: '#D9CDB4', price: 20 },
  // ── Accessories ──
  { id: 'c60', store: 'Carhartt WIP', brand: 'Carhartt', name: 'Canvas Tote', cat: 'Accessories', tone: '#7C7556', price: 32 },
  { id: 'c61', store: 'Nike', brand: 'Nike', name: 'Everyday Crew Socks (3pk)', cat: 'Accessories', tone: '#F1ECE3', price: 22 },
];

Object.assign(window, { CATEGORIES, SLOT_OF, WARDROBE, MOODS, OCCASIONS, occColor, SLOTS, byCat, buildOutfit, figureColors, shade, outfitName, outfitPrice, DROPS, RECS, WASH, washThreshold, freshness, needsWash, WEARLOG_SEED, resolveOutfit, outfitToIds, IMPORT_STORES, CATALOG });
