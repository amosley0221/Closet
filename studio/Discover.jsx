// Discover.jsx — search the in-app catalog or paste a store link; add each
// result to your closet (owned) or your wishlist.
function parseLink(url) {
  const u = url.toLowerCase();
  const brands = [['jordan', 'Jordan'], ['nike', 'Nike'], ['goat', 'GOAT'], ['levi', "Levi's"], ['hm.', 'H&M'], ['cos', 'COS'], ['mitchell', 'Mitchell & Ness'], ['carhartt', 'Carhartt'], ['uniqlo', 'Uniqlo'], ['newbalance', 'New Balance'], ['adidas', 'adidas']];
  let brand = 'Store';
  for (const [k, v] of brands) if (u.includes(k)) { brand = v; break; }
  let name = 'Imported item';
  try {
    const seg = url.split('?')[0].split('#')[0].split('/').filter(Boolean).pop();
    if (seg) name = decodeURIComponent(seg).replace(/\.(html?|aspx|php)$/i, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).slice(0, 40);
  } catch (e) {}
  const shoey = /jordan|nike|goat|new balance|adidas|air|max|dunk|990|1906|forum/i.test(brand + ' ' + name);
  return { brand, name, cat: shoey ? 'Footwear' : 'Tops', tone: '#9DA3AC', price: 0, store: 'Link', sneaker: shoey };
}

function Discover({ ctx }) {
  const { nav } = ctx;
  const [q, setQ] = React.useState('');
  const [store, setStore] = React.useState('All');
  const [added, setAdded] = React.useState({}); // catalog id -> 'closet'
  const isLink = /^https?:\/\//i.test(q.trim());
  const preview = isLink ? parseLink(q.trim()) : null;

  let results = CATALOG.filter((p) => store === 'All' || p.store === store);
  if (q.trim() && !isLink) {
    const s = q.toLowerCase();
    results = results.filter((p) => (p.name + ' ' + p.brand + ' ' + p.store + ' ' + p.cat).toLowerCase().includes(s));
  }

  const wished = (id) => ctx.wishlist.some((x) => x.id === 'cat-' + id);
  const addCloset = (p) => { ctx.addItem({ id: 'imp' + Date.now(), name: p.name, brand: p.brand, cat: p.cat, tone: p.tone, tone2: p.tone2, tags: ['casual'], date: ctx.today, price: p.price, wears: 0, sneaker: p.sneaker }); setAdded((a) => ({ ...a, [p.id]: 1 })); nav.toast('Added to your closet'); };
  const addWish = (p, id) => { ctx.addToWishlist({ id: 'cat-' + id, name: p.name, brand: p.brand, cat: p.cat, tone: p.tone, tone2: p.tone2, price: p.price, store: p.store }); nav.toast('Saved to wishlist'); };

  const Card = ({ p, cid }) => (
    <div style={{ background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ position: 'relative' }}>
        <Thumb tone={p.tone} tone2={p.tone2} style={{ width: '100%', height: 130 }} />
        <button onClick={() => wished(cid) ? ctx.removeWishlist('cat-' + cid) : addWish(p, cid)} style={{ position: 'absolute', top: 8, right: 8, width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
          <Icon name="heart" size={16} color={wished(cid) ? ST.clay : ST.ink2} fill={wished(cid)} />
        </button>
        <span style={{ position: 'absolute', bottom: 8, left: 8, fontFamily: SANS, fontSize: 8.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: ST.ink2, background: 'rgba(255,255,255,0.85)', padding: '3px 7px', borderRadius: 6 }}>{p.store}</span>
      </div>
      <div style={{ padding: 11 }}>
        <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 500, color: ST.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
        <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 2, marginBottom: 10 }}>{p.brand} · {fmtMoney(p.price)}</div>
        {added[cid]
          ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: 38, borderRadius: 10, background: ST.bg2, fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: ST.good }}><Icon name="check" size={15} color={ST.good} sw={2.2} /> In closet</div>
          : <button onClick={() => addCloset({ ...p, id: cid })} style={{ width: '100%', height: 38, borderRadius: 10, border: 'none', background: ST.ink, color: ST.bg, fontFamily: SANS, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap' }}><Icon name="plus" size={15} color={ST.bg} sw={2.2} /> Add to closet</button>}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      <TopBar onBack={nav.pop} title="Add items" sub="Search stores or paste a link"
        right={<button onClick={() => nav.openWishlist()} style={{ height: 40, padding: '0 14px', borderRadius: 999, border: '1px solid ' + ST.line, background: ST.card, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Icon name="heart" size={16} color={ST.clay} /> <span style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 600 }}>{ctx.wishlist.length}</span></button>} />

      {/* search / link */}
      <div style={{ padding: '6px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 14, padding: '11px 14px' }}>
          <Icon name="search" size={18} color={ST.mute} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items, or paste a product link…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: SANS, fontSize: 14, color: ST.ink }} />
          {q && <button onClick={() => setQ('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="x" size={16} color={ST.mute} /></button>}
        </div>
      </div>

      {/* link preview */}
      {preview && (
        <div style={{ padding: '14px 22px 0' }}>
          <div style={{ ...LABEL, marginBottom: 9 }}>From your link</div>
          <div style={{ background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: 13, display: 'flex', alignItems: 'center', gap: 13 }}>
            <Thumb tone={preview.tone} style={{ width: 56, height: 56, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preview.name}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 2 }}>{preview.brand} · {preview.cat}</div>
            </div>
            <button onClick={() => { addCloset({ ...preview, id: 'lnk' }); setQ(''); }} style={{ height: 38, padding: '0 14px', borderRadius: 10, border: 'none', background: ST.ink, color: ST.bg, fontFamily: SANS, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>Add</button>
          </div>
        </div>
      )}

      {/* store chips */}
      {!isLink && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '16px 22px 4px' }}>
          {IMPORT_STORES.map((s) => <Chip key={s} active={store === s} onClick={() => setStore(s)}>{s}</Chip>)}
        </div>
      )}

      {/* results */}
      {!isLink && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, padding: '14px 20px 0' }}>
          {results.map((p) => <Card key={p.id} p={p} cid={p.id} />)}
        </div>
      )}
      {!isLink && results.length === 0 && <div style={{ textAlign: 'center', padding: '50px 30px', color: ST.mute, fontFamily: SANS, fontSize: 14 }}>No matches. Try a store name or paste a link.</div>}
      <div style={{ height: 40 }} />
    </div>
  );
}
window.Discover = Discover;
