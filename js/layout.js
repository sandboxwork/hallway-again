/*
 * layout.js — the webtoon strip. One tall page (1920 × H) with panels at fixed coordinates.
 * The camera frames these rects, so panel placement and camera moves share one source of truth.
 * [x, y, w, h] in strip pixels.
 */
window.LAYOUT = {
  W: 1920,
  H: 11100,
  panels: {
    p1: [1150, 410, 670, 270],     // title · eyes strip
    p3: [100, 1260, 1720, 520],    // c02 · morning hallway, long shot
    p4: [100, 1820, 840, 470],     // c02 · me: hello
    p5: [980, 1820, 840, 470],     // c02 · co: hello
    p6: [100, 2330, 1720, 190],    // c03 · no problem
    p7: [100, 2640, 1080, 540],    // c04 · coffee corner, again
    p8: [1220, 2640, 600, 540],    // c04 · flinch close-up
    p9: [100, 3220, 1720, 330],    // c05 · robot walk
    p10: [100, 3700, 1720, 640],   // c06 · split dilemma
    p11: [100, 4480, 1720, 420],   // c07 · standoff
    p12: [100, 4940, 1720, 250],   // c08 · eyes meet
    p13: [100, 5230, 840, 400],    // c08 · mouth corner ECU
    p14: [980, 5230, 840, 400],    // c08 · nod
    p15: [100, 5670, 1720, 230],   // c09 · gauge
    p16: [100, 5940, 1720, 700],   // c10–c11 · faces + thought
    p17: [100, 6800, 1720, 480],   // c12 · third time, far shot
    p18: [100, 7320, 1720, 250],   // c13 · eyes almost meet
    p19: [100, 7610, 546, 440],    // c14 · notice board
    p20: [687, 7610, 546, 440],    // c14 · phone
    p21: [1274, 7610, 546, 440],   // c14 · the other way
    p22: [100, 8090, 1720, 460],   // c15 · side-eye pass
    p23: [100, 8700, 1720, 760],   // c16 · tension (dark)
    p24: [100, 9620, 1720, 560],   // c17 · fourth time
    p25: [100, 10240, 1720, 700],  // c18 · please, let's pretend
  },
};
