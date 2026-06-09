// ItemDetail.jsx — one wardrobe item: ownership, cost-per-wear, pairings, drops.
function ItemDetail({ ctx, id }) {
  const { nav } = ctx;
  const it = ctx.wardrobe.find((x) => x.id === id);
  if (!it) return <div style={{ padding: 80, fontFamily: SANS }}>Item not found.</div>;
  const cpw = it.price / Math.max(1, it.wears);
  const months = monthsOwned(it.date);
  const relatedDrop = it.sneaker ? DROPS.find((d) => d.brand === it.brand) : null;
  const pairs = ctx.wardrobe.filter((x) => x.id !== it.id && x.cat !== it.cat && x.tags.some((t) => it.tags.includes(t))).slice(0, 4);
  const slot = SLOT_OF[it.cat];
  const washable = it.cat !== 'Footwear' && it.cat !== 'Accessories';
  const fresh = freshness(it);
  const dirty = needsWash(it);
  const recentWears = ctx.wearLog.filter((e) => Object.values(e.items).includes(it.id)).slice(0, 4);

  const Fact = ({ k, v, accent }) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 24, letterSpacing: -0.4, color: accent || ST.ink, lineHeight: 1 }}>{v}</div>
      <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 0.4, color: ST.mute, marginTop: 5, textTransform: 'uppercase' }}>{k}</div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      <TopBar onBack={nav.pop} right={<button onClick={() => nav.toast('Edit item')} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid ' + ST.line, background: ST.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="edit" size={18} /></button>} />

      {/* hero photo */}
      <div style={{ padding: '4px 22px 0' }}>
        <ItemImage src={it.image} slotId={'garment-' + it.id} tone={it.tone} fit="contain" label={'Drop a photo of your ' + it.name} radius={22} style={{ width: '100%', height: 300 }} />
      </div>

      <div style={{ padding: '20px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: ST.clay, background: ST.clayBg, padding: '4px 10px', borderRadius: 999 }}>{it.cat}</span>
          {it.sneaker && <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: ST.ink2, background: ST.bg2, padding: '4px 10px', borderRadius: 999 }}>Sneaker</span>}
          {washable && dirty && <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: '#fff', background: ST.clay, padding: '4px 10px', borderRadius: 999 }}>Needs wash</span>}
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.02 }}>{it.name}</div>
        <div style={{ fontFamily: SANS, fontSize: 13, color: ST.mute, marginTop: 6 }}>{it.brand}</div>

        {/* cost per wear headline */}
        <div style={{ marginTop: 20, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 20, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ ...LABEL, marginBottom: 6 }}>Cost per wear</div>
              <div style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 600, letterSpacing: -1, lineHeight: 0.9, color: cpw < 5 ? ST.good : ST.ink }}>{fmtMoney(cpw)}</div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: SANS, fontSize: 11.5, color: ST.mute, lineHeight: 1.7 }}>
              {fmtMoney(it.price)} paid<br />÷ {it.wears} wears
            </div>
          </div>
          {/* progress toward "worth it" */}
          <div style={{ marginTop: 16 }}>
            <div style={{ height: 6, borderRadius: 3, background: ST.bg2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: Math.min(100, it.wears / 50 * 100) + '%', background: ST.sage, borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 8 }}>
              {cpw < 5 ? 'Great value — worn often.' : it.wears < 12 ? 'Wear it more to bring this down.' : 'Earning its keep.'}
            </div>
          </div>
        </div>

        {/* ownership facts */}
        <div style={{ display: 'flex', marginTop: 18, padding: '4px 2px' }}>
          <Fact k="Bought" v={fmtDate(it.date).replace(', ' + new Date(it.date + 'T00:00').getFullYear(), '')} />
          <Fact k="Owned" v={months >= 12 ? Math.floor(months / 12) + 'y' : months + 'mo'} />
          <Fact k="Worn" v={it.wears + '×'} />
          <Fact k="Paid" v={fmtMoney(it.price)} />
        </div>

        {/* actions */}
        <div style={{ display: 'flex', gap: 9, marginTop: 20 }}>
          <Btn icon="hanger" style={{ flex: 1 }} onClick={() => nav.build(null)}>Add to a fit</Btn>
          <Btn variant="ghost" style={{ flex: 1 }} onClick={() => { if (slot) nav.logFit({ [slot]: it }); else { ctx.logWear(it.id); nav.toast('Logged a wear'); } }}>Log a wear</Btn>
        </div>

        {/* freshness / laundry */}
        {washable && (
          <div style={{ marginTop: 18, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 20, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={LABEL}>Freshness</div>
              <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 600, color: dirty ? ST.clay : fresh >= 0.5 ? '#C08A3E' : ST.good }}>{dirty ? 'Needs washing' : fresh >= 0.5 ? 'Wearing thin' : 'Fresh'}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: ST.bg2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: Math.max(6, fresh * 100) + '%', background: dirty ? ST.clay : fresh >= 0.5 ? '#C08A3E' : ST.sage, borderRadius: 3 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
              <span style={{ fontFamily: SANS, fontSize: 11, color: ST.mute }}>{it.fresh || 0} of {washThreshold(it)} wears since wash</span>
              {(it.fresh || 0) > 0 && <button onClick={() => { ctx.washItems([it.id]); nav.toast('Marked as washed'); }} style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: ST.bg, background: ST.ink, border: 'none', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}>Mark washed</button>}
            </div>
          </div>
        )}

        {/* worn recently */}
        {recentWears.length > 0 && (
          <div style={{ marginTop: 26 }}>
            <div style={{ ...LABEL, marginBottom: 11 }}>Worn recently</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentWears.map((e) => (
                <button key={e.id} onClick={() => nav.openLog()} style={{ display: 'flex', alignItems: 'center', gap: 11, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 14, padding: '11px 13px', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 5, background: occColor(e.occasion), flexShrink: 0 }} />
                  <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 500, color: ST.ink }}>{e.occasion}</span>
                  {e.note ? <span style={{ fontFamily: SANS, fontSize: 12, color: ST.mute, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>· {e.note}</span> : null}
                  <span style={{ fontFamily: SANS, fontSize: 12, color: ST.mute, marginLeft: 'auto', flexShrink: 0 }}>{fmtDate(e.date).replace(/, \d{4}/, '')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* related drop */}
        {relatedDrop && (
          <div style={{ marginTop: 26 }}>
            <div style={{ ...LABEL, marginBottom: 11 }}>Because you own these</div>
            <button onClick={() => nav.tab('drops')} style={{ width: '100%', textAlign: 'left', background: ST.clayBg, border: 'none', borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
              <Thumb tone={relatedDrop.tone} tone2={relatedDrop.tone2} style={{ width: 52, height: 52, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 1.3, textTransform: 'uppercase', color: ST.clay, marginBottom: 4 }}>New drop · {relatedDrop.day} {relatedDrop.time}</div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{relatedDrop.name}</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 3 }}>{fmtMoney(relatedDrop.price)} · {relatedDrop.match}% your taste</div>
              </div>
              <Icon name="chevron" size={18} color={ST.clay} />
            </button>
          </div>
        )}

        {/* pairings */}
        {pairs.length > 0 && (
          <div style={{ marginTop: 26 }}>
            <div style={{ ...LABEL, marginBottom: 11 }}>Goes well with</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -24px', padding: '0 24px 4px' }}>
              {pairs.map((p) => (
                <button key={p.id} onClick={() => nav.openItem(p.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
                  <Thumb tone={p.tone} tone2={p.tone2} style={{ width: 96, height: 120 }} />
                  <div style={{ fontFamily: SANS, fontSize: 11, color: ST.ink2, marginTop: 6, width: 96, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}
window.ItemDetail = ItemDetail;
