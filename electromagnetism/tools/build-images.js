#!/usr/bin/env node
/*
 * Exports every illustration and circuit diagram to images/*.svg.
 *
 *   node tools/build-images.js          -> SVG files
 *   node tools/build-images.js --png    -> SVG files + PNG copies in images/png (uses Microsoft Edge or Chrome, headless)
 *   node tools/build-images.js --png kit oersted   -> only those scene ids
 */
'use strict';
var fs = require('fs');
var path = require('path');
var os = require('os');
var cp = require('child_process');

var root = path.resolve(__dirname, '..');
var Art = require(path.join(root, 'js', 'art.js'));
['scenes.js', 'scenes2.js', 'schematics.js'].forEach(function (f) {
  var file = path.join(root, 'js', f);
  if (fs.existsSync(file)) { require(file); }
});

var args = process.argv.slice(2);
var wantPng = args.indexOf('--png') !== -1;
var only = args.filter(function (a) { return a.indexOf('--') !== 0; });

var outDir = path.join(root, 'images');
var pngDir = path.join(outDir, 'png');
fs.mkdirSync(outDir, { recursive: true });

function findBrowser() {
  var candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  ];
  for (var i = 0; i < candidates.length; i++) { if (fs.existsSync(candidates[i])) { return candidates[i]; } }
  return null;
}

var browser = wantPng ? findBrowser() : null;
if (wantPng && !browser) { console.warn('No Edge/Chrome found: skipping PNG export.'); }
if (browser) { fs.mkdirSync(pngDir, { recursive: true }); }
var profile = browser ? fs.mkdtempSync(path.join(os.tmpdir(), 'ema-edge-')) : null;

var count = 0;
Art.list.forEach(function (item) {
  if (only.length && only.indexOf(item.id) === -1) { return; }
  var svg = Art.render(item.id);
  var svgPath = path.join(outDir, item.file);
  fs.writeFileSync(svgPath, '<?xml version="1.0" encoding="UTF-8"?>\n' + svg + '\n', 'utf8');
  count++;
  if (browser) {
    var m = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
    var w = m ? m[1] : 1200, h = m ? m[2] : 800;
    var pngPath = path.join(pngDir, item.file.replace(/\.svg$/, '.png'));
    var url = 'file:///' + svgPath.replace(/\\/g, '/');
    cp.spawnSync(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
      '--user-data-dir=' + profile, '--window-size=' + w + ',' + h, '--screenshot=' + pngPath, url], { stdio: 'ignore', timeout: 60000 });
    if (!fs.existsSync(pngPath)) { console.warn('PNG failed for ' + item.file); }
  }
  console.log('wrote ' + item.file);
});
if (profile) { try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* ignore */ } }
console.log(count + ' image(s) exported to ' + outDir);
