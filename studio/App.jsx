// App.jsx — shell: state, navigation stack, tab bar, transitions, toast.
const { useState, useRef, useEffect, useCallback } = React;

// ── on-device persistence ──
const LS_KEY = 'closet:v1';
function loadState() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch (e) { return {}; } }
function saveState(s) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {} }

function TabBar({ tab, onTab }) {
  const items = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'closet', icon: 'closet', label: 'Closet' },
    { key: 'builder', center: true },
    { key: 'drops', icon: 'drops', label: 'Drops' },
    { key: 'you', icon: 'user', label: 'You' },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 30, display: 'flex', alignItems: 'center', padding: '12px 16px 30px', borderTop: '1px solid ' + ST.line, background: 'rgba(251,250,247,0.92)', backdropFilter: 'blur(12px)' }}>
      {items.map((it) => it.center ? (
        <div key="c" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => onTab('builder')} style={{ width: 50, height: 50, borderRadius: '50%', background: tab === 'builder' ? ST.clay : ST.ink, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 6px 16px rgba(28,26,23,0.22)' }}>
            <Icon name="plus" size={24} color="#fff" sw={2.2} />
          </button>
        </div>
      ) : (
        <button key={it.key} onClick={() => onTab(it.key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer' }}>
          <Icon name={it.icon} size={22} color={tab === it.key ? ST.ink : ST.mute2} sw={tab === it.key ? 2 : 1.6} />
          <span style={{ fontFamily: SANS, fontSize: 9, letterSpacing: 0.5, textTransform: 'uppercase', color: tab === it.key ? ST.ink : ST.mute2 }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function SideBar({ tab, onTab, onAdd }) {
  const items = [
    { key: 'home', icon: 'home', label: 'Home' },
    { key: 'closet', icon: 'closet', label: 'Closet' },
    { key: 'builder', icon: 'plus', label: 'Build' },
    { key: 'drops', icon: 'drops', label: 'Drops' },
    { key: 'you', icon: 'user', label: 'You' },
  ];
  return (
    <div style={{ width: 248, flexShrink: 0, height: '100%', background: ST.bg2, borderRight: '1px solid ' + ST.line, display: 'flex', flexDirection: 'column', padding: '30px 18px 24px' }}>
      <div style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 600, letterSpacing: -0.5, color: ST.ink, padding: '0 13px', marginBottom: 30 }}>Closet</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((it) => {
          const active = tab === it.key;
          return (
            <button key={it.key} onClick={() => onTab(it.key)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 13px', borderRadius: 12, border: 'none', cursor: 'pointer', background: active ? ST.ink : 'transparent', width: '100%', textAlign: 'left' }}>
              <Icon name={it.icon} size={20} color={active ? ST.bg : ST.ink} sw={active ? 2 : 1.7} />
              <span style={{ fontFamily: SANS, fontSize: 14, fontWeight: active ? 600 : 500, color: active ? ST.bg : ST.ink }}>{it.label}</span>
            </button>
          );
        })}
      </div>
      <button onClick={onAdd} style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 13px', borderRadius: 12, border: '1px solid ' + ST.line2, cursor: 'pointer', background: ST.card, width: '100%' }}>
        <Icon name="plus" size={18} color={ST.ink} sw={2} />
        <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: ST.ink }}>Add item</span>
      </button>
    </div>
  );
}

function PushView({ children }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: ST.bg, boxShadow: '-12px 0 40px rgba(0,0,0,0.12)' }}>
      {children}
    </div>
  );
}

function App() {
  const persisted = useRef(loadState()).current;
  const [tab, setTab] = useState('home');
  const [stack, setStack] = useState([]); // [{key, screen, id, closing}]
  const [wardrobe, setWardrobe] = useState(persisted.wardrobe || WARDROBE);
  const [savedOutfits, setSavedOutfits] = useState(persisted.savedOutfits || []);
  const [builderMood, setBuilderMood] = useState(null);
  const [builderNonce, setBuilderNonce] = useState(0);
  const [wearLog, setWearLog] = useState(persisted.wearLog || WEARLOG_SEED);
  const [wishlist, setWishlist] = useState(persisted.wishlist || []);
  const [logState, setLogState] = useState(null); // { items, date, occasion, note }
  const [avatar, setAvatar] = useState(persisted.avatar || { skin: '#E2C4A6', hair: 'short', hairColor: '#3B2E26', build: 'regular' });
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastT = useRef(0);
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 700);
  useEffect(() => {
    const f = () => setWide(window.innerWidth >= 700);
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f);
  }, []);
  const today = '2026-06-07';
  const todayOutfit = React.useMemo(() => buildOutfit('comfy', wardrobe, 0), [wardrobe]);

  // persist the user's data on every change
  useEffect(() => { saveState({ wardrobe, savedOutfits, wearLog, wishlist, avatar }); }, [wardrobe, savedOutfits, wearLog, wishlist, avatar]);

  // expose resolved avatar to every OutfitFigure on the page
  const BUILD_SCALE = { slim: 0.92, regular: 1, broad: 1.09 };
  window.__avatar = { skin: avatar.skin, hair: avatar.hair, hairColor: avatar.hairColor, build: BUILD_SCALE[avatar.build] || 1 };

  const showToast = useCallback((msg) => {
    setToast(msg); clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 1900);
  }, []);

  const pop = useCallback(() => {
    setStack((s) => s.slice(0, -1));
  }, []);

  const nav = {
    tab: (k) => { setStack([]); setTab(k); },
    openItem: (id) => setStack((s) => [...s, { key: Date.now(), screen: 'item', id }]),
    addItem: () => setStack((s) => [...s, { key: Date.now(), screen: 'add' }]),
    openLog: () => setStack((s) => [...s, { key: Date.now(), screen: 'log' }]),
    openLaundry: () => setStack((s) => [...s, { key: Date.now(), screen: 'laundry' }]),
    openDiscover: () => setStack((s) => [...s, { key: Date.now(), screen: 'discover' }]),
    openWishlist: () => setStack((s) => [...s, { key: Date.now(), screen: 'wishlist' }]),
    logFit: (outfit, defaults) => setLogState({ items: outfitToIds(outfit), date: today, occasion: (defaults && defaults.occasion) || 'Casual', note: '' }),
    pop,
    build: (moodKey) => { setStack([]); setBuilderMood(moodKey); setBuilderNonce((n) => n + 1); setTab('builder'); },
    openAvatar: () => setAvatarOpen(true),
    toast: showToast,
  };

  const logOutfit = (entry) => {
    const ids = SLOTS.map(({ slot }) => entry.items[slot]).filter(Boolean);
    setWearLog((l) => [{ ...entry, id: 'w' + Date.now() }, ...l]);
    setWardrobe((w) => w.map((i) => ids.includes(i.id) ? { ...i, wears: i.wears + 1, fresh: (i.fresh || 0) + 1 } : i));
  };

  const ctx = {
    nav, wardrobe, savedOutfits, builderMood, todayOutfit, wearLog, today, avatar, wishlist,
    addItem: (item) => setWardrobe((w) => [{ fresh: 0, ...item }, ...w]),
    addToWishlist: (item) => setWishlist((l) => l.some((x) => x.id === item.id) ? l : [{ ...item }, ...l]),
    removeWishlist: (id) => setWishlist((l) => l.filter((x) => x.id !== id)),
    logOutfit,
    logWear: (id) => setWardrobe((w) => w.map((i) => i.id === id ? { ...i, wears: i.wears + 1, fresh: (i.fresh || 0) + 1 } : i)),
    washItems: (ids) => setWardrobe((w) => w.map((i) => ids.includes(i.id) ? { ...i, fresh: 0 } : i)),
    washAll: () => setWardrobe((w) => w.map((i) => needsWash(i) ? { ...i, fresh: 0 } : i)),
    saveOutfit: (o) => setSavedOutfits((s) => [o, ...s]),
    resetData: () => { try { localStorage.removeItem(LS_KEY); } catch (e) {} location.reload(); },
  };

  const TABS = { home: Home, closet: Closet, builder: Builder, drops: Drops, you: Profile };
  const Screen = TABS[tab];
  const showTabBar = stack.length === 0;

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', background: ST.bg2 }}>
      {wide && <SideBar tab={tab} onTab={nav.tab} onAdd={() => nav.addItem()} />}
      <div style={{ position: 'relative', flex: 1, height: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center', background: ST.bg }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: wide ? 600 : 'none', height: '100%', overflow: 'hidden', background: ST.bg, borderLeft: wide ? '1px solid ' + ST.line : 'none', borderRight: wide ? '1px solid ' + ST.line : 'none' }}>
      {/* active tab */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Screen ctx={ctx} key={tab === 'builder' ? 'builder' + builderNonce : tab} />
      </div>

      {/* pushed screens */}
      {stack.map((entry) => (
        <PushView key={entry.key}>
          {entry.screen === 'item' && <ItemDetail ctx={ctx} id={entry.id} />}
          {entry.screen === 'add' && <AddItem ctx={ctx} />}
          {entry.screen === 'log' && <WearLog ctx={ctx} />}
          {entry.screen === 'laundry' && <Laundry ctx={ctx} />}
          {entry.screen === 'discover' && <Discover ctx={ctx} />}
          {entry.screen === 'wishlist' && <Wishlist ctx={ctx} />}
        </PushView>
      ))}

      {/* log-a-fit sheet */}
      {logState && (
        <LogSheet ctx={ctx} init={logState} onClose={() => setLogState(null)}
          onConfirm={(entry) => { logOutfit(entry); setLogState(null); showToast('Added to your wear log'); }} />
      )}

      {/* avatar studio */}
      {avatarOpen && (
        <AvatarSheet avatar={avatar} onClose={() => setAvatarOpen(false)}
          onSave={(a) => { setAvatar(a); setAvatarOpen(false); showToast('Avatar saved'); }} />
      )}

      {/* toast */}
      {toast && (
        <div style={{ position: 'absolute', bottom: (!wide && showTabBar) ? 110 : 40, left: '50%', transform: 'translateX(-50%)', zIndex: 60, background: ST.ink, color: ST.bg, fontFamily: SANS, fontSize: 13, fontWeight: 500, padding: '11px 18px', borderRadius: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.22)', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', animation: 'toastIn .25s ease' }}>
          <Icon name="check" size={16} color={ST.bg} sw={2.2} /> {toast}
        </div>
      )}

      {!wide && showTabBar && <TabBar tab={tab} onTab={nav.tab} />}
      </div>
      </div>
    </div>
  );
}
window.App = App;
