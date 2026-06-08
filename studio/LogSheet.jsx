// LogSheet.jsx — bottom sheet to log a worn outfit with date + occasion.
function LogSheet({ ctx, init, onClose, onConfirm }) {
  const [date, setDate] = React.useState(init.date);
  const [occasion, setOccasion] = React.useState(init.occasion);
  const [note, setNote] = React.useState(init.note || '');
  const outfit = resolveOutfit(init.items, ctx.wardrobe);
  const pieces = SLOTS.filter(({ slot }) => outfit[slot]).length;

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(28,26,23,0.34)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: ST.bg, borderRadius: '26px 26px 0 0', padding: '10px 22px 30px', maxHeight: '88%', overflowY: 'auto', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: ST.line2, margin: '6px auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <div style={{ width: 70, height: 92, background: ST.card, border: '1px solid ' + ST.line, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
            <OutfitFigure scale={0.26} {...figureColors(outfit)} />
          </div>
          <div>
            <div style={{ ...LABEL, marginBottom: 5 }}>Log a fit</div>
            <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1 }}>What you wore</div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: ST.mute, marginTop: 6 }}>{pieces} pieces · keeps your log &amp; laundry current</div>
          </div>
        </div>

        {/* occasion */}
        <div style={{ ...LABEL, fontSize: 9, marginBottom: 9 }}>Occasion</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {OCCASIONS.map((o) => (
            <Chip key={o.key} active={occasion === o.key} accent={o.color} onClick={() => setOccasion(o.key)}>{o.key}</Chip>
          ))}
        </div>

        {/* date + note */}
        <div style={{ padding: '12px 0', borderTop: '1px solid ' + ST.line, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...LABEL, fontSize: 9 }}>Date worn</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ fontFamily: SANS, fontSize: 14, color: ST.ink, border: 'none', outline: 'none', background: 'transparent', textAlign: 'right' }} />
        </div>
        <div style={{ padding: '12px 0', borderTop: '1px solid ' + ST.line, borderBottom: '1px solid ' + ST.line, marginBottom: 18 }}>
          <div style={{ ...LABEL, fontSize: 9, marginBottom: 7 }}>Note (optional)</div>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Sam's wedding, client pitch…" style={{ width: '100%', fontFamily: SANS, fontSize: 14, color: ST.ink, border: 'none', outline: 'none', background: 'transparent' }} />
        </div>

        <Btn icon="check" style={{ width: '100%' }} onClick={() => onConfirm({ date, occasion, note: note.trim(), items: init.items })}>Add to wear log</Btn>
      </div>
    </div>
  );
}
window.LogSheet = LogSheet;
