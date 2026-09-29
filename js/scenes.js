/*
 * 복도에서 또 마주쳤다 — webtoon edition.
 * One tall strip of panels (js/layout.js); the camera travels down it in sync with the narration,
 * punching in on the tiny gestures the script is about. Art is painted from js/art.js at build time.
 */
Video.define(({ tl, cue, scene, onFrame, stage }) => {
  const $ = (s) => stage.querySelector(s);
  const $$ = (s) => [...stage.querySelectorAll(s)];
  const at = (id, phrase, off = 0) => cue(id).when(phrase, off);
  const A = window.Art;
  const C = A.C;
  const { panels: P, H } = window.LAYOUT;

  const [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12, c13, c14, c15, c16, c17, c18] = [
    'c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09',
    'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18',
  ].map(cue);

  CustomWiggle.create('awk', { wiggles: 7, type: 'easeOut' });
  CustomWiggle.create('shiver', { wiggles: 18, type: 'uniform' });

  scene('#strip', 0, null);

  // ================= build: place panels and paint art =================
  for (const [id, [x, y, w, h]] of Object.entries(P)) {
    Object.assign(document.getElementById(id).style, { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px` });
  }
  function paint(sel, w, h, markup) {
    const svg = $(sel);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = markup;
  }
  const g = (x, y, inner, cls = '') => `<g${cls ? ` class="${cls}"` : ''} transform="translate(${x} ${y})">${inner}</g>`;
  const floor = (w, y, h, color = '#EDE3D2') =>
    `<rect width="${w}" height="${y}" fill="#FFFDF8"/><rect y="${y}" width="${w}" height="${h - y}" fill="${color}"/>` +
    `<path d="M0 ${y} H${w}" stroke="${C.ink}" stroke-width="5"/>`;
  const windowAt = (x, y, w, h) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#DCEBF5" stroke="${C.ink}" stroke-width="5"/>` +
    `<path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="${C.ink}" stroke-width="4"/>`;
  const beam = (x, y, w, fy) =>
    `<polygon points="${x},${y} ${x + w},${y} ${x + w + 170},${fy} ${x + 170},${fy}" fill="rgba(255,222,130,0.3)"/>`;
  const note = (x, y, s) =>
    `<g class="note" transform="translate(${x} ${y}) scale(${s})"><ellipse rx="16" ry="12" transform="rotate(-20)" fill="${C.ink}"/>` +
    `<path d="M14 -4 V-62 q20 8 22 30" stroke="${C.ink}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
  const eyesStrip = (w, h, E, blush) =>
    `<rect width="${w}" height="${h}" fill="${C.skin}"/>` +
    `<rect width="${w / 2}" height="40" fill="${C.meHair}"/><rect x="${w / 2}" width="${w / 2}" height="40" fill="${C.coHair}"/>` +
    `<rect x="${w / 2 - 7}" width="14" height="${h}" fill="${C.ink}"/>` +
    g(Math.round(w / 4), Math.round(h * 0.56), A.eyePair('me', E, { blush })) +
    g(Math.round((3 * w) / 4), Math.round(h * 0.56), A.eyePair('co', E, { blush }));

  // title · eyes strip
  paint('#p1 svg.art', 670, 270, eyesStrip(670, 270, 38, false));

  // c02 · morning hallway
  paint('#p3 svg.art', 1720, 520,
    floor(1720, 440, 520) +
    windowAt(300, 70, 260, 190) + windowAt(760, 70, 260, 190) + windowAt(1220, 70, 260, 190) +
    beam(300, 260, 260, 440) + beam(760, 260, 260, 440) + beam(1220, 260, 260, 440) +
    g(0, 440, A.person('me', 42, { mouth: 'neutral' })) + g(0, 440, A.person('co', 42, { mouth: 'neutral' })));
  paint('#p4 svg.art', 840, 470, g(300, 290, A.bust('me', 120, { mouth: 'smile' })));
  paint('#p5 svg.art', 840, 470, g(540, 290, A.bust('co', 120, { mouth: 'smile' })));
  paint('#p6 svg.art', 1720, 190,
    `<path d="M1200 176 H1700" stroke="${C.ink}" stroke-width="4"/>` +
    `<path class="check" d="M1060 92 L1098 128 L1164 56" stroke="${C.ink}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    g(0, 176, A.person('me', 18, { mouth: 'smile' })) + g(0, 176, A.person('co', 18, { mouth: 'smile' })));

  // c04–c05 · coffee, flinch, robot walk
  paint('#p7 svg.art', 1080, 540,
    floor(1080, 450, 540) +
    `<g><rect x="60" y="150" width="190" height="300" rx="14" fill="#5B5B63" stroke="${C.ink}" stroke-width="5"/>` +
    `<rect x="90" y="185" width="130" height="70" rx="8" fill="#9FD3F0" stroke="${C.ink}" stroke-width="4"/>` +
    `<rect x="118" y="300" width="74" height="84" fill="#2A2A2E"/><circle cx="232" cy="206" r="9" fill="${C.blush}"/></g>` +
    g(0, 450, A.person('me', 40, { cup: true, mouth: 'neutral' })) + g(0, 450, A.person('co', 40, { mouth: 'neutral' })));
  paint('#p8 svg.art', 600, 540,
    A.speedLines(300, 330, 175, 560, 64, 7, C.ink, 3) +
    g(300, 330, A.head('me', 160, { brow: 'up', mouth: 'frown', sweat: true })));
  paint('#p9 svg.art', 1720, 330,
    floor(1720, 300, 330) +
    `<g class="robot">` +
    `<g opacity="0.12">${g(560, 300, A.person('me', 36, { brow: 'worried', mouth: 'frown' }))}</g>` +
    `<g opacity="0.22">${g(620, 300, A.person('me', 36, { brow: 'worried', mouth: 'frown' }))}</g>` +
    `<g opacity="0.38">${g(680, 300, A.person('me', 36, { brow: 'worried', mouth: 'frown' }))}</g>` +
    g(740, 300, A.person('me', 36, { brow: 'worried', mouth: 'frown', sweat: true }), 'main') +
    `</g>`);

  // c06 · the split dilemma
  paint('#p10 .art-l', 1720, 640,
    g(220, 400, A.bust('me', 100, { mouth: 'smile' })) +
    g(640, 420, A.bust('co', 100, { brow: 'up', mouth: 'small' })));
  const frost = (x, y) => `<path d="M${x} ${y - 26} V${y + 26} M${x - 26} ${y} H${x + 26} M${x - 18} ${y - 18} L${x + 18} ${y + 18} M${x + 18} ${y - 18} L${x - 18} ${y + 18}" stroke="#7FB6E6" stroke-width="6" stroke-linecap="round"/>`;
  paint('#p10 .art-r', 1720, 640,
    g(1150, 430, A.bust('me', 100, { brow: 'angry', mouth: 'flat' })) +
    g(1530, 410, A.bust('co', 100, { brow: 'up', mouth: 'frown', sweat: true })) +
    frost(1400, 250) + frost(1660, 300) + frost(1440, 560));

  // c07–c11 · the ambiguous choice
  paint('#p11 svg.art', 1720, 420,
    floor(1720, 396, 420) + windowAt(160, 150, 200, 150) + windowAt(1360, 150, 200, 150) +
    g(640, 396, A.person('me', 58, { brow: 'worried', mouth: 'flat', sweat: true })) +
    g(1080, 396, A.person('co', 58, { brow: 'worried', mouth: 'flat', sweat: true })));
  paint('#p12 svg.art', 1720, 250,
    eyesStrip(1720, 250, 56, false) +
    `<path class="spark" d="M770 140 L800 112 L830 166 L860 112 L890 166 L920 112 L950 140" stroke="${C.blush}" stroke-width="9" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`);
  paint('#p13 svg.art', 840, 400,
    `<rect width="840" height="400" fill="${C.skin}"/>` +
    g(420, -60, A.head('me', 520, { mouth: 'neutral' })) +
    `<g class="annot"><path d="M598 178 V116 M584 132 L598 116 L612 132" stroke="${C.blush}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M620 116 H650 M620 148 H650" stroke="${C.blush}" stroke-width="5" stroke-linecap="round"/></g>`);
  paint('#p14 svg.art', 840, 400,
    g(270, 262, A.bust('me', 95, { mouth: 'tiny' })) + g(570, 262, A.bust('co', 95, { mouth: 'tiny' })) +
    `<path class="nodline" d="M222 128 q48 -34 96 0 M522 128 q48 -34 96 0" stroke="${C.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`);
  paint('#p15 svg.art', 1720, 230,
    `<path d="M360 118 H1360" stroke="${C.ink}" stroke-width="10" stroke-linecap="round"/>` +
    `<path d="M360 94 V142 M860 100 V136 M1360 94 V142" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>` +
    g(360, 118, `<g class="knob"><circle r="30" fill="${C.blush}" stroke="${C.ink}" stroke-width="7"/></g>`));
  paint('#p16 svg.art', 1720, 700,
    g(620, 520, A.bust('me', 150, { mouth: 'tiny' })) + g(1100, 520, A.bust('co', 150, { mouth: 'tiny' })));

  // c12–c15 · third time
  paint('#p17 svg.art', 1720, 480,
    floor(1720, 250, 480, '#F1DCCB') + windowAt(700, 40, 150, 120) + windowAt(980, 40, 150, 120) +
    g(0, 250, A.person('me', 26, { mouth: 'neutral' })) + g(0, 250, A.person('co', 26, { mouth: 'neutral' })));
  paint('#p18 svg.art', 1720, 250,
    eyesStrip(1720, 250, 56, true) +
    `<g class="whoosh"><path d="M600 60 H760 M620 96 H780 M1120 60 H960 M1100 96 H940" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></g>`);
  paint('#p19 svg.art', 546, 440,
    `<rect width="546" height="440" fill="#FFFDF8"/>` +
    `<rect x="50" y="46" width="220" height="290" fill="#fff" stroke="${C.ink}" stroke-width="5"/>` +
    `<circle cx="160" cy="46" r="11" fill="${C.blush}" stroke="${C.ink}" stroke-width="4"/>` +
    `<text x="160" y="110" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="36" font-weight="800" fill="${C.ink}">안내문</text>` +
    `<path d="M84 150 H236 M84 184 H236 M84 218 H210 M84 252 H236 M84 286 H180" stroke="#B9B2A6" stroke-width="8" stroke-linecap="round"/>` +
    g(404, 256, A.head('me', 106, { brow: 'flat', mouth: 'flat' })));
  paint('#p20 svg.art', 546, 440,
    g(273, 240, A.bust('co', 106, { brow: 'flat', mouth: 'flat' })) +
    `<ellipse cx="273" cy="352" rx="170" ry="60" fill="rgba(159,224,255,0.35)"/>` +
    `<rect x="214" y="352" width="118" height="170" rx="18" fill="#2A2A2E" stroke="${C.ink}" stroke-width="5"/>` +
    `<rect class="screen" x="228" y="366" width="90" height="120" rx="8" fill="#9FE0FF"/>`);
  paint('#p21 svg.art', 546, 440,
    `<rect width="546" height="440" fill="#FFFDF8"/>` +
    g(300, 262, A.head('me', 106, { brow: 'up', mouth: 'small' })) +
    `<g class="notes">${note(110, 236, 1)}${note(176, 176, 0.8)}</g>`);
  paint('#p22 svg.art', 1720, 460,
    `<rect width="1720" height="460" fill="#FFFDF8"/>` + windowAt(260, 130, 220, 160) + windowAt(1240, 130, 220, 160) +
    g(1020, 310, A.bust('co', 130, { mouth: 'flat', blush: true, sweat: true })) +
    g(700, 310, A.bust('me', 130, { mouth: 'flat', blush: true, sweat: true })));

  // c16 · tension (dark)
  paint('#p23 svg.art', 1720, 760,
    A.speedLines(860, 560, 300, 1100, 96, 11, 'rgba(255,255,255,0.09)', 6) +
    g(420, 590, A.bust('me', 150, { brow: 'worried', mouth: 'frown', blush: true, sweat: true })) +
    g(1300, 590, A.bust('co', 150, { brow: 'worried', mouth: 'frown', blush: true, sweat: true })) +
    `<path class="rope" d="M590 560 Q860 560 1130 560" stroke="${C.blush}" stroke-width="9" fill="none" stroke-linecap="round"/>`);

  // c17–c18 · fourth time, the same thought
  paint('#p24 svg.art', 1720, 560,
    A.burst(860, 250, 150, 235, 14, C.blush) +
    `<text class="four" x="860" y="326" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="220" font-weight="900" fill="#fff" stroke="${C.ink}" stroke-width="12" paint-order="stroke">4</text>` +
    g(330, 300, A.head('me', 130, { brow: 'angry', mouth: 'flat', sweat: true })) +
    g(1390, 300, A.head('co', 130, { brow: 'angry', mouth: 'flat', sweat: true })));
  paint('#p25 svg.art', 1720, 700,
    `<defs><linearGradient id="spot25" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(255,240,200,0.28)"/><stop offset="1" stop-color="rgba(255,240,200,0.04)"/></linearGradient></defs>` +
    `<polygon points="760,0 960,0 1380,640 340,640" fill="url(#spot25)"/>` +
    `<ellipse cx="860" cy="640" rx="560" ry="46" fill="rgba(255,240,200,0.12)"/>` +
    g(0, 640, A.person('me', 56, { brow: 'worried', mouth: 'frown' })) + g(0, 640, A.person('co', 56, { brow: 'worried', mouth: 'frown' })));

  // shared initial state
  gsap.set('#strip', { x: 0, y: 0, scale: 1, transformOrigin: '0 0' });
  gsap.set('#strip .leg', { transformOrigin: '50% 0%' });
  gsap.set('#strip .person', { transformOrigin: '50% 100%' });
  gsap.set('#strip .head, #strip .eyeball, #strip .bust, #strip .knob', { transformOrigin: '50% 50%' });
  $$('#strip [data-rot]').forEach((el) => gsap.set(el, { rotation: Number(el.dataset.rot) }));

  // idle breathing on every character (pure function of t)
  const breaths = $$('#strip .breath').map((el, i) => ({ el, ph: i * 1.37 }));
  onFrame((t) => {
    for (const b of breaths) b.el.setAttribute('transform', `translate(0 ${(Math.sin(t * 2.2 + b.ph) * 1.8).toFixed(2)})`);
  });

  // ================= helpers =================
  const eachHead = (sel, fn) => $$(sel).forEach((h) => fn(h, Number(h.dataset.r)));
  function face(sel, { brow, browL, browR, mouth }, pos, dur = 0.3) {
    eachHead(sel, (h, r) => {
      const bl = browL || brow;
      const br = browR || brow;
      if (bl) tl.to(h.querySelector('.brow-l'), { attr: { d: A.browD(bl, r, -1) }, duration: dur, ease: 'power2.out' }, pos);
      if (br) tl.to(h.querySelector('.brow-r'), { attr: { d: A.browD(br, r, 1) }, duration: dur, ease: 'power2.out' }, pos);
      if (mouth) tl.to(h.querySelector('.mouth'), { attr: { d: A.mouthD(mouth, r) }, duration: dur, ease: 'power2.inOut' }, pos);
    });
  }
  function look(sel, fx, fy, pos, dur = 0.25, ease = 'power3.out') {
    eachHead(sel, (h, r) => tl.to(h.querySelectorAll('.pupil'), { x: fx * r, y: fy * r, duration: dur, ease }, pos));
  }
  const lookNow = (sel, fx, fy) => eachHead(sel, (h, r) => gsap.set(h.querySelectorAll('.pupil'), { x: fx * r, y: fy * r }));
  function lookPair(sel, fx, fy, pos, dur = 0.25, ease = 'power3.out') {
    $$(sel).forEach((p) => {
      const e = Number(p.dataset.e);
      tl.to(p.querySelectorAll('.pupil'), { x: fx * e, y: fy * e, duration: dur, ease }, pos);
    });
  }
  function pairBrows(sel, kind, pos, dur = 0.25) {
    $$(sel).forEach((p) => {
      const e = Number(p.dataset.e);
      tl.to(p.querySelector('.brow-l'), { attr: { d: A.pairBrowD(kind, e, -1) }, duration: dur }, pos);
      tl.to(p.querySelector('.brow-r'), { attr: { d: A.pairBrowD(kind, e, 1) }, duration: dur }, pos);
    });
  }
  const blink = (sel, pos) => tl.to(sel, { scaleY: 0.1, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' }, pos);

  const panelIn = (id, pos, from = {}) =>
    tl.from(document.getElementById(id), { autoAlpha: 0, y: 46, scale: 0.97, duration: 0.55, ease: 'power3.out', ...from }, pos);
  const pop = (target, pos, from = {}) =>
    tl.from(target, { scale: 0.4, autoAlpha: 0, duration: 0.4, ease: 'back.out(2.2)', ...from }, pos);
  const slam = (target, pos) => tl.from(target, { scale: 1.9, autoAlpha: 0, duration: 0.32, ease: 'back.out(1.8)' }, pos);
  const draw = (target, pos, dur = 0.4) => tl.fromTo(target, { drawSVG: '0%' }, { drawSVG: '100%', duration: dur, ease: 'power2.out' }, pos);

  function walk(sel, x, start, end, ease = 'power1.inOut') {
    const d = end - start;
    const steps = Math.max(2, 2 * Math.round(d / 0.32));
    tl.to(sel, { x, duration: d, ease }, start);
    tl.fromTo(`${sel} .leg-l`, { rotation: 16 }, { rotation: -16, duration: d / steps, repeat: steps - 1, yoyo: true, ease: 'sine.inOut', immediateRender: false }, start);
    tl.fromTo(`${sel} .leg-r`, { rotation: -16 }, { rotation: 16, duration: d / steps, repeat: steps - 1, yoyo: true, ease: 'sine.inOut', immediateRender: false }, start);
    tl.to(sel, { y: -6, duration: d / steps, repeat: steps - 1, yoyo: true, ease: 'sine.inOut' }, start);
    tl.to(`${sel} .leg`, { rotation: 0, duration: 0.15 }, end);
  }

  // camera: frame a strip rect inside the area above the HUD (HUD sits in the bottom corners, where the
  // not-yet-revealed part of the page is; the top of the screen shows the previous panels)
  function frame([x, y, w, h], maxS = 1) {
    const s = Math.max(1, Math.min(maxS, 1800 / w, 860 / h));
    const tx = Math.min(0, Math.max(1920 - s * 1920, 960 - s * (x + w / 2)));
    const ty = Math.min(0, Math.max(1080 - s * H, 470 - s * (y + h / 2)));
    return { x: tx, y: ty, scale: s };
  }
  const cam = (rect, pos, dur = 1.0, maxS = 1, ease = 'power3.inOut') =>
    tl.to('#strip', { ...frame(rect, maxS), duration: dur, ease }, pos);
  const union = (...ids) => {
    const rs = ids.map((id) => P[id]);
    const x0 = Math.min(...rs.map((r) => r[0]));
    const y0 = Math.min(...rs.map((r) => r[1]));
    const x1 = Math.max(...rs.map((r) => r[0] + r[2]));
    const y1 = Math.max(...rs.map((r) => r[1] + r[3]));
    return [x0, y0, x1 - x0, y1 - y0];
  };

  // ================= HUD =================
  const whenLabels = $$('#hud .count-when span');
  gsap.set(whenLabels, { autoAlpha: 0 });
  gsap.set('#hud .digit-window', { transformOrigin: '0% 100%' });
  function counter(nth, pos) {
    tl.to('#hud .digits', { y: -76 * nth, duration: 0.55, ease: 'back.out(1.7)' }, pos);
    tl.fromTo('#hud .hud-count', { scale: 1 }, { scale: 1.12, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, pos);
    if (nth > 1) tl.to(whenLabels[nth - 2], { autoAlpha: 0, y: -14, duration: 0.25, ease: 'power2.in' }, pos);
    tl.fromTo(whenLabels[nth - 1], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, pos + 0.12);
  }
  const meter = { v: 0 };
  const meterFill = $('#hud .meter-fill');
  const meterVal = $('#hud .meter-val');
  onFrame(() => {
    meterFill.style.transform = `scaleX(${meter.v / 100})`;
    meterVal.textContent = `${Math.round(meter.v)}%`;
  });
  const awk = (v, pos, d = 0.9) => tl.to(meter, { v, duration: d, ease: 'power2.out' }, pos);
  tl.from('#hud .hud-box', { y: 40, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1 }, c02.start - 0.45);

  // ================= title · c01 =================
  const hookLines = SplitText.create('#strip .hook', { type: 'lines', mask: 'lines' }).lines;
  tl.from('#strip .kicker', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.15);
  tl.from(hookLines, { yPercent: 110, duration: 1.0, ease: 'power4.out', stagger: 0.14 }, 0.35);
  panelIn('p1', 1.0, { x: 120, y: 0 });
  lookPair('#p1 .pair.who-me', 0.36, 0, at('c01', '미묘하게', -0.1));
  lookPair('#p1 .pair.who-co', -0.36, 0, at('c01', '미묘하게', -0.1));
  const tAwk1 = at('c01', '어색한');
  lookPair('#p1 .pair.who-me', -0.38, -0.1, tAwk1, 0.14, 'power4.out');
  lookPair('#p1 .pair.who-co', 0.38, -0.1, tAwk1, 0.14, 'power4.out');
  pairBrows('#p1 .pair', 'worried', tAwk1);
  tl.to('#p1 .blush', { opacity: 1, duration: 0.4 }, tAwk1 + 0.1);
  tl.to('#p1', { x: 8, duration: 0.7, ease: 'awk' }, tAwk1);
  tl.to('#strip .hook em', { x: 8, duration: 0.8, ease: 'awk' }, tAwk1);

  // ================= c02 · morning, first hello =================
  cam(P.p3, c02.start - 0.7, 1.1);
  panelIn('p3', c02.start - 0.75);
  pop('#p3 .cap', c02.start);
  gsap.set('#p3 .person.who-me', { x: -80 });
  gsap.set('#p3 .person.who-co', { x: 1800 });
  lookNow('#p3 .who-me .head', 0.06, 0);
  lookNow('#p3 .who-co .head', -0.06, 0);
  const meet1 = at('c02', '마주쳐');
  walk('#p3 .person.who-me', 740, c02.start - 0.4, meet1);
  walk('#p3 .person.who-co', 980, c02.start - 0.4, meet1);
  counter(1, meet1);

  const hello = at('c02', '안녕하세요');
  cam(union('p4', 'p5', 'p6'), hello - 0.75, 0.8);
  lookNow('#p4 .head', 0.07, 0);
  lookNow('#p5 .head', -0.07, 0);
  panelIn('p4', hello - 0.55, { x: -60, y: 0 });
  pop('#p4 .balloon', hello - 0.12);
  tl.to('#p4 .head', { rotation: 10, y: 10, duration: 0.28, yoyo: true, repeat: 1, ease: 'power2.out' }, hello);
  panelIn('p5', hello - 0.2, { x: 60, y: 0 });
  pop('#p5 .balloon', hello + 0.3);
  tl.to('#p5 .head', { rotation: -10, y: 10, duration: 0.28, yoyo: true, repeat: 1, ease: 'power2.out' }, hello + 0.4);

  // c03 · no problem (yet)
  panelIn('p6', c03.start - 0.25);
  draw('#p6 .check', c03.start + 0.35, 0.35);
  gsap.set('#p6 .person.who-me', { x: 1400 });
  gsap.set('#p6 .person.who-co', { x: 1500 });
  walk('#p6 .person.who-me', 1260, c03.start, c04.start - 0.3);
  walk('#p6 .person.who-co', 1650, c03.start, c04.start - 0.3);

  // ================= c04 · ten minutes later =================
  cam(union('p7', 'p8'), c04.start - 0.6, 1.0);
  panelIn('p7', c04.start - 0.55);
  slam('#p7 .cap.stamp', at('c04', '10분', -0.15));
  gsap.set('#p7 .person.who-me', { x: 300 });
  gsap.set('#p7 .person.who-co', { x: 1130 });
  lookNow('#p7 .who-me .head', 0.06, 0.02);
  lookNow('#p7 .who-co .head', -0.06, 0);
  const meet2 = at('c04', '또 마주친다');
  walk('#p7 .person.who-me', 470, c04.start - 0.2, meet2);
  walk('#p7 .person.who-co', 660, c04.start + 0.2, meet2);
  slam('#p7 .sfx', meet2);
  face('#p7 .head', { brow: 'up' }, meet2);
  counter(2, meet2);
  awk(35, meet2);
  panelIn('p8', meet2 + 0.15, { x: 80, y: 0, scale: 0.9 });
  slam('#p8 .sfx', meet2 + 0.3);
  tl.to('#p8 .pupil', { scale: 0.55, duration: 0.2 }, meet2 + 0.25);
  tl.to('#p8 .head', { x: 10, duration: 0.7, ease: 'awk' }, meet2 + 0.3);

  // c05 · every move gets hard
  cam(union('p7', 'p8', 'p9'), c05.start - 0.35, 0.8);
  panelIn('p9', c05.start - 0.3);
  tl.to('#p9 .robot', { x: 470, duration: c05.duration + 0.6, ease: 'steps(7)' }, c05.start);
  tl.to('#p9 .robot .person', { rotation: 3, duration: c05.duration + 0.6, ease: 'shiver' }, c05.start);
  const creaks = $$('#p9 .sfx');
  slam(creaks[0], c05.start + 0.45);
  slam(creaks[1], at('c05', '어려워진다'));
  tl.to('#p9 .cap em', { x: 8, duration: 0.8, ease: 'awk' }, at('c05', '어려워진다'));
  awk(45, at('c05', '어려워진다'));

  // ================= c06 · the dilemma =================
  const tSilent = at('c06', '아무 말 없이');
  const [x10, y10, w10, h10] = P.p10;
  cam([x10, y10, 880, h10], c06.start - 0.55, 1.0, 1.35);
  panelIn('p10', c06.start - 0.5);
  tl.from('#p10 .half-r', { x: 240, autoAlpha: 0, duration: 0.55, ease: 'power3.out' }, tSilent - 0.35);
  lookNow('#p10 .art-l .who-me .head', 0.07, 0);
  lookNow('#p10 .art-l .who-co .head', -0.06, 0.03);
  lookNow('#p10 .art-r .who-me .head', 0.05, -0.08);
  lookNow('#p10 .art-r .who-co .head', -0.07, 0);
  gsap.set('#p10 .art-r .who-me .eyeball', { scaleY: 0.5 });
  const leftBits = $$('#p10 .half-l .cap, #p10 .half-l .balloon, #p10 .half-l .sfx');
  pop(leftBits[1], c06.start + 0.15);                     // balloon "안녕하세요"
  slam(leftBits[2], c06.start + 1.0);                     // "?"
  face('#p10 .art-l .who-co .head', { browL: 'up', browR: 'flat' }, c06.start + 1.0);
  pop(leftBits[3], at('c06', '방금', -0.1), { scale: 0.8 }); // caption
  draw('#p10 .x-l path', tSilent - 0.6, 0.22);
  cam([x10 + 840, y10, 880, h10], tSilent - 0.4, 0.7, 1.35);
  tl.to('#p10 .art-r .who-me .head', { rotation: -8, duration: 0.4 }, tSilent);
  const rightBits = $$('#p10 .half-r .cap, #p10 .half-r .sfx');
  slam(rightBits[1], at('c06', '쌀쌀맞아진', -0.3));       // "!"
  pop(rightBits[2], at('c06', '갑자기', -0.1), { scale: 0.8 });
  draw('#p10 .x-r path', c06.end - 0.25, 0.22);
  cam(P.p10, c06.end - 0.45, 0.7);
  awk(55, c06.start + 0.6);

  // ================= c07 · the ambiguous choice =================
  cam(P.p11, c07.start - 0.6, 1.0);
  panelIn('p11', c07.start - 0.55);
  pop('#p11 .cap', c07.start + 0.1, { scale: 0.8 });
  lookNow('#p11 .who-me .head', 0.07, 0);
  lookNow('#p11 .who-co .head', -0.07, 0);
  const dots = $$('#p11 .balloon');
  pop(dots[0], c07.start + 0.9);
  pop(dots[1], c07.start + 1.15);
  awk(50, c07.start + 0.3);

  // c08 · eyes · mouth corner · nod
  const [tEye, tMouth, tNod] = [at('c08', '눈을'), at('c08', '입꼬리를'), at('c08', '고개를')];
  cam(P.p12, tEye - 0.45, 0.5, 1.05);
  panelIn('p12', tEye - 0.5, { y: 0 });
  lookPair('#p12 .pair.who-me', 0.34, 0, tEye);
  lookPair('#p12 .pair.who-co', -0.34, 0, tEye);
  draw('#p12 .spark', tEye + 0.15, 0.25);
  tl.to('#hud', { autoAlpha: 0, duration: 0.25 }, tMouth - 0.4);
  cam(P.p13, tMouth - 0.35, 0.5, 2, 'power4.inOut');
  panelIn('p13', tMouth - 0.45, { y: 0, scale: 1 });
  face('#p13 .head', { mouth: 'tiny' }, tMouth + 0.35, 0.6);
  draw('#p13 .annot path', tMouth + 0.65, 0.3);
  cam(P.p14, tNod - 0.3, 0.45, 2, 'power4.inOut');
  panelIn('p14', tNod - 0.35, { y: 0, scale: 1 });
  lookNow('#p14 .who-me .head', 0.07, 0.02);
  lookNow('#p14 .who-co .head', -0.07, 0.02);
  tl.to('#p14 .who-me .head', { y: 14, rotation: 6, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }, tNod + 0.05);
  tl.to('#p14 .who-co .head', { y: 14, rotation: -6, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }, tNod + 0.1);
  draw('#p14 .nodline', tNod + 0.05, 0.3);
  slam('#p14 .sfx', tNod + 0.1);

  // c09 · neither a real hello nor ignoring
  const tButAlso = at('c09', '그렇다고');
  cam(union('p13', 'p14', 'p15'), c09.start - 0.4, 0.8);
  tl.to('#hud', { autoAlpha: 1, duration: 0.3 }, c09.start - 0.1);
  panelIn('p15', c09.start - 0.3);
  tl.to('#p15 .g-left', { color: C.blush, duration: 0.2 }, c09.start);
  tl.to('#p15 .g-left', { color: '#8B857A', duration: 0.2 }, tButAlso - 0.1);
  tl.to('#p15 .knob', { x: 1000, duration: 0.6, ease: 'power3.inOut' }, tButAlso - 0.2);
  tl.to('#p15 .g-right', { color: C.blush, duration: 0.2 }, at('c09', '무시도'));
  tl.to('#p15 .knob', { x: 500, duration: 0.55, ease: 'back.out(1.6)' }, c09.end - 0.5);
  tl.to('#p15 .g-right', { color: '#8B857A', duration: 0.2 }, c09.end - 0.2);

  // c10 · speaking with the face
  cam(P.p16, c10.start - 0.45, 0.9);
  panelIn('p16', c10.start - 0.45);
  lookNow('#p16 .who-me .head', 0.07, 0);
  lookNow('#p16 .who-co .head', -0.07, 0);
  gsap.set('#p16 .thought', { transformOrigin: '50% 100%' });
  pop('#p16 .cap', c10.start, { scale: 0.8 });
  tl.to('#p16 .bust', { scale: 1.04, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' }, c10.start + 0.35);

  // c11 · "Yes, I know. We already said hi."
  tl.to('#p16 .cap', { autoAlpha: 0, y: -12, duration: 0.3 }, c11.start - 0.35);
  pop('#p16 .thought', c11.start - 0.25, { scale: 0.85, ease: 'back.out(1.7)', duration: 0.45 });
  const th1 = $$('#p16 .th-line');
  tl.from(th1[0], { y: 18, autoAlpha: 0, duration: 0.4, ease: 'power3.out' }, c11.start - 0.05);
  tl.from(th1[1], { y: 18, autoAlpha: 0, duration: 0.4, ease: 'power3.out' }, at('c11', '우리', -0.1));
  blink('#p16 .eyeball', c11.end + 0.35);

  // ================= c12 · third time =================
  cam(P.p17, c12.start - 0.6, 1.0);
  panelIn('p17', c12.start - 0.55);
  pop('#p17 .cap', c12.start);
  gsap.set('#p17 .person.who-me', { x: 330 });
  gsap.set('#p17 .person.who-co', { x: 1400 });
  lookNow('#p17 .who-me .head', 0.06, 0);
  lookNow('#p17 .who-co .head', -0.06, 0);
  const meet3 = at('c12', '또 마주치면');
  walk('#p17 .person.who-me', 510, c12.start - 0.3, meet3);
  walk('#p17 .person.who-co', 1200, c12.start - 0.3, meet3);
  const bangs = $$('#p17 .sfx');
  slam(bangs[0], meet3);
  slam(bangs[1], meet3 + 0.08);
  face('#p17 .head', { brow: 'up', mouth: 'frown' }, meet3);
  counter(3, meet3);
  awk(70, meet3);
  const tWorse = at('c12', '더 어색해진다');
  const worseChars = SplitText.create('#p17 .display', { type: 'chars' }).chars;
  tl.from(worseChars, { yPercent: 60, autoAlpha: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.04 }, tWorse - 0.15);
  tl.to(worseChars, { y: 5, rotation: 4, duration: 1.8, ease: 'shiver', stagger: 0.03 }, tWorse + 0.3);

  // c13 · looking away just before the eyes meet
  cam(P.p18, c13.start - 0.45, 0.6, 1.05);
  panelIn('p18', c13.start - 0.45, { y: 0 });
  pairBrows('#p18 .pair', 'worried', c13.start);
  lookPair('#p18 .pair.who-me', 0.2, 0, c13.start + 0.1, 1.0, 'sine.inOut');
  lookPair('#p18 .pair.who-co', -0.2, 0, c13.start + 0.1, 1.0, 'sine.inOut');
  const tAway = at('c13', '시선을', -0.05);
  lookPair('#p18 .pair.who-me', -0.4, -0.3, tAway, 0.12, 'power4.out');
  lookPair('#p18 .pair.who-co', 0.4, -0.3, tAway, 0.12, 'power4.out');
  draw('#p18 .whoosh path', tAway, 0.18);
  slam('#p18 .sfx', tAway);

  // c14 · notice board · phone · the other way
  const avoid = [at('c14', '벽에'), at('c14', '휴대폰을'), at('c14', '괜히')];
  cam(union('p19', 'p20', 'p21'), c14.start - 0.45, 0.7);
  lookNow('#p19 .head', -0.07, -0.05);
  lookNow('#p20 .head', 0, 0.09);
  lookNow('#p21 .head', -0.07, -0.08);
  gsap.set('#p21 .head', { rotation: -14 });
  panelIn('p19', avoid[0] - 0.25, { y: 60 });
  tl.to('#p19 .pupil', { x: '+=10', duration: 0.22, repeat: 7, yoyo: true, ease: 'sine.inOut' }, avoid[0] + 0.2);
  panelIn('p20', avoid[1] - 0.25, { y: 60 });
  tl.to('#p20 .screen', { opacity: 0.6, duration: 0.3, repeat: 3, yoyo: true, ease: 'sine.inOut' }, avoid[1] + 0.2);
  panelIn('p21', avoid[2] - 0.25, { y: 60 });
  tl.fromTo('#p21 .note', { y: 0, autoAlpha: 1 }, { y: -40, autoAlpha: 0, duration: 1.1, stagger: 0.35, repeat: 1, ease: 'power1.out', immediateRender: false }, avoid[2] + 0.1);

  // c15 · we saw each other, we pretend we didn't
  const tSaw = at('c15', '봤는데');
  const tPretend = at('c15', '못 본 척');
  cam(P.p22, c15.start - 0.4, 0.8);
  panelIn('p22', c15.start - 0.4);
  // back to back: heads turned away, only the pupils sneak a look
  gsap.set('#p22 .who-me .head', { rotation: -9 });
  gsap.set('#p22 .who-co .head', { rotation: 9 });
  lookNow('#p22 .who-me .head', -0.08, -0.04);
  lookNow('#p22 .who-co .head', 0.08, -0.04);
  const caps22 = $$('#p22 .cap');
  pop(caps22[0], c15.start, { scale: 0.8 });
  look('#p22 .who-me .head', 0.085, 0.02, tSaw - 0.25, 0.14);
  look('#p22 .who-co .head', -0.085, 0.02, tSaw - 0.25, 0.14);
  face('#p22 .head', { brow: 'worried' }, tSaw - 0.25, 0.2);
  look('#p22 .who-me .head', -0.085, -0.05, tPretend, 0.12, 'power4.out');
  look('#p22 .who-co .head', 0.085, -0.05, tPretend, 0.12, 'power4.out');
  face('#p22 .head', { brow: 'flat' }, tPretend, 0.15);
  slam(caps22[1], tPretend - 0.3);

  // ================= c16 · the strange tension =================
  cam(P.p23, c16.start - 0.6, 1.1);
  cam(P.p23, c16.start + 0.6, c16.duration, 1.05, 'none');
  panelIn('p23', c16.start - 0.55);
  lookNow('#p23 .who-me .head', 0.07, 0);
  lookNow('#p23 .who-co .head', -0.07, 0);
  const caps23 = $$('#p23 .cap');
  pop(caps23[0], c16.start, { scale: 0.8 });
  pop(caps23[1], at('c16', '사이가', -0.1), { scale: 0.8 });
  const tReason = at('c16', '단지 오늘');
  tl.to([caps23[0], caps23[1]], { autoAlpha: 0, y: -14, duration: 0.3, stagger: 0.05 }, tReason - 0.4);
  pop(caps23[2], tReason - 0.1, { scale: 0.85 });
  const tTension = at('c16', '이상한 긴장감');
  const rope = $('#p23 .rope');
  const string = { a: 0 };
  gsap.set(rope, { autoAlpha: 0 });
  onFrame((t) => rope.setAttribute('d', `M590 560 Q860 ${(560 + Math.sin(t * 38) * 30 * string.a).toFixed(1)} 1130 560`));
  tl.to(rope, { autoAlpha: 1, duration: 0.2 }, tTension - 0.3);
  tl.to(string, { a: 1, duration: 0.5, ease: 'power2.out' }, tTension - 0.3);
  slam('#p23 .display', tTension);
  tl.to('#p23 .bust', { x: 3, duration: 1.4, ease: 'shiver' }, tTension);
  awk(95, tTension);

  // ================= c17 · fourth time, the same thought =================
  const meet4 = at('c17', '네 번째쯤');
  cam(P.p24, c17.start - 0.6, 1.0);
  panelIn('p24', c17.start - 0.55);
  lookNow('#p24 .who-me .head', 0.06, 0);
  lookNow('#p24 .who-co .head', -0.06, 0);
  tl.from('#p24 .burst', { scale: 0, rotation: -40, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(2)' }, meet4 - 0.1);
  slam('#p24 .four', meet4);
  pop('#p24 > .cap', meet4 - 0.05, { scale: 0.8 });
  counter(4, meet4);
  awk(100, meet4, 0.6);
  tl.to('#hud .digits span:last-child', { color: C.blush, duration: 0.3 }, meet4);
  tl.to('#hud .meter-fill', { opacity: 0.35, duration: 0.18, yoyo: true, repeat: 5, ease: 'none' }, meet4 + 0.5);
  pop('#p24 .center-wrap .cap', at('c17', '둘 다', -0.1), { scale: 0.8 });
  tl.to('#p24 .eyeball', { scaleY: 0.25, duration: 0.25, ease: 'power2.out' }, at('c17', '같은 생각'));

  // ================= c18 · "please, let's just pretend" =================
  cam([P.p25[0], P.p25[1], P.p25[2], 800], c18.start - 0.6, 1.0);
  panelIn('p25', c18.start - 0.55);
  gsap.set('#p25 .eyeball', { scaleY: 0.12 });
  gsap.set('#p25 .person.who-me', { x: 380 });
  gsap.set('#p25 .person.who-co', { x: 1340 });
  gsap.set('#p25 .thought', { transformOrigin: '50% 100%' });
  pop('#p25 .thought', c18.start - 0.25, { scale: 0.85, ease: 'back.out(1.7)', duration: 0.45 });
  const th2 = $$('#p25 .th-line');
  tl.from(th2[0], { y: 18, autoAlpha: 0, duration: 0.4, ease: 'power3.out' }, c18.start - 0.05);
  tl.from(th2[1], { y: 18, autoAlpha: 0, duration: 0.4, ease: 'power3.out' }, at('c18', '못 본 척', -0.15));
  const tPassed = c18.end + 1.6;
  walk('#p25 .person.who-me', 1150, c18.start + 0.2, tPassed, 'sine.inOut');
  walk('#p25 .person.who-co', 570, c18.start + 0.2, tPassed, 'sine.inOut');
  const sighs = $$('#p25 .sfx');
  tl.to('#p25 .eyeball', { scaleY: 1, duration: 0.2 }, tPassed);
  face('#p25 .head', { brow: 'neutral', mouth: 'flat' }, tPassed);
  pop(sighs[0], tPassed + 0.1);
  pop(sighs[1], tPassed + 0.25);
  tl.to('#hud', { autoAlpha: 0, duration: 0.5 }, tPassed - 0.2);
  tl.from('#strip .endcard', { autoAlpha: 0, y: 12, duration: 0.6, ease: 'power2.out' }, tPassed);
});
