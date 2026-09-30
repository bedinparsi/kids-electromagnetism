/*!
 * Electromagnetism Adventure - the single-page app: routing, pages, saving progress, quiz and certificate.
 */
(function (root) {
  'use strict';
  var doc = root.document;
  var Content = root.Content, Art = root.Art, Sims = root.Sims;
  var main = doc.getElementById('main');
  var nav = doc.getElementById('site-nav');
  var STORE_KEY = 'electromagnetism-adventure-v1';

  // ------------------------------------------------------------------ saved progress (this computer only)
  var store = load();
  function load() {
    var s;
    try { s = JSON.parse(root.localStorage.getItem(STORE_KEY)); } catch (e) { s = null; }
    s = s && typeof s === 'object' ? s : {};
    ['done', 'predict', 'nb', 'notes', 'check', 'quiz'].forEach(function (k) { if (!s[k] || typeof s[k] !== 'object') { s[k] = {}; } });
    return s;
  }
  function save() {
    try { root.localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* storage may be blocked: the app still works */ }
  }

  // ------------------------------------------------------------------ helpers
  function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function pageById(id) {
    var all = Content.pages.concat(Content.extraPages);
    for (var i = 0; i < all.length; i++) { if (all[i].id === id) { return all[i]; } }
    return null;
  }
  function pageByRoute(route) {
    var all = Content.pages.concat(Content.extraPages);
    for (var i = 0; i < all.length; i++) { if (all[i].route === route) { return all[i]; } }
    return null;
  }
  function artMeta(id) {
    for (var i = 0; i < Art.list.length; i++) { if (Art.list[i].id === id) { return Art.list[i]; } }
    return null;
  }
  function doneCount() { return Content.pages.filter(function (pg) { return store.done[pg.id]; }).length; }
  function nextPage() {
    for (var i = 0; i < Content.pages.length; i++) { if (!store.done[Content.pages[i].id]) { return Content.pages[i]; } }
    return null;
  }
  function todayText() {
    try { return new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return new Date().toDateString(); }
  }

  // ------------------------------------------------------------------ navigation
  function buildNav(current) {
    nav.innerHTML = '';
    Content.pages.forEach(function (pg) {
      var a = doc.createElement('a');
      a.href = '#/' + pg.route;
      a.textContent = pg.nav;
      if (store.done[pg.id]) { a.className = 'done'; a.setAttribute('aria-label', pg.nav + ' (completed)'); }
      if (current === pg.id) { a.setAttribute('aria-current', 'page'); }
      nav.appendChild(a);
    });
  }
  var toggle = $('.menu-toggle');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });
  // in-page links like #g-plan or #main: scroll instead of routing
  doc.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) { return; }
    var href = a.getAttribute('href');
    if (href.indexOf('#/') === 0 || href === '#') { return; }
    var target = doc.getElementById(href.slice(1));
    if (target) {
      e.preventDefault();
      if (!target.hasAttribute('tabindex')) { target.setAttribute('tabindex', '-1'); }
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    }
  });

  // ------------------------------------------------------------------ hydrating placeholders
  function figure(id, opts) {
    var meta = artMeta(id);
    if (!meta) { return '<p class="box warning">Missing picture: ' + esc(id) + '</p>'; }
    var svg = Art.render(id, opts || {});
    return '<figure class="art"><div class="art-svg">' + svg + '</div><figcaption><span>' + esc(meta.title) +
      '</span><a href="images/' + esc(meta.file) + '" target="_blank" rel="noopener">Open picture \u2197</a></figcaption></figure>';
  }
  function hydrate(ctx) {
    $$('[data-art]', ctx).forEach(function (el) { el.outerHTML = figure(el.getAttribute('data-art')); });
    $$('[data-predict]', ctx).forEach(renderPredict);
    $$('[data-notebook]', ctx).forEach(renderNotebook);
    $$('[data-chart]', ctx).forEach(function (el) { updateChart(el.getAttribute('data-chart')); });
    $$('[data-notes]', ctx).forEach(renderNotes);
    $$('[data-checklist]', ctx).forEach(renderChecklist);
    $$('[data-promise]', ctx).forEach(renderPromise);
    $$('[data-sim]', ctx).forEach(function (el) { Sims.mount(el.getAttribute('data-sim'), el); });
  }
  function renderPredict(el) {
    var key = el.getAttribute('data-predict');
    var opts = (el.getAttribute('data-options') || 'Yes|No').split('|');
    el.className = 'choice-row';
    el.setAttribute('role', 'group');
    opts.forEach(function (o) {
      var b = doc.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.textContent = o;
      b.setAttribute('aria-pressed', String(store.predict[key] === o));
      b.addEventListener('click', function () {
        store.predict[key] = o; save();
        $$('.chip', el).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      });
      el.appendChild(b);
    });
  }
  function renderNotebook(el) {
    var key = el.getAttribute('data-notebook'), nb = Content.notebooks[key];
    if (!nb) { return; }
    var data = store.nb[key] || (store.nb[key] = {});
    var h = '<div class="table-wrap"><table class="notebook"><caption>\uD83D\uDCD3 ' + esc(nb.caption) + '</caption><thead><tr>';
    nb.cols.forEach(function (c) { h += '<th scope="col">' + esc(c.label) + '</th>'; });
    h += '</tr></thead><tbody>';
    nb.rows.forEach(function (row, r) {
      var editable = /:$/.test(row);
      h += '<tr>' + (editable
        ? '<th scope="row"><input type="text" data-k="' + r + '_0" aria-label="' + esc(row) + '" placeholder="' + esc(row) + '" value="' + esc(data[r + '_0']) + '"></th>'
        : '<th scope="row">' + esc(row) + '</th>');
      for (var c = 1; c < nb.cols.length; c++) {
        var col = nb.cols[c], k = r + '_' + c, v = data[k], label = esc(row + ': ' + col.label);
        if (col.type === 'select') {
          h += '<td><select data-k="' + k + '" aria-label="' + label + '">' + col.options.map(function (o) {
            return '<option' + (v === o ? ' selected' : '') + '>' + esc(o) + '</option>';
          }).join('') + '</select></td>';
        } else if (col.type === 'number') {
          h += '<td><input type="number" min="0" max="999" inputmode="numeric" data-k="' + k + '" aria-label="' + label + '" value="' + esc(v) + '"></td>';
        } else {
          h += '<td><input type="text" data-k="' + k + '" aria-label="' + label + '" value="' + esc(v) + '"></td>';
        }
      }
      h += '</tr>';
    });
    h += '</tbody></table></div><p class="saved-note" aria-live="polite"></p>';
    el.innerHTML = h;
    var note = $('.saved-note', el), timer = null;
    function onChange(e) {
      var k = e.target.getAttribute('data-k');
      if (!k) { return; }
      data[k] = e.target.value; save();
      updateChart(key);
      note.textContent = 'Saved \u2714';
      clearTimeout(timer);
      timer = setTimeout(function () { note.textContent = ''; }, 1500);
    }
    el.addEventListener('input', onChange);
    el.addEventListener('change', onChange);
  }
  function updateChart(key) {
    var nb = Content.notebooks[key];
    if (!nb) { return; }
    var colIdx = -1;
    nb.cols.forEach(function (c, i) { if (c.chart) { colIdx = i; } });
    if (colIdx < 0) { return; }
    var data = store.nb[key] || {};
    var vals = nb.rows.map(function (row, r) { var n = parseFloat(data[r + '_' + colIdx]); return isFinite(n) && n >= 0 ? n : null; });
    var max = Math.max.apply(null, [10].concat(vals.filter(function (v) { return v !== null; })));
    $$('[data-chart="' + key + '"]').forEach(function (el) {
      var labels = nb.short || nb.rows;
      el.className = 'chart';
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', 'Bar chart: ' + labels.map(function (l, i) { return l + ' = ' + (vals[i] === null ? 'not yet' : vals[i]); }).join(', '));
      el.innerHTML = labels.map(function (l, i) {
        var v = vals[i], hPct = v === null ? 0 : Math.max(2, Math.round(v / max * 100));
        return '<div class="bar-col"><span class="bar-val">' + (v === null ? '' : esc(v)) + '</span><span class="bar" style="height:' + hPct +
          '%"></span><span class="bar-lbl">' + esc(l) + '</span></div>';
      }).join('');
    });
  }
  function renderNotes(el) {
    var key = el.getAttribute('data-notes'), label = el.getAttribute('data-label') || 'My notes';
    var id = 'notes-' + key;
    el.innerHTML = '<label class="q-label" for="' + esc(id) + '">' + esc(label) + '</label><textarea class="notes" id="' + esc(id) + '"></textarea><p class="saved-note" aria-live="polite"></p>';
    var ta = $('textarea', el), note = $('.saved-note', el), timer = null;
    ta.value = store.notes[key] || '';
    ta.addEventListener('input', function () {
      store.notes[key] = ta.value; save();
      note.textContent = 'Saved \u2714';
      clearTimeout(timer);
      timer = setTimeout(function () { note.textContent = ''; }, 1500);
    });
  }
  function renderChecklist(el) {
    var key = el.getAttribute('data-checklist'), items = Content.checklists[key] || [];
    var state = store.check[key] || (store.check[key] = []);
    var ul = doc.createElement('ul');
    ul.className = 'checklist';
    items.forEach(function (it, i) {
      var li = doc.createElement('li'), lab = doc.createElement('label'), cb = doc.createElement('input'), span = doc.createElement('span');
      cb.type = 'checkbox';
      cb.checked = !!state[i];
      cb.addEventListener('change', function () { state[i] = cb.checked; save(); });
      span.textContent = it;
      lab.appendChild(cb); lab.appendChild(span); li.appendChild(lab); ul.appendChild(li);
    });
    el.innerHTML = '';
    el.appendChild(ul);
  }
  function renderPromise(el) {
    var pr = store.promise || {};
    el.innerHTML = '<p>I promise to follow the safety rules, to work with a grown-up, and to use only the 6-volt battery.</p>' +
      '<p class="promise-banner"><label for="promise-name"><strong>My name:</strong></label> <input id="promise-name" type="text" autocomplete="given-name" maxlength="40"></p>' +
      '<ul class="checklist"><li><label><input type="checkbox" id="promise-ok"> <span>I promise!</span></label></li></ul><p class="saved-note" aria-live="polite"></p>';
    var name = $('#promise-name', el), ok = $('#promise-ok', el), note = $('.saved-note', el);
    name.value = pr.name || '';
    ok.checked = !!pr.signed;
    function update() {
      store.promise = { name: name.value.trim(), signed: ok.checked };
      if (ok.checked) { store.done.safety = true; } else { delete store.done.safety; }
      save();
      buildNav('safety');
      syncDoneRow('safety');
      note.textContent = ok.checked ? 'Promise signed. Welcome to the lab' + (store.promise.name ? ', ' + store.promise.name : '') + '!' : '';
    }
    name.addEventListener('input', update);
    ok.addEventListener('change', update);
  }

  // ------------------------------------------------------------------ pages
  function head(pg, extra) {
    return '<header class="page-head" style="--mc:' + pg.color + '"><span class="kicker">' + esc(pg.kicker) + '</span>' +
      '<h1 tabindex="-1"><span aria-hidden="true">' + pg.icon + '</span> ' + esc(pg.title) + '</h1>' +
      (pg.sub ? '<p>' + esc(pg.sub) + '</p>' : '') + (extra || '') + '</header>';
  }
  function pager(pg) {
    var i = Content.pages.indexOf(pg), prev = Content.pages[i - 1], next = Content.pages[i + 1];
    return '<nav class="pager" aria-label="Mission pages">' +
      (prev ? '<a class="btn" style="--mc:' + prev.color + '" href="#/' + prev.route + '">\u2190 ' + esc(prev.nav) + '</a>' : '<a class="btn" href="#/">\u2190 Home</a>') +
      '<button type="button" class="btn no-print" data-print>Print this page</button>' +
      (next ? '<a class="btn primary" style="--mc:' + next.color + '" href="#/' + next.route + '">' + esc(next.nav) + ' \u2192</a>' : '<a class="btn primary" href="#/certificate">Certificate \u2192</a>') +
      '</nav>';
  }
  function doneRow(pg) {
    if (pg.id === 'quiz') { return ''; }
    if (pg.id === 'safety') {
      return '<div class="done-row" data-done-row="safety"><p>Sign the Scientist\u2019s Promise above to complete Mission 0.</p></div>';
    }
    return '<div class="done-row" data-done-row="' + pg.id + '"><p></p><button type="button" class="btn primary" style="--mc:#16a34a" data-done="' + pg.id + '"></button></div>';
  }
  function syncDoneRow(id) {
    var row = $('[data-done-row="' + id + '"]');
    if (!row) { return; }
    var isDone = !!store.done[id], btn = $('[data-done]', row), p = $('p', row);
    if (id === 'safety') {
      p.textContent = isDone ? '\u2705 Promise signed: Mission 0 complete!' : 'Sign the Scientist\u2019s Promise above to complete Mission 0.';
      return;
    }
    p.textContent = isDone ? '\u2705 Mission complete! ' + doneCount() + ' of ' + Content.pages.length + ' done.' : 'Finished the experiment and filled in your notebook?';
    btn.textContent = isDone ? 'Undo' : 'Mission complete!';
    btn.classList.toggle('primary', !isDone);
  }
  function wireCommon(pg) {
    $$('[data-print]').forEach(function (b) { b.addEventListener('click', function () { root.print(); }); });
    $$('[data-done]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-done');
        if (store.done[id]) { delete store.done[id]; } else { store.done[id] = true; }
        save();
        buildNav(pg.id);
        syncDoneRow(id);
      });
    });
    if (pg) { syncDoneRow(pg.id); }
  }

  function renderHome() {
    var n = doneCount(), total = Content.pages.length, next = nextPage();
    var h = '<div class="hero">' + Art.render('cover') + '</div>';
    h += '<h1 class="center" tabindex="-1">Ready, young scientist?</h1>';
    h += Content.home;
    h += '<div class="box observe"><p class="box-title"><span class="ico" aria-hidden="true">⭐</span> Your progress: ' + n + ' of ' + total + ' done</p>' +
      '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + n + '" aria-label="Missions completed"><span style="width:' + Math.round(n / total * 100) + '%"></span></div></div>';
    h += '<div class="hero-actions">' + (next
      ? '<a class="btn primary big" href="#/' + next.route + '">' + (n ? 'Carry on: ' + esc(next.nav) : 'Start the adventure') + ' \u2192</a>'
      : '<a class="btn primary big" href="#/certificate">See your certificate \uD83D\uDCDC</a>') +
      '<a class="btn big" href="#/grown-ups">For grown-ups</a></div>';
    h += '<h2>The adventure map</h2><ol class="map">';
    Content.pages.forEach(function (pg) {
      var d = !!store.done[pg.id];
      h += '<li><a class="mission-card' + (d ? ' is-done' : '') + '" style="--mc:' + pg.color + '" href="#/' + pg.route + '">' +
        '<span class="mc-icon" aria-hidden="true">' + pg.icon + '</span><span class="mc-kicker">' + esc(pg.kicker) + '</span>' +
        '<span class="mc-title">' + esc(pg.title) + '</span><span class="mc-sub">' + esc(pg.sub) + '</span>' +
        '<span class="mc-state">' + (d ? '\u2705 Done' : 'Not started yet') + '</span></a></li>';
    });
    h += '</ol>';
    main.innerHTML = h;
  }

  function renderContentPage(pg) {
    var body = Content.bodies[pg.id];
    var h = head(pg);
    var needsPromise = /^m[1-5]$/.test(pg.id) && !store.done.safety;
    if (needsPromise) {
      h += '<div class="box warning no-print"><p class="box-title"><span class="ico" aria-hidden="true">🦺</span> Safety first!</p><p>Have you done <a href="#/mission/0">Mission 0: Safety</a> and signed the Scientist\u2019s Promise? Do that before any experiment with the battery.</p></div>';
    }
    h += '<div class="page-body" style="--mc:' + pg.color + '">' + body + '</div>';
    h += doneRow(pg) + pager(pg);
    main.innerHTML = h;
    hydrate(main);
    wireCommon(pg);
  }

  function renderQuiz(pg) {
    var qs = Content.quiz, ans = store.quiz.answers || (store.quiz.answers = {});
    var h = head(pg) + '<p class="lead">Tap the answer you think is right. You\u2019ll find out straight away, with a little explanation.</p>';
    qs.forEach(function (q, i) {
      h += '<section class="quiz-q" data-q="' + i + '"><h3>' + (i + 1) + '. ' + esc(q.q) + '</h3><div class="choices">' +
        q.a.map(function (a, j) { return '<button type="button" data-a="' + j + '">' + esc(a) + '</button>'; }).join('') +
        '</div><p class="explain" hidden></p></section>';
    });
    h += '<div class="box observe score-box" aria-live="polite"></div>';
    h += '<p class="center"><button type="button" class="btn" data-reset-quiz>Start the quiz again</button></p>';
    h += pager(pg);
    main.innerHTML = h;
    function showQ(i) {
      var sec = $('[data-q="' + i + '"]'), q = qs[i], chosen = ans[i];
      if (chosen === undefined) { return; }
      $$('button', sec).forEach(function (b) {
        var j = Number(b.getAttribute('data-a'));
        b.disabled = true;
        if (j === q.c) { b.classList.add('correct'); }
        if (j === chosen && j !== q.c) { b.classList.add('wrong'); }
      });
      var ex = $('.explain', sec);
      ex.hidden = false;
      ex.textContent = (chosen === q.c ? '\u2714 Correct! ' : '\u2718 Not quite. ') + q.e;
    }
    function score() {
      var answered = Object.keys(ans).length, right = 0;
      Object.keys(ans).forEach(function (k) { if (ans[k] === qs[k].c) { right++; } });
      var box = $('.score-box');
      if (answered < qs.length) {
        box.innerHTML = 'Answered ' + answered + ' of ' + qs.length + '. Keep going!';
      } else {
        store.quiz.score = right;
        store.quiz.best = Math.max(store.quiz.best || 0, right);
        store.done.quiz = true;
        save();
        buildNav('quiz');
        var words = right === qs.length ? 'Perfect score! You are an electromagnetism expert!' : (right >= 9 ? 'Brilliant work!' : (right >= 6 ? 'Good job! Check the explanations for the ones you missed.' : 'Nice try! Read the explanations and have another go.'));
        box.innerHTML = '<span class="big-score">' + right + ' / ' + qs.length + '</span>' + esc(words) +
          '<p style="margin-top:1rem"><a class="btn primary big" href="#/certificate">Get your certificate \uD83D\uDCDC</a></p>';
      }
    }
    $$('.quiz-q').forEach(function (sec) {
      var i = Number(sec.getAttribute('data-q'));
      $$('button', sec).forEach(function (b) {
        b.addEventListener('click', function () {
          if (ans[i] !== undefined) { return; }
          ans[i] = Number(b.getAttribute('data-a')); save();
          showQ(i); score();
        });
      });
      showQ(i);
    });
    score();
    $('[data-reset-quiz]').addEventListener('click', function () {
      store.quiz.answers = {}; delete store.done.quiz; save();
      buildNav('quiz'); renderQuiz(pg); focusHeading();
    });
    wireCommon(null);
  }

  function renderCertificate(pg) {
    var cert = store.cert || {};
    var name = cert.name || (store.promise && store.promise.name) || '';
    var date = cert.date || todayText();
    var h = head(pg);
    if (!store.done.quiz) {
      h += '<div class="box tip no-print"><p>Your certificate is waiting! It\u2019s even better after the <a href="#/quiz">Big Quiz</a>, because your score goes on it.</p></div>';
    }
    h += '<div class="cert-form no-print"><label>Scientist\u2019s name<input type="text" id="cert-name" maxlength="40"></label>' +
      '<label>Date<input type="text" id="cert-date" maxlength="40"></label>' +
      '<button type="button" class="btn primary" id="cert-print">Print</button><button type="button" class="btn" id="cert-dl">Download picture</button></div>';
    h += '<div class="cert-wrap" id="cert-art"></div>';
    main.innerHTML = h;
    var nameIn = $('#cert-name'), dateIn = $('#cert-date'), art = $('#cert-art');
    nameIn.value = name; dateIn.value = date;
    function draw() {
      var score = store.done.quiz && typeof store.quiz.score === 'number' ? 'Big Quiz score: ' + store.quiz.score + ' out of ' + Content.quiz.length : '';
      art.innerHTML = Art.render('certificate', { name: nameIn.value.trim(), date: dateIn.value.trim(), score: score });
    }
    function saveCert() { store.cert = { name: nameIn.value.trim(), date: dateIn.value.trim() }; save(); draw(); }
    nameIn.addEventListener('input', saveCert);
    dateIn.addEventListener('input', saveCert);
    $('#cert-print').addEventListener('click', function () { root.print(); });
    $('#cert-dl').addEventListener('click', function () {
      var blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>\n' + art.innerHTML], { type: 'image/svg+xml' });
      var url = URL.createObjectURL(blob), a = doc.createElement('a');
      a.href = url; a.download = 'electromagnetism-certificate.svg';
      doc.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    });
    draw();
  }

  function renderGlossary(pg) {
    var h = head(pg) + '<p class="lead">All the science words from the adventure, in one place.</p><dl class="glossary">';
    Content.glossary.forEach(function (g) { h += '<dt>' + esc(g[0]) + '</dt><dd>' + esc(g[1]) + '</dd>'; });
    h += '</dl>';
    main.innerHTML = h;
  }

  function renderGallery(pg) {
    var h = head(pg) + '<p class="lead">Every illustration and circuit diagram is also saved as its own file in the <code>images</code> folder. Open one to print it or share it.</p>';
    [['Illustrations', 'illustration'], ['Circuit diagrams (schematics)', 'schematic']].forEach(function (grp) {
      h += '<h2>' + grp[0] + '</h2><div class="gallery">';
      Art.list.forEach(function (it) {
        if (it.kind !== grp[1]) { return; }
        h += figure(it.id);
      });
      h += '</div>';
    });
    main.innerHTML = h;
  }

  function renderGrownUps(pg) {
    var h = head(pg) + Content.grownUps +
      '<div class="box warning no-print"><p class="box-title">Saved answers</p><p>Notebook answers, guesses and progress are saved in this browser on this computer only. Nothing is sent anywhere.</p>' +
      '<button type="button" class="btn danger" id="reset-all">Clear everything saved on this computer</button></div>';
    main.innerHTML = h;
    $('#reset-all').addEventListener('click', function () {
      if (root.confirm('Clear all saved progress, notebook answers and quiz answers?')) {
        store = { done: {}, predict: {}, nb: {}, notes: {}, check: {}, quiz: {} };
        save(); buildNav('grown-ups');
        $('#reset-all').textContent = 'Cleared \u2714';
      }
    });
  }

  // ------------------------------------------------------------------ router
  function focusHeading() {
    var h1 = $('h1', main);
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  }
  function route() {
    var hash = root.location.hash || '#/';
    if (hash.indexOf('#/') !== 0) { return; }            // in-page anchors are handled by the click handler
    var r = hash.slice(2).replace(/\/+$/, '');
    doc.body.classList.remove('cert-page');
    var pg = r ? pageByRoute(r) : null;
    if (!r) {
      renderHome(); buildNav(null); doc.title = 'The Electromagnetism Adventure';
    } else if (!pg) {
      main.innerHTML = '<h1 tabindex="-1">Page not found</h1><p><a href="#/">Go back to the start</a></p>';
      buildNav(null);
    } else {
      buildNav(pg.id);
      if (Content.bodies[pg.id]) { renderContentPage(pg); }
      else if (pg.id === 'quiz') { renderQuiz(pg); }
      else if (pg.id === 'certificate') { doc.body.classList.add('cert-page'); renderCertificate(pg); }
      else if (pg.id === 'glossary') { renderGlossary(pg); }
      else if (pg.id === 'gallery') { renderGallery(pg); }
      else if (pg.id === 'grown-ups') { renderGrownUps(pg); }
      doc.title = pg.title + ' \u00B7 Electromagnetism Adventure';
    }
    root.scrollTo(0, 0);
    focusHeading();
  }
  root.addEventListener('hashchange', route);
  route();
}(typeof self !== 'undefined' ? self : this));
