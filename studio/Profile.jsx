// Profile.jsx — "You" tab: wardrobe stats, saved fits, cost insights, settings.
function Profile({ ctx }) {
  const { nav } = ctx;
  const w = ctx.wardrobe;
  const totalValue = w.reduce((s, i) => s + i.price, 0);
  const avgCpw = w.length ? w.reduce((s, i) => s + i.price / Math.max(1, i.wears), 0) / w.length : 0;
  const mostWorn = [...w].sort((a, b) => b.wears - a.wears).slice(0, 3);
  const bestValue = [...w].filter((i) => i.wears > 3).sort((a, b) => (a.price / a.wears) - (b.price / b.wears))[0];
  const dirtyCount = w.filter((i) => needsWash(i) && i.cat !== 'Footwear' && i.cat !== 'Accessories').length;

  const Stat = ({ n, l }) => (
    <div style={{ flex: 1, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: '14px 14px' }}>
      <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 26, letterSpacing: -0.5, lineHeight: 0.9 }}>{n}</div>
      <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 0.3, color: ST.mute, marginTop: 6, textTransform: 'uppercase' }}>{l}</div>
    </div>
  );
  const SettingRow = ({ label, value, last }) => (
    <button onClick={() => nav.toast(label)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: last ? 'none' : '1px solid ' + ST.line, background: 'none', border: 'none', cursor: 'pointer' }}>
      <span style={{ fontFamily: SANS, fontSize: 14, color: ST.ink }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontFamily: SANS, fontSize: 12.5, color: ST.mute }}>{value}</span>
        <Icon name="chevron" size={16} color={ST.mute2} />
      </span>
    </button>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      {/* header */}
      <div style={{ padding: '58px 24px 0', display: 'flex', alignItems: 'center', gap: 15 }}>
        <button onClick={() => nav.openAvatar()} style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', position: 'relative', background: ST.bg2, border: '1px solid ' + ST.line, cursor: 'pointer', flexShrink: 0, padding: 0 }}>
          <div style={{ position: 'absolute', left: -8, top: 11 }}>
            <OutfitFigure scale={0.42} jacket="#7C7556" shirt="#F1ECE3" />
          </div>
          <div style={{ position: 'absolute', right: 2, bottom: 2, width: 20, height: 20, borderRadius: '50%', background: ST.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="edit" size={11} color="#fff" /></div>
        </button>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: SERIF, fontSize: 27, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1, whiteSpace: 'nowrap' }}>Your closet</div>
          <button onClick={() => nav.openAvatar()} style={{ fontFamily: SANS, fontSize: 12, color: ST.clay, marginTop: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Edit your avatar →</button>
        </div>
      </div>

      {/* stat tiles */}
      <div style={{ display: 'flex', gap: 10, padding: '22px 20px 0' }}>
        <Stat n={w.length} l="Items" />
        <Stat n={fmtMoney(totalValue)} l="Closet value" />
        <Stat n={w.length ? fmtMoney(avgCpw) : '—'} l="Avg / wear" />
      </div>

      {/* activity: wear log + wishlist + laundry */}
      <div style={{ display: 'flex', gap: 10, padding: '12px 20px 0' }}>
        <button onClick={() => nav.openLog()} style={{ flex: 1, textAlign: 'left', background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: 13, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}><Icon name="calendar" size={19} color={ST.ink} /><Icon name="chevron" size={14} color={ST.mute2} /></div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, letterSpacing: -0.2 }}>Wear log</div>
          <div style={{ fontFamily: SANS, fontSize: 10.5, color: ST.mute, marginTop: 2 }}>{ctx.wearLog.length} logged</div>
        </button>
        <button onClick={() => nav.openWishlist()} style={{ flex: 1, textAlign: 'left', background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: 13, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}><Icon name="heart" size={19} color={ST.clay} fill={ctx.wishlist.length > 0} /><Icon name="chevron" size={14} color={ST.mute2} /></div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, letterSpacing: -0.2 }}>Wishlist</div>
          <div style={{ fontFamily: SANS, fontSize: 10.5, color: ST.mute, marginTop: 2 }}>{ctx.wishlist.length} saved</div>
        </button>
        <button onClick={() => nav.openLaundry()} style={{ flex: 1, textAlign: 'left', background: dirtyCount ? ST.clayBg : ST.card, border: '1px solid ' + (dirtyCount ? 'transparent' : ST.line), borderRadius: 16, padding: 13, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}><Icon name="sparkle" size={19} color={dirtyCount ? ST.clay : ST.ink} fill={!!dirtyCount} /><Icon name="chevron" size={14} color={ST.mute2} /></div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, letterSpacing: -0.2, color: dirtyCount ? ST.clay : ST.ink }}>Laundry</div>
          <div style={{ fontFamily: SANS, fontSize: 10.5, color: dirtyCount ? ST.clay : ST.mute, marginTop: 2 }}>{dirtyCount ? dirtyCount + ' to wash' : 'All clean'}</div>
        </button>
      </div>

      {/* saved fits */}
      <div style={{ padding: '26px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px 12px' }}>
          <span style={LABEL}>Your saved fits · {ctx.savedOutfits.length}</span>
          <button onClick={() => nav.build(null)} style={{ ...LABEL, color: ST.clay, background: 'none', border: 'none', cursor: 'pointer' }}>+ New</button>
        </div>
        {ctx.savedOutfits.length === 0 ? (
          <div style={{ margin: '0 20px', padding: '22px', background: ST.card, border: '1px dashed ' + ST.line2, borderRadius: 18, textAlign: 'center' }}>
            <div style={{ fontFamily: SANS, fontSize: 13, color: ST.mute, marginBottom: 12 }}>No saved fits yet. Build one with a mood.</div>
            <Btn onClick={() => nav.build(null)} icon="hanger" style={{ display: 'inline-flex', padding: '0 22px', height: 44 }}>Open builder</Btn>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 4px' }}>
            {ctx.savedOutfits.map((s, i) => (
              <div key={i} style={{ flexShrink: 0, width: 130, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 18, padding: 12 }}>
                <div style={{ height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                  <OutfitFigure scale={0.42} {...figureColors(s.outfit)} />
                </div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 15, letterSpacing: -0.2, marginTop: 6 }}>{s.name}</div>
                <div style={{ fontFamily: SANS, fontSize: 10.5, color: ST.mute, marginTop: 2 }}>{fmtMoney(outfitPrice(s.outfit))}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* insights */}
      {w.length > 0 && (
      <div style={{ padding: '26px 24px 0' }}>
        <div style={{ ...LABEL, marginBottom: 12 }}>Insights</div>
        {bestValue && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, background: '#EAF0E6', borderRadius: 16, padding: 13, marginBottom: 11 }}>
            <Thumb tone={bestValue.tone} tone2={bestValue.tone2} style={{ width: 48, height: 48, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 1, textTransform: 'uppercase', color: ST.good, fontWeight: 600 }}>Best value piece</div>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, marginTop: 2 }}>{bestValue.name}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: ST.ink2, marginTop: 2 }}>{fmtMoney(bestValue.price / bestValue.wears)} / wear · {bestValue.wears} wears</div>
            </div>
          </div>
        )}
        <div style={{ background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: '4px 14px' }}>
          <div style={{ ...LABEL, fontSize: 9, padding: '12px 0 4px' }}>Most worn</div>
          {mostWorn.map((it, i) => (
            <button key={it.id} onClick={() => nav.openItem(it.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid ' + ST.line : 'none', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 600, color: ST.mute2, width: 18 }}>{i + 1}</span>
              <Thumb tone={it.tone} tone2={it.tone2} style={{ width: 40, height: 40, flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: SANS, fontSize: 13.5, fontWeight: 500 }}>{it.name}</span>
              <span style={{ fontFamily: SANS, fontSize: 12, color: ST.mute }}>{it.wears}×</span>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* settings */}
      <div style={{ padding: '26px 24px 0' }}>
        <div style={{ ...LABEL, marginBottom: 4 }}>Settings</div>
        <div style={{ background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: '0 16px', marginTop: 10 }}>
          <button onClick={() => nav.openAvatar()} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid ' + ST.line, background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontFamily: SANS, fontSize: 14, color: ST.ink }}>Your avatar</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ fontFamily: SANS, fontSize: 12.5, color: ST.mute }}>Edit</span><Icon name="chevron" size={16} color={ST.mute2} /></span>
          </button>
          <SettingRow label="Try-on default" value="Avatar" />
          <SettingRow label="Drop notifications" value="On" />
          <SettingRow label="Connected retailers" value="3" />
          <button onClick={() => { if (window.confirm('Reset all closet data? This clears your items, fits, wishlist and avatar on this device.')) ctx.resetData(); }} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontFamily: SANS, fontSize: 14, color: ST.clay }}>Reset all data</span>
            <Icon name="chevron" size={16} color={ST.mute2} />
          </button>
        </div>
      </div>
      <div style={{ height: 110 }} />
    </div>
  );
}
window.Profile = Profile;
