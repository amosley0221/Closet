// Closet.jsx — searchable, filterable grid of the wardrobe.
function Closet({ ctx }) {
  const { nav } = ctx;
  const [cat, setCat] = React.useState('All');
  const [q, setQ] = React.useState('');
  const [sort, setSort] = React.useState('recent');

  let items = ctx.wardrobe.filter((i) => (cat === 'All' || i.cat === cat));
  if (q.trim()) {
    const s = q.toLowerCase();
    items = items.filter((i) => (i.name + ' ' + i.brand + ' ' + i.cat).toLowerCase().includes(s));
  }
  items = [...items].sort((a, b) => sort === 'recent' ? (a.date < b.date ? 1 : -1) : b.wears - a.wears);

  const cats = ['All', ...CATEGORIES];
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c, ctx.wardrobe.filter((i) => i.cat === c).length]));

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      {/* header */}
      <div style={{ padding: '58px 22px 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ ...LABEL, marginBottom: 7 }}>{ctx.wardrobe.length} pieces</div>
          <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1 }}>Your Closet</div>
        </div>
        <button onClick={() => nav.addItem()} style={{ height: 40, padding: '0 16px 0 12px', borderRadius: 999, border: 'none', background: ST.ink, color: ST.bg, fontFamily: SANS, fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          <Icon name="plus" size={17} color={ST.bg} sw={2.2} /> Add
        </button>
      </div>

      {/* search */}
      <div style={{ padding: '18px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 14, padding: '11px 14px' }}>
          <Icon name="search" size={18} color={ST.mute} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items, brands…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: SANS, fontSize: 14, color: ST.ink }} />
          {q && <button onClick={() => setQ('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><Icon name="x" size={16} color={ST.mute} /></button>}
        </div>
      </div>

      {/* category chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '16px 22px 4px' }}>
        {cats.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}{c !== 'All' && counts[c] ? ` ${counts[c]}` : ''}</Chip>
        ))}
      </div>

      {/* sort row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 4px' }}>
        <span style={{ fontFamily: SANS, fontSize: 12, color: ST.mute }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        <button onClick={() => setSort(sort === 'recent' ? 'worn' : 'recent')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: SANS, fontSize: 12, fontWeight: 500, color: ST.ink2 }}>
          <Icon name="sliders" size={15} color={ST.ink2} /> {sort === 'recent' ? 'Recently added' : 'Most worn'}
        </button>
      </div>

      {/* grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, padding: '14px 20px 0' }}>
        {items.map((it) => (
          <button key={it.id} onClick={() => nav.openItem(it.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ position: 'relative' }}>
              <ItemPhoto slotId={'garment-' + it.id} tone={it.tone} fit="contain" label={it.name} radius={16} style={{ width: '100%', height: 168 }} />
              {it.sneaker && <div style={{ position: 'absolute', top: 9, right: 9, background: 'rgba(255,255,255,0.85)', borderRadius: 7, padding: '3px 7px', fontFamily: SANS, fontSize: 8.5, fontWeight: 600, letterSpacing: 0.5, color: ST.ink, pointerEvents: 'none' }}>SNEAKER</div>}
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: ST.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
                <span style={{ fontFamily: SANS, fontSize: 11, color: ST.mute }}>{it.brand}</span>
                <span style={{ fontFamily: SANS, fontSize: 10.5, color: ST.mute2 }}>{it.wears}× worn</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {ctx.wardrobe.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 30px' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: ST.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Icon name="closet" size={26} color={ST.ink} /></div>
          <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Your closet is empty</div>
          <div style={{ fontFamily: SANS, fontSize: 13, color: ST.mute, lineHeight: 1.5, marginBottom: 18, maxWidth: 260, marginLeft: 'auto', marginRight: 'auto' }}>Add items from a store or upload your own to get started.</div>
          <div style={{ display: 'flex', gap: 9, justifyContent: 'center' }}>
            <Btn icon="search" onClick={() => nav.openDiscover()} style={{ padding: '0 20px' }}>From store</Btn>
            <Btn variant="ghost" icon="camera" onClick={() => nav.addItem()} style={{ padding: '0 20px' }}>Add photo</Btn>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 30px', color: ST.mute, fontFamily: SANS, fontSize: 14 }}>No items match.</div>
      ) : null}
      <div style={{ height: 110 }} />
    </div>
  );
}
window.Closet = Closet;
