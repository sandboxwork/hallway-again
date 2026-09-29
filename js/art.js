/*
 * art.js — parametric SVG drawings for the two characters and comic devices.
 * Every function returns SVG markup; scenes.js paints it into panels at build time.
 * Class names are the animation hooks: .person .breath .leg-l/.leg-r .head .eyeball .pupil
 * .brow-l/.brow-r .mouth .blush .sweat .pair
 */
window.Art = (() => {
  const n = (v) => Math.round(v * 10) / 10;
  const C = {
    ink: '#1F1F22',
    skin: '#F6D8C2',
    white: '#FFFFFF',
    meHair: '#2B2B2E',
    meShirt: '#46464F',
    coHair: '#2D4A7A',
    coShirt: '#5B7FB8',
    blush: '#F2604C',
    sweat: '#8EC5F2',
  };
  const hairOf = (who) => (who === 'me' ? C.meHair : C.coHair);
  const shirtOf = (who) => (who === 'me' ? C.meShirt : C.coShirt);

  // ----- expression paths (head radius R). Same command structure per kind, so GSAP can tween between them.
  const BROWS = {
    neutral: [-0.5, -0.52],
    up: [-0.66, -0.68],
    worried: [-0.46, -0.62],
    angry: [-0.6, -0.44],
    flat: [-0.5, -0.5],
  };
  function browD(kind, R, side) {
    const [yo, yi] = BROWS[kind] || BROWS.neutral;
    return `M${n(side * 0.6 * R)} ${n(yo * R)} L${n(side * 0.16 * R)} ${n(yi * R)}`;
  }
  const MOUTHS = {
    neutral: [0.26, 0.4, 0.4],
    tiny: [0.26, 0.37, 0.47],
    smile: [0.32, 0.32, 0.6],
    frown: [0.24, 0.47, 0.34],
    flat: [0.22, 0.42, 0.42],
    small: [0.12, 0.44, 0.44],
  };
  function mouthD(kind, R) {
    const [hw, y, cy] = MOUTHS[kind] || MOUTHS.neutral;
    return `M${n(-hw * R)} ${n(y * R)} Q0 ${n(cy * R)} ${n(hw * R)} ${n(y * R)}`;
  }
  function hairD(who, R) {
    if (who === 'me') {
      return `M${n(-0.99 * R)} ${n(-0.14 * R)} A${R} ${R} 0 0 1 ${n(0.99 * R)} ${n(-0.14 * R)} ` +
        `Q${n(0.62 * R)} ${n(-0.66 * R)} ${n(0.1 * R)} ${n(-0.66 * R)} Q${n(-0.5 * R)} ${n(-0.76 * R)} ${n(-0.99 * R)} ${n(-0.14 * R)}Z`;
    }
    return `M${n(-0.99 * R)} ${n(-0.14 * R)} A${R} ${R} 0 0 1 ${n(0.99 * R)} ${n(-0.14 * R)} ` +
      `Q${n(0.78 * R)} ${n(-0.56 * R)} ${n(0.36 * R)} ${n(-0.72 * R)} Q${n(-0.22 * R)} ${n(-0.95 * R)} ${n(-0.99 * R)} ${n(-0.14 * R)}Z`;
  }

  /** head centred at 0,0. o: { brow, mouth, blush, sweat } */
  function head(who, R, o = {}) {
    const sw = n(0.04 * R);
    const eye = (side) => `
      <g class="eye eye-${side < 0 ? 'l' : 'r'}" transform="translate(${n(side * 0.34 * R)} ${n(-0.12 * R)})">
        <g class="eyeball">
          <ellipse class="sclera" rx="${n(0.19 * R)}" ry="${n(0.23 * R)}" fill="${C.white}" stroke="${C.ink}" stroke-width="${n(0.035 * R)}"/>
          <circle class="pupil" r="${n(0.1 * R)}" fill="${C.ink}"/>
        </g>
      </g>`;
    return `
    <g class="head who-${who}" data-r="${R}">
      <circle class="skin" r="${R}" fill="${C.skin}" stroke="${C.ink}" stroke-width="${sw}"/>
      <path class="hair" d="${hairD(who, R)}" fill="${hairOf(who)}"/>
      <g class="blush" opacity="${o.blush ? 1 : 0}">
        <ellipse cx="${n(-0.55 * R)}" cy="${n(0.2 * R)}" rx="${n(0.17 * R)}" ry="${n(0.08 * R)}" fill="${C.blush}" opacity="0.75"/>
        <ellipse cx="${n(0.55 * R)}" cy="${n(0.2 * R)}" rx="${n(0.17 * R)}" ry="${n(0.08 * R)}" fill="${C.blush}" opacity="0.75"/>
      </g>
      ${eye(-1)}${eye(1)}
      <path class="brow brow-l" d="${browD(o.brow, R, -1)}" stroke="${C.ink}" stroke-width="${n(0.085 * R)}" stroke-linecap="round" fill="none"/>
      <path class="brow brow-r" d="${browD(o.brow, R, 1)}" stroke="${C.ink}" stroke-width="${n(0.085 * R)}" stroke-linecap="round" fill="none"/>
      <path class="mouth" d="${mouthD(o.mouth, R)}" stroke="${C.ink}" stroke-width="${n(0.065 * R)}" stroke-linecap="round" fill="none"/>
      <path class="sweat" opacity="${o.sweat ? 1 : 0}" d="M${n(0.74 * R)} ${n(-0.7 * R)} q${n(0.12 * R)} ${n(0.18 * R)} 0 ${n(0.27 * R)} q${n(-0.12 * R)} ${n(-0.09 * R)} 0 ${n(-0.27 * R)}z" fill="${C.sweat}" stroke="${C.ink}" stroke-width="${n(0.025 * R)}"/>
    </g>`;
  }

  /** full body, feet at 0,0 (height ≈ 5.1R). o: head options + { cup } */
  function person(who, R, o = {}) {
    const sw = n(0.04 * R);
    const cup = o.cup
      ? `<g class="cup"><rect x="${n(0.66 * R)}" y="${n(-2.55 * R)}" width="${n(0.44 * R)}" height="${n(0.54 * R)}" rx="${n(0.08 * R)}" fill="${C.white}" stroke="${C.ink}" stroke-width="${sw}"/>
         <path d="M${n(1.1 * R)} ${n(-2.42 * R)} q${n(0.2 * R)} 0 ${n(0.2 * R)} ${n(0.14 * R)} q0 ${n(0.14 * R)} ${n(-0.2 * R)} ${n(0.14 * R)}" fill="none" stroke="${C.ink}" stroke-width="${sw}"/></g>`
      : '';
    return `
    <g class="person who-${who}">
      <g class="breath">
        <rect class="leg leg-l" x="${n(-0.42 * R)}" y="${n(-1.35 * R)}" width="${n(0.34 * R)}" height="${n(1.35 * R)}" rx="${n(0.17 * R)}" fill="${C.ink}"/>
        <rect class="leg leg-r" x="${n(0.08 * R)}" y="${n(-1.35 * R)}" width="${n(0.34 * R)}" height="${n(1.35 * R)}" rx="${n(0.17 * R)}" fill="${C.ink}"/>
        <rect class="torso" x="${n(-0.72 * R)}" y="${n(-3.15 * R)}" width="${n(1.44 * R)}" height="${n(1.95 * R)}" rx="${n(0.6 * R)}" fill="${shirtOf(who)}" stroke="${C.ink}" stroke-width="${sw}"/>
        ${cup}
        <g transform="translate(0 ${n(-4.05 * R)})">${head(who, R, o)}</g>
      </g>
    </g>`;
  }

  /** head and shoulders, head centred at 0,0 */
  function bust(who, R, o = {}) {
    const sw = n(0.04 * R);
    return `
    <g class="bust who-${who}">
      <g class="breath">
        <path class="shoulders" d="M${n(-1.35 * R)} ${n(2.6 * R)} Q${n(-1.32 * R)} ${n(0.98 * R)} 0 ${n(0.92 * R)} Q${n(1.32 * R)} ${n(0.98 * R)} ${n(1.35 * R)} ${n(2.6 * R)}Z" fill="${shirtOf(who)}" stroke="${C.ink}" stroke-width="${sw}"/>
        ${head(who, R, o)}
      </g>
    </g>`;
  }

  /** a pair of big eyes + brows for "eyes strip" panels, centred at 0,0. E = eye height radius */
  function pairBrowD(kind, E, side) {
    const y = { neutral: [-1.5, -1.6], worried: [-1.4, -1.8], up: [-1.8, -1.9], angry: [-1.75, -1.4] }[kind] || [-1.5, -1.6];
    return `M${n(side * 2.35 * E)} ${n(y[0] * E)} L${n(side * 0.95 * E)} ${n(y[1] * E)}`;
  }
  function eyePair(who, E, o = {}) {
    const eye = (side) => `
      <g class="eye eye-${side < 0 ? 'l' : 'r'}" transform="translate(${n(side * 1.6 * E)} 0)">
        <g class="eyeball">
          <ellipse class="sclera" rx="${n(0.82 * E)}" ry="${E}" fill="${C.white}" stroke="${C.ink}" stroke-width="${n(0.12 * E)}"/>
          <circle class="pupil" r="${n(0.42 * E)}" fill="${C.ink}"/>
        </g>
      </g>`;
    return `
    <g class="pair who-${who}" data-e="${E}">
      ${eye(-1)}${eye(1)}
      <path class="brow brow-l" d="${pairBrowD(o.brow, E, -1)}" stroke="${C.ink}" stroke-width="${n(0.3 * E)}" stroke-linecap="round" fill="none"/>
      <path class="brow brow-r" d="${pairBrowD(o.brow, E, 1)}" stroke="${C.ink}" stroke-width="${n(0.3 * E)}" stroke-linecap="round" fill="none"/>
      <g class="blush" opacity="${o.blush ? 1 : 0}">
        <ellipse cx="${n(-1.6 * E)}" cy="${n(1.5 * E)}" rx="${n(0.7 * E)}" ry="${n(0.22 * E)}" fill="${C.blush}" opacity="0.7"/>
        <ellipse cx="${n(1.6 * E)}" cy="${n(1.5 * E)}" rx="${n(0.7 * E)}" ry="${n(0.22 * E)}" fill="${C.blush}" opacity="0.7"/>
      </g>
    </g>`;
  }

  // ----- comic devices -----
  function prng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) >>> 0;
      let r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  /** radial focus lines around (cx, cy) */
  function speedLines(cx, cy, r0, r1, count, seed, color = C.ink, width = 4, cls = 'speed') {
    const r = prng(seed);
    let d = '';
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + r() * 0.05;
      const a0 = r0 + r() * r0 * 0.25;
      d += `M${n(cx + Math.cos(a) * a0)} ${n(cy + Math.sin(a) * a0)} L${n(cx + Math.cos(a) * r1)} ${n(cy + Math.sin(a) * r1)} `;
    }
    return `<path class="${cls}" d="${d}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" fill="none"/>`;
  }
  /** spiky burst */
  function burst(cx, cy, r0, r1, spikes, fill, cls = 'burst') {
    let d = '';
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const rr = i % 2 ? r0 : r1;
      d += `${i ? 'L' : 'M'}${n(cx + Math.cos(a) * rr)} ${n(cy + Math.sin(a) * rr)} `;
    }
    return `<path class="${cls}" d="${d}Z" fill="${fill}" stroke="${C.ink}" stroke-width="8" stroke-linejoin="round"/>`;
  }

  return { C, head, person, bust, eyePair, browD, mouthD, pairBrowD, speedLines, burst, prng };
})();
