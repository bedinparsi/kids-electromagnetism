/*!
 * Electromagnetism Adventure - illustrations part 2 (missions 3, 4, bonus, wrap-up, cover, certificate).
 */
(function (root) {
  'use strict';
  var Art = root.Art || (typeof require === 'function' ? require('./art.js') : null);
  var p = Art.p, C = p.C, T = p.T;
  var rect = p.rect, circle = p.circle, ellipse = p.ellipse, line = p.line, path = p.path, poly = p.poly, g = p.g;
  var arrow = p.arrow, curve = p.curve, panel = p.panel, badge = p.badge, wire = p.wire, copper = p.copper;
  var electron = p.electron, compass = p.compass, block3D = p.block3D, horseshoe = p.horseshoe;
  var nail = p.nail, coil = p.coil, clip = p.clip, tape = p.tape, donut = p.donut, bolt = p.bolt, timer = p.timer;
  var P = p.P, r1 = p.r1;

  function def(id, meta, fn) { Art.define(id, meta, function (o) { return p.frame(meta, fn(o)); }); }
  function cap(x, y, l1, l2) {
    return T(x + 180, y + 268, l1, { size: 20, weight: 'bold', anchor: 'middle' }) +
      T(x + 180, y + 294, l2, { size: 19, anchor: 'middle', fill: C.sub });
  }

  // ================================================================ 06 BUILD ELECTROMAGNET
  def('em-build', {
    file: '06-build-electromagnet.svg', title: 'Build an Electromagnet', badge: 'MISSION 3', color: '#2563EB',
    alt: 'Six steps: strip 2 cm from both wire ends, wrap 10 tight turns round the nail in the same direction, tape the coil, push end A into one battery terminal, touch end B to the other terminal for up to 5 seconds and pick up paper clips, let go and count.'
  }, function () {
    var s = '', cols = [40, 420, 800], rows = [112, 447], blue = '#2563EB';
    rows.forEach(function (y) { cols.forEach(function (x) { s += panel(x, y, 360, 320, { stroke: '#BFDBFE' }); }); });

    // 1 strip
    s += wire('M 80,262 L 270,262', { w: 16 }) + copper(270, 262, 350, 262, 8);
    s += arrow(270, 300, 350, 300, { both: true, w: 2.5, head: 8 });
    s += T(310, 326, '2 cm', { size: 21, weight: 'bold', anchor: 'middle' });
    s += rect(300, 186, 44, 18, { rx: 8, fill: C.wire, stroke: C.wireDark, w: 2 });
    s += line(292, 190, 272, 186, { stroke: C.muted, w: 2 }) + line(292, 200, 270, 202, { stroke: C.muted, w: 2 });
    s += p.scissors(190, 215, 0.9, 25);
    s += cap(40, 112, 'A grown-up strips 2 cm', 'of plastic off BOTH ends.');

    // 2 wrap
    var c2 = coil(525, 250, 675, 250, 10, { ry: 20, w: 5 });
    s += c2.back + nail(460, 250, 730, 250, 1) + c2.front;
    s += wire('M 523,270 C 505,300 472,306 442,318', { w: 6 }) + wire('M 677,270 C 692,300 722,306 758,318', { w: 6 });
    s += T(442, 346, '50 cm free end', { size: 18, weight: 'bold', fill: C.sub });
    s += T(758, 346, 'rest of the wire', { size: 18, fill: C.sub, anchor: 'end' });
    s += curve([545, 206], [572, 182], [628, 182], [655, 206], { color: blue, w: 4, heads: [1], head: 13 });
    s += T(600, 172, 'same way!', { size: 19, weight: 'bold', fill: blue, anchor: 'middle' });
    s += cap(420, 112, 'Leave 50 cm free, then wrap', '10 tight turns, all the SAME way.');

    // 3 tape
    var c3 = coil(905, 250, 1055, 250, 10, { ry: 20, w: 5 });
    s += c3.back + nail(840, 250, 1110, 250, 1) + c3.front;
    s += tape(893, 250, 20, 58, 0) + tape(1067, 250, 20, 58, 0);
    s += wire('M 903,270 C 885,300 852,306 822,318', { w: 6 }) + wire('M 1057,270 C 1072,300 1102,306 1138,318', { w: 6 });
    s += T(980, 180, 'Keep the turns close together', { size: 17, anchor: 'middle', fill: C.sub });
    s += cap(800, 112, 'Tape both ends of the coil', "so it can't unwind.");

    // 4 connect
    var b = p.battery(170, 562, 0.72);
    s += b.svg;
    s += wire('M 62,566 C 130,562 190,' + r1(b.posMid[1] - 2) + ' ' + P([b.posMid[0] - 14, b.posMid[1]]), { w: 7 });
    s += copper(b.posMid[0] - 14, b.posMid[1], b.posMid[0] + 12, b.posMid[1] + 2, 5);
    var ex = b.neg[0] - 10, ey = b.neg[1] - 24;
    s += wire('M 62,516 C 120,514 ' + P([ex - 30, ey - 8]) + ' ' + P([ex, ey]), { w: 7 });
    s += copper(ex, ey, b.neg[0] - 3, b.neg[1] - 9, 5);
    s += path('M' + P([b.neg[0] + 12, b.neg[1] - 26]) + ' q 10,10 0,22', { stroke: '#2563EB', w: 2.5, dash: '4 4', cap: 'round' });
    s += T(104, 492, 'End B = your ON switch', { size: 18, weight: 'bold', fill: blue });
    s += T(62, 596, 'End A', { size: 18, weight: 'bold', fill: C.sub });
    s += cap(40, 447, 'Push end A into one terminal.', 'Touch end B on the other one.');

    // 5 switch on
    var c5 = coil(600, 492, 600, 585, 10, { ry: 20, w: 5 });
    s += c5.back + nail(600, 470, 600, 612, 1) + c5.front;
    s += wire('M 580,496 C 556,480 540,470 520,462', { w: 5 }) + wire('M 620,582 C 660,570 672,520 680,462', { w: 5 });
    s += clip(592, 638, 0.5, -10) + clip(612, 644, 0.5, 14, '#3B82F6') + clip(598, 662, 0.5, 4);
    s += bolt(500, 545, 1.2) + timer(712, 550, 30, '5s');
    s += cap(420, 447, 'Switch ON (5 seconds max)', 'and pick up paper clips!');

    // 6 switch off + count
    var c6 = coil(900, 492, 900, 585, 10, { ry: 20, w: 5 });
    s += c6.back + nail(900, 470, 900, 612, 1) + c6.front;
    s += wire('M 880,496 C 856,480 840,470 820,462', { w: 5 }) + wire('M 920,582 C 950,570 956,520 958,462', { w: 5 });
    s += clip(884, 648, 0.5, -40) + clip(916, 660, 0.5, 30, '#3B82F6') + clip(898, 684, 0.5, 80);
    [[872, 620], [882, 616], [926, 634], [936, 630]].forEach(function (q) { s += line(q[0], q[1], q[0], q[1] + 12, { stroke: C.muted, w: 2.5 }); });
    s += rect(990, 478, 150, 196, { rx: 10, fill: '#FFFBEB', stroke: '#D97706', w: 2 });
    [1020, 1065, 1110].forEach(function (x) { s += circle(x, 478, 6, { fill: '#9CA3AF' }); });
    s += T(1065, 510, 'Turns   Clips', { size: 17, weight: 'bold', anchor: 'middle' });
    [10, 20, 40, 80].forEach(function (n, i) {
      var y = 544 + i * 34;
      s += T(1024, y, String(n), { size: 18, weight: 'bold', anchor: 'middle' });
      s += arrow(1042, y - 6, 1064, y - 6, { w: 2, head: 7 });
      s += line(1074, y, 1124, y, { stroke: C.sub, w: 2 });
    });
    s += cap(800, 447, 'Let go: the clips drop!', 'Count them. Then add more turns.');

    rows.forEach(function (y, r) { cols.forEach(function (x, c) { s += badge(x + 32, y + 32, r * 3 + c + 1, blue, 20); }); });
    return s;
  });

  // ================================================================ 07 HOW ELECTROMAGNETS WORK
  def('em-how', {
    file: '07-how-electromagnets-work.svg', title: 'How an Electromagnet Works', badge: 'MISSION 3', color: '#1D4ED8',
    alt: 'A current makes magnetic circles round a wire. A coil adds them up so it acts like a bar magnet. An iron nail inside lines up its tiny magnets, making it much stronger. More turns, an iron core and more current make it stronger. Swapping the battery wires swaps the poles.'
  }, function () {
    var s = '';
    [40, 420, 800].forEach(function (x) { s += panel(x, 112, 360, 350, { stroke: '#BFDBFE' }); });
    // 1 one wire
    s += T(60, 148, '1. One wire', { size: 24, weight: 'bold' });
    s += p.wireRings(220, 175, 395, [225, 285, 345], 88, 22, C.field);
    s += T(220, 424, 'Current makes magnetic', { size: 20, anchor: 'middle' });
    s += T(220, 449, 'circles around a wire.', { size: 20, anchor: 'middle' });
    // 2 coil
    s += T(440, 148, '2. Make a coil', { size: 24, weight: 'bold' });
    s += curve([705, 270], [762, 160], [438, 160], [495, 270], { color: C.field, w: 3 });
    s += curve([705, 300], [762, 410], [438, 410], [495, 300], { color: C.field, w: 3 });
    for (var i = 0; i < 8; i++) {
      var cx = 515 + i * 25;
      s += ellipse(cx, 285, 13, 48, { stroke: C.wireDark, w: 8 }) + ellipse(cx, 285, 13, 48, { stroke: C.wire, w: 5 });
    }
    [268, 285, 302].forEach(function (y) { s += arrow(497, y, 703, y, { color: C.field, w: 3, head: 10 }); });
    s += T(722, 297, 'N', { size: 30, weight: 'bold', fill: C.north });
    s += T(478, 297, 'S', { size: 30, weight: 'bold', fill: C.south, anchor: 'end' });
    s += T(600, 424, 'The circles add up: the coil', { size: 20, anchor: 'middle' });
    s += T(600, 449, 'acts like a bar magnet!', { size: 20, anchor: 'middle' });
    // 3 iron core
    s += T(820, 148, '3. Add an iron nail', { size: 24, weight: 'bold' });
    s += T(826, 188, 'Switched OFF: jumbled up', { size: 19, weight: 'bold', fill: C.sub });
    var angles = [35, 160, 275, 95, 210, 330, 60, 245, 125, 15, 300, 185, 80, 225, 350, 150];
    function nailShape(y) {
      return rect(822, y - 6, 10, 62, { rx: 3, fill: '#8B929C', stroke: '#6B7280', w: 1.5 }) +
        poly([[832, y], [1105, y], [1132, y + 25], [1105, y + 50], [832, y + 50]], { fill: '#D1D5DB', stroke: '#6B7280', w: 2 });
    }
    s += nailShape(202);
    for (var j = 0; j < 16; j++) { s += p.domArrow(852 + (j % 8) * 33, j < 8 ? 216 : 238, angles[j]); }
    s += T(826, 283, 'Switched ON: all lined up!', { size: 19, weight: 'bold', fill: '#1D4ED8' });
    s += nailShape(300);
    for (j = 0; j < 16; j++) { s += p.domArrow(852 + (j % 8) * 33, j < 8 ? 314 : 336, 0, '#1D4ED8'); }
    s += T(810, 327, 'S', { size: 24, weight: 'bold', fill: C.south, anchor: 'middle', base: 'central' });
    s += T(1147, 327, 'N', { size: 24, weight: 'bold', fill: C.north, anchor: 'middle', base: 'central' });
    s += T(980, 398, ['The coil lines up billions of', 'tiny magnets inside the iron.', 'Much, much stronger!'], { size: 19, anchor: 'middle', lh: 24 });

    // 4 stronger
    s += panel(40, 480, 550, 290, { stroke: '#BFDBFE' });
    s += T(64, 516, 'Make it stronger', { size: 24, weight: 'bold' });
    var c4 = coil(95, 565, 165, 565, 12, { ry: 12, w: 3 });
    s += c4.back + nail(78, 565, 182, 565, 0.6) + c4.front;
    s += T(210, 560, '**More turns** of wire', { size: 21 }) + T(210, 585, 'more circles adding up', { size: 18, fill: C.sub });
    s += nail(78, 640, 182, 640, 0.6);
    s += T(210, 635, 'An **iron core** (the nail)', { size: 21 }) + T(210, 660, 'a coil on a pencil is much weaker', { size: 18, fill: C.sub });
    s += p.battery(100, 704, 0.32, { signs: false }).svg;
    s += T(210, 710, '**More current**', { size: 21 }) + T(210, 735, 'but more heat: be careful!', { size: 18, fill: C.sub });

    // 5 flip
    s += panel(610, 480, 550, 290, { stroke: '#BFDBFE' });
    s += T(634, 516, 'Flip the battery, flip the poles!', { size: 24, weight: 'bold' });
    [[580, 'S', 270, ['Tip is **S**:', 'red end points at it.']], [690, 'N', 90, ['Swapped: tip is **N**.', 'Needle turns round!']]].forEach(function (q) {
      var y = q[0], cc = coil(680, y, 780, y, 8, { ry: 14, w: 4 });
      s += cc.back + nail(640, y, 830, y, 0.7) + cc.front;
      s += T(826, y - 22, q[1], { size: 22, weight: 'bold', fill: q[1] === 'N' ? C.north : C.south, anchor: 'middle' });
      s += compass(890, y, 34, q[2], { letters: false });
      s += T(952, y - 6, q[3], { size: 18, lh: 22 });
    });
    s += arrow(655, 622, 655, 650, { both: true, w: 3, head: 8, color: '#1D4ED8' });
    s += T(672, 642, 'swap the battery wires', { size: 18, weight: 'bold', fill: '#1D4ED8' });
    return s;
  });

  // ================================================================ 08 BUILD GENERATOR
  def('gen-build', {
    file: '08-build-generator.svg', title: 'Make Electricity with a Magnet', badge: 'MISSION 4', color: '#16A34A',
    alt: 'Mission 4 setup: a wire donut of 10 turns, about 1 metre of twisted wire, and a compass detector with the rest of the wire wrapped 15 times round it along the needle. The two bare ends are twisted together. No battery. Push a magnet through the donut and watch the needle.'
  }, function () {
    var s = '', green = '#15803D';
    s += panel(40, 112, 1120, 448, { fill: '#F7FEE7', stroke: '#BBF7D0' });
    s += T(64, 150, 'push in, pull out!', { size: 20, weight: 'bold', fill: green });
    s += arrow(110, 196, 110, 334, { both: true, w: 5, head: 13, color: green });
    s += line(257, 300, 257, 388, { stroke: green, w: 3, dash: '6 6' });
    s += block3D(158, 262, 1.1, 'N');
    s += donut(250, 410, 115, 36, 10, { w: 4, spread: 14 });
    s += T(250, 488, 'Wire donut: 10 turns', { size: 21, weight: 'bold', anchor: 'middle' });
    s += T(250, 512, 'wrapped round a can, then taped', { size: 18, anchor: 'middle', fill: C.sub });
    // twisted leads
    s += wire(p.sinePath(365, 815, 408, 7, 4.5, 0), { w: 5, shine: false }) + wire(p.sinePath(365, 815, 408, 7, 4.5, Math.PI), { w: 5, shine: false });
    s += arrow(380, 352, 800, 352, { both: true, w: 2.5, head: 9 });
    s += T(590, 340, 'about 1 metre', { size: 20, weight: 'bold', anchor: 'middle' });
    s += T(590, 448, 'keeps the magnet far from the compass', { size: 18, anchor: 'middle', fill: C.sub });
    // no battery badge
    s += circle(591, 212, 44, { fill: '#fff', stroke: C.bad, w: 5 });
    s += p.battery(571, 214, 0.26, { signs: false }).svg;
    s += line(561, 182, 621, 242, { stroke: C.bad, w: 6 });
    s += T(591, 284, 'No battery needed!', { size: 21, weight: 'bold', fill: C.bad, anchor: 'middle' });
    // compass detector
    s += compass(930, 395, 80, 0);
    s += wire('M 815,402 C 860,400 880,306 914,304', { w: 5, shine: false });
    s += wire('M 815,414 C 860,416 880,488 914,488', { w: 5, shine: false });
    for (var i = 0; i < 6; i++) {
      var x = 917.5 + i * 5;
      s += line(x, 304, x, 488, { stroke: C.wireDark, w: 5.4 }) + line(x, 304, x, 488, { stroke: C.wire, w: 3.4 });
    }
    s += ellipse(930, 302, 17, 6, { stroke: C.wireDark, w: 3 }) + ellipse(930, 490, 17, 6, { stroke: C.wireDark, w: 3 });
    s += ellipse(842, 421, 9, 5, { stroke: C.copper, w: 4 }) + ellipse(849, 421, 9, 5, { stroke: C.copperDark, w: 3 });
    s += T(790, 520, 'twisted joint', { size: 18, weight: 'bold', anchor: 'middle', fill: C.sub });
    s += arrow(800, 502, 836, 432, { w: 2.5, head: 9, color: C.sub });
    s += T(1024, 322, ['**Detector:**', 'wire wrapped', '15 times round', 'the compass', '(along the', 'needle)'], { size: 18, lh: 23 });

    // steps
    var texts = [['Wrap 10 turns round', 'a can, slide off, tape'], ['Run about 1 m of', 'wire to the compass'], ['Wrap 15 turns round', 'the compass, N to S'],
      ['Twist the 2 bare', 'ends together'], ['Push a magnet through', 'and watch the needle!']];
    texts.forEach(function (t, i) {
      var x = 40 + i * 226, cx = x + 105;
      s += panel(x, 575, 210, 195, { stroke: '#BBF7D0' });
      if (i === 0) {
        s += p.can(cx, 650, 0.75);
        for (var j = 0; j < 4; j++) { s += ellipse(cx, 646 + j * 5, 26, 7, { stroke: C.wire, w: 3 }); }
      } else if (i === 1) {
        s += wire('M ' + (x + 30) + ',656 L ' + (x + 180) + ',656', { w: 6 });
        s += arrow(x + 30, 632, x + 180, 632, { both: true, w: 2, head: 8 });
        s += T(cx, 622, '1 m', { size: 17, weight: 'bold', anchor: 'middle' });
      } else if (i === 2) {
        s += compass(cx, 652, 36, 0, { letters: false });
        for (j = 0; j < 4; j++) { s += line(cx - 6 + j * 4, 610, cx - 6 + j * 4, 694, { stroke: C.wire, w: 2.6 }); }
      } else if (i === 3) {
        s += wire('M ' + (x + 18) + ',652 L ' + (x + 60) + ',652', { w: 8 }) + wire('M ' + (x + 150) + ',652 L ' + (x + 192) + ',652', { w: 8 });
        s += copper(x + 60, 652, x + 100, 652, 5) + copper(x + 150, 652, x + 110, 652, 5);
        s += ellipse(cx - 2, 652, 9, 6, { stroke: C.copper, w: 4 }) + ellipse(cx + 6, 652, 9, 6, { stroke: C.copperDark, w: 3 });
      } else {
        s += donut(cx - 8, 676, 48, 14, 4, { w: 3, spread: 6, tape: false });
        s += block3D(x + 52, 632, 0.5, 'N');
        s += arrow(x + 186, 612, x + 186, 672, { w: 3.5, head: 10, color: green });
      }
      s += T(cx, 720, t[0], { size: 17, anchor: 'middle', weight: 'bold' });
      s += T(cx, 743, t[1], { size: 17, anchor: 'middle', fill: C.sub });
      s += badge(x + 26, 601, i + 1, '#16A34A', 17);
    });
    return s;
  });

  // ================================================================ 09 HOW GENERATORS WORK
  def('gen-how', {
    file: '09-how-generators-work.svg', title: 'How Moving Magnets Make Electricity', badge: 'MISSION 4', color: '#15803D', titleSize: 38,
    alt: 'Pushing the magnet in makes the needle kick one way, holding it still does nothing, pulling it out kicks the other way, and moving faster gives a bigger kick. Moving field lines sweep across the wire and push electrons along. Michael Faraday discovered this in 1831.'
  }, function () {
    var s = '', green = '#15803D';
    var cfg = [['Push IN', -55, 'down', 'Needle kicks', 'one way'], ['Hold STILL', 0, 'still', 'Nothing happens!', 'no movement, no electricity'],
      ['Pull OUT', 55, 'up', 'Kicks the OTHER way', 'the current flows backwards'], ['Go FASTER', -85, 'fast', 'Bigger kick!', 'more electricity']];
    cfg.forEach(function (q, i) {
      var x = 40 + i * 283, dcx = x + 100;
      s += panel(x, 112, 268, 318, { stroke: '#BBF7D0' });
      s += T(x + 134, 148, q[0], { size: 22, weight: 'bold', anchor: 'middle', fill: green });
      if (q[2] === 'still') {
        s += donut(dcx, 300, 66, 18, 5, { w: 3.5, spread: 8, part: 'back' });
        s += block3D(x + 44, 298, 0.62, 'N');
        s += donut(dcx, 300, 66, 18, 5, { w: 3.5, spread: 8, part: 'front', tape: false });
        s += T(dcx, 250, 'magnet inside', { size: 16, anchor: 'middle', fill: C.sub });
      } else {
        s += donut(dcx, 300, 66, 18, 5, { w: 3.5, spread: 8, tape: false });
        s += block3D(x + 44, 208, 0.62, 'N');
        if (q[2] === 'down') { s += arrow(dcx, 234, dcx, 274, { w: 5, color: green, head: 14 }); }
        if (q[2] === 'up') { s += arrow(dcx, 274, dcx, 234, { w: 5, color: green, head: 14 }); }
        if (q[2] === 'fast') {
          s += arrow(dcx - 16, 232, dcx - 16, 276, { w: 6, color: green, head: 15 }) + arrow(dcx + 16, 232, dcx + 16, 276, { w: 6, color: green, head: 15 });
          [[x + 62, 168], [x + 100, 162], [x + 138, 168]].forEach(function (m) { s += line(m[0], m[1], m[0], m[1] + 18, { stroke: C.muted, w: 3 }); });
        }
      }
      s += compass(x + 222, 250, 34, q[1], { letters: false });
      if (q[1]) { s += bolt(x + 250, 208, 0.6); }
      s += T(x + 134, 388, q[3], { size: 20, weight: 'bold', anchor: 'middle' });
      s += T(x + 134, 413, q[4], { size: 17, anchor: 'middle', fill: C.sub });
    });

    // why
    s += panel(40, 448, 700, 322, { stroke: '#BBF7D0' });
    s += T(64, 484, 'Why does it work?', { size: 24, weight: 'bold' });
    s += curve([174, 612], [108, 690], [98, 470], [174, 512], { color: C.field, w: 3 });
    s += curve([206, 612], [272, 690], [282, 470], [206, 512], { color: C.field, w: 3 });
    s += arrow(190, 616, 190, 690, { color: C.field, w: 3, head: 10 });
    s += p.barMagnetV(170, 512, 40, 100, 'S');
    s += donut(190, 712, 86, 20, 4, { w: 3.5, spread: 8, tape: false });
    s += electron(150, 731, 8) + electron(232, 731, 8);
    s += arrow(304, 520, 304, 612, { w: 6, color: green, head: 15 });
    s += T(304, 506, 'moving', { size: 17, anchor: 'middle', fill: green, weight: 'bold' });
    s += T(350, 522, ['A magnet is surrounded by invisible', 'field lines. When the magnet moves,', 'its field lines sweep across the wire',
      'and shove the electrons along:', '**that is an electric current!**', '', 'No movement = no sweeping = no current.',
      'In and out sweep opposite ways, so the', 'current flows the opposite way.'], { size: 19, lh: 25 });

    // history
    s += panel(760, 448, 400, 322, { fill: '#F0FDF4', stroke: '#BBF7D0' });
    s += T(784, 484, '1831 \u00B7 England', { size: 22, weight: 'bold', fill: green });
    s += T(784, 516, ['Michael Faraday wondered: if', 'electricity can make magnetism,', 'can magnetism make electricity?',
      'He pushed a magnet into a coil and', 'a meter twitched. It worked!'], { size: 18, lh: 23 });
    s += T(784, 650, ['**Today:** power stations spin giant', 'magnets inside giant coils to make', 'the electricity for your home.'], { size: 18, lh: 23 });
    s += line(1112, 728, 1112, 764, { stroke: '#94A3B8', w: 5 });
    [-90, 30, 150].forEach(function (a) {
      var r = a * Math.PI / 180;
      s += line(1112, 728, 1112 + 30 * Math.cos(r), 728 + 30 * Math.sin(r), { stroke: '#94A3B8', w: 7 });
    });
    s += circle(1112, 728, 6, { fill: '#64748B' }) + bolt(1060, 740, 0.8);
    return s;
  });

  // ================================================================ 10 JUMPING WIRE
  def('jumping-wire', {
    file: '10-jumping-wire.svg', title: 'The Jumping Wire', badge: 'BONUS', color: '#DB2777',
    alt: 'Bonus mission: a U-shaped wire swing hangs from a pencil laid across two stacks of books. The horseshoe magnet lies on its side on a box so the bottom of the swing hangs between its tips. When the battery is touched, the swing kicks sideways. This push is what spins electric motors.'
  }, function () {
    var s = '', pink = '#DB2777';
    s += panel(40, 112, 600, 448, { fill: '#FFF7FB', stroke: '#FBCFE8' });
    s += T(64, 148, 'Set it up (front view)', { size: 24, weight: 'bold' });
    s += line(60, 520, 620, 520, { stroke: '#A8A29E', w: 4 });
    [[70, 440, 130, '#60A5FA'], [76, 360, 118, '#F59E0B'], [72, 280, 126, '#34D399'], [480, 440, 130, '#A78BFA'], [486, 360, 118, '#F472B6'], [482, 280, 126, '#FBBF24']].forEach(function (b) {
      s += rect(b[0], b[1], b[2], 80, { rx: 4, fill: b[3], stroke: 'rgba(0,0,0,0.15)', w: 2 });
      s += line(b[0] + 8, b[1] + 64, b[0] + b[2] - 8, b[1] + 64, { stroke: '#fff', w: 2, op: 0.6 });
    });
    s += rect(270, 470, 140, 50, { rx: 4, fill: '#C4B5FD', stroke: 'rgba(0,0,0,0.15)', w: 2 });
    s += T(340, 500, 'box', { size: 16, fill: '#4C1D95', anchor: 'middle' });
    s += rect(300, 350, 80, 120, { fill: C.horseshoe });
    s += rect(300, 350, 80, 40, { fill: C.steel, stroke: C.steelEdge, w: 1.5 }) + rect(300, 430, 80, 40, { fill: C.steel, stroke: C.steelEdge, w: 1.5 });
    s += T(340, 371, 'N', { size: 22, weight: 'bold', anchor: 'middle', base: 'central', fill: C.north });
    s += T(340, 451, 'S', { size: 22, weight: 'bold', anchor: 'middle', base: 'central', fill: C.south });
    s += p.pencil(340, 272, 460, 0);
    s += wire('M 250,284 L 250,410 L 430,410 L 430,284', { w: 6 });
    s += wire('M 250,286 C 250,250 236,230 214,206', { w: 6 }) + wire('M 430,286 C 430,250 444,230 466,206', { w: 6 });
    s += copper(214, 206, 204, 196, 4) + copper(466, 206, 476, 196, 4);
    s += T(172, 188, 'to battery', { size: 17, weight: 'bold', anchor: 'middle', fill: C.sub });
    s += T(510, 188, 'to battery', { size: 17, weight: 'bold', anchor: 'middle', fill: C.sub });
    s += T(135, 548, 'books', { size: 17, anchor: 'middle', fill: C.sub }) + T(545, 548, 'books', { size: 17, anchor: 'middle', fill: C.sub });
    s += T(340, 548, 'magnet on its side, on a box', { size: 17, anchor: 'middle', fill: C.sub });
    s += badge(92, 256, 1, pink, 16) + badge(228, 340, 2, pink, 16) + badge(408, 340, 3, pink, 16) + badge(262, 214, 4, pink, 16);

    // side view
    s += panel(660, 112, 500, 300, { stroke: '#FBCFE8' });
    s += T(684, 148, 'Side view: watch it kick!', { size: 22, weight: 'bold' });
    s += rect(700, 356, 170, 40, { rx: 4, fill: '#C4B5FD' });
    s += p.horseshoeC(760, 300, 0.8, ['N', 'S']);
    s += circle(832, 176, 9, { fill: '#FBBF24', stroke: '#B45309', w: 2 });
    s += path('M 832,184 L 876,296', { stroke: C.wire, w: 5, op: 0.35, dash: '8 6', cap: 'round' }) + circle(876, 296, 6, { fill: C.wire, op: 0.35 });
    s += wire('M 832,184 L 832,300', { w: 5, shine: false }) + circle(832, 300, 6, { fill: C.wire, stroke: C.wireDark, w: 2 });
    s += curve([846, 268], [854, 276], [862, 276], [872, 268], { color: pink, w: 3, heads: [1], head: 10 });
    s += T(896, 262, 'kick!', { size: 22, weight: 'bold', fill: pink });
    s += T(990, 322, ['The swing jumps', 'out of (or into)', 'the magnet.'], { size: 18, lh: 23 });

    // why
    s += panel(660, 428, 500, 342, { fill: '#FDF2F8', stroke: '#FBCFE8' });
    s += T(684, 464, 'Why does it jump?', { size: 22, weight: 'bold' });
    s += T(684, 496, ['The current makes magnetic circles', 'round the wire (remember Mission 2?).', 'They push against the horseshoe',
      "magnet's field and shove the wire.", '', 'Swap the battery wires, or turn the', 'magnet over: it jumps the other way.', '',
      '**This push is what spins electric**', '**motors** in fans, drills and cars!'], { size: 18, lh: 24 });

    // how to build
    s += panel(40, 576, 600, 194, { stroke: '#FBCFE8' });
    s += T(64, 610, 'How to build it', { size: 22, weight: 'bold' });
    s += badge(78, 636, 1, pink, 12) + T(100, 642, 'Lay a pencil across two stacks of books.', { size: 18 });
    s += badge(78, 664, 2, pink, 12) + T(100, 670, 'Hang a U-shaped loop of wire over it: the swing.', { size: 18 });
    s += badge(78, 692, 3, pink, 12) + T(100, 698, ['Stand the horseshoe on its side on a box, so the', 'bottom of the swing hangs between its tips.'], { size: 18, lh: 22 });
    s += badge(78, 742, 4, pink, 12) + T(100, 748, 'Touch the battery for 1 to 2 seconds. Watch!', { size: 18 });
    return s;
  });

  // ================================================================ 12 BIG IDEA
  def('big-idea', {
    file: '11-the-big-idea.svg', title: 'The Big Idea', badge: 'WRAP-UP', color: '#0F766E',
    alt: 'Electricity makes magnetism (electromagnet), magnetism plus electricity makes movement (motor), and movement plus magnets makes electricity (generator). Examples: cranes, doorbells, speakers, power stations, wind turbines, bike dynamos, fans and electric cars.'
  }, function () {
    var s = T(40, 138, 'Electricity, magnetism and movement can turn into each other!', { size: 23, weight: 'bold', fill: '#115E59' });
    s += arrow(330, 337, 200, 535, { w: 8, color: '#2563EB', head: 24 });
    s += arrow(240, 610, 520, 610, { w: 8, color: '#DB2777', head: 24 });
    s += arrow(560, 535, 430, 337, { w: 8, color: '#16A34A', head: 24 });
    s += circle(380, 262, 80, { fill: '#FEF3C7', stroke: '#F59E0B', w: 5 }) + bolt(380, 244, 1.5);
    s += T(380, 304, 'ELECTRICITY', { size: 17, weight: 'bold', anchor: 'middle', fill: '#92400E' });
    s += circle(150, 610, 80, { fill: '#EDE9FE', stroke: C.field, w: 5 }) + horseshoe(150, 548, 0.42, ['N', 'S']);
    s += T(150, 652, 'MAGNETISM', { size: 17, weight: 'bold', anchor: 'middle', fill: '#5B21B6' });
    s += circle(610, 610, 80, { fill: '#DCFCE7', stroke: C.good, w: 5 });
    [0, 120, 240].forEach(function (a) { s += ellipse(610, 575, 9, 22, { fill: '#22C55E', t: 'rotate(' + a + ' 610 595)' }); });
    s += circle(610, 595, 7, { fill: '#166534' });
    s += curve([576, 620], [586, 640], [634, 640], [644, 620], { color: '#166534', w: 3, heads: [1], head: 10 });
    s += T(610, 662, 'MOVEMENT', { size: 17, weight: 'bold', anchor: 'middle', fill: '#166534' });
    s += T(64, 380, ['**Electromagnet**', 'electricity makes', 'magnetism', 'Missions 2 and 3'], { size: 19, lh: 24, fill: '#1E3A8A' });
    s += T(522, 380, ['**Generator**', 'moving magnets', 'make electricity', 'Mission 4'], { size: 19, lh: 24, fill: '#14532D' });
    s += T(380, 700, ['**Motor**: electricity + magnets', 'make movement (Bonus mission)'], { size: 19, anchor: 'middle', lh: 24, fill: '#831843' });
    s += T(380, 468, ['A circle of', 'energy!'], { size: 20, italic: true, anchor: 'middle', fill: C.sub, lh: 24 });

    s += panel(720, 160, 440, 610, { stroke: '#99F6E4' });
    s += T(744, 196, 'Where you can find them', { size: 23, weight: 'bold' });
    [['Electromagnets', '#2563EB', 236, ['Scrapyard cranes lifting cars', 'Doorbells and door locks', 'Speakers and headphones', 'MRI scanners in hospitals']],
      ['Generators', '#16A34A', 382, ['Power stations', 'Wind turbines', 'Bike dynamo lights', 'Wind-up torches']],
      ['Motors', '#DB2777', 528, ['Fans and washing machines', 'Electric cars and trains', 'Drills and toy cars', 'The buzz in your phone']]].forEach(function (grp) {
      s += rect(744, grp[2] - 20, 8, 126, { rx: 4, fill: grp[1] });
      s += T(764, grp[2], grp[0], { size: 21, weight: 'bold', fill: grp[1] });
      s += T(764, grp[2] + 28, grp[3], { size: 18, lh: 24 });
    });
    s += rect(744, 666, 392, 90, { rx: 12, fill: '#F0FDFA', stroke: '#99F6E4', w: 2 });
    s += T(760, 694, ['**Did you know?** Most of the electricity', 'in your home was made by spinning', 'magnets and coils in a power station!'], { size: 17, lh: 22 });
    return s;
  });

  // ================================================================ COVER (hero banner)
  Art.define('cover', { file: '00-cover.svg', title: 'The Electromagnetism Adventure', alt: 'Cover: a horseshoe magnet, an electromagnet picking up paper clips, and a compass.' }, function () {
    var s = '';
    s += rect(0, 0, 1200, 420, { fill: '#DBEAFE' });
    s += path('M0,360 C200,330 400,390 600,360 C800,330 1000,390 1200,355 L1200,420 L0,420 Z', { fill: '#BFDBFE' });
    s += T(600, 84, 'The Electromagnetism Adventure', { size: 52, weight: 'bold', anchor: 'middle', fill: '#1E3A8A' });
    s += T(600, 126, 'Electricity makes magnets. Magnets make electricity.', { size: 24, anchor: 'middle', fill: '#1E40AF' });
    s += horseshoe(190, 160, 1.1, ['N', 'S']);
    [322, 340, 358].forEach(function (y) { s += arrow(160, y, 220, y, { color: C.field, w: 3, head: 9 }); });
    var c = coil(500, 262, 700, 262, 13, { ry: 24, w: 6 });
    s += c.back + nail(430, 262, 800, 262, 1.4) + c.front;
    s += wire('M 498,286 C 480,330 470,350 452,372', { w: 6 }) + wire('M 702,286 C 716,330 740,350 760,372', { w: 6 });
    s += clip(808, 300, 0.55, -8) + clip(830, 308, 0.55, 16, '#3B82F6') + clip(812, 330, 0.55, 40, '#10B981');
    s += bolt(600, 190, 1.3);
    s += compass(1010, 250, 92, 40);
    s += bolt(1110, 160, 1.2) + bolt(905, 165, 0.9);
    [[360, 180], [880, 330], [1130, 350], [70, 120], [540, 360], [980, 110]].forEach(function (e, i) { s += electron(e[0], e[1], 12 + (i % 3) * 3); });
    [[300, 110], [760, 170], [1150, 90], [60, 300]].forEach(function (q) {
      s += poly([[0, -12], [3, -3], [12, 0], [3, 3], [0, 12], [-3, 3], [-12, 0], [-3, -3]].map(function (v) { return [q[0] + v[0], q[1] + v[1]]; }), { fill: '#FBBF24' });
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" width="1200" height="420" font-family="' + p.FONT +
      '" role="img" aria-label="The Electromagnetism Adventure"><title>The Electromagnetism Adventure</title>' + s + '</svg>';
  });

  // ================================================================ CERTIFICATE
  Art.define('certificate', { file: '12-certificate.svg', title: 'Certificate', alt: 'Certificate: Junior Electromagnetism Engineer' }, function (o) {
    var s = '';
    s += rect(0, 0, 1200, 848, { fill: '#FFFFFF' });
    s += rect(20, 20, 1160, 808, { rx: 28, fill: '#FFFDF7', stroke: '#1D4ED8', w: 10 });
    s += rect(46, 46, 1108, 756, { rx: 18, stroke: '#F59E0B', w: 4, dash: '2 12', cap: 'round' });
    s += T(600, 160, 'Certificate of Discovery', { size: 64, weight: 'bold', anchor: 'middle', fill: '#1E3A8A' });
    s += T(600, 230, 'This certifies that', { size: 28, anchor: 'middle', fill: C.sub });
    s += line(290, 330, 910, 330, { stroke: C.ink, w: 2 });
    if (o.name) { s += T(600, 316, o.name, { size: 54, weight: 'bold', anchor: 'middle', fill: '#DB2777' }); }
    s += T(600, 392, ['has explored magnets, electricity, electromagnets', 'and generators, and is now an official'], { size: 26, anchor: 'middle', lh: 38, fill: C.ink });
    s += T(600, 506, 'Junior Electromagnetism Engineer', { size: 50, weight: 'bold', anchor: 'middle', fill: '#15803D' });
    if (o.score) { s += T(600, 556, o.score, { size: 24, anchor: 'middle', fill: C.sub }); }
    s += horseshoe(170, 560, 0.62, ['N', 'S']);
    s += circle(1030, 640, 74, { fill: '#FACC15', stroke: '#D97706', w: 5 }) + circle(1030, 640, 58, { stroke: '#fff', w: 3, dash: '4 6' });
    s += bolt(1030, 640, 1.8);
    s += line(170, 736, 480, 736, { stroke: C.ink, w: 2 }) + T(325, 766, 'Grown-up lab partner', { size: 20, anchor: 'middle', fill: C.sub });
    s += line(560, 736, 870, 736, { stroke: C.ink, w: 2 }) + T(715, 766, 'Date', { size: 20, anchor: 'middle', fill: C.sub });
    if (o.date) { s += T(715, 724, o.date, { size: 26, anchor: 'middle', fill: C.ink }); }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 848" width="1200" height="848" font-family="' + p.FONT +
      '" role="img" aria-label="Certificate of Discovery"><title>Certificate of Discovery</title>' + s + '</svg>';
  });
}(typeof self !== 'undefined' ? self : this));
