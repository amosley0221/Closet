// core.jsx — Studio design tokens, icon set, shared UI atoms.
// Loaded first; exports to window for the screen modules.

const ST = {
  bg: '#FBFAF7',
  bg2: '#F4F1EB',
  card: '#FFFFFF',
  ink: '#1C1A17',
  ink2: '#3F3A33',
  mute: '#8B8780',
  mute2: '#B7B2A9',
  line: '#ECE9E2',
  line2: '#E2DDD3',
  clay: '#9A6B4F',
  clayBg: '#F1E9E2',
  sage: '#6E7A63',
  good: '#5C7A55',
};
const SERIF = '"Cormorant Garamond", Georgia, serif';
const SANS = '"Archivo", system-ui, sans-serif';
const LABEL = { fontFamily: SANS, fontSize: 10, letterSpacing: 2.2, textTransform: 'uppercase', color: ST.mute };

// ── Icons ───────────────────────────────────────────────────
const ICON_PATHS = {
  home: <><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></>,
  closet: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  drops: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10z"/><circle cx="8" cy="8" r="1.2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></>,
  back: <path d="M15 5l-7 7 7 7"/>,
  chevron: <path d="M9 5l7 7-7 7"/>,
  chevDown: <path d="M5 9l7 7 7-7"/>,
  x: <><path d="M6 6l12 12"/><path d="M18 6L6 18"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></>,
  camera: <><path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></>,
  check: <path d="M4 12.5l5 5 11-11"/>,
  sliders: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>,
  sparkle: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/></>,
  heart: <path d="M12 20s-7-4.5-7-10A4 4 0 0 1 12 7a4 4 0 0 1 7 3c0 5.5-7 10-7 10z"/>,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/></>,
  tag: <><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10z"/><circle cx="8" cy="8" r="1.4"/></>,
  shuffle: <><path d="M3 7h4l10 10h4M3 17h4l3-3M14 7h3l4 0M18 4l3 3-3 3M18 14l3 3-3 3"/></>,
  hanger: <><path d="M12 6a2 2 0 1 1 1 1.7L4 13h16l-8-5"/></>,
  ext: <><path d="M14 4h6v6M20 4l-9 9M9 5H5v14h14v-4"/></>,
  star: <path d="M12 4l2.4 5.2 5.6.5-4.3 3.7 1.3 5.5L12 21l-4.9 3.0 1.3-5.5L4 9.7l5.6-.5z"/>,
};
function Icon({ name, size = 22, color = ST.ink, sw = 1.7, fill = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : 'none'} stroke={fill ? 'none' : color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {ICON_PATHS[name]}
    </svg>
  );
}

// ── Thumb — photo placeholder block tinted to the item's tone ──
function Thumb({ tone = '#D8D3CA', tone2, r = 14, style = {}, glyph, brand }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: r, background: tone2 ? `linear-gradient(150deg, ${tone}, ${tone2})` : tone, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)', ...style }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.10) 0 7px, transparent 7px 14px)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.22), transparent 55%)' }} />
      {brand && <div style={{ position: 'absolute', bottom: 7, left: 9, fontFamily: SANS, fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)', mixBlendMode: 'overlay' }}>{brand}</div>}
      {glyph}
    </div>
  );
}

// ── Chip — filter / mood pill ──
function Chip({ children, active, onClick, accent = ST.ink, style = {} }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: SANS, fontSize: 12.5, fontWeight: 500, letterSpacing: 0.2,
      padding: '8px 15px', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap',
      border: '1px solid ' + (active ? accent : ST.line2),
      background: active ? accent : 'transparent',
      color: active ? ST.bg : ST.ink2, transition: 'all .18s', ...style,
    }}>{children}</button>
  );
}

// ── TopBar for pushed screens ──
function TopBar({ title, onBack, right, sub }) {
  return (
    <div style={{ padding: '54px 18px 12px', display: 'flex', alignItems: 'center', gap: 10, background: ST.bg, position: 'relative', zIndex: 5 }}>
      {onBack && (
        <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid ' + ST.line, background: ST.card, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <Icon name="back" size={20} />
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub && <div style={{ ...LABEL, fontSize: 9, marginBottom: 2 }}>{sub}</div>}
        {title && <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 23, letterSpacing: -0.3, color: ST.ink, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>}
      </div>
      {right}
    </div>
  );
}

// ── Primary / ghost buttons ──
function Btn({ children, onClick, variant = 'solid', style = {}, icon }) {
  const base = { fontFamily: SANS, fontWeight: 600, fontSize: 13.5, letterSpacing: 0.2, height: 50, borderRadius: 999, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'transform .1s', border: 'none', whiteSpace: 'nowrap' };
  const variants = {
    solid: { background: ST.ink, color: ST.bg },
    ghost: { background: 'transparent', color: ST.ink, border: '1px solid ' + ST.line2 },
    clay: { background: ST.clay, color: '#fff' },
  };
  return (
    <button onClick={onClick} onPointerDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')} onPointerUp={(e) => (e.currentTarget.style.transform = '')} onPointerLeave={(e) => (e.currentTarget.style.transform = '')}
      style={{ ...base, ...variants[variant], ...style }}>
      {icon && <Icon name={icon} size={18} color={variant === 'ghost' ? ST.ink : '#fff'} />}
      {children}
    </button>
  );
}

// ── tiny helpers ──
function fmtMoney(n) { return '$' + n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 }); }
function fmtDate(iso) { const d = new Date(iso + 'T00:00'); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
function monthsOwned(iso) { const d = new Date(iso + 'T00:00'); const now = new Date('2026-06-07'); return Math.max(1, Math.round((now - d) / (1000 * 60 * 60 * 24 * 30.4))); }

// mix a hex toward a pale studio tone (for image-slot empty states)
function lightMix(hex, t = 0.74) {
  try {
    const a = parseInt(hex.slice(1), 16), b = parseInt('F4F1EB', 16);
    const ar = a >> 16, ag = (a >> 8) & 255, ab = a & 255;
    const br = b >> 16, bg = (b >> 8) & 255, bb = b & 255;
    const r = Math.round(ar + (br - ar) * t), g = Math.round(ag + (bg - ag) * t), bl = Math.round(ab + (bb - ab) * t);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
  } catch (e) { return '#ECE9E2'; }
}

// ── ItemPhoto — a real, user-droppable photo for a wardrobe item.
// Keyed by item id, so a photo dropped anywhere shows everywhere. The empty
// state shows a colored "product card" backdrop tinted to the item; once a
// photo is dropped it sits (background-removed cutout) over that card.
function ItemPhoto({ slotId, tone = '#D8D3CA', label = 'Drop a photo', radius = 14, fit = 'cover', style = {} }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, background: lightMix(tone, 0.5), boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)', ...style }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0 8px, transparent 8px 16px)', pointerEvents: 'none' }} />
      {React.createElement('image-slot', {
        id: slotId, shape: 'rect', fit, placeholder: label,
        style: { position: 'absolute', inset: 0, width: '100%', height: '100%', '--slot-tone': 'transparent' },
      })}
    </div>
  );
}

// ── ItemImage — shows a real product image when the item has one (e.g. from
// live search), otherwise falls back to the user-droppable ItemPhoto slot.
function ItemImage({ src, slotId, tone = '#D8D3CA', label = 'Drop a photo', radius = 14, fit = 'contain', style = {} }) {
  const [err, setErr] = React.useState(false);
  if (src && !err) {
    return (
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, background: '#FFFFFF', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)', ...style }}>
        <img src={src} alt={label} onError={() => setErr(true)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: fit === 'cover' ? 'cover' : 'contain', display: 'block' }} />
      </div>
    );
  }
  return <ItemPhoto slotId={slotId} tone={tone} label={label} radius={radius} fit={fit} style={style} />;
}

Object.assign(window, { ST, SERIF, SANS, LABEL, Icon, Thumb, Chip, TopBar, Btn, fmtMoney, fmtDate, monthsOwned, lightMix, ItemPhoto, ItemImage });
