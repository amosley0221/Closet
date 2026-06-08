// Home.jsx — Studio dashboard, wired up.
function HomeEmpty({ ctx }) {
  const { nav } = ctx;
  const Step = ({ icon, title, sub, onClick }) => (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 18, padding: 16, cursor: 'pointer', textAlign: 'left' }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: ST.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={icon} size={22} color={ST.ink} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 18, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontFamily: SANS, fontSize: 11.5, color: ST.mute, marginTop: 2 }}>{sub}</div>
      </div>
      <Icon name="chevron" size={18} color={ST.mute2} />
    </button>
  );
  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      <div style={{ padding: '58px 24px 0' }}>
        <div style={{ ...LABEL, marginBottom: 9 }}>Welcome to Closet</div>
        <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 500, lineHeight: 0.92, letterSpacing: -0.5 }}>Let's build<br />your closet.</div>
        <div style={{ fontFamily: SANS, fontSize: 13.5, color: ST.mute, marginTop: 14, lineHeight: 1.55, maxWidth: 300 }}>Add what you own, make an avatar that looks like you, then build outfits and track your wear.</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 2px' }}>
        <OutfitFigure scale={0.58} />
      </div>
      <div style={{ padding: '6px 20px 0', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <Step icon="search" title="Add from a store" sub="Search or paste a link — no photo needed" onClick={() => nav.openDiscover()} />
        <Step icon="camera" title="Add a photo" sub="Snap or upload an item you own" onClick={() => nav.addItem()} />
        <Step icon="user" title="Create your avatar" sub="Skin tone, hair & build that look like you" onClick={() => nav.openAvatar()} />
      </div>
      <div style={{ height: 120 }} />
    </div>
  );
}

function Home({ ctx }) {
  const { nav } = ctx;
  const outfit = ctx.todayOutfit;
  const drop = DROPS[0];
  const recent = [...ctx.wardrobe].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const totalValue = ctx.wardrobe.reduce((s, i) => s + i.price, 0);
  const avgWear = (ctx.wardrobe.reduce((s, i) => s + i.price / Math.max(1, i.wears), 0) / ctx.wardrobe.length);
  const dirty = ctx.wardrobe.filter((i) => needsWash(i) && i.cat !== 'Footwear' && i.cat !== 'Accessories');

  if (!ctx.wardrobe.length) return <HomeEmpty ctx={ctx} />;

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      {/* header */}
      <div style={{ padding: '58px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ ...LABEL, marginBottom: 9 }}>Friday, June 7 · 18° clear</div>
          <div style={{ fontFamily: SERIF, fontSize: 40, fontWeight: 500, lineHeight: 0.92, letterSpacing: -0.5 }}>Good<br />evening.</div>
        </div>
        <button onClick={() => nav.tab('you')} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid ' + ST.line, background: ST.card, fontFamily: SERIF, fontSize: 19, fontWeight: 600, color: ST.ink, cursor: 'pointer', flexShrink: 0 }}>M</button>
      </div>

      <div style={{ padding: '22px 20px 0', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* hero */}
        <div style={{ background: ST.card, borderRadius: 22, border: '1px solid ' + ST.line, padding: '20px 20px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={LABEL}>The look · Today</span>
            <span style={{ ...LABEL, color: ST.clay }}>Clear · Casual</span>
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 500, letterSpacing: -0.4, lineHeight: 1 }}>{outfitName('comfy', outfit)}</div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 2px' }}>
            <OutfitFigure scale={0.78} {...figureColors(outfit)} />
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 16 }}>
            {SLOTS.map(({ slot, label }) => outfit[slot] && (
              <div key={slot} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: outfit[slot].tone, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }} />
                <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 0.3, color: ST.mute }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 9 }}>
            <Btn style={{ flex: 1 }} onClick={() => nav.logFit(outfit)}>Wear today</Btn>
            <Btn variant="ghost" style={{ flex: 1 }} icon="shuffle" onClick={() => nav.build(null)}>Restyle</Btn>
          </div>
        </div>

        {/* mood quick picks */}
        <div>
          <div style={{ ...LABEL, marginBottom: 11, paddingLeft: 2 }}>Dress for a mood</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, margin: '0 -20px', padding: '0 20px 4px' }}>
            {MOODS.map((m) => (
              <Chip key={m.key} onClick={() => nav.build(m.key)}>{m.label}</Chip>
            ))}
          </div>
        </div>

        {/* laundry nudge */}
        {dirty.length > 0 && (
          <div>
            <div style={{ ...LABEL, marginBottom: 11, paddingLeft: 2 }}>Closet upkeep</div>
            <button onClick={() => nav.openLaundry()} style={{ width: '100%', textAlign: 'left', background: ST.card, border: '1px solid ' + ST.line, borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: ST.clayBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, color: ST.clay }}>{dirty.length}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 1.4, color: ST.clay, textTransform: 'uppercase', marginBottom: 4 }}>Time for laundry</div>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 17, letterSpacing: -0.2, lineHeight: 1 }}>{dirty.length} items need washing</div>
                <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{dirty.map((d) => d.name).slice(0, 2).join(' · ')}</div>
              </div>
              <Icon name="chevron" size={18} color={ST.clay} />
            </button>
          </div>
        )}

        {/* drop smart card */}
        <div>
          <div style={{ ...LABEL, marginBottom: 11, paddingLeft: 2 }}>Worth knowing</div>
          <button onClick={() => nav.tab('drops')} style={{ width: '100%', textAlign: 'left', background: ST.clayBg, borderRadius: 18, border: 'none', padding: 14, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}>
            <Thumb tone={drop.tone} tone2={drop.tone2} style={{ width: 54, height: 54, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 1.4, color: ST.clay, textTransform: 'uppercase', marginBottom: 4 }}>Releasing {drop.day} · {drop.time}</div>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 18, letterSpacing: -0.2, lineHeight: 1, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{drop.name}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute }}>{fmtMoney(drop.price)} · {drop.retailers.length} retailers</div>
            </div>
            <Icon name="chevron" size={18} color={ST.clay} />
          </button>
        </div>

        {/* stats */}
        <div style={{ display: 'flex', borderTop: '1px solid ' + ST.line, paddingTop: 16 }}>
          {[[String(ctx.wardrobe.length), 'In your closet'], [fmtMoney(avgWear), 'Avg / wear'], [ctx.savedOutfits.length + '', 'Saved fits']].map(([n, l], i) => (
            <button key={i} onClick={() => i === 2 ? nav.tab('you') : nav.tab('closet')} style={{ flex: 1, textAlign: i === 1 ? 'center' : i === 2 ? 'right' : 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 30, letterSpacing: -0.5, lineHeight: 1, color: ST.ink }}>{n}</div>
              <div style={{ fontFamily: SANS, fontSize: 9.5, letterSpacing: 0.3, color: ST.mute, marginTop: 5 }}>{l}</div>
            </button>
          ))}
        </div>

        {/* this week — worn */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
            <span style={{ ...LABEL, paddingLeft: 2 }}>This week</span>
            <button onClick={() => nav.openLog()} style={{ ...LABEL, color: ST.clay, background: 'none', border: 'none', cursor: 'pointer' }}>Wear log</button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px' }}>
            {ctx.wearLog.slice(0, 6).map((e) => {
              const o = resolveOutfit(e.items, ctx.wardrobe);
              return (
                <button key={e.id} onClick={() => nav.openLog()} style={{ flexShrink: 0, width: 96, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: 10, cursor: 'pointer' }}>
                  <div style={{ height: 92, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <OutfitFigure scale={0.28} {...figureColors(o)} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 4, background: occColor(e.occasion), flexShrink: 0 }} />
                    <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 500, color: ST.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.occasion}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* recent additions */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
            <span style={{ ...LABEL, paddingLeft: 2 }}>Recently added</span>
            <button onClick={() => nav.tab('closet')} style={{ ...LABEL, color: ST.clay, background: 'none', border: 'none', cursor: 'pointer' }}>All</button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -20px', padding: '0 20px 4px' }}>
            {recent.map((it) => (
              <button key={it.id} onClick={() => nav.openItem(it.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0 }}>
                <Thumb tone={it.tone} tone2={it.tone2} brand={it.brand !== '—' ? it.brand : ''} style={{ width: 88, height: 110 }} />
                <div style={{ fontFamily: SANS, fontSize: 10.5, color: ST.ink2, marginTop: 6, width: 88, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ height: 100 }} />
    </div>
  );
}
window.Home = Home;
