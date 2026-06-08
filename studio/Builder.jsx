// Builder.jsx — Mood-driven outfit builder with live figure + slot swapping.
const MOOD_OCC = { allblack: 'Night out', retro: 'Night out', interview: 'Work', date: 'Date', comfy: 'Casual', minimal: 'Work' };
function BuilderEmpty({ ctx }) {
  const { nav } = ctx;
  return (
    <div style={{ height: '100%', background: ST.bg, color: ST.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: ST.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}><Icon name="hanger" size={28} color={ST.ink} /></div>
      <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, letterSpacing: -0.4, marginBottom: 10 }}>Nothing to style yet</div>
      <div style={{ fontFamily: SANS, fontSize: 13.5, color: ST.mute, lineHeight: 1.55, marginBottom: 22, maxWidth: 280 }}>Add a few items to your closet and the builder will style them onto your avatar.</div>
      <div style={{ display: 'flex', gap: 9 }}>
        <Btn icon="search" onClick={() => nav.openDiscover()} style={{ padding: '0 20px' }}>Add from store</Btn>
        <Btn variant="ghost" icon="camera" onClick={() => nav.addItem()} style={{ padding: '0 20px' }}>Add photo</Btn>
      </div>
    </div>
  );
}
function Builder({ ctx }) {
  const { nav } = ctx;
  const [mood, setMood] = React.useState(ctx.builderMood || null);
  const [occasion, setOccasion] = React.useState('Everyday');
  const [seed, setSeed] = React.useState(0);
  const [outfit, setOutfit] = React.useState(() => buildOutfit(ctx.builderMood || null, ctx.wardrobe, 0));
  const [pickSlot, setPickSlot] = React.useState(null);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => { setOutfit(buildOutfit(mood, ctx.wardrobe, seed)); setSaved(false); }, [mood, seed]);

  const moodObj = MOODS.find((m) => m.key === mood);
  const total = outfitPrice(outfit);
  const used = SLOTS.filter(({ slot }) => outfit[slot]).length;

  const swap = (slot, item) => { setOutfit((o) => ({ ...o, [slot]: item })); setPickSlot(null); setSaved(false); };

  if (!ctx.wardrobe.length) return <BuilderEmpty ctx={ctx} />;

  return (
    <div style={{ height: '100%', position: 'relative', background: ST.bg, color: ST.ink, overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto' }}>
        {/* header */}
        <div style={{ padding: '58px 24px 0' }}>
          <div style={{ ...LABEL, marginBottom: 7 }}>Outfit builder</div>
          <div style={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1 }}>Build a fit</div>
        </div>

        {/* mood picker */}
        <div style={{ marginTop: 20 }}>
          <div style={{ ...LABEL, padding: '0 24px 10px' }}>What's the mood?</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 24px 4px' }}>
            {MOODS.map((m) => (
              <Chip key={m.key} active={mood === m.key} accent={ST.clay} onClick={() => setMood(mood === m.key ? null : m.key)}>{m.label}</Chip>
            ))}
          </div>
          <div style={{ padding: '10px 24px 0', minHeight: 18 }}>
            <span style={{ fontFamily: SANS, fontSize: 12, color: moodObj ? ST.clay : ST.mute }}>
              {moodObj ? `“${moodObj.note}” — picked from what you own` : 'Pick a mood, or style it yourself below'}
            </span>
          </div>
        </div>

        {/* live figure */}
        <div style={{ margin: '8px 20px 0', background: ST.card, borderRadius: 24, border: '1px solid ' + ST.line, padding: '18px 18px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, letterSpacing: -0.3, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mood ? outfitName(mood, outfit) : 'Custom fit'}</div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 4 }}>{used} pieces · {fmtMoney(total)} total</div>
            </div>
            <button onClick={() => nav.toast('Try-on view — upload a photo of you')} style={{ flexShrink: 0, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6, background: ST.bg2, border: '1px solid ' + ST.line, borderRadius: 999, padding: '7px 12px', cursor: 'pointer', fontFamily: SANS, fontSize: 11, fontWeight: 500, color: ST.ink2 }}>
              <Icon name="user" size={14} color={ST.ink2} /> On me
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', margin: '2px 0' }}>
            <OutfitFigure scale={0.82} {...figureColors(outfit)} />
          </div>
          <Btn variant="ghost" icon="shuffle" onClick={() => setSeed((s) => s + 1)} style={{ width: '100%', height: 44 }}>Shuffle the mix</Btn>
        </div>

        {/* slots */}
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ ...LABEL, marginBottom: 10, paddingLeft: 4 }}>The pieces · tap to swap</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {SLOTS.map(({ slot, cat, label }) => {
              const it = outfit[slot];
              return (
                <button key={slot} onClick={() => setPickSlot(slot)} style={{ display: 'flex', alignItems: 'center', gap: 13, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 16, padding: 11, cursor: 'pointer', textAlign: 'left' }}>
                  {it ? <Thumb tone={it.tone} tone2={it.tone2} style={{ width: 50, height: 50, flexShrink: 0 }} />
                      : <div style={{ width: 50, height: 50, borderRadius: 12, border: '1.5px dashed ' + ST.line2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={18} color={ST.mute2} /></div>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...LABEL, fontSize: 9, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 500, color: it ? ST.ink : ST.mute, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it ? it.name : 'Add a piece'}</div>
                    {it && <div style={{ fontFamily: SANS, fontSize: 11, color: ST.mute, marginTop: 1 }}>{it.brand}</div>}
                  </div>
                  <Icon name="chevDown" size={18} color={ST.mute2} />
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ height: 130 }} />
      </div>

      {/* save bar */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 20px 30px', background: 'linear-gradient(transparent, ' + ST.bg + ' 22%)', display: 'flex', gap: 9 }}>
        <Btn variant="ghost" icon={saved ? 'check' : 'heart'} onClick={() => { if (!saved) { ctx.saveOutfit({ mood, outfit, name: mood ? outfitName(mood, outfit) : 'Custom fit' }); setSaved(true); nav.toast('Saved to your fits'); } }} style={{ flex: 1 }}>
          {saved ? 'Saved' : 'Save fit'}
        </Btn>
        <Btn icon="check" onClick={() => nav.logFit(outfit, { occasion: MOOD_OCC[mood] || 'Casual' })} style={{ flex: 1.3 }}>I'm wearing this</Btn>
      </div>

      {/* slot picker sheet */}
      {pickSlot && (() => {
        const meta = SLOTS.find((s) => s.slot === pickSlot);
        const pool = byCat(meta.cat, ctx.wardrobe);
        return (
          <div onClick={() => setPickSlot(null)} style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(28,26,23,0.32)', display: 'flex', alignItems: 'flex-end' }}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: ST.bg, borderRadius: '24px 24px 0 0', padding: '10px 18px 30px', maxHeight: '78%', overflowY: 'auto', boxShadow: '0 -10px 40px rgba(0,0,0,0.18)' }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: ST.line2, margin: '6px auto 14px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 22, letterSpacing: -0.3 }}>Swap your {meta.label.toLowerCase()}</div>
                <button onClick={() => swap(pickSlot, null)} style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: ST.clay, background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11 }}>
                {pool.map((it) => {
                  const sel = outfit[pickSlot] && outfit[pickSlot].id === it.id;
                  return (
                    <button key={it.id} onClick={() => swap(pickSlot, it)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}>
                      <div style={{ position: 'relative' }}>
                        <Thumb tone={it.tone} tone2={it.tone2} style={{ width: '100%', height: 92, boxShadow: sel ? '0 0 0 2px ' + ST.ink : 'inset 0 0 0 1px rgba(0,0,0,0.06)', opacity: needsWash(it) ? 0.55 : 1 }} />
                        {sel && <div style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: '50%', background: ST.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={13} color="#fff" sw={2.4} /></div>}
                        {needsWash(it) && <div style={{ position: 'absolute', top: 6, left: 6, background: ST.clay, color: '#fff', fontFamily: SANS, fontSize: 8, fontWeight: 700, letterSpacing: 0.5, padding: '2px 6px', borderRadius: 5 }}>WASH</div>}
                      </div>
                      <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 500, color: ST.ink, marginTop: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
window.Builder = Builder;
