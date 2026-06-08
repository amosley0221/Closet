// AddItem.jsx — capture a new piece; writes into live wardrobe state.
function AddItem({ ctx }) {
  const { nav } = ctx;
  const [name, setName] = React.useState('');
  const [brand, setBrand] = React.useState('');
  const [cat, setCat] = React.useState('');
  const [tone, setTone] = React.useState('#3A4252');
  const [date, setDate] = React.useState('2026-06-07');
  const [price, setPrice] = React.useState('');
  const draftId = React.useRef('n' + Date.now()).current;

  const palette = ['#1C1A17', '#3A4252', '#7C7556', '#B23A2E', '#566E86', '#D9CDB4', '#6E2F33', '#E9E5DE'];
  const valid = name.trim() && cat;

  const field = { fontFamily: SANS, fontSize: 15, color: ST.ink, border: 'none', outline: 'none', background: 'transparent', width: '100%' };
  const Row = ({ label, children }) => (
    <div style={{ padding: '13px 0', borderBottom: '1px solid ' + ST.line }}>
      <div style={{ ...LABEL, fontSize: 9, marginBottom: 7 }}>{label}</div>
      {children}
    </div>
  );

  const save = () => {
    ctx.addItem({ id: draftId, name: name.trim(), brand: brand.trim() || '—', cat, tone, tags: ['casual'], date, price: Number(price) || 0, wears: 0, sneaker: cat === 'Footwear' });
    nav.toast('Added to your closet');
    nav.pop();
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: ST.bg, color: ST.ink }}>
      <TopBar onBack={nav.pop} title="Add an item" right={<button onClick={() => nav.pop()} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid ' + ST.line, background: ST.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Icon name="x" size={18} /></button>} />

      <div style={{ padding: '6px 24px 0' }}>
        {/* import from a store */}
        <button onClick={() => nav.openDiscover()} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, background: ST.clayBg, border: 'none', borderRadius: 16, padding: '13px 14px', cursor: 'pointer', marginBottom: 16, textAlign: 'left' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: ST.card, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="search" size={18} color={ST.clay} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 600, color: ST.ink }}>Search &amp; import from a store</div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: ST.ink2, marginTop: 2 }}>Add things you bought online — no photo needed</div>
          </div>
          <Icon name="chevron" size={18} color={ST.clay} />
        </button>
        <div style={{ ...LABEL, fontSize: 9, marginBottom: 9 }}>Or add it yourself</div>

        {/* real photo */}
        <ItemPhoto slotId={'garment-' + draftId} tone={tone} fit="contain" label="Drop or take a photo of the item" radius={22} style={{ width: '100%', height: 240 }} />

        {/* color on avatar */}
        <div style={{ ...LABEL, fontSize: 9, margin: '16px 0 9px' }}>Color on your avatar</div>
        <div style={{ display: 'flex', gap: 9, justifyContent: 'space-between' }}>
          {palette.map((c) => (
            <button key={c} onClick={() => setTone(c)} style={{ width: 30, height: 30, borderRadius: '50%', background: c, cursor: 'pointer', border: 'none', boxShadow: tone === c ? '0 0 0 2px ' + ST.bg + ', 0 0 0 4px ' + ST.ink : 'inset 0 0 0 1px rgba(0,0,0,0.1)' }} />
          ))}
        </div>

        {/* fields */}
        <div style={{ marginTop: 18 }}>
          <Row label="Item name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Charcoal Overshirt" style={field} /></Row>
          <Row label="Brand"><input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. COS" style={field} /></Row>
          <Row label="Category">
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 2 }}>
              {CATEGORIES.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
            </div>
          </Row>
          <div style={{ display: 'flex', gap: 18 }}>
            <div style={{ flex: 1 }}><Row label="Purchase date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ ...field, fontFamily: SANS }} /></Row></div>
            <div style={{ flex: 1 }}><Row label="Price paid"><div style={{ display: 'flex', alignItems: 'center', gap: 2 }}><span style={{ fontFamily: SANS, fontSize: 15, color: ST.mute }}>$</span><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" style={field} /></div></Row></div>
          </div>
          <div style={{ fontFamily: SANS, fontSize: 11.5, color: ST.mute, marginTop: 12, lineHeight: 1.5 }}>
            Purchase date &amp; price let Closet track your <b style={{ color: ST.ink2 }}>cost-per-wear</b> over time.
          </div>
        </div>
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: '14px 24px 30px', background: 'linear-gradient(transparent, ' + ST.bg + ' 24%)' }}>
        <Btn onClick={valid ? save : undefined} icon="check" style={{ width: '100%', opacity: valid ? 1 : 0.4, pointerEvents: valid ? 'auto' : 'none' }}>Save to closet</Btn>
      </div>
    </div>
  );
}
window.AddItem = AddItem;
