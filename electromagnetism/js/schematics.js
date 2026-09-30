/*!
 * Electromagnetism Adventure - circuit diagrams (schematics) for every mission + a symbol key.
 */
(function (root) {
  'use strict';
  var Art = root.Art || (typeof require === 'function' ? require('./art.js') : null);
  var p = Art.p, C = p.C, T = p.T;
  var rect = p.rect, line = p.line, g = p.g, arrow = p.arrow, panel = p.panel, compass = p.compass, barMagnet = p.barMagnet;
  var sLine = p.sLine, sBatteryV = p.sBatteryV, sSwitchH = p.sSwitchH, sCoilH = p.sCoilH, sMeter = p.sMeter, sDot = p.sDot;
  var SLATE = '#334155', SK = '#111827';

  function def(id, meta, fn) {
    meta.color = SLATE; meta.badge = 'SCHEMATIC'; meta.kind = 'schematic';
    Art.define(id, meta, function (o) { return p.frame(meta, fn(o)); });
  }
  function mini(svg, cx, cy, s) { return g(svg, { t: p.tr(cx, cy, 0, s) }); }

  // shared mini symbols for the legends (drawn around 0,0)
  var SYM = {
    battery: function () { return mini(sBatteryV(0, 0), 885, 0, 0.62); },
    switch: function () { return mini(line(-60, 0, -30, 0, { stroke: SK, w: 4 }) + sSwitchH(0, 0) + line(30, 0, 60, 0, { stroke: SK, w: 4 }), 885, 0, 0.8); },
    wire: function () { return line(840, 0, 930, 0, { stroke: SK, w: 4 }); },
    compass: function () { return compass(885, 0, 36, 0, { letters: false }); },
    coil: function () { return mini(sCoilH(-50, 10, 50, 5), 885, 0, 0.9); },
    core: function () { return mini(sCoilH(-50, 14, 50, 5, true), 885, 0, 0.9); },
    meter: function () { return mini(sMeter(0, 0, 34), 885, 0, 1); },
    magnet: function () { return barMagnet(840, -15, 90, 30, 'S'); },
    joint: function () { return line(840, 0, 930, 0, { stroke: SK, w: 4 }) + line(885, 0, 885, 30, { stroke: SK, w: 4 }) + sDot(885, 0); },
    poles: function () {
      return rect(850, -40, 70, 24, { fill: C.north }) + rect(850, 16, 70, 24, { fill: C.south }) + line(836, 0, 934, 0, { stroke: SK, w: 4 }) +
        T(885, -27, 'N', { size: 16, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' }) +
        T(885, 29, 'S', { size: 16, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
    }
  };
  var TEXT = {
    battery: ['Battery', ['Long line = + side,', 'short line = \u2212 side.', 'Ours has 4 cells inside', '(4 \u00D7 1.5 V = 6 V).']],
    switch: ['Switch', ['A gap you can close.', 'Our switch: touching', 'the bare wire end on.']],
    wire: ['Wire', ['A line = a wire. Ours', 'is the red copper wire.']],
    compass: ['Compass', ['A tiny magnet on a pin.', 'It swings when a', 'magnet is near.']],
    coil: ['Coil', ['Bumps = turns of wire', 'wrapped round and', 'round.']],
    core: ['Iron core', ['Two lines next to a', 'coil = iron inside it.', 'Ours is the nail.']],
    meter: ['Meter', ['Scientists call it a', 'galvanometer. Ours is', 'a compass + a coil.']],
    magnet: ['Magnet', ['N and S poles. The', 'arrow shows it moving.']],
    joint: ['Joint', ['A dot = wires joined.', 'We twist the bare', 'ends together.']],
    poles: ['Magnet poles', ['The wire runs between', 'the N and S tips of the', 'horseshoe magnet.']]
  };
  function legend(keys) {
    var s = panel(820, 112, 340, 658, { stroke: '#CBD5E1' });
    s += T(844, 150, 'Symbols used', { size: 22, weight: 'bold' });
    var step = 590 / keys.length;
    keys.forEach(function (k, i) {
      var y = 205 + i * step;
      s += g(SYM[k](), { t: 'translate(0,' + p.r1(y) + ')' });
      s += T(948, y - 18, TEXT[k][0], { size: 20, weight: 'bold' });
      s += T(948, y + 6, TEXT[k][1], { size: 16, lh: 21, fill: C.sub });
      if (i < keys.length - 1) { s += line(844, y + step / 2 + 4, 1136, y + step / 2 + 4, { stroke: '#E2E8F0', w: 2 }); }
    });
    return s;
  }
  function board(title) {
    return panel(40, 112, 760, 658, { stroke: '#CBD5E1' }) + T(64, 150, title, { size: 24, weight: 'bold' });
  }
  function batteryLabel() {
    return T(112, 428, '6 V', { size: 26, weight: 'bold', anchor: 'end' }) + T(112, 454, 'battery', { size: 18, anchor: 'end', fill: C.sub });
  }
  function switchLabel() {
    return T(330, 184, 'switch', { size: 20, weight: 'bold', anchor: 'middle' }) +
      T(330, 270, ['touch the bare', 'end on = ON'], { size: 17, anchor: 'middle', fill: C.sub, lh: 21 });
  }

  // ---------------------------------------------------------------- Mission 2
  def('schem-oersted', {
    file: '14-circuit-mission2.svg', title: 'Circuit Diagram: Mission 2',
    alt: 'Circuit diagram for Mission 2: battery, a touch switch and a wire that passes over a compass, all in one loop.'
  }, function () {
    var s = board('Wire over a compass');
    s += compass(640, 435, 62, 0, { letters: false });
    s += sLine([[170, 385], [170, 230], [300, 230]]) + sLine([[360, 230], [640, 230], [640, 640], [170, 640], [170, 485]]);
    s += sBatteryV(170, 435) + sSwitchH(330, 230) + batteryLabel() + switchLabel();
    s += T(562, 414, ['wire runs', 'over the', 'compass'], { size: 18, anchor: 'end', lh: 22 });
    s += arrow(470, 614, 370, 614, { w: 3, color: C.current, head: 11 });
    s += T(420, 600, 'current', { size: 16, anchor: 'middle', fill: '#B45309' });
    s += T(420, 700, ['This loop has nothing to slow the electricity down,', 'so it is almost a short circuit: 5-second rule!'], { size: 19, anchor: 'middle', fill: '#B91C1C', lh: 25 });
    return s + legend(['battery', 'switch', 'wire', 'compass']);
  });

  // ---------------------------------------------------------------- Mission 3
  def('schem-electromagnet', {
    file: '15-circuit-mission3.svg', title: 'Circuit Diagram: Mission 3',
    alt: 'Circuit diagram for Mission 3: battery, a touch switch and a coil with an iron core (the electromagnet), all in one loop.'
  }, function () {
    var s = board('The electromagnet');
    s += sLine([[170, 385], [170, 230], [300, 230]]) + sLine([[360, 230], [640, 230], [640, 640], [520, 640]]) + sLine([[300, 640], [170, 640], [170, 485]]);
    s += sCoilH(300, 640, 520, 8, true);
    s += sBatteryV(170, 435) + sSwitchH(330, 230) + batteryLabel() + switchLabel();
    s += T(410, 574, 'iron core: the nail', { size: 19, weight: 'bold', anchor: 'middle', fill: C.sub });
    s += T(410, 686, 'coil: your turns of wire', { size: 19, weight: 'bold', anchor: 'middle' });
    s += arrow(612, 380, 612, 480, { w: 3, color: C.current, head: 11 });
    s += T(598, 436, 'current', { size: 16, anchor: 'end', fill: '#B45309' });
    s += T(420, 726, ['More turns = more bumps = a stronger magnet.', 'Still almost a short circuit: 5-second rule!'], { size: 18, anchor: 'middle', fill: C.sub, lh: 24 });
    return s + legend(['battery', 'switch', 'coil', 'core']);
  });

  // ---------------------------------------------------------------- Mission 4
  def('schem-generator', {
    file: '16-circuit-mission4.svg', title: 'Circuit Diagram: Mission 4',
    alt: 'Circuit diagram for Mission 4: a coil (the wire donut) with a moving magnet, joined in one loop to a meter (the compass detector). There is no battery.'
  }, function () {
    var s = board('The magnet generator');
    s += sLine([[300, 280], [300, 620], [365, 620]]) + sLine([[520, 280], [640, 280], [640, 620], [475, 620]]);
    s += sCoilH(300, 280, 520, 7);
    s += sDot(640, 450);
    s += T(656, 456, 'joint', { size: 17, fill: C.sub });
    s += p.sMeter(420, 620, 55);
    s += barMagnet(150, 262, 120, 36, 'S');
    s += arrow(160, 232, 262, 232, { both: true, w: 4, color: '#15803D', head: 13 });
    s += T(211, 214, 'moves in and out', { size: 17, anchor: 'middle', fill: '#15803D', weight: 'bold' });
    s += T(320, 334, 'wire donut (coil): 10 turns', { size: 19, weight: 'bold' });
    s += T(470, 430, ['**No battery!**', 'The moving magnet is', 'the power source.'], { size: 21, anchor: 'middle', lh: 28, fill: '#15803D' });
    s += T(420, 704, 'compass detector', { size: 19, weight: 'bold', anchor: 'middle' });
    s += T(420, 728, '(15 turns round a compass)', { size: 16, anchor: 'middle', fill: C.sub });
    return s + legend(['coil', 'magnet', 'meter', 'joint']);
  });

  // ---------------------------------------------------------------- Bonus
  def('schem-motor', {
    file: '17-circuit-bonus.svg', title: 'Circuit Diagram: Bonus',
    alt: 'Circuit diagram for the bonus mission: battery, a touch switch and a wire that runs between the north and south tips of the horseshoe magnet.'
  }, function () {
    var s = board('The jumping wire');
    s += sLine([[170, 385], [170, 230], [300, 230]]) + sLine([[360, 230], [640, 230], [640, 640], [170, 640], [170, 485]]);
    s += rect(360, 590, 120, 36, { fill: C.north }) + rect(360, 654, 120, 36, { fill: C.south });
    s += T(420, 609, 'N', { size: 22, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
    s += T(420, 673, 'S', { size: 22, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
    [390, 450].forEach(function (x) { s += arrow(x, 628, x, 653, { w: 2.5, color: C.field, head: 8 }); });
    s += sLine([[340, 640], [500, 640]]);
    s += T(420, 574, 'horseshoe magnet tips', { size: 18, weight: 'bold', anchor: 'middle' });
    s += sBatteryV(170, 435) + sSwitchH(330, 230) + batteryLabel() + switchLabel();
    s += arrow(460, 212, 560, 212, { w: 3, color: C.current, head: 11 });
    s += T(510, 198, 'current', { size: 16, anchor: 'middle', fill: '#B45309' });
    s += T(420, 430, ['Current + magnet = a push.', 'The wire jumps sideways!'], { size: 21, anchor: 'middle', lh: 28, fill: '#BE185D' });
    s += T(420, 734, 'The same push spins electric motors.', { size: 18, anchor: 'middle', fill: C.sub });
    return s + legend(['battery', 'switch', 'wire', 'poles']);
  });

  // ---------------------------------------------------------------- Symbol key
  def('schem-symbols', {
    file: '13-circuit-symbols.svg', title: 'Circuit Symbols',
    alt: 'Key to circuit symbols: wire, battery, switch, coil, coil with iron core, meter, magnet and joint.'
  }, function () {
    var s = T(40, 138, 'Scientists draw circuits with simple symbols, so anyone in the world can read them.', { size: 21, fill: C.sub });
    var cards = [
      ['Wire', function (x, y) { return line(x + 44, y + 95, x + 224, y + 95, { stroke: SK, w: 4 }); }, ['A line = a wire.', 'Ours is the red', 'copper wire.']],
      ['Battery', function (x, y) { return sBatteryV(x + 134, y + 95); }, ['Long line = +,', 'short line = \u2212.', 'Ours: 4 cells = 6 V.']],
      ['Switch', function (x, y) {
        return line(x + 54, y + 105, x + 104, y + 105, { stroke: SK, w: 4 }) + sSwitchH(x + 134, y + 105) + line(x + 164, y + 105, x + 214, y + 105, { stroke: SK, w: 4 });
      }, ['Open = OFF (a gap).', 'Our switch: touching', 'the bare end on.']],
      ['Coil', function (x, y) {
        return line(x + 34, y + 105, x + 64, y + 105, { stroke: SK, w: 4 }) + sCoilH(x + 64, y + 105, x + 204, 6) + line(x + 204, y + 105, x + 234, y + 105, { stroke: SK, w: 4 });
      }, ['Turns of wire,', 'like our wire donut.']],
      ['Coil + iron core', function (x, y) {
        return line(x + 34, y + 115, x + 64, y + 115, { stroke: SK, w: 4 }) + sCoilH(x + 64, y + 115, x + 204, 6, true) + line(x + 204, y + 115, x + 234, y + 115, { stroke: SK, w: 4 });
      }, ['The electromagnet:', 'a coil on a nail.']],
      ['Meter', function (x, y) {
        return line(x + 44, y + 95, x + 84, y + 95, { stroke: SK, w: 4 }) + sMeter(x + 134, y + 95, 48) + line(x + 182, y + 95, x + 224, y + 95, { stroke: SK, w: 4 });
      }, ['A galvanometer spots', 'electricity. Ours is', 'a compass + a coil.']],
      ['Magnet', function (x, y) { return barMagnet(x + 64, y + 77, 140, 36, 'N'); }, ['N and S poles.', '(Not an official symbol,', 'but very handy!)']],
      ['Joint', function (x, y) {
        return line(x + 54, y + 95, x + 214, y + 95, { stroke: SK, w: 4 }) + line(x + 134, y + 95, x + 134, y + 150, { stroke: SK, w: 4 }) + sDot(x + 134, y + 95);
      }, ['A dot = wires joined', 'together. We twist', 'the bare ends.']]
    ];
    cards.forEach(function (c, i) {
      var x = 40 + (i % 4) * 283, y = i < 4 ? 160 : 470;
      s += panel(x, y, 268, 290, { stroke: '#CBD5E1' });
      s += rect(x + 14, y + 14, 240, 160, { rx: 12, fill: '#F8FAFC' });
      s += c[1](x, y);
      s += T(x + 134, y + 208, c[0], { size: 22, weight: 'bold', anchor: 'middle' });
      s += T(x + 134, y + 236, c[2], { size: 17, anchor: 'middle', lh: 22, fill: C.sub });
    });
    return s;
  });
}(typeof self !== 'undefined' ? self : this));
