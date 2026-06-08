// WearLog.jsx — history of what you wore, by month, filterable by occasion.
function monthKey(iso) { const d = new Date(iso + 'T00:00'); return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }
function weekday(iso) { const d = new Date(iso + 'T00:00'); return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }); }

function WearLog({ ctx }) {
  const { nav } = ctx;
  const [filter, setFilter] = React.useState('All');
  const present = [...new Set(ctx.wearLog.map((e) => e.occasion))];
  const filters = ['All', ...OCCASIONS.map((o) => o.key).filter((k) => present.includes(k))];

  let entries = [...ctx.wearLog].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (filter !== 'All') entries = entries.filter((e) => e.occasion === filter);

  // group by month
  const groups = [];
  entries.forEach((e) => {
    const k = monthKey(e.date);
    let g = groups.find((x) => x.k === k);
    if (!g) { g = { k, items: [] }; groups.push(g); }
    g.items.push(e);
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      <TopBar onBack={nav.pop} title="Wear log" sub={ctx.wearLog.length + ' fits logged'} />

      {/* occasion filter */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 18px 6px' }}>
        {filters.map((f) => (
          <Chip key={f} active={filter === f} accent={f === 'All' ? ST.ink : occColor(f)} onClick={() => setFilter(f)}>{f}</Chip>
        ))}
      </div>

      <div style={{ padding: '10px 20px 0' }}>
        {groups.map((g) => (
          <div key={g.k} style={{ marginBottom: 22 }}>
            <div style={{ ...LABEL, marginBottom: 12, paddingLeft: 2 }}>{g.k}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {g.items.map((e) => {
                const outfit = resolveOutfit(e.items, ctx.wardrobe);
                const used = SLOTS.map(({ slot }) => outfit[slot]).filter(Boolean);
                return (
                  <div key={e.id} style={{ display: 'flex', gap: 13, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 18, padding: 13 }}>
                    <div style={{ width: 60, height: 80, background: ST.bg2, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                      <OutfitFigure scale={0.22} {...figureColors(outfit)} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                        <span style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: '#fff', background: occColor(e.occasion), padding: '3px 9px', borderRadius: 999 }}>{e.occasion}</span>
                        <span style={{ fontFamily: SANS, fontSize: 12, color: ST.mute }}>{weekday(e.date)}</span>
                      </div>
                      {e.note ? <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 16, letterSpacing: -0.2, lineHeight: 1.1, marginBottom: 6 }}>{e.note}</div> : null}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {used.map((it) => <span key={it.id} style={{ width: 16, height: 16, borderRadius: 5, background: it.tone, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)' }} />)}
                        </div>
                        <button onClick={() => nav.logFit(outfit, { occasion: e.occasion })} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', fontFamily: SANS, fontSize: 11.5, fontWeight: 600, color: ST.clay }}>
                          <Icon name="shuffle" size={14} color={ST.clay} /> Wear again
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {entries.length === 0 && <div style={{ textAlign: 'center', padding: '50px 30px', color: ST.mute, fontFamily: SANS, fontSize: 14 }}>Nothing logged for {filter} yet.</div>}
      </div>
      <div style={{ height: 30 }} />
    </div>
  );
}
window.WearLog = WearLog;
