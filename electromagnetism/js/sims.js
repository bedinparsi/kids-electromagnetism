/*!
 * Electromagnetism Adventure - interactive simulators.
 * Sims.mount(id, hostElement) builds one simulator inside hostElement.
 * The physics is simplified on purpose: it shows the right patterns, not exact numbers.
 */
(function (root) {
  'use strict';
  var Art = root.Art, p = Art.p, C = p.C;
  var SVGNS = 'http://www.w3.org/2000/svg';

  // ------------------------------------------------------------------ helpers
  function el(tag, attrs) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') { e.textContent = attrs[k]; } else { e.setAttribute(k, attrs[k]); }
    });
    return e;
  }
  function svgWrap(w, h, inner, label) {
    return '<svg xmlns="' + SVGNS + '" viewBox="0 0 ' + w + ' ' + h + '" font-family="' + p.FONT + '" role="img" aria-label="' + p.esc(label) + '">' + inner + '</svg>';
  }
  function shell(host, o) {
    var sec = el('section', { 'class': 'sim', 'aria-label': 'Simulator: ' + o.title });
    sec.innerHTML = '<div class="sim-head"><h3></h3><span class="sim-tag">Simulator</span></div>' +
      (o.svg ? '<div class="sim-stage"></div>' : '') + (o.body ? '<div class="sim-body"></div>' : '') +
      '<div class="sim-controls"></div><div class="sim-readout" aria-live="polite"></div>' + (o.note ? '<p class="sim-note"></p>' : '');
    sec.querySelector('h3').textContent = o.title;
    if (o.note) { sec.querySelector('.sim-note').textContent = o.note; }
    host.innerHTML = '';
    host.appendChild(sec);
    var stage = sec.querySelector('.sim-stage');
    if (stage) { stage.innerHTML = o.svg; }
    return {
      root: sec, stage: stage, svg: stage ? stage.querySelector('svg') : null, body: sec.querySelector('.sim-body'),
      controls: sec.querySelector('.sim-controls'), readout: sec.querySelector('.sim-readout')
    };
  }
  function button(parent, html, o) {
    o = o || {};
    var b = el('button', { type: 'button', 'class': 'btn' + (o.cls ? ' ' + o.cls : '') });
    b.innerHTML = html;
    if (o.pressed !== undefined) { b.setAttribute('aria-pressed', String(o.pressed)); }
    if (o.title) { b.setAttribute('title', o.title); }
    parent.appendChild(b);
    return b;
  }
  // press-and-hold button (mouse, touch, pen or keyboard Space/Enter)
  function holdButton(btn, onDown, onUp) {
    var active = false;
    btn.classList.add('hold');
    btn.setAttribute('aria-pressed', 'false');
    function down(e) {
      if (active) { return; }
      active = true;
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      if (e && e.pointerId !== undefined && btn.setPointerCapture) { try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
      onDown();
    }
    function up() {
      if (!active) { return; }
      active = false;
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      onUp();
    }
    btn.addEventListener('pointerdown', function (e) { if (e.button === 0 || e.pointerType !== 'mouse') { e.preventDefault(); down(e); } });
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('lostpointercapture', up);
    btn.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); down(); } });
    btn.addEventListener('keyup', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); up(); } });
    btn.addEventListener('blur', up);
    btn.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    return { release: up, isActive: function () { return active; } };
  }
  // animation loop that stops by itself when the simulator leaves the page
  function loop(rootEl, fn) {
    var last = performance.now();
    function frame(t) {
      if (!rootEl.isConnected) { return; }
      var dt = Math.min(0.04, Math.max(0, (t - last) / 1000));
      last = t;
      fn(dt, t);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function setRot(node, ang, cx, cy) { node.setAttribute('transform', 'rotate(' + ang.toFixed(2) + ' ' + cx + ' ' + cy + ')'); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function fmtSecs(s) { return s.toFixed(1) + ' s'; }
  // a compass needle that swings towards a target angle like a real one (with a bit of wobble)
  function Needle(node, cx, cy) {
    this.node = node; this.cx = cx; this.cy = cy; this.ang = 0; this.vel = 0;
  }
  Needle.prototype.step = function (dt, target, stiff) {
    var k = stiff || 70, c = 2 * 0.28 * Math.sqrt(k);
    var diff = target - this.ang;
    this.vel += (k * diff - c * this.vel) * dt;
    this.ang += this.vel * dt;
    setRot(this.node, this.ang, this.cx, this.cy);
  };
  function heatWarning(onTime) {
    if (onTime > 5) { return ' <span class="warn">\u26A0 5-second rule! Let go now: in real life the wire and battery would be getting warm.</span>'; }
    return '';
  }

  var sims = {};

  // ================================================================== 1. magnet playground
  sims.magnets = function (host) {
    var W = 800, H = 280;
    var inner = p.rect(0, 0, W, H, { fill: '#F8FAFC' }) + p.line(40, 230, 760, 230, { stroke: '#CBD5E1', w: 4 }) +
      '<g class="mg-left"></g><g class="mg-right"></g>' +
      '<g class="mg-arrows"></g>' +
      '<text class="mg-word" x="400" y="62" font-size="40" font-weight="bold" text-anchor="middle"></text>';
    var ui = shell(host, { title: 'Magnet playground', svg: svgWrap(W, H, inner, 'Two bar magnets that pull together or push apart'),
      note: 'Flip a magnet to change which poles face each other.' });
    var svg = ui.svg, gl = svg.querySelector('.mg-left'), gr = svg.querySelector('.mg-right');
    var arrows = svg.querySelector('.mg-arrows'), word = svg.querySelector('.mg-word');
    var state = { lf: false, rf: false, field: false };
    [gl, gr].forEach(function (g) { g.style.transition = 'transform 0.7s cubic-bezier(.3,1.4,.5,1)'; });

    function fieldLoops() {
      var s = '';
      [[20, -30], [45, -60], [70, -90]].forEach(function (q) {
        s += p.path('M0,22 C' + (-q[0]) + ',' + q[1] + ' ' + (200 + q[0]) + ',' + q[1] + ' 200,22', { stroke: C.field, w: 2.5, op: 0.55 });
        s += p.path('M0,38 C' + (-q[0]) + ',' + (60 - q[1]) + ' ' + (200 + q[0]) + ',' + (60 - q[1]) + ' 200,38', { stroke: C.field, w: 2.5, op: 0.55 });
      });
      return s;
    }
    function draw() {
      var leftPole = state.lf ? 'N' : 'S';          // pole on the LEFT end of the left magnet
      var rightPole = state.rf ? 'N' : 'S';         // pole on the LEFT end of the right magnet
      var facingL = leftPole === 'N' ? 'S' : 'N';  // right end of left magnet
      var facingR = rightPole;
      var pull = facingL !== facingR;
      gl.innerHTML = (state.field ? fieldLoops() : '') + p.barMagnet(0, 0, 200, 60, leftPole);
      gr.innerHTML = (state.field ? fieldLoops() : '') + p.barMagnet(0, 0, 200, 60, rightPole);
      var lx = pull ? 190 : 60, rx = pull ? 410 : 540;
      gl.style.transform = 'translate(' + lx + 'px, 170px)';
      gr.style.transform = 'translate(' + rx + 'px, 170px)';
      word.textContent = pull ? 'PULL!' : 'PUSH!';
      word.setAttribute('fill', pull ? '#15803D' : '#B91C1C');
      arrows.innerHTML = pull
        ? p.arrow(300, 110, 380, 110, { color: '#16A34A', w: 6, head: 18 }) + p.arrow(500, 110, 420, 110, { color: '#16A34A', w: 6, head: 18 })
        : p.arrow(380, 110, 300, 110, { color: '#DC2626', w: 6, head: 18 }) + p.arrow(420, 110, 500, 110, { color: '#DC2626', w: 6, head: 18 });
      ui.readout.innerHTML = '<strong>' + facingL + '</strong> faces <strong>' + facingR + '</strong>: ' +
        (pull ? 'different poles <span class="good">PULL together</span>.' : 'the same poles <span class="warn">PUSH apart</span>.');
    }
    var bL = button(ui.controls, '\u21C4 Flip left magnet');
    var bR = button(ui.controls, '\u21C4 Flip right magnet');
    var bF = button(ui.controls, 'Show field lines', { pressed: false });
    bL.addEventListener('click', function () { state.lf = !state.lf; draw(); });
    bR.addEventListener('click', function () { state.rf = !state.rf; draw(); });
    bF.addEventListener('click', function () { state.field = !state.field; bF.setAttribute('aria-pressed', String(state.field)); draw(); });
    draw();
  };

  // ================================================================== 2. what sticks? (sorting game)
  sims.sticks = function (host) {
    var items = [
      ['📎', 'Paper clip', true, 'Paper clips are made of steel.'],
      ['🔩', 'Iron nail', true, 'Iron is magnetic.'],
      ['🥫', 'Food tin', true, 'Food tins are steel with a thin coat of tin.'],
      ['🚪', 'Fridge door', true, 'Fridge doors are steel: that\u2019s why fridge magnets work!'],
      ['✂️', 'Scissor blades', true, 'Most scissor blades are steel.'],
      ['🥤', 'Drink can', false, 'Drink cans are aluminium, which is not magnetic.'],
      ['✨', 'Aluminium foil', false, 'Aluminium is a metal, but not a magnetic one.'],
      ['〰️', 'Copper wire', false, 'Copper is not magnetic (until electricity flows... see Mission 2!).'],
      ['✏️', 'Wooden pencil', false, 'Wood is not magnetic.'],
      ['💍', 'Gold ring', false, 'Gold is not magnetic.']
    ];
    var ui = shell(host, { title: 'What sticks? Sorting game', body: true, note: 'Tip: only a few metals are magnetic. Iron and steel are the big ones.' });
    var grid = el('div', { 'class': 'sticks-game' });
    ui.body.appendChild(grid);
    var answers = {};
    items.forEach(function (it, i) {
      var card = el('div', { 'class': 'stick-item' });
      card.innerHTML = '<span class="emoji" aria-hidden="true"></span><span class="name"></span><span class="opts"></span><span class="verdict" aria-live="polite"></span>';
      card.querySelector('.emoji').textContent = it[0];
      card.querySelector('.name').textContent = it[1];
      var opts = card.querySelector('.opts');
      [['yes', '🧲 Sticks'], ['no', 'No']].forEach(function (o) {
        var b = el('button', { type: 'button', 'aria-pressed': 'false', 'aria-label': it[1] + ': ' + (o[0] === 'yes' ? 'sticks' : 'does not stick') });
        b.textContent = o[1];
        b.addEventListener('click', function () {
          answers[i] = o[0];
          opts.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
          b.setAttribute('aria-pressed', 'true');
          card.classList.remove('right', 'wrong');
          card.querySelector('.verdict').textContent = '';
        });
        opts.appendChild(b);
      });
      grid.appendChild(card);
    });
    var check = button(ui.controls, 'Check my answers', { cls: 'primary' });
    var reset = button(ui.controls, 'Start again');
    check.addEventListener('click', function () {
      var right = 0, done = 0;
      grid.querySelectorAll('.stick-item').forEach(function (card, i) {
        var it = items[i], a = answers[i];
        card.classList.remove('right', 'wrong');
        if (!a) { card.querySelector('.verdict').textContent = 'Choose one!'; return; }
        done++;
        var ok = (a === 'yes') === it[2];
        if (ok) { right++; }
        card.classList.add(ok ? 'right' : 'wrong');
        card.querySelector('.verdict').textContent = (ok ? '\u2714 ' : '\u2718 ') + it[3];
      });
      ui.readout.innerHTML = done < items.length
        ? 'You sorted ' + done + ' of ' + items.length + '. Sort them all, then check again.'
        : 'You got <strong>' + right + ' out of ' + items.length + '</strong>' + (right === items.length ? ' <span class="good">Perfect, magnet detective!</span>' : '. Read the notes, then test the real things!');
    });
    reset.addEventListener('click', function () {
      answers = {};
      grid.querySelectorAll('.stick-item').forEach(function (card) {
        card.classList.remove('right', 'wrong');
        card.querySelector('.verdict').textContent = '';
        card.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      });
      ui.readout.textContent = '';
    });
    ui.readout.textContent = 'Choose "Sticks" or "No" for every object, then press Check.';
  };

  // ================================================================== 3. Oersted: wire over a compass
  sims.oersted = function (host) {
    var W = 800, H = 420, cx = 280, cy = 210, R = 150;
    var inner = p.rect(0, 0, W, H, { fill: '#FEF9EE' }) +
      '<g class="oe-under">' + p.wire('M' + cx + ',20 L' + cx + ',400', { w: 16 }) + '</g>' +
      p.compass(cx, cy, R, 0, { needleClass: 'oe-needle' }) +
      '<g class="oe-over">' + p.wire('M' + cx + ',20 L' + cx + ',400', { w: 16, op: 0.8 }) + '</g>' +
      '<line class="oe-flow" x1="' + cx + '" y1="24" x2="' + cx + '" y2="396" stroke="#FACC15" stroke-width="5" stroke-dasharray="6 18" stroke-linecap="round" opacity="0"/>' +
      p.arrow(50, 110, 50, 50, { w: 4, head: 12 }) + p.T(50, 40, 'N', { size: 20, weight: 'bold', anchor: 'middle', fill: C.north }) +
      p.rect(520, 30, 250, 360, { rx: 16, fill: '#FFFFFF', stroke: '#A5F3FC', w: 3 }) +
      p.T(645, 62, 'Side view of the wire', { size: 19, weight: 'bold', anchor: 'middle' }) +
      '<g class="oe-rings"></g>' +
      p.T(645, 372, 'magnetic circles', { size: 17, anchor: 'middle', fill: C.sub });
    var ui = shell(host, { title: '\u00D8rsted\u2019s compass', svg: svgWrap(W, H, inner, 'A compass with a wire lying across it'),
      note: 'Hold the button to "touch the wire to the battery". Try swapping the ends and moving the wire underneath.' });
    var svg = ui.svg;
    var needle = new Needle(svg.querySelector('.oe-needle'), cx, cy);
    var over = svg.querySelector('.oe-over'), under = svg.querySelector('.oe-under');
    var flow = svg.querySelector('.oe-flow'), rings = svg.querySelector('.oe-rings');
    var st = { on: false, swapped: false, under: false, onTime: 0, offset: 0 };

    function drawRings() {
      var up = !st.swapped, s = '', x = 645;
      [140, 210, 280].forEach(function (Y) {
        s += p.path('M' + (x + 90) + ',' + Y + ' A90,22 0 0 0 ' + (x - 90) + ',' + Y, { stroke: '#0891B2', w: 4, op: 0.35 });
      });
      s += p.rect(x - 10, 90, 20, 250, { rx: 10, fill: C.wire, stroke: C.wireDark, w: 2 });
      s += up ? p.arrow(x, 330, x, 102, { color: '#FACC15', w: 6, head: 16 }) : p.arrow(x, 100, x, 328, { color: '#FACC15', w: 6, head: 16 });
      [140, 210, 280].forEach(function (Y) {
        s += p.path('M' + (x - 90) + ',' + Y + ' A90,22 0 0 0 ' + (x + 90) + ',' + Y, { stroke: '#0891B2', w: 4 });
        s += p.head(up ? x + 8 : x - 8, Y + 22, up ? 0 : Math.PI, 13, '#0891B2');
      });
      rings.innerHTML = s;
    }
    function layout() {
      over.style.display = st.under ? 'none' : '';
      under.style.display = st.under ? '' : 'none';
      rings.style.opacity = st.on ? '1' : '0.18';
      flow.setAttribute('opacity', st.on ? '0.95' : '0');
      drawRings();
    }
    var hb = button(ui.controls, '\u26A1 Hold to connect', { cls: 'primary' });
    var bs = button(ui.controls, '\u21C4 Swap the ends');
    var bu = button(ui.controls, 'Wire: on top', { pressed: false });
    holdButton(hb, function () { st.on = true; st.onTime = 0; layout(); }, function () { st.on = false; layout(); });
    bs.addEventListener('click', function () { st.swapped = !st.swapped; layout(); });
    bu.addEventListener('click', function () {
      st.under = !st.under;
      bu.innerHTML = st.under ? 'Wire: underneath' : 'Wire: on top';
      bu.setAttribute('aria-pressed', String(st.under));
      layout();
    });
    layout();
    var lastMsg = '';
    loop(ui.root, function (dt) {
      var dir = (st.swapped ? -1 : 1) * (st.under ? -1 : 1);
      var bx = st.on ? -4 * dir : 0;                 // field from the wire (east +), Earth's field = 1 north
      var target = Math.atan2(bx, 1) * 180 / Math.PI;
      needle.step(dt, target, 40 * Math.sqrt(1 + bx * bx));
      if (st.on) {
        st.onTime += dt;
        // Dashes show conventional current: northwards (up the screen) unless swapped, matching the needle
        // (SNOW rule: current South-to-North Over a needle turns its north end West).
        st.offset = (st.offset + dt * 60 * (st.swapped ? -1 : 1)) % 24;
        flow.setAttribute('stroke-dashoffset', st.offset.toFixed(1));
      }
      var a = needle.ang, side = Math.abs(a) < 4 ? 'pointing north' : (a < 0 ? 'swung LEFT (west)' : 'swung RIGHT (east)');
      var msg = (st.on ? '<strong>Current flowing</strong> for ' + fmtSecs(st.onTime) + '. ' : 'Battery not connected. ') +
        'Needle: <strong>' + side + '</strong>' + (st.on ? heatWarning(st.onTime) : '');
      if (msg !== lastMsg) { ui.readout.innerHTML = msg; lastMsg = msg; }
    });
  };

  // ================================================================== 4. electromagnet lab
  sims.electromagnet = function (host) {
    var W = 800, H = 470, NX = 300, HEAD = 60, TIP = 290, TOTAL = 30;
    var TURNS = [0, 10, 20, 40, 80];
    var bat = p.battery(590, 300, 0.8);
    var inner = p.rect(0, 0, W, H, { fill: '#F8FAFC' }) +
      p.ellipse(300, 430, 190, 26, { fill: '#E2E8F0' }) +
      '<g class="em-core"></g><g class="em-coil"></g><g class="em-poles"></g>' +
      '<g class="em-clips"></g>' +
      bat.svg +
      '<g class="em-leads"></g>' +
      p.compass(470, 250, 44, 0, { letters: false, needleClass: 'em-needle' }) +
      p.T(470, 196, 'compass', { size: 16, anchor: 'middle', fill: C.sub }) +
      p.rect(590, 40, 170, 22, { rx: 11, fill: '#E2E8F0' }) + '<rect class="em-heat" x="590" y="40" width="0" height="22" rx="11" fill="#F97316"/>' +
      p.T(675, 84, 'wire warmth', { size: 16, anchor: 'middle', fill: C.sub });
    var ui = shell(host, { title: 'Electromagnet lab', svg: svgWrap(W, H, inner, 'An electromagnet over a pile of paper clips'),
      note: 'The simulator\u2019s numbers are made up to show the pattern. Your real nail will give different numbers, and that\u2019s fine!' });
    var svg = ui.svg;
    var gCore = svg.querySelector('.em-core'), gCoil = svg.querySelector('.em-coil'), gPoles = svg.querySelector('.em-poles');
    var gClips = svg.querySelector('.em-clips'), gLeads = svg.querySelector('.em-leads'), heatBar = svg.querySelector('.em-heat');
    var needle = new Needle(svg.querySelector('.em-needle'), 470, 250);
    var st = { turnsIdx: 1, core: 'nail', on: false, flip: false, onTime: 0, heat: 0, held: [], residual: -1, residualT: 0 };

    // paper clips: fixed "pile" spots, generated once
    var clips = [], seed = 7;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var colours = ['#64748B', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'];
    for (var i = 0; i < TOTAL; i++) {
      var g = document.createElementNS(SVGNS, 'g');
      g.innerHTML = p.clip(0, 0, 0.42, 0, colours[i % colours.length]);
      g.style.transition = 'transform 0.45s cubic-bezier(.2,.9,.3,1.1)';
      gClips.appendChild(g);
      clips.push({ g: g, px: 150 + rnd() * 300, py: 412 + rnd() * 30, pr: rnd() * 180 - 90 });
    }
    function hangSpot(k) {
      var row = Math.floor(k / 5), col = k % 5;
      return { x: NX + (col - 2) * 17 + (row % 2) * 8, y: TIP + 26 + row * 25, r: (col - 2) * 10 };
    }
    function placeClips() {
      clips.forEach(function (c, k) {
        var idx = st.held.indexOf(k), pos;
        if (idx >= 0) { pos = hangSpot(idx); } else { pos = { x: c.px, y: c.py, r: c.pr }; }
        c.g.style.transform = 'translate(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px) rotate(' + pos.r.toFixed(1) + 'deg)';
      });
    }
    function strength() {
      var n = TURNS[st.turnsIdx], f = st.core === 'nail' ? 1 : 0.01;
      return n * f;
    }
    function clipsFor() { return Math.floor(TOTAL * (1 - Math.exp(-strength() / 30))); }
    function drawCore() {
      if (st.core === 'nail') { gCore.innerHTML = p.nail(NX, HEAD, NX, TIP, 1.2); }
      else if (st.core === 'pencil') { gCore.innerHTML = p.pencil(NX, (HEAD + TIP) / 2, TIP - HEAD, 90); }
      else { gCore.innerHTML = ''; }
      var n = TURNS[st.turnsIdx];
      if (n > 0) {
        var vis = Math.min(n, 22), layers = n > 22 ? Math.min(3, Math.ceil(n / 22)) : 1, s = '';
        for (var L = layers - 1; L >= 0; L--) {
          var c = p.coil(NX, 95, NX, 255, vis, { ry: 22 + L * 6, w: 4.5 });
          s += c.back + c.front;
        }
        gCoil.innerHTML = s;
      } else { gCoil.innerHTML = ''; }
      var leadTop = n > 0 ? [NX + 22, 95] : [NX + 8, 95], leadBot = n > 0 ? [NX + 22, 255] : [NX + 8, 255];
      var pm = bat.posMid, ng = bat.neg;
      var endB = st.on ? [ng[0] - 3, ng[1] - 9] : [ng[0] - 16, ng[1] - 26];   // end B touches the terminal only when ON
      gLeads.innerHTML = p.wire('M' + p.P(leadTop) + ' C 420,80 560,150 ' + p.P([pm[0] - 12, pm[1]]), { w: 5 }) +
        p.copper(pm[0] - 12, pm[1], pm[0] + 10, pm[1] + 2, 4) +
        p.wire('M' + p.P(leadBot) + ' C 380,370 560,350 ' + p.P([endB[0] - 8, endB[1] - 14]), { w: 5 }) +
        p.copper(endB[0] - 8, endB[1] - 14, endB[0], endB[1], 4);
    }
    function drawPoles() {
      var tip = st.flip ? 'N' : 'S', head = tip === 'N' ? 'S' : 'N';
      var active = st.on && strength() > 0;
      gPoles.innerHTML = active
        ? p.circle(NX - 50, TIP - 8, 16, { fill: tip === 'N' ? C.north : C.south }) + p.T(NX - 50, TIP - 7, tip, { size: 18, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' }) +
          p.circle(NX - 50, HEAD + 8, 16, { fill: head === 'N' ? C.north : C.south }) + p.T(NX - 50, HEAD + 9, head, { size: 18, weight: 'bold', anchor: 'middle', base: 'central', fill: '#fff' })
        : '';
    }
    function switchOn() {
      st.on = true; st.onTime = 0; st.residual = -1;
      var n = clipsFor();
      st.held = [];
      for (var k = 0; k < n; k++) { st.held.push(k); }
      drawCore(); drawPoles(); placeClips(); update(true);
    }
    function switchOff() {
      st.on = false;
      var keep = st.core === 'nail' && TURNS[st.turnsIdx] >= 40 && st.held.length > 0 && st.onTime > 0.8;
      st.residual = keep ? st.held[0] : -1;
      st.residualT = 0;
      st.held = keep ? [st.held[0]] : [];
      drawCore(); drawPoles(); placeClips(); update(true);
    }

    var lab = el('label');
    lab.innerHTML = 'Turns: <input type="range" min="0" max="4" step="1" value="1" aria-label="Number of turns"> <strong class="em-tn">10</strong>';
    ui.controls.appendChild(lab);
    var range = lab.querySelector('input'), tn = lab.querySelector('.em-tn');
    var lab2 = el('label');
    lab2.innerHTML = 'Core: <select aria-label="Core"><option value="nail">Iron nail</option><option value="pencil">Pencil</option><option value="none">Nothing</option></select>';
    ui.controls.appendChild(lab2);
    var sel = lab2.querySelector('select');
    var hb = button(ui.controls, '\u26A1 Hold to switch ON', { cls: 'primary' });
    var bs = button(ui.controls, '\u21C4 Swap battery wires');
    var hold = holdButton(hb, switchOn, switchOff);
    range.addEventListener('input', function () {
      st.turnsIdx = Number(range.value); tn.textContent = String(TURNS[st.turnsIdx]);
      if (hold.isActive()) { switchOn(); } else { st.held = []; st.residual = -1; drawCore(); placeClips(); update(true); }
    });
    sel.addEventListener('change', function () {
      st.core = sel.value;
      if (hold.isActive()) { switchOn(); } else { st.held = []; st.residual = -1; drawCore(); placeClips(); update(true); }
    });
    bs.addEventListener('click', function () { st.flip = !st.flip; drawPoles(); update(true); });

    var lastMsg = '';
    function update(force) {
      var n = TURNS[st.turnsIdx];
      var coreName = st.core === 'nail' ? 'iron nail' : (st.core === 'pencil' ? 'pencil' : 'nothing');
      var msg;
      if (st.on) {
        msg = '<strong>ON</strong> for ' + fmtSecs(st.onTime) + ' \u00B7 ' + n + ' turns on ' + coreName + ' \u00B7 clips picked up: <strong>' + st.held.length + '</strong>';
        if (n === 0) { msg += ' \u00B7 No coil, no magnet!'; }
        else if (st.core !== 'nail' && st.held.length === 0) { msg += ' \u00B7 Without iron the coil is far too weak.'; }
        else { msg += ' \u00B7 The point is <strong>' + (st.flip ? 'N' : 'S') + '</strong>.'; }
        msg += heatWarning(st.onTime);
      } else if (st.residual >= 0) {
        msg = 'OFF. One clip is still stuck: the steel nail remembers a little magnetism!';
      } else {
        msg = 'OFF \u00B7 ' + n + ' turns on ' + coreName + '. Hold the button to switch the electromagnet on.';
      }
      if (force || msg !== lastMsg) { ui.readout.innerHTML = msg; lastMsg = msg; }
    }
    drawCore(); drawPoles(); placeClips(); update(true);
    loop(ui.root, function (dt) {
      if (st.on) { st.onTime += dt; st.heat = Math.min(10, st.heat + dt * 1.6); } else { st.heat = Math.max(0, st.heat - dt * 0.8); }
      heatBar.setAttribute('width', (170 * st.heat / 10).toFixed(1));
      heatBar.setAttribute('fill', st.heat > 7 ? '#DC2626' : '#F97316');
      if (st.residual >= 0) {
        st.residualT += dt;
        if (st.residualT > 3) { st.residual = -1; st.held = []; placeClips(); update(true); }
      }
      // compass: points at an S tip, away from an N tip (field strength drops if weak)
      var target = 0;
      if (st.on && strength() > 0) {
        var s = clamp(strength() / 20, 0, 1);
        var towards = st.flip ? 90 : -90;           // compass is to the right of the tip
        target = towards * (0.35 + 0.65 * s);
      }
      needle.step(dt, target, 60);
      if (st.on) { update(false); }
    });
  };

  // ================================================================== 5. generator lab
  sims.generator = function (host) {
    var W = 800, H = 470, RX = 210, RY = 300, A = 55;
    var inner = p.rect(0, 0, W, H, { fill: '#F7FEE7' }) +
      p.T(210, 36, 'Drag the magnet up and down!', { size: 20, weight: 'bold', anchor: 'middle', fill: '#15803D' }) +
      '<g class="gn-ringback">' + p.donut(RX, RY, 120, 34, 6, { w: 4.5, spread: 12, part: 'back' }) + '</g>' +
      '<g class="gn-magnet" style="cursor:grab"></g>' +
      '<g class="gn-ringfront">' + p.donut(RX, RY, 120, 34, 6, { w: 4.5, spread: 12, part: 'front', tape: false }) + '</g>' +
      '<g class="gn-leads">' + p.wire(p.sinePath(330, 470, RY + 4, 5, 2.5, 0), { w: 4, shine: false }) + p.wire(p.sinePath(330, 470, RY + 4, 5, 2.5, Math.PI), { w: 4, shine: false }) +
        p.wire('M470,300 C 530,300 575,292 590,272', { w: 4, shine: false }) + p.wire('M470,308 C 540,312 606,298 612,272', { w: 4, shine: false }) + '</g>' +
      '<g class="gn-gap"></g>' +
      p.compass(600, 170, 105, 0, { needleClass: 'gn-needle' }) +
      '<g>' + [0, 1, 2, 3, 4, 5].map(function (i) { var x = 588 + i * 5; return p.line(x, 70, x, 270, { stroke: C.wire, w: 3, op: 0.85 }); }).join('') + '</g>' +
      p.rect(430, 330, 350, 120, { rx: 12, fill: '#0F172A' }) +
      p.line(440, 390, 770, 390, { stroke: '#334155', w: 1.5 }) +
      '<polyline class="gn-trace" fill="none" stroke="#FACC15" stroke-width="3" stroke-linejoin="round" points=""/>' +
      p.T(442, 350, 'current', { size: 14, fill: '#94A3B8' }) + p.T(768, 444, 'time \u2192', { size: 14, fill: '#94A3B8', anchor: 'end' });
    var ui = shell(host, { title: 'Magnet generator lab', svg: svgWrap(W, H, inner, 'A wire donut, a magnet you can drag, and a compass detector'),
      note: 'Drag the magnet through the donut, or use the buttons. Keyboard: focus the picture and use the up and down arrow keys.' });
    var svg = ui.svg;
    svg.setAttribute('tabindex', '0');
    var gMag = svg.querySelector('.gn-magnet'), gGap = svg.querySelector('.gn-gap'), trace = svg.querySelector('.gn-trace');
    var needle = new Needle(svg.querySelector('.gn-needle'), 600, 170);
    var st = { z: -190, lastZ: -190, v: 0, flip: false, turns: 10, closed: true, two: false, dragging: false, anim: null, samples: [], nvel: 0, nang: 0 };
    var ZMIN = -250, ZMAX = 150;

    function drawMagnet() {
      var s = p.block3D(-99, -12, 1.2, st.flip ? 'S' : 'N');
      if (st.two) { s = p.block3D(-99, -40, 1.2, st.flip ? 'S' : 'N') + p.block3D(-99, -12, 1.2, null); }
      gMag.innerHTML = s + p.T(18, 44, st.flip ? 'S face down' : 'N face down', { size: 14, anchor: 'middle', fill: C.sub });
    }
    function placeMagnet() { gMag.setAttribute('transform', 'translate(' + RX + ',' + (RY + st.z).toFixed(1) + ')'); }
    function flux(z) { return 1 / Math.pow(1 + (z / A) * (z / A), 1.5); }
    function drawGap() {
      gGap.innerHTML = st.closed ? '' : p.rect(452, RY - 18, 22, 44, { fill: '#F7FEE7' }) + p.T(462, RY + 46, 'loop broken!', { size: 15, weight: 'bold', anchor: 'middle', fill: C.bad });
    }
    drawMagnet(); placeMagnet(); drawGap();

    // dragging
    function svgY(evt) {
      var pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY;
      var m = svg.getScreenCTM();
      return m ? pt.matrixTransform(m.inverse()).y : 0;
    }
    var grabOffset = 0;
    svg.addEventListener('pointerdown', function (e) {
      var y = svgY(e), pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      var m = svg.getScreenCTM(), x = m ? pt.matrixTransform(m.inverse()).x : 0;
      if (x > 400) { return; }
      st.dragging = true; st.anim = null;
      grabOffset = (RY + st.z) - y;
      if (Math.abs(grabOffset) > 60) { grabOffset = 0; }
      gMag.style.cursor = 'grabbing';
      try { svg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      e.preventDefault();
    });
    svg.addEventListener('pointermove', function (e) {
      if (!st.dragging) { return; }
      st.z = clamp(svgY(e) + grabOffset - RY, ZMIN, ZMAX);
    });
    function endDrag() { st.dragging = false; gMag.style.cursor = 'grab'; }
    svg.addEventListener('pointerup', endDrag);
    svg.addEventListener('pointercancel', endDrag);
    svg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { st.anim = { to: clamp(st.z + 70, ZMIN, ZMAX), speed: 700 }; e.preventDefault(); }
      if (e.key === 'ArrowUp') { st.anim = { to: clamp(st.z - 70, ZMIN, ZMAX), speed: 700 }; e.preventDefault(); }
    });

    function go(to, speed) { st.dragging = false; st.anim = { to: to, speed: speed }; }
    function teleport(z) { st.z = z; st.lastZ = z; st.v = 0; placeMagnet(); }
    var bIn = button(ui.controls, '\u2B07 Push in');
    var bOut = button(ui.controls, '\u2B06 Pull out');
    var bSlow = button(ui.controls, 'Push in slowly');
    var bFlip = button(ui.controls, '\u21C5 Flip magnet');
    var bTwo = button(ui.controls, 'Two magnets', { pressed: false });
    var lab = el('label');
    lab.innerHTML = 'Donut turns: <select aria-label="Donut turns"><option>5</option><option selected>10</option><option>20</option></select>';
    ui.controls.appendChild(lab);
    var sel = lab.querySelector('select');
    var bLoop = button(ui.controls, 'Break the loop', { pressed: false });
    bIn.addEventListener('click', function () { if (st.z > -20) { teleport(-190); } go(0, 900); });
    bOut.addEventListener('click', function () { if (st.z < -150) { teleport(0); } go(-200, 900); });
    bSlow.addEventListener('click', function () { if (st.z > -20) { teleport(-190); } go(0, 140); });
    bFlip.addEventListener('click', function () { st.flip = !st.flip; drawMagnet(); });
    bTwo.addEventListener('click', function () { st.two = !st.two; bTwo.setAttribute('aria-pressed', String(st.two)); drawMagnet(); });
    sel.addEventListener('change', function () { st.turns = Number(sel.value); });
    bLoop.addEventListener('click', function () {
      st.closed = !st.closed;
      bLoop.textContent = st.closed ? 'Break the loop' : 'Join the loop';
      bLoop.setAttribute('aria-pressed', String(!st.closed));
      drawGap();
    });

    var lastMsg = '', quiet = 0, peak = 0;
    loop(ui.root, function (dt) {
      if (dt <= 0) { return; }
      if (st.anim) {
        var dz = st.anim.to - st.z, stepZ = st.anim.speed * dt;
        if (Math.abs(dz) <= stepZ) { st.z = st.anim.to; st.anim = null; } else { st.z += Math.sign(dz) * stepZ; }
      }
      placeMagnet();
      var zNow = st.z, dzdt = (zNow - st.lastZ) / dt;
      st.lastZ = zNow;
      st.v = st.v * 0.6 + dzdt * 0.4;                            // smooth the speed a little
      var strengthMag = (st.two ? 1.7 : 1) * (st.flip ? -1 : 1);
      var dfdz = (flux(zNow + 1) - flux(zNow - 1)) / 2;
      var current = st.closed ? -st.turns * strengthMag * dfdz * st.v * 0.9 : 0;
      // needle: a damped swing pushed by the current
      var k = 62, c = 4.5;
      st.nvel += (-k * st.nang - c * st.nvel + 46 * current) * dt;
      st.nang = clamp(st.nang + st.nvel * dt, -85, 85);
      if (Math.abs(st.nang) >= 85) { st.nvel *= -0.3; }
      setRot(needle.node, st.nang, 600, 170);
      // trace
      st.samples.push(current);
      if (st.samples.length > 240) { st.samples.shift(); }
      var pts = st.samples.map(function (v, i) { return (440 + i * 330 / 240).toFixed(1) + ',' + clamp(390 - v * 0.4, 336, 444).toFixed(1); }).join(' ');
      trace.setAttribute('points', pts);
      // words
      var mag = Math.abs(current);
      peak = Math.max(peak * 0.98, mag);
      var msg;
      if (!st.closed) {
        msg = 'The loop is broken, so <strong>no electricity can flow</strong>, even when the magnet moves. The needle stays still.';
      } else if (mag > 3) {
        quiet = 0;
        msg = 'Electricity flowing! The needle kicks <strong>' + (current > 0 ? 'right' : 'left') + '</strong>' +
          (Math.abs(st.v) > 500 ? ' (fast magnet = big kick!)' : '') + '.';
      } else {
        quiet += dt;
        msg = quiet > 0.4 ? (Math.abs(zNow) < 40 ? 'The magnet is sitting inside the donut but <strong>not moving</strong>: no electricity!' : 'Magnet still: <strong>no electricity</strong>. Move it through the donut!') : lastMsg;
      }
      if (msg && msg !== lastMsg) { ui.readout.innerHTML = msg; lastMsg = msg; }
    });
  };

  // ================================================================== 6. jumping wire (motor effect)
  sims.motor = function (host) {
    var W = 800, H = 420, PX = 295, PY = 70, L = 180;
    var inner = p.rect(0, 0, W, H, { fill: '#FFF7FB' }) +
      p.rect(130, 335, 220, 44, { rx: 6, fill: '#C4B5FD' }) + p.T(240, 363, 'box', { size: 16, anchor: 'middle', fill: '#4C1D95' }) +
      '<g class="mo-magnet"></g>' +
      '<g class="mo-swing"></g>' +
      p.circle(PX, PY, 10, { fill: '#FBBF24', stroke: '#B45309', w: 2 }) +
      p.T(PX, PY - 20, 'pencil', { size: 15, anchor: 'middle', fill: C.sub }) +
      p.T(600, 110, 'Side view', { size: 20, weight: 'bold', anchor: 'middle' }) +
      '<text class="mo-word" x="600" y="200" font-size="34" font-weight="bold" text-anchor="middle"></text>' +
      p.T(600, 250, ['\u2190 into the magnet', 'out of the magnet \u2192'], { size: 17, anchor: 'middle', fill: C.sub, lh: 24 });
    var ui = shell(host, { title: 'Jumping wire', svg: svgWrap(W, H, inner, 'A wire swing hanging between the tips of a horseshoe magnet'),
      note: 'Hold the button to send electricity through the swing. Then swap the wires or turn the magnet over.' });
    var svg = ui.svg, gMag = svg.querySelector('.mo-magnet'), gSwing = svg.querySelector('.mo-swing'), word = svg.querySelector('.mo-word');
    var st = { on: false, swapped: false, flipped: false, magnet: true, th: 0, w: 0, onTime: 0 };
    function drawMagnet() {
      gMag.innerHTML = st.magnet ? p.horseshoeC(205, 265, 1, st.flipped ? ['S', 'N'] : ['N', 'S']) : '';
    }
    function drawSwing() {
      var bx = PX + L * Math.sin(st.th), by = PY + L * Math.cos(st.th);
      gSwing.innerHTML = p.wire('M' + PX + ',' + PY + ' L' + bx.toFixed(1) + ',' + by.toFixed(1), { w: 6, shine: false }) +
        p.circle(bx, by, 8, { fill: C.wire, stroke: C.wireDark, w: 2 }) +
        (st.on ? p.circle(bx, by, 14, { stroke: '#FACC15', w: 3 }) : '');
    }
    drawMagnet(); drawSwing();
    var hb = button(ui.controls, '\u26A1 Hold to connect', { cls: 'primary' });
    var bs = button(ui.controls, '\u21C4 Swap battery wires');
    var bf = button(ui.controls, '\u21C5 Turn magnet over');
    var bm = button(ui.controls, 'Remove magnet', { pressed: false });
    holdButton(hb, function () { st.on = true; st.onTime = 0; }, function () { st.on = false; });
    bs.addEventListener('click', function () { st.swapped = !st.swapped; });
    bf.addEventListener('click', function () { st.flipped = !st.flipped; drawMagnet(); });
    bm.addEventListener('click', function () {
      st.magnet = !st.magnet;
      bm.textContent = st.magnet ? 'Remove magnet' : 'Put magnet back';
      bm.setAttribute('aria-pressed', String(!st.magnet));
      drawMagnet();
    });
    var lastMsg = '';
    loop(ui.root, function (dt) {
      var dir = (st.swapped ? -1 : 1) * (st.flipped ? -1 : 1);
      var off = L * Math.sin(st.th);                          // sideways position of the swing bottom
      var inField = Math.exp(-(off - 0) * (off - 0) / (60 * 60));
      var force = st.on && st.magnet ? 16 * dir * inField : 0;
      var w0 = 7.2;
      st.w += (-w0 * w0 * Math.sin(st.th) - 1.1 * st.w + force) * dt;
      st.th += st.w * dt;
      drawSwing();
      if (st.on) { st.onTime += dt; }
      var deg = st.th * 180 / Math.PI;
      var txt = Math.abs(deg) < 2 ? '' : (deg > 0 ? 'OUT!' : 'IN!');
      if (word.textContent !== txt) { word.textContent = txt; word.setAttribute('fill', '#DB2777'); }
      var msg;
      if (!st.on) { msg = 'Not connected. Hold the button to send electricity through the swing.'; }
      else if (!st.magnet) { msg = 'Current is flowing, but with <strong>no magnet</strong> there is nothing to push against. The swing stays still.'; }
      else { msg = 'Current + magnet = a push! The swing kicks <strong>' + (dir > 0 ? 'out of' : 'into') + '</strong> the magnet.' + heatWarning(st.onTime); }
      if (msg !== lastMsg) { ui.readout.innerHTML = msg; lastMsg = msg; }
    });
  };

  root.Sims = {
    ids: Object.keys(sims),
    mount: function (id, hostEl) {
      if (!sims[id]) { hostEl.textContent = 'Unknown simulator: ' + id; return; }
      try { sims[id](hostEl); } catch (err) {
        hostEl.innerHTML = '';
        var m = el('p', { 'class': 'box warning', text: 'Sorry, this simulator could not start in this browser.' });
        hostEl.appendChild(m);
        if (root.console) { root.console.error(err); }
      }
    }
  };
}(typeof self !== 'undefined' ? self : this));
