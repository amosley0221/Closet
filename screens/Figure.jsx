// Figure.jsx — OutfitFigure: a customizable AVATAR that "wears" the built
// outfit. Skin tone, hairstyle/color and body build come from the user's saved
// avatar (window.__avatar, set by App each render) unless passed explicitly.
// Garments are stylized vector silhouettes tinted to each item's real color.
// Any garment color that is null is skipped (bare avatar shows underneath).
// viewBox 0 0 190 380.

function _adj(hex, amt) {
  try {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  } catch (e) { return hex; }
}

function OutfitFigure({
  skin, hair, hairColor, build,
  beanie = null, jacket = null, sleeve = null, shirt = null,
  pants = null, shoes = null,
  shadow = 'rgba(0,0,0,0.12)',
  scale = 1, style = {}, form, formEdge,
}) {
  const av = (typeof window !== 'undefined' && window.__avatar) || {};
  skin = skin || av.skin || '#D9D2C6';
  hair = hair !== undefined ? hair : (av.hair || 'none');
  hairColor = hairColor || av.hairColor || '#3B2E26';
  build = build || av.build || 1;
  sleeve = sleeve || (jacket ? _adj(jacket, -14) : null);

  const rid = React.useId().replace(/[:]/g, '');
  const id = (s) => rid + s;

  const Grad = ({ gid, c, light = 22, dark = 30, x2 = 1, y2 = 1 }) => (
    <linearGradient id={gid} x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0" stopColor={_adj(c, light)} />
      <stop offset="0.55" stopColor={c} />
      <stop offset="1" stopColor={_adj(c, -dark)} />
    </linearGradient>
  );

  const W = 190, H = 380;
  return (
    <div style={{ width: W * scale, height: H * scale, position: 'relative', ...style }}>
      <svg width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <Grad gid={id('skin')} c={skin} light={14} dark={18} />
          <Grad gid={id('skinArm')} c={skin} light={8} dark={24} x2={1.4} />
          <Grad gid={id('hair')} c={hairColor} light={20} dark={26} />
          {beanie && <Grad gid={id('bea')} c={beanie} />}
          {shirt && <Grad gid={id('shi')} c={shirt} light={18} dark={24} />}
          {jacket && <Grad gid={id('jac')} c={jacket} light={20} dark={30} />}
          {sleeve && <Grad gid={id('sle')} c={sleeve} light={16} dark={34} x2={1.5} />}
          {pants && <Grad gid={id('pan')} c={pants} light={16} dark={30} />}
          {shoes && <Grad gid={id('sho')} c={shoes} light={26} dark={34} x2={1.6} />}
          <radialGradient id={id('flr')} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={shadow} /><stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <radialGradient id={id('hl')} cx="0.38" cy="0.32" r="0.6">
            <stop offset="0" stopColor="rgba(255,255,255,0.4)" /><stop offset="0.6" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <ellipse cx="95" cy="368" rx="50" ry="9" fill={`url(#${id('flr')})`} />

        <g transform={`translate(95,0) scale(${build},1) translate(-95,0)`}>
          {/* hair behind (volume for curls / long) */}
          {!beanie && hair === 'curls' && <ellipse cx="95" cy="36" rx="25" ry="24" fill={`url(#${id('hair')})`} />}
          {!beanie && hair === 'long' && <path d="M71,40 C71,20 84,13 95,13 C106,13 119,20 119,40 L119,150 C119,157 109,159 107,151 L107,54 C107,42 102,35 95,35 C88,35 83,42 83,54 L83,151 C81,159 71,157 71,150 Z" fill={`url(#${id('hair')})`} />}

          {/* legs */}
          <path d="M80,214 C77,252 76,300 79,344 C79,351 86,353 91,350 C93,322 94,288 94,250 C94,234 93,222 92,214 Z" fill={`url(#${id('skin')})`} />
          <path d="M110,214 C113,252 114,300 111,344 C111,351 104,353 99,350 C97,322 96,288 96,250 C96,234 97,222 98,214 Z" fill={`url(#${id('skin')})`} />
          {/* arms */}
          <path d="M63,90 C54,104 50,128 49,160 C48,184 49,202 51,214 C51,219 57,220 60,216 C62,196 64,168 68,138 C70,120 71,104 70,94 Z" fill={`url(#${id('skinArm')})`} />
          <path d="M127,90 C136,104 140,128 141,160 C142,184 141,202 139,214 C139,219 133,220 130,216 C128,196 126,168 122,138 C120,120 119,104 120,94 Z" fill={`url(#${id('skinArm')})`} />
          {/* hands w/ fingers */}
          {[0, 1].map((m) => (
            <g key={m} transform={m ? 'translate(190,0) scale(-1,1)' : undefined}>
              <ellipse cx="47.5" cy="219" rx="2.6" ry="3.7" fill={`url(#${id('skin')})`} />
              <path d="M49,213 C56,211 61,214 61,219 C61,226 58,231 54.5,231 C51,231 48,226 48,219 C48,216 48,214 49,213 Z" fill={`url(#${id('skin')})`} />
              <path d="M51.6,225 L51.6,229.5 M55,226 L55,230.5 M58.4,225 L58.4,229.5" stroke={_adj(skin, -28)} strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.55" />
            </g>
          ))}
          {/* torso */}
          <path d="M62,86 C72,80 80,80 86,84 C90,90 100,90 104,84 C110,80 118,80 128,86 C132,100 131,112 129,124 C126,156 123,186 119,210 C118,215 113,218 106,218 L84,218 C77,218 72,215 71,210 C67,186 64,156 61,124 C59,112 58,100 62,86 Z" fill={`url(#${id('skin')})`} />
          {/* neck */}
          <path d="M86,62 C86,72 85,77 83,82 C88,87 102,87 107,82 C105,77 104,72 104,62 Z" fill={`url(#${id('skin')})`} />
          <path d="M86,62 C86,70 85,76 83,82 C88,85 102,85 107,82 C105,76 104,70 104,62 Z" fill="rgba(0,0,0,0.08)" />
          {/* head */}
          <ellipse cx="95" cy="42" rx="17.5" ry="21.5" fill={`url(#${id('skin')})`} />
          <ellipse cx="95" cy="42" rx="17.5" ry="21.5" fill={`url(#${id('hl')})`} />

          {/* face */}
          <g>
            <path d="M85.5,40 C87.6,39.2 90,39.2 91.6,40.1" stroke={_adj(skin, -72)} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M98.4,40.1 C100,39.2 102.4,39.2 104.5,40" stroke={_adj(skin, -72)} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.6" />
            <ellipse cx="88.5" cy="45.5" rx="1.7" ry="2.1" fill={_adj(skin, -88)} />
            <ellipse cx="101.5" cy="45.5" rx="1.7" ry="2.1" fill={_adj(skin, -88)} />
            <circle cx="89.1" cy="45" r="0.5" fill="rgba(255,255,255,0.75)" />
            <circle cx="102.1" cy="45" r="0.5" fill="rgba(255,255,255,0.75)" />
            <path d="M95,46.5 C95.5,49 95,50.5 93.5,51.5" stroke={_adj(skin, -52)} strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.38" />
            <path d="M91.5,54.5 C93.4,56.1 96.6,56.1 98.5,54.5" stroke={_adj(skin, -60)} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.55" />
          </g>

          {/* hair cap (scalp) */}
          {!beanie && hair && hair !== 'none' && (
            <path d="M76,44 C76,23 85,14 95,14 C105,14 114,23 114,44 C111,32 105,28 95,28 C85,28 79,32 76,44 Z" fill={`url(#${id('hair')})`} />
          )}

          {/* ── pants ── */}
          {pants && <g>
            <path d="M78,200 C75,250 74,300 78,346 C78,353 87,355 93,351 C95,322 96,286 96,248 C96,230 95,212 95,202 Z" fill={`url(#${id('pan')})`} />
            <path d="M112,200 C115,250 116,300 112,346 C112,353 103,355 97,351 C95,322 94,286 94,248 C94,230 95,212 95,202 Z" fill={`url(#${id('pan')})`} />
            <path d="M70,198 C84,193 106,193 120,198 L120,210 C106,205 84,205 70,210 Z" fill={_adj(pants, -22)} />
            <path d="M95,206 L95,348" stroke="rgba(0,0,0,0.10)" strokeWidth="1.2" fill="none" />
          </g>}

          {/* ── shoes ── */}
          {shoes && <g>
            <path d="M74,342 C71,344 60,348 56,353 C53,357 55,362 63,363 L92,363 C96,363 97,358 96,353 C95,347 93,343 91,341 C85,339 79,339 74,342 Z" fill={`url(#${id('sho')})`} />
            <path d="M56,358 L96,358 C97,361 96,363 92,363 L63,363 C57,363 54,361 56,358 Z" fill="#F4F1EB" />
            <path d="M116,342 C119,344 130,348 134,353 C137,357 135,362 127,363 L98,363 C94,363 93,358 94,353 C95,347 97,343 99,341 C105,339 111,339 116,342 Z" fill={`url(#${id('sho')})`} />
            <path d="M134,358 L94,358 C93,361 94,363 98,363 L127,363 C133,363 136,361 134,358 Z" fill="#F4F1EB" />
          </g>}

          {/* ── shirt ── */}
          {shirt && <path d="M64,86 C73,81 81,81 87,85 C90,91 100,91 103,85 C109,81 117,81 126,86 C130,100 129,112 127,124 C125,150 123,172 121,190 C120,194 116,196 110,196 L80,196 C74,196 70,194 69,190 C67,172 65,150 63,124 C61,112 60,100 64,86 Z" fill={`url(#${id('shi')})`} />}

          {/* ── jacket ── */}
          {jacket && <g>
            <path d="M62,88 C52,104 48,130 47,162 C46,186 47,204 49,216 C49,222 58,223 62,217 C64,196 66,166 70,136 C72,118 73,102 72,92 Z" fill={`url(#${id('sle')})`} />
            <path d="M128,88 C138,104 142,130 143,162 C144,186 143,204 141,216 C141,222 132,223 128,217 C126,196 124,166 120,136 C118,118 117,102 118,92 Z" fill={`url(#${id('sle')})`} />
            <path d="M60,84 C70,79 80,80 88,86 L95,150 L102,86 C110,80 120,79 130,84 C134,99 133,112 131,126 C128,158 125,188 121,212 C120,216 115,218 109,218 L81,218 C75,218 70,216 69,212 C65,188 62,158 59,126 C57,112 56,99 60,84 Z" fill={`url(#${id('jac')})`} />
            <path d="M60,84 C72,82 84,86 95,98 C84,90 72,88 62,90 Z" fill={_adj(jacket, 14)} />
            <path d="M130,84 C118,82 106,86 95,98 C106,90 118,88 128,90 Z" fill={_adj(jacket, 14)} />
            <path d="M95,150 L95,216" stroke="rgba(0,0,0,0.14)" strokeWidth="1.4" fill="none" />
          </g>}

          {/* ── beanie ── */}
          {beanie && <g>
            <path d="M77,39 C77,20 87,13 95,13 C103,13 113,20 113,39 C113,40 108,41 95,41 C82,41 77,40 77,39 Z" fill={`url(#${id('bea')})`} />
            <path d="M76,35 C76,40 82,42 95,42 C108,42 114,40 114,35 C114,39 112,41 95,41 C78,41 76,39 76,35 Z" fill={_adj(beanie, -16)} />
          </g>}
        </g>
      </svg>
    </div>
  );
}

window.OutfitFigure = OutfitFigure;
