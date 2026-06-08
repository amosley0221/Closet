// Laundry.jsx — what needs washing, derived from logged wears.
function Laundry({ ctx }) {
  const { nav } = ctx;
  const tracked = ctx.wardrobe.filter((i) => i.cat !== 'Accessories' && i.cat !== 'Footwear');
  const dirty = tracked.filter((i) => needsWash(i)).sort((a, b) => freshness(b) - freshness(a));
  const aging = tracked.filter((i) => !needsWash(i) && freshness(i) >= 0.5).sort((a, b) => freshness(b) - freshness(a));
  const fresh = tracked.filter((i) => freshness(i) < 0.5);

  const Bar = ({ it }) => {
    const f = freshness(it);
    const c = needsWash(it) ? ST.clay : f >= 0.5 ? '#C08A3E' : ST.sage;
    return (
      <div style={{ height: 6, borderRadius: 3, background: ST.bg2, overflow: 'hidden', marginTop: 8 }}>
        <div style={{ height: '100%', width: Math.max(6, f * 100) + '%', background: c, borderRadius: 3 }} />
      </div>
    );
  };
  const Item = ({ it }) => {
    const dirtyIt = needsWash(it);
    return (
      <div style={{ display: 'flex', gap: 13, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: 12 }}>
        <Thumb tone={it.tone} tone2={it.tone2} style={{ width: 52, height: 52, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 500, color: ST.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
            <span style={{ flexShrink: 0, fontFamily: SANS, fontSize: 10.5, color: ST.mute }}>{it.fresh || 0}/{washThreshold(it)} wears</span>
          </div>
          <Bar it={it} />
          <div style={{ fontFamily: SANS, fontSize: 11, color: dirtyIt ? ST.clay : ST.mute, marginTop: 6 }}>
            {dirtyIt ? 'Needs washing — hidden from suggestions' : freshness(it) >= 0.5 ? 'One more wear, then wash' : 'Fresh'}
          </div>
        </div>
        {dirtyIt && (
          <button onClick={() => ctx.washItems([it.id])} style={{ alignSelf: 'center', flexShrink: 0, fontFamily: SANS, fontSize: 12, fontWeight: 600, color: ST.bg, background: ST.ink, border: 'none', borderRadius: 999, padding: '9px 14px', cursor: 'pointer' }}>Washed</button>
        )}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      <TopBar onBack={nav.pop} title="Laundry" sub="Tracked from your wear log" />

      {/* summary */}
      <div style={{ padding: '4px 20px 0' }}>
        <div style={{ background: dirty.length ? ST.clayBg : '#EAF0E6', borderRadius: 20, padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 40, letterSpacing: -1, lineHeight: 0.9, color: dirty.length ? ST.clay : ST.good }}>{dirty.length}</div>
            <div style={{ ...LABEL, fontSize: 9, marginTop: 6 }}>{dirty.length === 1 ? 'item needs washing' : 'items need washing'}</div>
          </div>
          <div style={{ flex: 1, fontFamily: SANS, fontSize: 12, color: ST.ink2, lineHeight: 1.5 }}>
            {dirty.length ? 'A wash now frees up your most-worn basics for the week ahead.' : "You're all caught up. Nice."}
          </div>
        </div>
        {dirty.length > 0 && (
          <Btn onClick={() => { ctx.washAll(); nav.toast('Marked ' + dirty.length + ' items clean'); }} icon="check" style={{ width: '100%', marginTop: 12 }}>Did a wash — mark all clean</Btn>
        )}
      </div>

      {/* lists */}
      <div style={{ padding: '22px 20px 0' }}>
        {dirty.length > 0 && <><div style={{ ...LABEL, marginBottom: 11, paddingLeft: 2 }}>Needs washing</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>{dirty.map((it) => <Item key={it.id} it={it} />)}</div></>}
        {aging.length > 0 && <><div style={{ ...LABEL, marginBottom: 11, paddingLeft: 2 }}>Wearing thin</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>{aging.map((it) => <Item key={it.id} it={it} />)}</div></>}
        <div style={{ ...LABEL, marginBottom: 11, paddingLeft: 2 }}>Fresh · {fresh.length}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{fresh.map((it) => <Item key={it.id} it={it} />)}</div>
      </div>
      <div style={{ height: 30 }} />
    </div>
  );
}
window.Laundry = Laundry;
