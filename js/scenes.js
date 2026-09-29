/*
 * 복도에서 또 마주쳤다 — timeline.
 * Everything is anchored to narration cues (see storyboard.md), so re-generated takes re-time the video.
 */
Video.define(({ tl, cue, scene, onFrame, stage }) => {
  const $ = (s) => stage.querySelector(s);
  const $$ = (s) => [...stage.querySelectorAll(s)];
  const at = (id, phrase, off = 0) => cue(id).when(phrase, off);
  const words = (sel) => SplitText.create(sel, { type: 'words', mask: 'words' }).words;

  const INK = '#1F1F22';
  const BG = '#F2EEE5';
  const BLUSH = '#F2604C';
  const MUTED = '#8B857A';
  const SMILE = 'M-44 52 Q0 70 44 52';
  const AWKWARD = 'M-44 64 Q0 52 44 64';
  const FLAT = 'M-40 60 Q0 60 40 60';

  CustomWiggle.create('awk', { wiggles: 7, type: 'easeOut' });
  CustomWiggle.create('shiver', { wiggles: 16, type: 'uniform' });

  const rise = (targets, pos, extra = {}) =>
    tl.from(targets, { yPercent: 110, duration: 0.75, ease: 'power3.out', stagger: 0.06, ...extra }, pos);
  const sink = (targets, pos) =>
    tl.to(targets, { yPercent: -110, duration: 0.42, ease: 'power2.in', stagger: 0.03 }, pos);

  const [c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12, c13, c14, c15, c16, c17, c18] = [
    'c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09',
    'c10', 'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18',
  ].map(cue);

  // ---------- scene windows ----------
  scene('#s01', 0, c02.start - 0.1);
  scene('#hall', c02.start - 0.6, c06.start - 0.3);
  scene('#s02', c02.start - 0.6, c04.start);
  scene('#s03', c04.start - 0.4, c06.start - 0.3);
  scene('#s04', c06.start - 0.4, c07.start);
  scene('#duo', c07.start - 0.4, null);
  scene('#s05', c07.start - 0.4, c12.start);
  scene('#s06', c12.start - 0.3, c16.start);
  scene('#s07', c16.start - 0.3, c17.start);
  scene('#s08', c17.start - 0.3, null);

  // ---------- HUD: encounter counter + awkwardness meter ----------
  tl.from('#hud .hud-count, #hud .hud-meter', { y: -30, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, c02.start - 0.45);
  const whenLabels = $$('#hud .count-when span');
  gsap.set(whenLabels, { autoAlpha: 0 });
  gsap.set('#hud .digit-window', { transformOrigin: '0% 100%' });
  function counter(n, pos) {
    tl.to('#hud .digits', { y: -96 * n, duration: 0.55, ease: 'back.out(1.7)' }, pos);
    tl.fromTo('#hud .digit-window', { scale: 1 }, { scale: 1.2, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, pos);
    if (n > 1) tl.to(whenLabels[n - 2], { autoAlpha: 0, y: -14, duration: 0.25, ease: 'power2.in' }, pos);
    tl.fromTo(whenLabels[n - 1], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out', immediateRender: false }, pos + 0.12);
  }
  const meter = { v: 0 };
  const meterFill = $('#hud .meter-fill');
  const meterVal = $('#hud .meter-val');
  onFrame(() => {
    meterFill.style.transform = `scaleX(${meter.v / 100})`;
    meterVal.textContent = `${Math.round(meter.v)}%`;
  });
  const awk = (v, pos, d = 0.9) => tl.to(meter, { v, duration: d, ease: 'power2.out' }, pos);

  // ---------- s01 · hook ----------
  const hookLines = SplitText.create('#s01 .hook', { type: 'lines', mask: 'lines' }).lines;
  tl.from('#s01 .kicker', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.15);
  tl.from(hookLines, { yPercent: 110, duration: 1.0, ease: 'power4.out', stagger: 0.14 }, 0.35);
  tl.from('#s01 .dots circle', { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2)', stagger: 0.1 }, 0.9);
  tl.to('#s01 .d-me', { x: 95, duration: 0.9, ease: 'power3.inOut' }, at('c01', '미묘하게', -0.2));
  tl.to('#s01 .d-co', { x: -95, duration: 0.9, ease: 'power3.inOut' }, at('c01', '미묘하게', -0.2));
  tl.to('#s01 .dots circle', { x: '+=9', duration: 0.8, ease: 'awk' }, at('c01', '어색한'));
  tl.to('#s01 .hook em', { x: 8, duration: 0.8, ease: 'awk' }, at('c01', '어색한'));
  sink(hookLines, c02.start - 0.75);
  tl.to('#s01 .kicker, #s01 .dots', { y: -24, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, c02.start - 0.75);

  // ---------- hallway + walkers ----------
  tl.from('#hall .floor', { drawSVG: '0%', duration: 1.0, ease: 'power2.inOut' }, c02.start - 0.6);
  tl.from('#hall .doors', { autoAlpha: 0, duration: 0.6 }, c02.start - 0.4);
  gsap.set('#wMe', { x: -150, y: 820 });
  gsap.set('#wCo', { x: 2070, y: 820 });
  gsap.set('#wMe .cup, #wMe .sweat', { autoAlpha: 0 });
  function walkers(xMe, xCo, start, end, ease = 'power2.out') {
    const d = end - start;
    tl.to('#wMe', { x: xMe, duration: d, ease }, start);
    tl.to('#wCo', { x: xCo, duration: d, ease }, start);
    const halfSteps = Math.max(2, 2 * Math.round(d / 0.36)); // even → ends on the floor
    tl.to('#wMe, #wCo', { y: 808, duration: d / halfSteps, repeat: halfSteps - 1, yoyo: true, ease: 'sine.inOut' }, start);
  }

  // ---------- s02 · the first hello ----------
  const meet1 = at('c02', '마주쳐');
  walkers(850, 1070, c02.start - 0.35, meet1);
  counter(1, meet1);
  const hello = at('c02', '안녕하세요');
  gsap.set('#s02 .b-me', { transformOrigin: '85% 100%' });
  gsap.set('#s02 .b-co', { transformOrigin: '15% 100%' });
  tl.from('#s02 .b-me', { scale: 0.3, autoAlpha: 0, duration: 0.5, ease: 'back.out(2.2)' }, hello - 0.15);
  tl.from('#s02 .b-co', { scale: 0.3, autoAlpha: 0, duration: 0.5, ease: 'back.out(2.2)' }, hello + 0.3);

  // c03 · no problem (yet)
  tl.to('#s02 .bubble', { scale: 0.6, autoAlpha: 0, duration: 0.3, ease: 'power2.in', stagger: 0.05 }, c03.start - 0.25);
  tl.fromTo('#s02 .ok-check path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, ease: 'power2.out' }, c03.start);
  const okWords = words('#s02 .ok-text');
  rise(okWords, c03.start - 0.05);
  walkers(2080, -160, c03.end + 0.1, c04.start + 0.35, 'power2.in');
  sink(okWords, c04.start - 0.4);
  tl.to('#s02 .ok-check', { autoAlpha: 0, duration: 0.3 }, c04.start - 0.4);

  // ---------- s03 · ten minutes later ----------
  gsap.set('#s03 .stamp', { xPercent: -50, rotation: -6, transformOrigin: '50% 50%' });
  tl.from('#s03 .stamp', { scale: 1.8, autoAlpha: 0, duration: 0.45, ease: 'back.out(1.6)' }, at('c04', '10분', -0.12));
  const reenter = c04.start + 0.4;
  tl.set('#wMe', { x: -150 }, reenter);
  tl.set('#wCo', { x: 2070 }, reenter);
  tl.set('#wMe .cup', { autoAlpha: 1 }, reenter);
  const meet2 = at('c04', '또 마주친다');
  walkers(850, 1070, reenter + 0.02, meet2);
  counter(2, meet2);
  awk(35, meet2);
  tl.to('#s03 .stamp', { y: -40, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, c05.start - 0.45);

  // c05 · everything gets hard
  const hardWords = words('#s03 .hard-text');
  rise(hardWords, c05.start - 0.1);
  tl.to('#wMe', { x: '+=10', duration: 0.8, ease: 'awk' }, c05.start + 0.1);
  tl.to('#wMe .sweat', { autoAlpha: 1, duration: 0.25 }, c05.start + 0.3);
  tl.fromTo('#wMe .sweat', { y: -10 }, { y: 16, duration: 1.4, ease: 'power1.in', immediateRender: false }, c05.start + 0.3);
  tl.to('#s03 .hard-text em', { x: 8, duration: 0.8, ease: 'awk' }, at('c05', '어려워진다'));
  awk(45, at('c05', '어려워진다'));
  sink(hardWords, c06.start - 0.7);
  tl.to('#hall svg', { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, c06.start - 0.7);

  // ---------- s04 · the dilemma ----------
  const tSilent = at('c06', '아무 말 없이');
  gsap.set('#s04 .nope', { xPercent: -50 });
  tl.from('#s04 .card-l', { y: 60, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, c06.start - 0.2);
  tl.from('#s04 .cf-q', { y: 14, autoAlpha: 0, duration: 0.4, ease: 'back.out(2)' }, c06.start + 0.5);
  tl.fromTo('#s04 .card-l .nope path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.28, ease: 'power2.out', stagger: 0.12 }, tSilent - 0.6);
  tl.from('#s04 .card-r', { y: 60, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, tSilent - 0.25);
  tl.fromTo('#s04 .card-r .nope path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.28, ease: 'power2.out', stagger: 0.12 }, c06.end - 0.25);
  awk(55, c06.start + 0.6);
  tl.to('#s04 .card', { y: -40, autoAlpha: 0, duration: 0.45, ease: 'power2.in', stagger: 0.07 }, c07.start - 0.55);

  // ---------- duo · the two faces ----------
  gsap.set('#duo .face', { transformOrigin: '50% 50%' });
  gsap.set('#duo .f-eyes', { transformOrigin: '50% 50%' });
  gsap.set('#duo .f-blush', { autoAlpha: 0 });
  gsap.set('#tension', { autoAlpha: 0 });
  tl.from('#duo .face', { scale: 0.5, autoAlpha: 0, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.12 }, c07.start - 0.35);
  tl.from('#duo .f-tag', { y: 12, autoAlpha: 0, duration: 0.5, ease: 'power3.out', stagger: 0.1 }, c07.start);
  const duoSvg = $('#duo svg');
  onFrame((t) => { duoSvg.style.transform = `translateY(${(Math.sin(t * 1.7) * 4).toFixed(2)}px)`; });

  // ---------- s05 · the ambiguous choice ----------
  const choiceWords = words('#s05 .choice-text');
  rise(choiceWords, c07.start + 0.05, { stagger: 0.07, duration: 0.8 });
  awk(50, c07.start + 0.3);

  // c08 · eyes, mouth, nod
  const pills = $$('#s05 .pill');
  const beats = [at('c08', '눈을'), at('c08', '입꼬리를'), at('c08', '고개를')];
  tl.to('#duo .f-tag', { autoAlpha: 0, duration: 0.3 }, c08.start - 0.3);
  beats.forEach((tt, i) => {
    tl.from(pills[i], { y: 24, autoAlpha: 0, duration: 0.45, ease: 'back.out(1.8)' }, tt - 0.12);
    tl.to(pills[i], { backgroundColor: INK, color: BG, duration: 0.25 }, tt - 0.12);
    if (i > 0) tl.to(pills[i - 1], { backgroundColor: 'rgba(31, 31, 34, 0)', color: INK, opacity: 0.45, duration: 0.25 }, tt - 0.12);
  });
  tl.to('#fMe .f-eyes', { x: 22, duration: 0.35, ease: 'power2.out' }, beats[0] - 0.05);
  tl.to('#fCo .f-eyes', { x: -22, duration: 0.35, ease: 'power2.out' }, beats[0] - 0.05);
  tl.to('#duo .f-mouth', { attr: { d: SMILE }, duration: 0.6, ease: 'power2.inOut' }, beats[1] + 0.15);
  tl.to('#duo .face', { y: 18, duration: 0.2, ease: 'power2.out', yoyo: true, repeat: 1 }, beats[2] + 0.1);
  sink(choiceWords, c09.start - 0.4);
  tl.to(pills, { y: 20, autoAlpha: 0, duration: 0.35, ease: 'power2.in', stagger: 0.04 }, c09.start - 0.35);

  // c09 · neither a real hello nor ignoring
  const tButAlso = at('c09', '그렇다고');
  tl.from('#s05 .slider', { y: 20, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, c09.start - 0.2);
  tl.to('#s05 .sl-left', { color: BLUSH, duration: 0.2 }, c09.start);
  tl.to('#s05 .sl-left', { color: MUTED, duration: 0.2 }, tButAlso - 0.1);
  tl.to('#s05 .sl-knob', { x: 800, duration: 0.6, ease: 'power3.inOut' }, tButAlso - 0.2);
  tl.to('#s05 .sl-right', { color: BLUSH, duration: 0.2 }, at('c09', '무시도'));
  tl.to('#s05 .sl-right', { color: MUTED, duration: 0.2 }, c09.end - 0.2);
  tl.to('#s05 .sl-knob', { x: 400, duration: 0.55, ease: 'back.out(1.5)' }, c09.end - 0.6);

  // c10 · speaking with the face
  const faceWords = words('#s05 .face-text');
  tl.to('#s05 .slider', { y: -20, autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, c10.start - 0.15);
  rise(faceWords, c10.start - 0.05);
  tl.to('#duo .face', { scale: 1.05, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1 }, c10.start + 0.2);
  sink(faceWords, c11.start - 0.45);

  // c11 · "Yes, I know. We already said hi."
  gsap.set('#s05 .thought-1', { transformOrigin: '50% 100%' });
  tl.from('#s05 .thought-1', { scale: 0.85, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.7)' }, c11.start - 0.25);
  const th1 = $$('#s05 .thought-1 .th-line');
  tl.from(th1[0], { y: 20, autoAlpha: 0, duration: 0.45, ease: 'power3.out' }, c11.start - 0.05);
  tl.from(th1[1], { y: 20, autoAlpha: 0, duration: 0.45, ease: 'power3.out' }, at('c11', '우리', -0.1));
  tl.to('#duo .f-eyes', { scaleY: 0.1, duration: 0.09, yoyo: true, repeat: 1, ease: 'power1.inOut' }, c11.end + 0.3);
  tl.to('#s05 .thought-1', { scale: 0.9, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, c12.start - 0.4);

  // ---------- s06 · third time ----------
  const meet3 = at('c12', '또 마주치면');
  counter(3, meet3);
  awk(70, meet3);
  tl.to('#fMe .f-eyes', { x: 0, duration: 0.3 }, meet3);
  tl.to('#fCo .f-eyes', { x: 0, duration: 0.3 }, meet3);
  tl.to('#duo .f-mouth', { attr: { d: AWKWARD }, duration: 0.4, ease: 'power2.inOut' }, meet3 + 0.1);
  tl.to('#duo .f-blush', { autoAlpha: 1, duration: 0.5 }, meet3 + 0.2);
  const worseWords = words('#s06 .worse-text');
  const tWorse = at('c12', '더 어색해진다');
  rise(worseWords, tWorse - 0.15, { stagger: 0.07 });
  tl.to('#s06 .worse-text em', { x: 10, duration: 0.9, ease: 'awk' }, tWorse + 0.35);
  tl.to('#duo .face', { rotation: 2.5, duration: 0.9, ease: 'awk' }, tWorse + 0.35);
  sink(worseWords, c13.start - 0.35);

  // c13 · looking away just before the eyes meet
  const almostWords = words('#s06 .almost-text');
  rise(almostWords, c13.start - 0.05);
  tl.to('#fMe .f-eyes', { x: 18, duration: 1.0, ease: 'sine.inOut' }, c13.start + 0.1);
  tl.to('#fCo .f-eyes', { x: -18, duration: 1.0, ease: 'sine.inOut' }, c13.start + 0.1);
  const tAway = at('c13', '시선을', -0.05);
  tl.to('#fMe .f-eyes', { x: -26, y: -14, duration: 0.16, ease: 'power4.out' }, tAway);
  tl.to('#fCo .f-eyes', { x: 26, y: -14, duration: 0.16, ease: 'power4.out' }, tAway);
  tl.to('#fMe', { rotation: -7, duration: 0.3, ease: 'power3.out' }, tAway);
  tl.to('#fCo', { rotation: 7, duration: 0.3, ease: 'power3.out' }, tAway);
  sink(almostWords, c14.start - 0.35);

  // c14 · notice board, phone, the other way
  tl.to('#duo', { y: 170, scale: 0.8, duration: 0.8, ease: 'power3.inOut' }, c14.start - 0.45);
  const avCards = $$('#s06 .av-card');
  const avoid = [at('c14', '벽에'), at('c14', '휴대폰을'), at('c14', '괜히')];
  avoid.forEach((tt, i) => tl.from(avCards[i], { y: 50, autoAlpha: 0, duration: 0.55, ease: 'back.out(1.5)' }, tt - 0.12));
  tl.to('#fMe .f-eyes', { x: -24, y: -22, duration: 0.3, ease: 'power3.out' }, avoid[0]);
  tl.to('#fCo .f-eyes', { x: 22, y: -20, duration: 0.3, ease: 'power3.out' }, avoid[0]);
  tl.to('#fCo .f-eyes', { x: 0, y: 26, duration: 0.3, ease: 'power3.out' }, avoid[1]);
  tl.to('#fMe', { rotation: -14, duration: 0.5, ease: 'power3.out' }, avoid[2]);
  tl.to('#fMe .f-eyes', { x: -30, y: 0, duration: 0.3, ease: 'power3.out' }, avoid[2]);
  tl.to(avCards, { y: -30, autoAlpha: 0, duration: 0.4, ease: 'power2.in', stagger: 0.05 }, c15.start - 0.45);

  // c15 · we saw each other, we pretend we didn't
  const tSaw = at('c15', '봤는데');
  const tPretend = at('c15', '못 본 척');
  tl.from('#s06 .pretend-a', { y: 24, autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, c15.start - 0.05);
  const pretendWords = words('#s06 .pretend-b');
  rise(pretendWords, tPretend - 0.45, { stagger: 0.07 });
  tl.to('#duo .face', { rotation: 0, duration: 0.3, ease: 'power2.out' }, tSaw - 0.35);
  tl.to('#fMe .f-eyes', { x: 26, y: 0, duration: 0.18, ease: 'power3.out' }, tSaw - 0.3);
  tl.to('#fCo .f-eyes', { x: -26, y: 0, duration: 0.18, ease: 'power3.out' }, tSaw - 0.3);
  tl.to('#fMe .f-eyes', { x: -28, y: -10, duration: 0.14, ease: 'power4.out' }, tPretend);
  tl.to('#fCo .f-eyes', { x: 28, y: -10, duration: 0.14, ease: 'power4.out' }, tPretend);
  tl.to('#s06 .pretend-a', { y: -20, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, c16.start - 0.45);
  sink(pretendWords, c16.start - 0.45);

  // ---------- s07 · the strange tension ----------
  tl.to('#duo', { y: 0, scale: 1, duration: 0.9, ease: 'power3.inOut' }, c16.start - 0.35);
  tl.to('#duo .f-eyes', { x: 0, y: 0, duration: 0.5, ease: 'power2.inOut' }, c16.start - 0.2);
  tl.from('#s07 .small-a', { y: 20, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, c16.start);
  tl.from('#s07 .small-b', { y: 20, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, at('c16', '사이가', -0.1));
  const tReason = at('c16', '단지 오늘');
  tl.to('#s07 .small-a, #s07 .small-b', { y: -20, autoAlpha: 0, duration: 0.35, ease: 'power2.in', stagger: 0.05 }, tReason - 0.45);
  const reasonLines = SplitText.create('#s07 .reason', { type: 'lines', mask: 'lines' }).lines;
  rise(reasonLines, tReason - 0.1, { duration: 0.8, stagger: 0.14 });

  const tTension = at('c16', '이상한 긴장감');
  const tensionPath = $('#tension');
  const string = { a: 0 };
  onFrame((t) => {
    const y = 600 + Math.sin(t * 38) * 26 * string.a;
    tensionPath.setAttribute('d', `M870 600 Q960 ${y.toFixed(1)} 1050 600`);
  });
  tl.to('#tension', { autoAlpha: 1, duration: 0.2 }, tTension - 0.25);
  tl.to(string, { a: 1, duration: 0.5, ease: 'power2.out' }, tTension - 0.25);
  tl.from('#s07 .tension-label', { y: 20, autoAlpha: 0, duration: 0.5, ease: 'power3.out' }, tTension);
  tl.to('#duo .face', { x: 3, duration: 1.4, ease: 'shiver' }, tTension);
  awk(95, tTension);
  sink(reasonLines, c17.start - 0.45);
  tl.to('#s07 .tension-label', { y: -16, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, c17.start - 0.4);

  // ---------- s08 · fourth time, the same thought ----------
  const meet4 = at('c17', '네 번째쯤');
  tl.to(string, { a: 2, duration: 0.2, ease: 'power2.in' }, meet4 - 0.3);
  tl.to('#tension', { autoAlpha: 0, duration: 0.12 }, meet4 - 0.1);
  counter(4, meet4);
  awk(100, meet4, 0.6);
  tl.to('#hud .digits span:last-child', { color: BLUSH, duration: 0.3 }, meet4);
  tl.to('#hud .meter-fill', { opacity: 0.35, duration: 0.18, yoyo: true, repeat: 5, ease: 'none' }, meet4 + 0.5);
  const sameWords = words('#s08 .same-text');
  rise(sameWords, at('c17', '둘 다', -0.15));
  tl.to('#duo .f-eyes', { scaleY: 0.18, duration: 0.25, ease: 'power2.out' }, at('c17', '같은 생각'));
  sink(sameWords, c18.start - 0.45);

  // c18 · "Please, let's just pretend we didn't see each other."
  gsap.set('#s08 .thought-2', { transformOrigin: '50% 100%' });
  tl.from('#s08 .thought-2', { scale: 0.85, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.7)' }, c18.start - 0.3);
  const th2 = $$('#s08 .thought-2 .th-line');
  tl.from(th2[0], { y: 18, autoAlpha: 0, duration: 0.45, ease: 'power3.out' }, c18.start - 0.05);
  tl.from(th2[1], { y: 18, autoAlpha: 0, duration: 0.45, ease: 'power3.out' }, at('c18', '못 본 척', -0.15));

  // ending · open eyes, turn away, hold
  const tEnd = c18.end + 0.25;
  tl.to('#duo .f-eyes', { scaleY: 1, duration: 0.2 }, tEnd);
  tl.to('#fMe .f-eyes', { x: -30, y: 0, duration: 0.35, ease: 'power3.out' }, tEnd);
  tl.to('#fCo .f-eyes', { x: 30, y: 0, duration: 0.35, ease: 'power3.out' }, tEnd);
  tl.to('#fMe', { rotation: -10, x: -24, duration: 0.7, ease: 'power3.inOut' }, tEnd);
  tl.to('#fCo', { rotation: 10, x: 24, duration: 0.7, ease: 'power3.inOut' }, tEnd);
  tl.to('#duo .f-mouth', { attr: { d: FLAT }, duration: 0.4, ease: 'power2.inOut' }, tEnd);
  tl.from('#s08 .endcard', { y: 12, autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, tEnd + 0.5);
});
