// AvatarSheet.jsx — create an avatar that looks like you. Live preview wears a
// sample fit so skin/hair/build read in context.
function AvatarSheet({ avatar, onClose, onSave }) {
  const [a, setA] = React.useState(avatar);
  const set = (k, v) => setA((x) => ({ ...x, [k]: v }));
  const BUILD = { slim: 0.92, regular: 1, broad: 1.09 };

  const skins = ['#F4DBC3', '#EAC6A6', '#DCA77E', '#C08A62', '#9A6A47', '#6E4530', '#4A2E20', '#D9D2C6'];
  const hairColors = ['#1C1A17', '#3B2E26', '#6B4A2F', '#A9743B', '#CDA75A', '#9A9690'];
  const hairStyles = [['none', 'None'], ['short', 'Short'], ['curls', 'Curls'], ['long', 'Long']];

  const Swatch = ({ c, on, onClick, ring }) => (
    <button onClick={onClick} style={{ width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer', border: 'none', flexShrink: 0, boxShadow: on ? '0 0 0 2px ' + ST.bg + ', 0 0 0 4px ' + (ring || ST.ink) : 'inset 0 0 0 1px rgba(0,0,0,0.12)' }} />
  );

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 80, background: 'rgba(28,26,23,0.34)', display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', background: ST.bg, borderRadius: '26px 26px 0 0', padding: '10px 22px 30px', maxHeight: '92%', overflowY: 'auto', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: ST.line2, margin: '6px auto 14px' }} />
        <div style={{ ...LABEL, marginBottom: 5 }}>Your avatar</div>
        <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1, marginBottom: 14 }}>Make it look like you</div>

        {/* live preview */}
        <div style={{ background: ST.card, border: '1px solid ' + ST.line, borderRadius: 20, padding: '12px 0', display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <OutfitFigure scale={0.62} skin={a.skin} hair={a.hair} hairColor={a.hairColor} build={BUILD[a.build]}
            jacket="#7C7556" shirt="#F1ECE3" pants="#3A4252" shoes="#E9E5DE" />
        </div>

        {/* skin */}
        <div style={{ ...LABEL, fontSize: 9, marginBottom: 9 }}>Skin tone</div>
        <div style={{ display: 'flex', gap: 9, marginBottom: 18, flexWrap: 'wrap' }}>
          {skins.map((c) => <Swatch key={c} c={c} on={a.skin === c} onClick={() => set('skin', c)} />)}
        </div>

        {/* hair style */}
        <div style={{ ...LABEL, fontSize: 9, marginBottom: 9 }}>Hair</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {hairStyles.map(([k, label]) => <Chip key={k} active={a.hair === k} onClick={() => set('hair', k)}>{label}</Chip>)}
        </div>
        {a.hair !== 'none' && (
          <div style={{ display: 'flex', gap: 9, marginBottom: 18, flexWrap: 'wrap' }}>
            {hairColors.map((c) => <Swatch key={c} c={c} on={a.hairColor === c} ring={ST.clay} onClick={() => set('hairColor', c)} />)}
          </div>
        )}

        {/* build */}
        <div style={{ ...LABEL, fontSize: 9, marginBottom: 9, marginTop: a.hair !== 'none' ? 0 : 6 }}>Build</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {[['slim', 'Slim'], ['regular', 'Regular'], ['broad', 'Broad']].map(([k, label]) => (
            <Chip key={k} active={a.build === k} onClick={() => set('build', k)} style={{ flex: 1, textAlign: 'center', justifyContent: 'center' }}>{label}</Chip>
          ))}
        </div>

        <Btn icon="check" style={{ width: '100%' }} onClick={() => onSave(a)}>Save avatar</Btn>
      </div>
    </div>
  );
}
window.AvatarSheet = AvatarSheet;
