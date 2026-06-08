// Wishlist.jsx — items you've saved but don't own yet. Buy one → it moves to
// your closet.
function Wishlist({ ctx }) {
  const { nav } = ctx;
  const total = ctx.wishlist.reduce((s, i) => s + (i.price || 0), 0);

  const buy = (it) => {
    ctx.addItem({ id: 'imp' + Date.now(), name: it.name, brand: it.brand, cat: it.cat, tone: it.tone, tone2: it.tone2, tags: ['casual'], date: ctx.today, price: it.price || 0, wears: 0, sneaker: it.sneaker });
    ctx.removeWishlist(it.id);
    nav.toast('Moved to your closet');
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      <TopBar onBack={nav.pop} title="Wishlist" sub={ctx.wishlist.length + ' saved · ' + fmtMoney(total)}
        right={<button onClick={() => nav.openDiscover()} style={{ height: 40, padding: '0 14px', borderRadius: 999, border: 'none', background: ST.ink, color: ST.bg, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: SANS, fontSize: 12.5, fontWeight: 600 }}><Icon name="plus" size={16} color={ST.bg} sw={2.2} /> Add</button>} />

      {ctx.wishlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 36px' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: ST.clayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Icon name="heart" size={26} color={ST.clay} /></div>
          <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Nothing saved yet</div>
          <div style={{ fontFamily: SANS, fontSize: 13, color: ST.mute, lineHeight: 1.5, marginBottom: 18 }}>Search stores or tap the heart on any item or drop to save it here.</div>
          <Btn onClick={() => nav.openDiscover()} icon="search" style={{ display: 'inline-flex', padding: '0 22px', height: 46 }}>Browse items</Btn>
        </div>
      ) : (
        <div style={{ padding: '6px 20px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {ctx.wishlist.map((it) => (
            <div key={it.id} style={{ display: 'flex', gap: 13, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: 12 }}>
              <Thumb tone={it.tone} tone2={it.tone2} style={{ width: 64, height: 64, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 2 }}>{it.brand} · {fmtMoney(it.price || 0)}{it.store ? ' · ' + it.store : ''}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 9 }}>
                  <button onClick={() => buy(it)} style={{ height: 34, padding: '0 13px', borderRadius: 9, border: 'none', background: ST.ink, color: ST.bg, fontFamily: SANS, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}><Icon name="check" size={14} color={ST.bg} sw={2.2} /> I bought this</button>
                  <button onClick={() => ctx.removeWishlist(it.id)} style={{ height: 34, padding: '0 13px', borderRadius: 9, border: '1px solid ' + ST.line2, background: 'transparent', color: ST.ink2, fontFamily: SANS, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 40 }} />
    </div>
  );
}
window.Wishlist = Wishlist;
