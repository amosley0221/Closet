// Drops.jsx — upcoming releases you follow, with price comparison + recs.
function daysUntil(iso) { const d = new Date(iso + 'T00:00'); return Math.round((d - new Date('2026-06-07')) / 86400000); }

function DropCard({ d, ctx }) {
  const [open, setOpen] = React.useState(false);
  const [notify, setNotify] = React.useState(d.id === 'd1');
  const days = daysUntil(d.date);
  const best = Math.min(...d.retailers.map((r) => r[1]));
  return (
    <div style={{ background: ST.card, border: '1px solid ' + ST.line, borderRadius: 20, overflow: 'hidden' }}>
      <div style={{ padding: 14, display: 'flex', gap: 13 }}>
        <Thumb tone={d.tone} tone2={d.tone2} style={{ width: 76, height: 76, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: ST.clay }}>{d.brand}</span>
            <span style={{ width: 3, height: 3, borderRadius: 2, background: ST.mute2 }} />
            <span style={{ fontFamily: SANS, fontSize: 9.5, color: ST.sage, fontWeight: 600 }}>{d.match}% your taste</span>
          </div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 18, letterSpacing: -0.3, lineHeight: 1.04 }}>{d.name}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 5 }}>{d.reason}</div>
        </div>
      </div>
      {/* date strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ textAlign: 'center', background: ST.bg2, borderRadius: 12, padding: '7px 12px', minWidth: 52 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, lineHeight: 0.9, color: ST.ink }}>{days}</div>
            <div style={{ fontFamily: SANS, fontSize: 8.5, letterSpacing: 0.5, color: ST.mute, textTransform: 'uppercase' }}>days</div>
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: ST.ink }}>{d.day} · {fmtDate(d.date).replace(/, \d{4}/, '')}</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute }}>{d.time} · from {fmtMoney(best)}</div>
          </div>
        </div>
        <button onClick={() => setNotify(!notify)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid ' + (notify ? ST.ink : ST.line2), background: notify ? ST.ink : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon name="bell" size={18} color={notify ? '#fff' : ST.ink2} fill={false} />
        </button>
      </div>
      {/* retailers */}
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: ST.bg2, border: 'none', borderTop: '1px solid ' + ST.line, cursor: 'pointer' }}>
        <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 600, color: ST.ink2, whiteSpace: 'nowrap' }}>Where to buy · {d.retailers.length}</span>
        <span style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s', display: 'flex' }}><Icon name="chevDown" size={16} color={ST.mute} /></span>
      </button>
      {open && (
        <div style={{ padding: '4px 14px 12px' }}>
          {d.retailers.map(([r, p], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < d.retailers.length - 1 ? '1px solid ' + ST.line : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: SANS, fontSize: 13, color: ST.ink }}>{r}</span>
                {p === best && <span style={{ fontFamily: SANS, fontSize: 9, fontWeight: 700, letterSpacing: 0.5, color: ST.good, background: '#EAF0E6', padding: '2px 6px', borderRadius: 5 }}>BEST</span>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: ST.ink }}>{fmtMoney(p)}</span>
                <Icon name="ext" size={15} color={ST.mute} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Drops({ ctx }) {
  const { nav } = ctx;
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      <div style={{ padding: '58px 24px 0' }}>
        <div style={{ ...LABEL, marginBottom: 7 }}>Tracking 6 brands</div>
        <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1 }}>Drops</div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: ST.mute, marginTop: 8, lineHeight: 1.5 }}>Releases picked for you from the brands &amp; silhouettes you already wear.</div>
      </div>

      <div style={{ padding: '22px 20px 0', display: 'flex', flexDirection: 'column', gap: 13 }}>
        {DROPS.map((d) => <DropCard key={d.id} d={d} ctx={ctx} />)}
      </div>

      {/* recommendations */}
      <div style={{ padding: '30px 24px 0' }}>
        <div style={{ ...LABEL, marginBottom: 4 }}>Recommended for your closet</div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: ST.mute, marginBottom: 14 }}>Gaps we noticed — not drops, just good fits.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {RECS.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 13, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: 12 }}>
              <Thumb tone={r.tone} style={{ width: 54, height: 54, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 500, color: ST.ink }}>{r.name}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 2 }}>{r.brand} · {fmtMoney(r.price)}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: ST.clay, marginTop: 4 }}>{r.reason}</div>
              </div>
              <button onClick={() => { const wid = 'rec-' + r.id; if (ctx.wishlist.some((x) => x.id === wid)) { ctx.removeWishlist(wid); } else { ctx.addToWishlist({ id: wid, name: r.name, brand: r.brand, cat: r.cat, tone: r.tone, price: r.price, sneaker: r.sneaker, store: 'Recommended' }); nav.toast('Saved to wishlist'); } }} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid ' + ST.line2, background: ctx.wishlist.some((x) => x.id === 'rec-' + r.id) ? ST.clayBg : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Icon name="heart" size={17} color={ctx.wishlist.some((x) => x.id === 'rec-' + r.id) ? ST.clay : ST.ink2} fill={ctx.wishlist.some((x) => x.id === 'rec-' + r.id)} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 110 }} />
    </div>
  );
}
window.Drops = Drops;
