/*!
 * Electromagnetism Adventure - illustrations and circuit diagrams.
 * Each scene is a 1200 x 800 SVG built from the primitives in art.js.
 */
(function (root) {
  'use strict';
  var Art = root.Art || (typeof require === 'function' ? require('./art.js') : null);
  var p = Art.p, C = p.C, T = p.T;
  var rect = p.rect, circle = p.circle, ellipse = p.ellipse, line = p.line, path = p.path, poly = p.poly, g = p.g;
  var arrow = p.arrow, curve = p.curve, panel = p.panel, badge = p.badge, wire = p.wire, copper = p.copper;
  var electron = p.electron, compass = p.compass, barMagnet = p.barMagnet, block3D = p.block3D, horseshoe = p.horseshoe;
  var nail = p.nail, coil = p.coil, clip = p.clip, tape = p.tape, donut = p.donut, bolt = p.bolt, timer = p.timer;
  var P = p.P;

  function def(id, meta, fn) { Art.define(id, meta, function (o) { return p.frame(meta, fn(o)); }); }

  // ================================================================ 01 KIT
  def('kit', {
    file: '01-meet-your-kit.svg', title: 'Meet Your Science Kit', badge: 'START HERE', color: '#0284C7',
    alt: 'The kit: a 6-volt battery, 6 metres of red copper wire, two ceramic block magnets and a horseshoe magnet, plus household extras.'
  }, function () {
    var s = T(40, 140, 'What you have:', { size: 26, weight: 'bold' });
    var xs = [40, 326, 612, 898];
    var titles = ['6-volt battery', '6 m copper wire', '2 block magnets', 'Horseshoe magnet'];
    var caps = [['Pushes electricity', 'round the wire'], ['Copper inside,', 'red plastic outside'], ['Poles are on the', 'big flat faces'], ['Two poles close', 'together']];
    xs.forEach(function (x, i) {
      var cx = x + 131;
      s += panel(x, 155, 262, 315, { stroke: '#BAE6FD' });
      s += T(cx, 194, titles[i], { size: 24, weight: 'bold', anchor: 'middle', fill: '#0C4A6E' });
      s += T(cx, 430, caps[i], { size: 21, anchor: 'middle', fill: C.sub, lh: 26 });
    });
    // battery
    s += p.battery(102, 262, 0.92).svg;
    // wire hank
    [[457, 305, 95, 62, -12], [452, 300, 88, 58, 8], [462, 310, 82, 66, 25], [455, 303, 92, 52, -30], [458, 306, 70, 48, 50]].forEach(function (e) {
      s += ellipse(e[0], e[1], e[2], e[3], { stroke: C.wireDark, w: 8.5, t: 'rotate(' + e[4] + ' ' + e[0] + ' ' + e[1] + ')' });
      s += ellipse(e[0], e[1], e[2], e[3], { stroke: C.wire, w: 5.5, t: 'rotate(' + e[4] + ' ' + e[0] + ' ' + e[1] + ')' });
    });
    s += wire('M 540,335 C 578,360 566,396 522,393', { w: 5.5, shine: false });
    s += copper(522, 393, 496, 391, 4);
    s += T(457, 316, '6 m', { size: 30, weight: 'bold', anchor: 'middle', fill: '#881337' });
    // block magnets
    s += block3D(653, 246, 1, 'N');
    s += block3D(653, 336, 1, 'S');
    s += arrow(653, 374, 803, 374, { both: true, w: 2.5, head: 9 });
    s += T(728, 395, '48 mm long', { size: 17, anchor: 'middle', fill: C.sub });
    // horseshoe
    s += horseshoe(1029, 205, 1, ['N', 'S']);

    // extras
    s += panel(40, 490, 1120, 272, { fill: '#F0F9FF', stroke: '#BAE6FD' });
    s += T(64, 528, 'Also grab these from home:', { size: 24, weight: 'bold' });
    s += nail(66, 628, 172, 582, 1);
    s += clip(262, 606, 0.74, -14, '#64748B') + clip(302, 610, 0.74, 16, '#3B82F6');
    s += compass(440, 605, 50, 0);
    s += circle(600, 603, 40, { fill: C.tape, stroke: C.tapeEdge, w: 3 }) + circle(600, 603, 17, { fill: '#F0F9FF', stroke: C.tapeEdge, w: 3 });
    s += tape(624, 648, 16, 40, -35);
    s += p.pencil(760, 605, 130, -35);
    s += p.can(920, 605, 1);
    s += p.scissors(1080, 608, 1, 0);
    var items = [[120, 'Iron nail', '10 to 15 cm long'], [280, 'Paper clips', 'about 30'], [440, 'Compass', 'needle type'],
      [600, 'Sticky tape', ''], [760, 'Pencil', ''], [920, 'Can or jar', '6 to 7 cm wide'], [1080, 'Wire strippers', 'grown-ups only']];
    items.forEach(function (it) {
      s += T(it[0], 693, it[1], { size: 20, weight: 'bold', anchor: 'middle' });
      if (it[2]) { s += T(it[0], 716, it[2], { size: 17, anchor: 'middle', fill: C.sub }); }
    });
    s += T(600, 748, 'For the bonus mission: two stacks of books and a small box.', { size: 18, anchor: 'middle', fill: C.sub });
    return s;
  });

  // ================================================================ 02 SAFETY
  def('safety', {
    file: '02-safety-rules.svg', title: 'Safety Rules for Scientists', badge: 'MISSION 0', color: '#DC2626',
    alt: 'Eight safety rules: work with a grown-up, 5-second rule, stop if warm, never use wall sockets, keep magnets away from phones and pacemakers, no magnet crashes, protect the compass, careful with wire ends.'
  }, function () {
    var s = T(40, 136, 'Real scientists stay safe. Learn these 8 rules before you start!', { size: 23, weight: 'bold', fill: '#7F1D1D' });
    var rules = [
      ['Team up with a grown-up', ['A grown-up helps with every', 'mission, from start to finish.']],
      ['The 5-second rule', ['Connect the battery for 5 seconds', 'at most. Then let go and rest.']],
      ['Warm? Stop!', ['If the wire or battery feels warm,', 'disconnect and let it cool down.']],
      ['Never use wall sockets', ['Only use our 6-volt battery.', 'Mains electricity can kill.']],
      ['Keep magnets away', ['from phones, bank cards, watches', 'and people with pacemakers.']],
      ['No magnet crashes', ['Magnets that snap together can', 'chip or pinch. Slide them apart.']],
      ['Protect the compass', ['Keep magnets a hand-width away,', 'or the needle gets confused.']],
      ['Careful with wire ends', ['A grown-up strips the ends.', 'Bare copper can be sharp!']]
    ];
    rules.forEach(function (r, i) {
      var x = i % 2 ? 610 : 40, y = 156 + Math.floor(i / 2) * 150, ix = x + 80, iy = y + 70;
      s += panel(x, y, 550, 140, { stroke: '#FECACA' });
      s += circle(ix, iy, 52, { fill: '#FEE2E2' });
      s += T(x + 152, y + 50, r[0], { size: 26, weight: 'bold' });
      s += T(x + 152, y + 86, r[1], { size: 20, fill: C.sub, lh: 27 });
      s += icon(i, ix, iy);
      s += badge(x + 24, y + 24, i + 1, '#DC2626', 17);
    });
    function icon(i, ix, iy) {
      switch (i) {
        case 0:
          return circle(ix - 14, iy - 22, 13, { fill: '#F87171' }) + rect(ix - 32, iy - 6, 36, 42, { rx: 13, fill: '#F87171' }) +
            circle(ix + 19, iy - 6, 10, { fill: '#FBBF24' }) + rect(ix + 6, iy + 7, 26, 29, { rx: 10, fill: '#FBBF24' }) +
            line(ix + 2, iy + 14, ix + 9, iy + 16, { stroke: '#B45309', w: 4 });
        case 1: return timer(ix, iy + 6, 32, '5s');
        case 2:
          return rect(ix - 9, iy - 40, 18, 60, { rx: 9, fill: '#fff', stroke: C.bad, w: 3 }) + rect(ix - 3.5, iy - 14, 7, 36, { fill: C.bad }) +
            circle(ix, iy + 26, 14, { fill: C.bad }) +
            path('M' + (ix + 22) + ',' + (iy + 6) + ' q 8,-8 0,-16 q -8,-8 0,-16', { stroke: '#F97316', w: 3.5, cap: 'round' }) +
            path('M' + (ix + 34) + ',' + (iy + 6) + ' q 8,-8 0,-16 q -8,-8 0,-16', { stroke: '#F97316', w: 3.5, cap: 'round' });
        case 3:
          return rect(ix - 25, iy - 25, 50, 50, { rx: 9, fill: '#fff', stroke: '#6B7280', w: 3 }) +
            rect(ix - 14, iy - 12, 7, 15, { fill: '#374151' }) + rect(ix + 7, iy - 12, 7, 15, { fill: '#374151' }) + circle(ix, iy + 13, 4, { fill: '#374151' }) +
            circle(ix, iy, 41, { stroke: C.bad, w: 7 }) + line(ix - 29, iy - 29, ix + 29, iy + 29, { stroke: C.bad, w: 7 });
        case 4:
          return rect(ix - 42, iy - 24, 50, 34, { rx: 5, fill: '#60A5FA', stroke: '#1D4ED8', w: 2 }) + rect(ix - 42, iy - 16, 50, 7, { fill: '#1E3A8A' }) +
            horseshoe(ix + 26, iy - 34, 0.26, null) + arrow(ix - 26, iy + 30, ix + 34, iy + 30, { both: true, w: 3, head: 9, color: C.bad });
        case 5:
          return rect(-15, -12, 30, 24, { fill: C.ferrite, t: p.tr(ix - 26, iy + 4, -20) }) + rect(-15, -12, 30, 24, { fill: C.ferrite, t: p.tr(ix + 26, iy + 4, 20) }) +
            poly([[0, -16], [4, -5], [15, -5], [6, 2], [10, 13], [0, 6], [-10, 13], [-6, 2], [-15, -5], [-4, -5]].map(function (q) { return [ix + q[0], iy - 22 + q[1]]; }),
              { fill: '#FACC15', stroke: '#D97706', w: 1.5 });
        case 6:
          return compass(ix - 20, iy - 4, 25, 0, { letters: false }) + barMagnet(ix + 12, iy - 13, 32, 18, 'S', { labels: false }) +
            arrow(ix - 12, iy + 33, ix + 40, iy + 33, { both: true, w: 3, head: 8 });
        default:
          return wire('M' + (ix - 44) + ',' + (iy + 20) + ' L' + (ix - 4) + ',' + (iy + 20), { w: 10 }) + copper(ix - 4, iy + 20, ix + 28, iy + 20, 5) +
            p.scissors(ix + 10, iy - 2, 0.5, 30);
      }
    }
    return s;
  });

  // ================================================================ 03 MAGNETS
  def('magnets', {
    file: '03-magnet-basics.svg', title: 'Magnet Basics', badge: 'MISSION 1', color: '#7C3AED',
    alt: 'Magnet basics: every magnet has a north and south pole, opposite poles pull, same poles push, field lines, block and horseshoe magnets, finding poles with a compass.'
  }, function () {
    var s = '';
    // A: two poles + field lines
    s += panel(40, 112, 550, 280, { stroke: '#DDD6FE' });
    s += T(64, 148, 'Every magnet has two poles', { size: 25, weight: 'bold' });
    [[30, 216.7], [70, 183.3], [110, 150]].forEach(function (q) {
      s += curve([215, 250], [215 - q[0], q[1]], [415 + q[0], q[1]], [415, 250], { color: C.field, w: 3, op: 0.9 });
    });
    [[30, 307.3], [70, 340.7], [110, 374]].forEach(function (q) {
      s += curve([215, 274], [215 - q[0], q[1]], [415 + q[0], q[1]], [415, 274], { color: C.field, w: 3, op: 0.9 });
    });
    s += arrow(206, 262, 112, 262, { color: C.field, w: 3, head: 11 });
    s += arrow(518, 262, 426, 262, { color: C.field, w: 3, head: 11 });
    s += barMagnet(215, 242, 200, 40, 'N');
    s += T(315, 384, 'Field lines come out of N and go into S', { size: 20, anchor: 'middle', fill: C.sub });

    // B: pull or push
    s += panel(610, 112, 550, 280, { stroke: '#DDD6FE' });
    s += T(634, 148, 'Pull or push?', { size: 25, weight: 'bold' });
    s += barMagnet(650, 172, 150, 40, 'S') + barMagnet(920, 172, 150, 40, 'S');
    s += arrow(812, 192, 852, 192, { color: C.good, w: 4 }) + arrow(908, 192, 868, 192, { color: C.good, w: 4 });
    s += T(860, 244, 'N faces S: they **PULL** together', { size: 21, anchor: 'middle' });
    s += barMagnet(650, 276, 150, 40, 'S') + barMagnet(920, 276, 150, 40, 'N');
    s += arrow(852, 296, 812, 296, { color: C.bad, w: 4 }) + arrow(868, 296, 908, 296, { color: C.bad, w: 4 });
    s += T(860, 348, 'N faces N: they **PUSH** apart', { size: 21, anchor: 'middle' });
    s += T(860, 374, '(S and S push apart too)', { size: 18, anchor: 'middle', fill: C.sub });

    // C: block magnet
    s += panel(40, 410, 380, 292, { stroke: '#DDD6FE' });
    s += T(60, 446, 'Your block magnets', { size: 23, weight: 'bold' });
    [[176, 528], [290, 520]].forEach(function (q) { s += arrow(q[0], q[1], q[0], q[1] - 50, { color: C.field, w: 3, head: 10 }); });
    s += arrow(233, 512, 233, 466, { color: C.field, w: 3, head: 10 });
    s += block3D(115, 560, 1.3, 'N');
    s += T(232, 624, 'Bottom face = S', { size: 19, weight: 'bold', fill: C.south, anchor: 'middle' });
    s += T(230, 656, ['Usually N is on one big face', 'and S on the other. Test it!'], { size: 18, anchor: 'middle', fill: C.sub, lh: 24 });

    // D: horseshoe
    s += panel(440, 410, 320, 292, { stroke: '#DDD6FE' });
    s += T(460, 446, 'Horseshoe magnet', { size: 23, weight: 'bold' });
    s += horseshoe(600, 468, 1, ['N', 'S']);
    [615, 628, 641].forEach(function (y) { s += arrow(574, y, 626, y, { color: C.field, w: 2.5, head: 8 }); });
    s += T(600, 688, 'Strongest between the tips', { size: 19, anchor: 'middle', fill: C.sub });

    // E: find the poles
    s += panel(780, 410, 380, 292, { stroke: '#DDD6FE' });
    s += T(800, 446, 'Find the poles', { size: 23, weight: 'bold' });
    s += compass(875, 555, 58, 90);
    s += rect(1010, 495, 17, 120, { fill: C.south }) + rect(1027, 495, 17, 120, { fill: C.north });
    s += T(1018.5, 556, 'S', { size: 17, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
    s += T(1035.5, 556, 'N', { size: 17, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
    s += arrow(940, 638, 1004, 638, { both: true, w: 2.5, head: 8 });
    s += T(972, 662, 'a hand-width', { size: 16, anchor: 'middle', fill: C.sub });
    s += T(970, 690, "The needle's red end points to S", { size: 19, anchor: 'middle', fill: C.ink });

    // strip
    s += rect(40, 716, 1120, 54, { rx: 14, fill: '#EDE9FE' });
    s += T(600, 750, 'Magnets pull on **iron** and **steel**. Not on copper, aluminium, plastic, wood or paper.', { size: 21, anchor: 'middle' });
    return s;
  });

  // ================================================================ 04 ELECTRICITY
  def('electricity', {
    file: '04-what-is-electricity.svg', title: 'What Is Electricity?', badge: 'HOW IT WORKS', color: '#D97706',
    alt: 'Electricity is electrons flowing through copper. It needs a complete loop. The battery is a pump; volts are push, amps are flow. Our loops are nearly short circuits, so use the 5-second rule.'
  }, function () {
    var s = '';
    // A: inside the wire
    s += panel(40, 112, 550, 320, { stroke: '#FDE68A' });
    s += T(64, 148, 'Inside the wire', { size: 25, weight: 'bold' });
    s += rect(150, 262, 390, 36, { rx: 8, fill: C.copper, stroke: C.copperDark, w: 2 });
    s += rect(70, 238, 160, 84, { rx: 14, fill: C.wire, stroke: C.wireDark, w: 2 });
    s += rect(230, 238, 170, 84, { fill: C.wire, fo: 0.14, stroke: C.wire, w: 3, dash: '8 6' });
    s += rect(400, 238, 60, 84, { fill: C.wire, stroke: C.wireDark, w: 2 });
    [262, 315, 368, 500].forEach(function (x) { s += electron(x, 280, 12); });
    s += T(150, 196, 'Plastic coat', { size: 21, weight: 'bold', anchor: 'middle' });
    s += T(150, 220, 'keeps electricity in', { size: 18, anchor: 'middle', fill: C.sub });
    s += T(505, 196, 'Bare copper', { size: 21, weight: 'bold', anchor: 'middle' });
    s += T(505, 220, 'touches the battery', { size: 18, anchor: 'middle', fill: C.sub });
    s += line(505, 228, 505, 256, { stroke: C.sub, w: 2 });
    s += arrow(236, 340, 424, 340, { color: C.current, w: 5, head: 14 });
    s += T(330, 370, 'Copper: electrons flow easily', { size: 20, weight: 'bold', anchor: 'middle' });
    s += T(315, 412, 'Electricity = electrons moving through copper', { size: 20, anchor: 'middle', fill: C.sub });

    // B: complete loop
    s += panel(610, 112, 550, 320, { stroke: '#FDE68A' });
    s += T(634, 148, 'It needs a complete loop', { size: 25, weight: 'bold' });
    [[750, true], [1020, false]].forEach(function (q) {
      var cx = q[0], closed = q[1];
      var pts = function (a, b) { return 'M' + a.map(P).join(' L'); };
      var loopL = [[cx - 22, 344], [cx - 22, 322], [cx - 100, 322], [cx - 100, 190], [closed ? cx + 100 : cx - 20, 190]];
      var loopR = [[cx + 22, 338], [cx + 22, 322], [cx + 100, 322], [cx + 100, 190], [closed ? cx - 20 : cx + 20, 190]];
      s += wire(pts(loopL), { w: 7 }) + wire(pts(loopR), { w: 7 });
      if (!closed) {
        s += copper(cx - 26, 190, cx - 14, 190, 4) + copper(cx + 14, 190, cx + 26, 190, 4);
        s += T(cx, 174, 'gap', { size: 18, weight: 'bold', anchor: 'middle', fill: C.bad });
      }
      // battery block
      s += rect(cx - 50, 350, 100, 48, { rx: 7, fill: C.battery });
      s += rect(cx - 30, 340, 16, 10, { fill: '#0B0F19' });
      for (var i = 0; i < 3; i++) { s += ellipse(cx + 22, 344 - i * 5, 7, 2.5, { stroke: '#CBD5E1', w: 2 }); }
      s += T(cx, 376, '6 V', { size: 20, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
      [[cx - 100, 238], [cx - 100, 288], [cx - 52, 190], [cx + 52, 190], [cx + 100, 238], [cx + 100, 288], [cx - 62, 322], [cx + 62, 322]].forEach(function (e) {
        s += electron(e[0], e[1], 9);
      });
      if (closed) {
        s += arrow(cx - 126, 290, cx - 126, 236, { color: C.current, w: 4, head: 11 });
        s += arrow(cx - 22, 166, cx + 22, 166, { color: C.current, w: 4, head: 11 });
        s += arrow(cx + 126, 236, cx + 126, 290, { color: C.current, w: 4, head: 11 });
        s += T(cx, 422, 'Complete loop: it flows!', { size: 19, weight: 'bold', anchor: 'middle', fill: C.good });
      } else {
        s += T(cx, 422, 'A gap: nothing flows!', { size: 19, weight: 'bold', anchor: 'middle', fill: C.bad });
      }
    });

    // C: three cards
    s += panel(40, 450, 360, 318, { fill: '#FFFBEB', stroke: '#FDE68A' });
    s += T(64, 488, 'The battery is a pump', { size: 23, weight: 'bold' });
    s += p.battery(64, 560, 0.72).svg;
    s += T(200, 548, ['It pushes', 'electrons out', 'of its **\u2212** end,', 'round the loop,', 'and back in at', 'its **+** end.'], { size: 19, lh: 25 });
    s += T(64, 722, ['Check the **+** and **\u2212** marks', 'on the top of YOUR battery.'], { size: 18, fill: '#92400E', lh: 24 });

    s += panel(420, 450, 360, 318, { fill: '#FFFBEB', stroke: '#FDE68A' });
    s += T(444, 488, 'Volts and amps', { size: 23, weight: 'bold' });
    s += T(444, 528, ['**Volts** = how hard the battery', 'pushes. Ours: **6 volts**, safe', 'to touch.'], { size: 19, lh: 26 });
    s += T(444, 622, ['**Amps** = how much electricity', 'flows through the wire.'], { size: 19, lh: 26 });
    s += T(444, 700, ['Wall sockets push 20 to 40 times', 'harder. **They can kill!**'], { size: 19, lh: 26, fill: C.bad });

    s += panel(800, 450, 360, 318, { fill: '#FEF2F2', stroke: '#FECACA' });
    s += T(824, 488, 'Warning: short circuit!', { size: 23, weight: 'bold', fill: '#B91C1C' });
    s += T(824, 528, ['Our loops have almost nothing', 'to slow the electrons down,', 'so LOTS of electricity flows.', '', 'The wire and battery get warm,', 'and the battery runs down fast.'], { size: 19, lh: 26 });
    s += timer(862, 724, 24, '5s');
    s += T(900, 734, '5-second rule!', { size: 28, weight: 'bold', fill: C.bad });
    return s;
  });

  // ================================================================ 05 OERSTED
  def('oersted', {
    file: '05-oersted-setup.svg', title: "\u00D8rsted's Surprise", badge: 'MISSION 2', color: '#0891B2',
    alt: 'Mission 2: lay the wire over a compass, lined up with the needle, and touch the end to the battery for 5 seconds. The needle swings. Swap the ends and it swings the other way. Current makes magnetic circles around a wire.'
  }, function () {
    var s = '';
    s += panel(40, 112, 660, 428, { fill: '#FEF9EE', stroke: '#A5F3FC' });
    s += T(64, 148, 'Set it up (seen from above)', { size: 25, weight: 'bold' });
    s += arrow(662, 226, 662, 180, { w: 4, head: 12 });
    s += T(662, 170, 'N', { size: 22, weight: 'bold', anchor: 'middle', fill: C.north });
    var b = p.battery(84, 422, 0.72);
    s += compass(400, 330, 88, 0);
    s += b.svg;
    s += wire('M ' + P(b.posMid) + ' C 196,488 400,500 400,440 L 400,200 C 400,168 112,168 112,224 L 112,330 C 112,356 116,366 121,372', { w: 9 });
    s += copper(121, 372, 127, 385, 5);
    s += tape(400, 226, 48, 18, -6) + tape(400, 432, 48, 18, 6);
    s += T(430, 220, 'tape', { size: 17, fill: C.sub });
    s += T(132, 300, ['Touch this end', 'to the battery', 'for 5 seconds'], { size: 19, lh: 24, weight: 'bold', fill: '#0E7490' });
    s += arrow(172, 360, 134, 382, { w: 3, head: 10, color: '#0E7490' });
    s += T(506, 282, 'Compass', { size: 21, weight: 'bold' });
    s += line(503, 288, 484, 300, { stroke: C.sub, w: 2 });
    s += T(506, 334, ['Wire lies across', 'the top, lined up', 'with the needle'], { size: 19, lh: 24 });
    s += T(206, 522, '6 V battery', { size: 18, fill: C.sub });

    // insets
    s += panel(40, 556, 660, 214, { stroke: '#A5F3FC' });
    [[150, 0, 'Battery OFF', 'needle points north'], [370, -62, 'Battery ON', 'the needle swings!'], [590, 62, 'Ends swapped', 'it swings the other way']].forEach(function (q, i) {
      var cx = q[0];
      s += compass(cx, 640, 60, q[1]);
      s += line(cx, 572, cx, 708, { stroke: C.wire, w: 9, op: 0.55 });
      if (i) { s += bolt(cx + 60, 598, 0.85); }
      s += T(cx, 728, q[2], { size: 19, weight: 'bold', anchor: 'middle' });
      s += T(cx, 751, q[3], { size: 17, anchor: 'middle', fill: C.sub });
      s += badge(cx - 72, 588, i + 1, '#0891B2', 16);
    });

    // why
    s += panel(720, 112, 440, 658, { stroke: '#A5F3FC' });
    s += T(744, 148, 'Why does it happen?', { size: 25, weight: 'bold' });
    s += p.wireRings(940, 170, 452, [230, 310, 390], 110, 26, '#0891B2');
    s += T(940, 478, 'current flowing in the wire', { size: 17, anchor: 'middle', fill: C.sub });
    s += T(744, 512, ['Electricity flowing in a wire makes', 'invisible magnetic circles around it.', 'The compass needle is a tiny magnet,',
      'so the circles push it round.', 'Swap the ends: the circles turn the', 'other way, and so does the needle!'], { size: 19, lh: 23 });
    s += rect(740, 640, 400, 122, { rx: 14, fill: '#ECFEFF', stroke: '#67E8F9', w: 2 });
    s += T(758, 667, '1820 \u00B7 Denmark', { size: 20, weight: 'bold', fill: '#0E7490' });
    s += T(758, 692, ['Hans Christian \u00D8rsted noticed a compass', 'needle move when he switched on a',
      'current. The first clue that electricity', 'and magnetism are linked!'], { size: 17, lh: 21 });
    return s;
  });
}(typeof self !== 'undefined' ? self : this));
