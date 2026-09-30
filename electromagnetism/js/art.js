/*!
 * Electromagnetism Adventure - SVG art library.
 *
 * Works in the browser (window.Art) and in Node (require('./art.js')).
 * Every drawing is plain SVG markup with flat colours and NO ids / <defs>,
 * so many drawings can sit on the same web page without clashing.
 *
 * Art.render(id)  -> SVG markup for one scene (see Art.list for ids)
 * Art.list        -> [{id, file, title, alt, kind}]
 * Art.p           -> drawing primitives (reused by the interactive sims)
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) { module.exports = api; }
  else { root.Art = api; }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FONT = "'Trebuchet MS', 'Segoe UI', Arial, sans-serif";

  // ------------------------------------------------------------------ palette
  var C = {
    ink: '#1F2937', sub: '#4B5563', muted: '#9CA3AF', paper: '#FFFDF7',
    north: '#E53935', south: '#1E6FD9', field: '#7C3AED',
    wire: '#D61F4F', wireDark: '#8F1239', wireHi: '#F9A8C0',
    copper: '#C87533', copperDark: '#7C4019',
    battery: '#26215A', batteryTop: '#433B8A', batterySide: '#17133A',
    ferrite: '#4B5563', ferriteTop: '#6B7280', ferriteSide: '#374151',
    electron: '#FACC15', electronEdge: '#A16207', current: '#F59E0B',
    tape: '#FDE68A', tapeEdge: '#D97706', horseshoe: '#E11D48',
    steel: '#CBD5E1', steelEdge: '#64748B',
    good: '#16A34A', bad: '#DC2626'
  };

  // ------------------------------------------------------------------ basics
  function r1(n) { return Math.round(n * 10) / 10; }
  function P(p) { return r1(p[0]) + ',' + r1(p[1]); }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function attrs(o) {
    var out = '';
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) { continue; }
      var v = o[k];
      if (v === undefined || v === null || v === false) { continue; }
      if (typeof v === 'number') { v = r1(v); }
      out += ' ' + k + '="' + esc(v) + '"';
    }
    return out;
  }
  function tag(name, a, inner) {
    return '<' + name + attrs(a || {}) + (inner === undefined ? '/>' : '>' + inner + '</' + name + '>');
  }
  function merge(a, b) { b = b || {}; for (var k in b) { if (b[k] !== undefined) { a[k] = b[k]; } } return a; }
  function sty(o) {
    o = o || {};
    return {
      fill: o.fill === undefined ? 'none' : o.fill,
      stroke: o.stroke, 'stroke-width': o.w, opacity: o.op, 'fill-opacity': o.fo,
      'stroke-dasharray': o.dash, 'stroke-linecap': o.cap, 'stroke-linejoin': o.join,
      transform: o.t, 'class': o.cls
    };
  }
  function rect(x, y, w, h, o) { o = o || {}; return tag('rect', merge({ x: x, y: y, width: w, height: h, rx: o.rx }, sty(o))); }
  function circle(cx, cy, r, o) { return tag('circle', merge({ cx: cx, cy: cy, r: r }, sty(o))); }
  function ellipse(cx, cy, rx, ry, o) { return tag('ellipse', merge({ cx: cx, cy: cy, rx: rx, ry: ry }, sty(o))); }
  function line(x1, y1, x2, y2, o) {
    return tag('line', merge({ x1: x1, y1: y1, x2: x2, y2: y2 }, sty(merge({ stroke: C.ink, w: 3, cap: 'round' }, o))));
  }
  function path(d, o) { return tag('path', merge({ d: d }, sty(o))); }
  function poly(pts, o) {
    return tag('polygon', merge({ points: pts.map(P).join(' ') }, sty(o)));
  }
  function g(inner, o) { o = o || {}; return tag('g', { transform: o.t, opacity: o.op, 'class': o.cls }, inner); }
  function tr(x, y, rot, sc) {
    return 'translate(' + r1(x) + ',' + r1(y) + ')' + (rot ? ' rotate(' + r1(rot) + ')' : '') + (sc && sc !== 1 ? ' scale(' + sc + ')' : '');
  }

  // "**bold**" inside a text line becomes a bold tspan
  function rich(s) {
    return String(s).split('**').map(function (p, i) {
      return i % 2 ? '<tspan font-weight="bold">' + esc(p) + '</tspan>' : esc(p);
    }).join('');
  }
  // Text. s can be a string or an array of lines ('' = blank line)
  function T(x, y, s, o) {
    o = o || {};
    var size = o.size || 22;
    var a = {
      x: x, y: y, 'font-size': size, fill: o.fill || C.ink, 'font-weight': o.weight,
      'text-anchor': o.anchor, 'font-style': o.italic ? 'italic' : undefined,
      'dominant-baseline': o.base, opacity: o.op, transform: o.t, 'letter-spacing': o.ls
    };
    var inner;
    if (Array.isArray(s)) {
      var lh = o.lh || Math.round(size * 1.3), dy = 0, first = true;
      inner = '';
      s.forEach(function (ln, i) {
        if (i > 0) { dy += lh; }
        if (ln === '') { return; }
        inner += '<tspan x="' + r1(x) + '"' + (first && !dy ? '' : ' dy="' + dy + '"') + '>' + rich(ln) + '</tspan>';
        first = false; dy = 0;
      });
    } else {
      inner = rich(s);
    }
    return tag('text', a, inner);
  }

  // ------------------------------------------------------------------ arrows
  function head(x, y, a, s, col) {
    var bx = x - s * Math.cos(a), by = y - s * Math.sin(a);
    var px = 0.6 * s * Math.sin(a), py = -0.6 * s * Math.cos(a);
    return poly([[x, y], [bx + px, by + py], [bx - px, by - py]], { fill: col || C.ink });
  }
  function arrow(x1, y1, x2, y2, o) {
    o = o || {};
    var col = o.color || C.ink, w = o.w || 4, hs = o.head || (w * 2.4 + 5);
    var a = Math.atan2(y2 - y1, x2 - x1);
    var sx = x1, sy = y1, out = '';
    if (o.both) {
      sx = x1 + Math.cos(a) * hs * 0.7; sy = y1 + Math.sin(a) * hs * 0.7;
      out += head(x1, y1, a + Math.PI, hs, col);
    }
    var ex = x2 - Math.cos(a) * hs * 0.7, ey = y2 - Math.sin(a) * hs * 0.7;
    return line(sx, sy, ex, ey, { stroke: col, w: w, cap: 'butt', dash: o.dash, op: o.op }) + out + head(x2, y2, a, hs, col);
  }
  function bez(p0, p1, p2, p3, t) {
    var u = 1 - t;
    return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
      u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]];
  }
  function bezD(p0, p1, p2, p3, t) {
    var u = 1 - t;
    return [3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]),
      3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1])];
  }
  // cubic curve with arrowheads at the given t positions (default: middle)
  function curve(p0, p1, p2, p3, o) {
    o = o || {};
    var col = o.color || C.field, w = o.w || 3, hs = o.head || 11;
    var out = path('M' + P(p0) + ' C' + P(p1) + ' ' + P(p2) + ' ' + P(p3), { stroke: col, w: w, op: o.op, dash: o.dash, cap: 'round' });
    (o.heads || [0.5]).forEach(function (t) {
      var pt = bez(p0, p1, p2, p3, t), dv = bezD(p0, p1, p2, p3, t), a = Math.atan2(dv[1], dv[0]);
      var tip = t >= 1 ? pt : [pt[0] + Math.cos(a) * hs * 0.5, pt[1] + Math.sin(a) * hs * 0.5];
      out += head(tip[0], tip[1], a, hs, col);
    });
    return out;
  }

  // ------------------------------------------------------------------ parts
  function panel(x, y, w, h, o) {
    o = o || {};
    return rect(x, y, w, h, { rx: o.rx || 18, fill: o.fill || '#FFFFFF', stroke: o.stroke || '#E5E7EB', w: o.w || 3 });
  }
  function badge(cx, cy, n, col, r) {
    r = r || 20;
    return circle(cx, cy, r, { fill: col || C.ink }) +
      T(cx, cy + 1, String(n), { size: r * 1.15, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
  }
  function signBadge(cx, cy, r, sign) {
    var out = circle(cx, cy, r, { fill: sign === '+' ? C.bad : C.ink, stroke: '#fff', w: Math.max(1, r * 0.12) });
    out += line(cx - r * 0.5, cy, cx + r * 0.5, cy, { stroke: '#fff', w: r * 0.28 });
    if (sign === '+') { out += line(cx, cy - r * 0.5, cx, cy + r * 0.5, { stroke: '#fff', w: r * 0.28 }); }
    return out;
  }
  function wire(d, o) {
    o = o || {};
    var w = o.w || 8;
    var out = path(d, { stroke: C.wireDark, w: w + 3, cap: 'round', join: 'round', op: o.op }) +
      path(d, { stroke: C.wire, w: w, cap: 'round', join: 'round', op: o.op });
    if (w >= 7 && o.shine !== false) {
      out += path(d, { stroke: C.wireHi, w: Math.max(1.5, w * 0.2), cap: 'round', join: 'round', op: 0.6, t: 'translate(0,' + r1(-w * 0.22) + ')' });
    }
    return out;
  }
  function copper(x1, y1, x2, y2, w) {
    w = w || 5;
    return line(x1, y1, x2, y2, { stroke: C.copperDark, w: w + 2 }) + line(x1, y1, x2, y2, { stroke: C.copper, w: w });
  }
  function electron(cx, cy, r) {
    r = r || 11;
    return circle(cx, cy, r, { fill: C.electron, stroke: C.electronEdge, w: Math.max(1.2, r * 0.15) }) +
      circle(cx - r * 0.36, cy - r * 0.18, r * 0.14, { fill: C.ink }) +
      circle(cx + r * 0.36, cy - r * 0.18, r * 0.14, { fill: C.ink }) +
      path('M' + P([cx - r * 0.42, cy + r * 0.22]) + ' Q' + P([cx, cy + r * 0.62]) + ' ' + P([cx + r * 0.42, cy + r * 0.22]),
        { stroke: C.ink, w: Math.max(1, r * 0.13), cap: 'round' });
  }

  // 6-volt lantern battery. (x,y) = top-left of the front face.
  // Centre terminal = negative, corner spring = positive (check YOUR battery!).
  function battery(x, y, s, o) {
    s = s || 1; o = o || {};
    var W = 120 * s, H = 150 * s, dx = 30 * s, dy = -26 * s, out = '';
    out += poly([[x + W, y], [x + W + dx, y + dy], [x + W + dx, y + dy + H], [x + W, y + H]], { fill: C.batterySide });
    out += rect(x, y, W, H, { fill: C.battery });
    out += poly([[x, y], [x + dx, y + dy], [x + W + dx, y + dy], [x + W, y]], { fill: C.batteryTop });
    out += rect(x, y + 44 * s, W, 48 * s, { fill: '#D1D5DB' });
    out += rect(x, y + 44 * s, W, 6 * s, { fill: '#FACC15' });
    out += T(x + W / 2, y + 82 * s, o.label || '6 V', { size: 30 * s, weight: 'bold', anchor: 'middle' });
    var tcx = x + W / 2 + dx / 2, tcy = y + dy / 2;
    var nx = tcx - 10 * s, ny = tcy + 2 * s;
    out += poly([[nx - 9 * s, ny], [nx + 9 * s, ny], [nx + 5 * s, ny - 26 * s], [nx - 5 * s, ny - 26 * s]], { fill: '#0B0F19' });
    out += ellipse(nx, ny - 26 * s, 5 * s, 2 * s, { fill: '#9CA3AF' });
    var px = x + W + dx * 0.55 - 16 * s, py = y + dy * 0.55 + 1 * s;
    for (var i = 0; i < 5; i++) {
      out += ellipse(px, py - i * 6 * s, 8 * s, 3 * s, { stroke: '#E5E7EB', w: 2.5 * s });
    }
    if (o.signs !== false) {
      out += signBadge(nx - 24 * s, ny - 18 * s, 11 * s, '-');
      out += signBadge(px + 22 * s, py - 26 * s, 11 * s, '+');
    }
    return { svg: out, neg: [nx, ny - 27 * s], pos: [px, py - 27 * s], posMid: [px, py - 12 * s] };
  }

  // Compass: angle in degrees clockwise from north (0 = needle points up)
  function compass(cx, cy, r, ang, o) {
    o = o || {};
    var letters = o.letters !== false && r >= 34;
    var out = circle(cx, cy, r, { fill: '#E2E8F0', stroke: C.ink, w: Math.max(2.5, r * 0.07) });
    out += circle(cx, cy, r * 0.86, { fill: '#FFFFFF', stroke: '#CBD5E1', w: 1.5 });
    if (letters) {
      var fs = r * 0.2, rr = r * 0.72;
      out += T(cx, cy - rr, 'N', { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: C.north });
      out += T(cx + rr, cy, 'E', { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: C.muted });
      out += T(cx, cy + rr, 'S', { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: C.muted });
      out += T(cx - rr, cy, 'W', { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: C.muted });
    }
    var nl = r * (letters ? 0.56 : 0.7), nw = r * 0.12;
    var needle = poly([[cx, cy - nl], [cx + nw, cy], [cx - nw, cy]], { fill: C.north }) +
      poly([[cx - nw, cy], [cx + nw, cy], [cx, cy + nl]], { fill: '#F8FAFC', stroke: '#94A3B8', w: 1.2 });
    out += g(needle, { t: 'rotate(' + r1(ang || 0) + ' ' + r1(cx) + ' ' + r1(cy) + ')', cls: o.needleClass });
    out += circle(cx, cy, Math.max(2.5, r * 0.06), { fill: C.ink });
    return out;
  }

  function barMagnet(x, y, w, h, left, o) {
    o = o || {};
    var right = left === 'N' ? 'S' : 'N';
    var out = rect(x, y, w / 2, h, { fill: left === 'N' ? C.north : C.south }) +
      rect(x + w / 2, y, w / 2, h, { fill: right === 'N' ? C.north : C.south }) +
      rect(x, y, w, h, { stroke: 'rgba(0,0,0,0.25)', w: 1.5, rx: 3 });
    if (o.labels !== false) {
      var fs = Math.min(h * 0.62, w * 0.28);
      out += T(x + w / 4, y + h / 2 + 1, left, { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
      out += T(x + 3 * w / 4, y + h / 2 + 1, right, { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
    }
    return out;
  }
  function barMagnetV(x, y, w, h, top) {
    var bottom = top === 'N' ? 'S' : 'N', fs = Math.min(w * 0.62, h * 0.28);
    return rect(x, y, w, h / 2, { fill: top === 'N' ? C.north : C.south }) +
      rect(x, y + h / 2, w, h / 2, { fill: bottom === 'N' ? C.north : C.south }) +
      rect(x, y, w, h, { stroke: 'rgba(0,0,0,0.25)', w: 1.5, rx: 3 }) +
      T(x + w / 2, y + h / 4 + 1, top, { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' }) +
      T(x + w / 2, y + 3 * h / 4 + 1, bottom, { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
  }

  // Ceramic block magnet drawn in 3D with its big (pole) face on top
  function block3D(x, y, s, top) {
    s = s || 1;
    var W = 150 * s, Th = 24 * s, dx = 30 * s, dy = -23 * s;
    var out = poly([[x + W, y], [x + W + dx, y + dy], [x + W + dx, y + dy + Th], [x + W, y + Th]], { fill: C.ferriteSide });
    out += rect(x, y, W, Th, { fill: C.ferrite });
    out += poly([[x, y], [x + dx, y + dy], [x + W + dx, y + dy], [x + W, y]], { fill: C.ferriteTop });
    if (top) {
      var bx = x + W / 2 + dx / 2, by = y + dy / 2, br = Math.min(12 * s, Math.abs(dy) * 0.46);
      out += circle(bx, by, br, { fill: top === 'N' ? C.north : C.south });
      out += T(bx, by + 1, top, { size: br * 1.3, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' });
    }
    return out;
  }

  // Horseshoe magnet, opening downward. (cx, top) = top of the bend.
  function horseshoe(cx, top, s, poles) {
    s = s || 1;
    var Ro = 70 * s, Ri = 30 * s, bc = top + Ro, bot = bc + 115 * s, tipH = 50 * s;
    var d = 'M' + P([cx - Ro, bot]) + ' L' + P([cx - Ro, bc]) + ' A' + r1(Ro) + ',' + r1(Ro) + ' 0 0 1 ' + P([cx + Ro, bc]) +
      ' L' + P([cx + Ro, bot]) + ' L' + P([cx + Ri, bot]) + ' L' + P([cx + Ri, bc]) +
      ' A' + r1(Ri) + ',' + r1(Ri) + ' 0 0 0 ' + P([cx - Ri, bc]) + ' L' + P([cx - Ri, bot]) + ' Z';
    var out = path(d, { fill: C.horseshoe, stroke: '#9F1239', w: 2 });
    out += rect(cx - Ro, bot - tipH, Ro - Ri, tipH, { fill: C.steel, stroke: C.steelEdge, w: 1.5 });
    out += rect(cx + Ri, bot - tipH, Ro - Ri, tipH, { fill: C.steel, stroke: C.steelEdge, w: 1.5 });
    if (poles) {
      var fs = 22 * s;
      out += T(cx - (Ro + Ri) / 2, bot - tipH / 2 + 1, poles[0], { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: poles[0] === 'N' ? C.north : C.south });
      out += T(cx + (Ro + Ri) / 2, bot - tipH / 2 + 1, poles[1], { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: poles[1] === 'N' ? C.north : C.south });
    }
    return out;
  }
  // Horseshoe lying on its side like the letter C. Bend centre (bx, cy); tips point right.
  function horseshoeC(bx, cy, s, poles) {
    s = s || 1;
    var Ro = 70 * s, Ri = 30 * s, ex = bx + 115 * s, tipW = 50 * s;
    var d = 'M' + P([ex, cy - Ro]) + ' L' + P([bx, cy - Ro]) + ' A' + r1(Ro) + ',' + r1(Ro) + ' 0 0 0 ' + P([bx, cy + Ro]) +
      ' L' + P([ex, cy + Ro]) + ' L' + P([ex, cy + Ri]) + ' L' + P([bx, cy + Ri]) +
      ' A' + r1(Ri) + ',' + r1(Ri) + ' 0 0 1 ' + P([bx, cy - Ri]) + ' L' + P([ex, cy - Ri]) + ' Z';
    var out = path(d, { fill: C.horseshoe, stroke: '#9F1239', w: 2 });
    out += rect(ex - tipW, cy - Ro, tipW, Ro - Ri, { fill: C.steel, stroke: C.steelEdge, w: 1.5 });
    out += rect(ex - tipW, cy + Ri, tipW, Ro - Ri, { fill: C.steel, stroke: C.steelEdge, w: 1.5 });
    if (poles) {
      var fs = 20 * s;
      out += T(ex - tipW / 2, cy - (Ro + Ri) / 2 + 1, poles[0], { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: poles[0] === 'N' ? C.north : C.south });
      out += T(ex - tipW / 2, cy + (Ro + Ri) / 2 + 1, poles[1], { size: fs, weight: 'bold', anchor: 'middle', base: 'central', fill: poles[1] === 'N' ? C.north : C.south });
    }
    return out;
  }

  // Iron nail from head (x1,y1) to point (x2,y2)
  function nail(x1, y1, x2, y2, s) {
    s = s || 1;
    var L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    var inner = rect(4 * s, -6 * s, L - 26 * s, 12 * s, { fill: '#B8BEC6', stroke: '#6B7280', w: 1.5 }) +
      poly([[L - 22 * s, -6 * s], [L, 0], [L - 22 * s, 6 * s]], { fill: '#B8BEC6', stroke: '#6B7280', w: 1.5 }) +
      line(8 * s, -2.5 * s, L - 24 * s, -2.5 * s, { stroke: '#EEF0F3', w: 2 * s }) +
      rect(-4 * s, -14 * s, 8 * s, 28 * s, { rx: 2 * s, fill: '#8B929C', stroke: '#6B7280', w: 1.5 });
    return g(inner, { t: tr(x1, y1, a) });
  }
  // Coil of n turns along the segment (x1,y1)->(x2,y2). Returns {back, front}
  function coil(x1, y1, x2, y2, n, o) {
    o = o || {};
    var L = Math.hypot(x2 - x1, y2 - y1), a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    var ry = o.ry || 18, w = o.w || 5, pitch = n > 1 ? L / (n - 1) : 0;
    var k = Math.max(2.5, Math.min(pitch * 0.42, 9));
    var back = '', front = '', outline = '';
    for (var i = 0; i < n; i++) {
      var cx = i * pitch;
      var d = 'M' + P([cx - k, -ry]) + ' Q' + P([cx + k * 0.25, 0]) + ' ' + P([cx + k, ry]);
      outline += path(d, { stroke: C.wireDark, w: w + 2.5, cap: 'round' });
      front += path(d, { stroke: C.wire, w: w, cap: 'round' });
      if (i < n - 1) { back += line(cx + k, ry, cx + pitch - k, -ry, { stroke: C.wireDark, w: w * 0.75, op: 0.55 }); }
    }
    return { back: g(back, { t: tr(x1, y1, a) }), front: g(outline + front, { t: tr(x1, y1, a) }) };
  }
  // Paper clip (Gem style)
  var CLIP_D = 'M6,28 L6,-26 A6,6 0 0 0 -6,-26 L-6,34 A10,10 0 0 0 14,34 L14,-34 A14,14 0 0 0 -14,-34 L-14,20';
  function clip(cx, cy, s, ang, col) {
    s = s || 1;
    return path(CLIP_D, { stroke: col || '#64748B', w: 3.4 / s, cap: 'round', join: 'round', t: tr(cx, cy, ang || 0, s) });
  }
  function tape(cx, cy, w, h, ang) {
    return rect(-w / 2, -h / 2, w, h, { rx: 2, fill: C.tape, stroke: C.tapeEdge, w: 1.5, op: 0.93, t: tr(cx, cy, ang || 0) });
  }
  // Wire "donut" coil (flat ring seen at an angle). part: 'all' | 'back' | 'front'
  function donut(cx, cy, rx, ry, n, o) {
    o = o || {};
    var w = o.w || 4.5, spread = o.spread === undefined ? 12 : o.spread, part = o.part || 'all', out = '';
    for (var i = 0; i < n; i++) {
      var yy = cy + (n > 1 ? (i / (n - 1) - 0.5) * spread : 0), d;
      if (part === 'back') { d = 'M' + P([cx + rx, yy]) + ' A' + r1(rx) + ',' + r1(ry) + ' 0 0 0 ' + P([cx - rx, yy]); }
      else if (part === 'front') { d = 'M' + P([cx - rx, yy]) + ' A' + r1(rx) + ',' + r1(ry) + ' 0 0 0 ' + P([cx + rx, yy]); }
      if (d) {
        out += path(d, { stroke: C.wireDark, w: w + 2.5, cap: 'round', op: part === 'back' ? 0.9 : 1 }) +
          path(d, { stroke: C.wire, w: w, cap: 'round' });
      } else {
        out += ellipse(cx, yy, rx, ry, { stroke: C.wireDark, w: w + 2.5 }) + ellipse(cx, yy, rx, ry, { stroke: C.wire, w: w });
      }
    }
    if (o.tape !== false && part !== 'back') {
      [35, 90, 145].forEach(function (deg) {
        var th = deg * Math.PI / 180, x = cx + rx * Math.cos(th), y = cy + ry * Math.sin(th);
        var tang = Math.atan2(ry * Math.cos(th), -rx * Math.sin(th)) * 180 / Math.PI;
        out += tape(x, y, 12, spread + 16, tang);
      });
    }
    return out;
  }
  function can(cx, cy, s) {
    s = s || 1;
    var w = 60 * s, h = 86 * s, top = cy - h / 2;
    return path('M' + P([cx - w / 2, top]) + ' L' + P([cx - w / 2, top + h]) + ' A' + r1(w / 2) + ',' + r1(8 * s) + ' 0 0 0 ' + P([cx + w / 2, top + h]) +
      ' L' + P([cx + w / 2, top]) + ' Z', { fill: '#93C5FD', stroke: '#2563EB', w: 2 }) +
      rect(cx - w / 2, top + h * 0.32, w, h * 0.3, { fill: '#2563EB', op: 0.35 }) +
      ellipse(cx, top, w / 2, 8 * s, { fill: '#E5E7EB', stroke: '#6B7280', w: 2 }) +
      ellipse(cx, top, w / 2 - 6 * s, 5 * s, { stroke: '#9CA3AF', w: 1.5 });
  }
  function pencil(cx, cy, len, ang) {
    var h = len / 2, bw = 9;
    var inner = rect(-h + 16, -bw, len - 44, bw * 2, { fill: '#FBBF24', stroke: '#B45309', w: 1.5 }) +
      line(-h + 18, 0, h - 30, 0, { stroke: '#F59E0B', w: 2 }) +
      rect(-h, -bw, 12, bw * 2, { rx: 3, fill: '#F9A8D4', stroke: '#DB2777', w: 1.5 }) +
      rect(-h + 10, -bw, 8, bw * 2, { fill: '#9CA3AF', stroke: '#6B7280', w: 1 }) +
      poly([[h - 28, -bw], [h, 0], [h - 28, bw]], { fill: '#FDE7C8', stroke: '#B45309', w: 1.5 }) +
      poly([[h - 9, -3], [h, 0], [h - 9, 3]], { fill: '#374151' });
    return g(inner, { t: tr(cx, cy, ang || 0) });
  }
  function scissors(cx, cy, s, ang) {
    var inner = poly([[0, 0], [-9, -54], [4, -50]], { fill: '#E2E8F0', stroke: '#64748B', w: 1.5 }) +
      poly([[0, 0], [9, -54], [-4, -50]], { fill: '#CBD5E1', stroke: '#64748B', w: 1.5 }) +
      line(0, 0, -11, 17, { stroke: '#DC2626', w: 5 }) + line(0, 0, 11, 17, { stroke: '#DC2626', w: 5 }) +
      circle(-16, 29, 11, { stroke: '#DC2626', w: 5 }) + circle(16, 29, 11, { stroke: '#DC2626', w: 5 }) +
      circle(0, 0, 3, { fill: '#374151' });
    return g(inner, { t: tr(cx, cy, ang || 0, s || 1) });
  }
  function bolt(cx, cy, s) {
    s = s || 1;
    return poly([[6, -26], [-12, 4], [-1, 4], [-6, 26], [12, -6], [1, -6]].map(function (p) { return [cx + p[0] * s, cy + p[1] * s]; }),
      { fill: '#FACC15', stroke: '#A16207', w: 2, join: 'round' });
  }
  function timer(cx, cy, r, label) {
    return rect(cx - r * 0.18, cy - r * 1.3, r * 0.36, r * 0.32, { rx: 2, fill: C.bad }) +
      circle(cx, cy, r, { fill: '#fff', stroke: C.bad, w: Math.max(3, r * 0.14) }) +
      T(cx, cy + 1, label || '5s', { size: r * 0.78, weight: 'bold', anchor: 'middle', base: 'central', fill: C.bad });
  }
  function check(cx, cy, s) {
    s = s || 1;
    return path('M' + P([cx - 10 * s, cy]) + ' L' + P([cx - 3 * s, cy + 8 * s]) + ' L' + P([cx + 11 * s, cy - 9 * s]),
      { stroke: C.good, w: 4 * s, cap: 'round', join: 'round' });
  }
  function cross(cx, cy, s) {
    s = s || 1;
    return line(cx - 8 * s, cy - 8 * s, cx + 8 * s, cy + 8 * s, { stroke: C.bad, w: 4 * s }) +
      line(cx + 8 * s, cy - 8 * s, cx - 8 * s, cy + 8 * s, { stroke: C.bad, w: 4 * s });
  }
  function domArrow(cx, cy, ang, col) {
    return g(line(-10, 0, 5, 0, { stroke: col || C.ink, w: 3 }) + poly([[3, -5], [12, 0], [3, 5]], { fill: col || C.ink }), { t: tr(cx, cy, ang) });
  }
  function sinePath(x1, x2, y, amp, waves, phase) {
    var n = 80, d = '';
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      d += (i ? ' L' : 'M') + P([x1 + (x2 - x1) * t, y + amp * Math.sin(phase + t * waves * 2 * Math.PI)]);
    }
    return d;
  }
  // three field rings around a vertical wire (x, from y1 to y2), current flowing UP
  function wireRings(x, y1, y2, ys, rx, ry, col) {
    var out = '';
    ys.forEach(function (Y) {
      out += path('M' + P([x + rx, Y]) + ' A' + rx + ',' + ry + ' 0 0 0 ' + P([x - rx, Y]), { stroke: col, w: 4, op: 0.4, cap: 'round' });
    });
    out += rect(x - 10, y1, 20, y2 - y1, { rx: 10, fill: C.wire, stroke: C.wireDark, w: 2 });
    out += arrow(x, y2 - 12, x, y1 + 14, { color: '#FACC15', w: 6, head: 16 });
    ys.forEach(function (Y) {
      out += path('M' + P([x - rx, Y]) + ' A' + rx + ',' + ry + ' 0 0 0 ' + P([x + rx, Y]), { stroke: col, w: 4, cap: 'round' });
      out += head(x + 8, Y + ry, 0, 13, col);
    });
    return out;
  }

  // ------------------------------------------------------------------ schematic parts
  var SK = '#111827', SW = 4;
  function sLine(pts) { return path('M' + pts.map(P).join(' L'), { stroke: SK, w: SW, join: 'round', cap: 'round' }); }
  // battery on a vertical wire: leads at cy-50 (+, top) and cy+50 (-, bottom)
  function sBatteryV(cx, cy) {
    return line(cx, cy - 50, cx, cy - 26, { stroke: SK, w: SW }) +
      line(cx - 34, cy - 26, cx + 34, cy - 26, { stroke: SK, w: 4 }) +
      line(cx - 16, cy - 14, cx + 16, cy - 14, { stroke: SK, w: 9, cap: 'butt' }) +
      line(cx, cy - 12, cx, cy + 12, { stroke: SK, w: 3, dash: '3 5', cap: 'butt' }) +
      line(cx - 34, cy + 14, cx + 34, cy + 14, { stroke: SK, w: 4 }) +
      line(cx - 16, cy + 26, cx + 16, cy + 26, { stroke: SK, w: 9, cap: 'butt' }) +
      line(cx, cy + 26, cx, cy + 50, { stroke: SK, w: SW }) +
      signBadge(cx + 52, cy - 32, 11, '+') + signBadge(cx + 52, cy + 32, 11, '-');
  }
  // open switch on a horizontal wire, contacts at cx-30 and cx+30
  function sSwitchH(cx, y) {
    return line(cx - 25, y - 3, cx + 27, y - 32, { stroke: SK, w: SW }) +
      circle(cx - 30, y, 6, { fill: '#fff', stroke: SK, w: 3 }) + circle(cx + 30, y, 6, { fill: '#fff', stroke: SK, w: 3 });
  }
  function sCoilH(x1, y, x2, n, core) {
    var r = (x2 - x1) / (2 * n), d = 'M' + P([x1, y]);
    for (var i = 0; i < n; i++) { d += ' a' + r1(r) + ',' + r1(r) + ' 0 0 1 ' + r1(2 * r) + ',0'; }
    var out = path(d, { stroke: SK, w: SW, cap: 'round' });
    if (core) {
      out += line(x1, y - r - 12, x2, y - r - 12, { stroke: SK, w: 4 }) + line(x1, y - r - 22, x2, y - r - 22, { stroke: SK, w: 4 });
    }
    return out;
  }
  function sCoilV(x, y1, y2, n) {   // bumps to the left
    var r = (y2 - y1) / (2 * n), d = 'M' + P([x, y1]);
    for (var i = 0; i < n; i++) { d += ' a' + r1(r) + ',' + r1(r) + ' 0 0 0 0,' + r1(2 * r); }
    return path(d, { stroke: SK, w: SW, cap: 'round' });
  }
  function sMeter(cx, cy, r) {
    return circle(cx, cy, r, { fill: '#fff', stroke: SK, w: SW }) +
      g(poly([[cx, cy - r * 0.64], [cx + r * 0.13, cy], [cx - r * 0.13, cy]], { fill: C.north }) +
        poly([[cx - r * 0.13, cy], [cx + r * 0.13, cy], [cx, cy + r * 0.64]], { fill: '#F1F5F9', stroke: '#64748B', w: 1.2 }),
      { t: 'rotate(35 ' + r1(cx) + ' ' + r1(cy) + ')' }) +
      circle(cx, cy, 3.5, { fill: SK });
  }
  function sDot(x, y) { return circle(x, y, 8, { fill: SK }); }

  // ------------------------------------------------------------------ frame
  function frame(o, body) {
    var W = o.width || 1200, H = o.height || 800;
    var bw = o.badge ? Math.max(150, o.badge.length * 15 + 46) : 0;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H +
      '" font-family="' + FONT + '" role="img" aria-label="' + esc(o.alt || o.title || '') + '">';
    s += '<title>' + esc(o.alt || o.title || '') + '</title>';
    s += rect(0, 0, W, H, { fill: o.bg || C.paper });
    if (o.title) {
      s += rect(0, 0, W, 96, { fill: o.color });
      s += T(40, 63, o.title, { size: o.titleSize || 42, weight: 'bold', fill: '#fff' });
      if (o.badge) {
        s += rect(W - 40 - bw, 24, bw, 48, { rx: 24, fill: '#fff' });
        s += T(W - 40 - bw / 2, 57, o.badge, { size: 22, weight: 'bold', fill: o.color, anchor: 'middle', ls: 1 });
      }
    }
    s += body;
    if (o.footer !== false) { s += T(W - 40, H - 12, 'Electromagnetism Adventure', { size: 15, fill: C.muted, anchor: 'end' }); }
    return s + '</svg>';
  }

  var p = {
    C: C, FONT: FONT, r1: r1, P: P, esc: esc, tag: tag, rect: rect, circle: circle, ellipse: ellipse, line: line, path: path,
    poly: poly, g: g, tr: tr, T: T, head: head, arrow: arrow, curve: curve, bez: bez, panel: panel, badge: badge,
    signBadge: signBadge, wire: wire, copper: copper, electron: electron, battery: battery, compass: compass,
    barMagnet: barMagnet, barMagnetV: barMagnetV, block3D: block3D, horseshoe: horseshoe, horseshoeC: horseshoeC,
    nail: nail, coil: coil, clip: clip, tape: tape, donut: donut, can: can, pencil: pencil, scissors: scissors,
    bolt: bolt, timer: timer, check: check, cross: cross, domArrow: domArrow, sinePath: sinePath, wireRings: wireRings,
    sLine: sLine, sBatteryV: sBatteryV, sSwitchH: sSwitchH, sCoilH: sCoilH, sCoilV: sCoilV, sMeter: sMeter, sDot: sDot,
    frame: frame
  };

  // Scenes are registered from js/scenes.js with Art.define(id, meta, fn)
  var scenes = {};
  var list = [];

  return {
    p: p,
    list: list,
    define: function (id, meta, fn) {
      scenes[id] = { meta: meta, fn: fn };
      list.push({ id: id, file: meta.file, title: meta.title, alt: meta.alt, kind: meta.kind || 'illustration' });
    },
    has: function (id) { return !!scenes[id]; },
    render: function (id, opts) {
      var s = scenes[id];
      if (!s) { throw new Error('Unknown art id: ' + id); }
      return s.fn(opts || {});
    }
  };
}));
