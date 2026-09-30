# Handoff: Electromagnetism Adventure

A kids' single-page app, plus pictures and circuit diagrams, that teaches electromagnetism with a home kit.

- Date: 2026-09-30
- Workspace: the repo root (locally `Documents\physics`; Windows, PowerShell 5.1). Paths below are relative to it.
- Project: `electromagnetism\`
- Written for: the next Kiro session (Claude Opus 5.5, Autopilot)

## TL;DR

- Built an offline SPA plus 18 printable SVG/PNG pictures and circuit diagrams. They teach a 10-year-old two things, using the kit in `media\IMG_2697.jpeg`:
  - a current in a coil makes a magnet
  - a moving magnet makes electricity
- It runs today: open `electromagnetism\index.html`. No build step, no dependencies, and it works from `file://`.
- Published:
  - code at https://github.com/bedinparsi/kids-electromagnetism (public, `main`)
  - site at https://kids-electromagnetism.vercel.app
  - Vercel isn't auto-deploying from GitHub yet (see section 2)
- Tasks 1–6 and publishing are done. Headless Edge checks pass locally and on the live site: all 15 routes load with 0 JS errors. All 6 simulators behave correctly (checked locally).
- Still to do (section 7): a visual re-check of 6 pictures, simulator polish, README, print test, connecting Vercel to GitHub, and deleting `.tmp-test\`.

## 1. User and request

- The user is a parent teaching their 10-year-old. Kit in the photo:
  - a 6 V spring-top lantern battery (probably a VARTA 4R25X "430"; confirm from the photo)
  - 6 m of red PVC-insulated copper wire
  - 2 grey ceramic (ferrite) block magnets (drawn as 48 mm long)
  - a red horseshoe magnet with silver tips
- The original request is cut off in chat history: "create series of images, schemas, and documentation that a 10year-o[ld can understand]". Follow-up: "We still need the SPA, the schematics, the educational part, etc."
- Preferences:
  - Work through to the end without pausing ("please continue. do not stop").
  - When asked "are you done?", give a plain status.
  - Handoffs go in `physics\handoffs\`.

## 2. Run, rebuild, test (cwd = `electromagnetism\`)

| What | Command |
|---|---|
| Open the app | `Invoke-Item .\index.html`, or double-click it (Edge or Chrome) |
| Optional local server (long-running, so the user starts it) | `python -m http.server 8000 --bind 127.0.0.1`, then open http://127.0.0.1:8000 |
| Re-export pictures | `node tools/build-images.js` for SVG only. `node tools/build-images.js --png [scene-ids...]` also writes `images\png\*.png` via headless Edge |
| Syntax check | `node --check js\sims.js` (works on any file) |
| Test harness (temporary) | `node .tmp-test/cdp-test.js [routes] [full] [sims] [quiz] [mobile]`. With no args it runs routes, sims, quiz and mobile. `routes full` adds full-page shots. Output goes to `.tmp-test\shots\*.png` |

- Progress is saved in the browser's localStorage under the key `electromagnetism-adventure-v1`, on this computer only.
- The harness drives Edge over CDP on port 9333 with a throwaway profile, so it never touches the user's saved progress.
- To point the harness at the live site: `$env:BASE_URL='https://kids-electromagnetism.vercel.app/'; node .tmp-test/cdp-test.js routes`.

### Git and deployment

- **Repo:** https://github.com/bedinparsi/kids-electromagnetism (public), branch `main`.
  - The workspace root is the repo root.
  - The first commit is the user's own (`README.md` plus a Node `.gitignore`). The site commit sits on top of it.
- **Kept out of git** (via `.gitignore`):
  - `media/`: the iPhone photo contains GPS location data. Never commit it.
  - `electromagnetism/.tmp-test/`
  - `.vercel/`
- **Vercel project:** `bedinparsis-projects/kids-electromagnetism`, live at https://kids-electromagnetism.vercel.app.
  - The root `vercel.json` sets framework Other, no build step, and `outputDirectory: "electromagnetism"`.
  - `.vercelignore` keeps CLI uploads the same as the repo.
  - Checked: `/`, CSS, JS and images return 200. `/handoffs/…`, `/media/…`, `/.tmp-test/…` and `/vercel.json` return 404.
- **Redeploy** from the repo root: `cmd /c "vercel.cmd deploy --prod --yes --no-color < NUL 2>&1"`.
  - Always feed stdin from `NUL`. Otherwise the CLI can hang waiting on a prompt; `vercel project ls` did once.
  - CLI v53.1.1, logged in as `bedinparsi`. Its default scope has one other project, `ai-deep-dive`; leave it alone.
- **GitHub isn't connected to Vercel yet.** `vercel git connect` fails, most likely because the Vercel GitHub App has no access to this new repo.
  - The user has to grant access: GitHub → Settings → Applications → Installed GitHub Apps → Vercel → Configure → Repository access → add `kids-electromagnetism`.
  - Then run `cmd /c "vercel.cmd git connect --no-color < NUL 2>&1"`, or use Vercel dashboard → Project → Settings → Git.
  - Until then, every change needs commit, push, and a CLI redeploy.

## 3. Task status

| # | Task | Status |
|---|---|---|
| 1 | SVG art library and 18 scenes (`js/art.js`, `scenes.js`, `scenes2.js`, `schematics.js`) | Done |
| 2 | Export tool `tools/build-images.js` and visual review | Done. All 18 were re-exported at the end of the session; 6 still need a look (section 6) |
| 3 | SPA shell: `index.html` and `css/styles.css` | Done |
| 4 | All the words, in `js/content.js`: missions, grown-ups guide, quiz, glossary | Done |
| 5 | 6 simulators in `js/sims.js` | Done |
| 6 | App logic in `js/app.js`: router, saving, quiz, certificate | Done |
| 7 | Verification in headless Edge | Functional checks done. Visual polish and print not done |
| 8 | `README.md`, and deleting temp files | Not started |
| 9 | Publish: push to GitHub and deploy to Vercel | Done: commit `b0026af` pushed and the site is live. Vercel auto-deploy from GitHub is not connected yet |

## 4. File map

```
physics/                           git repo root = Vercel project root
  README.md                        the user's (from GitHub): extend it, keep their text
  vercel.json                      Vercel: framework Other, outputDirectory "electromagnetism"
  .gitignore, .vercelignore        keep media/, .tmp-test/ and .vercel/ out of git and Vercel
  media/IMG_2697.jpeg              the user's kit photo (3.1 MB; has GPS data, so not in git)
  handoffs/                        this file
  electromagnetism/
    index.html            47 lines  SPA shell; loads 7 classic scripts in order
    css/styles.css       322        all styling: responsive, print, reduced motion
    js/art.js            534        drawing primitives + Art registry (UMD)
    js/scenes.js         318        scenes 01-05
    js/scenes2.js        439        scenes 06-11, cover (00), certificate (12)
    js/schematics.js     182        circuit diagrams 13-17
    js/content.js        583        window.Content: every word the child reads
    js/sims.js           665        window.Sims: 6 simulators
    js/app.js            477        router, rendering, saving, quiz, certificate
    tools/build-images.js  66       exports images/*.svg (+ png/)
    images/                         18 SVGs (00-17) + png/ (18 PNGs): a static export
    .tmp-test/                      TEMPORARY, git-ignored: cdp-test.js (214 lines) + shots/ (12 PNGs)
```

Reading strategy: don't re-read whole files. Use `grep_search` for the id you need (a scene id such as `'em-build'`, `sims.generator =`, or a notebook key), then `read_file` with `offset`/`limit`. To check a picture, export it with `--png` and open the PNG with `read_file`.

## 5. Architecture and contracts

Invariants (keep these):
- **Works from `file://`.** Use classic `<script>` tags only, in this order: art → scenes → scenes2 → schematics → content → sims → app. No ES modules, and no fetching local files.
- **Pictures render inline.** The app draws every picture from JS. `images\` is only a static export for printing and sharing; the gallery and the "Open picture" links point there.
- **Zero dependencies.** There is no `package.json`. Node is only used by the export tool and the test harness.
- **No SVG ids.** SVG output has no `id`s, `<defs>`, gradients or markers (arrowheads are polygons), so many SVGs can share one page.
- **Code style.** ES5 (`var`, `function`) everywhere except `content.js`, which uses template literals.

**Art** (`js/art.js`; exposed as `window.Art` or `module.exports`)
- API:
  - `Art.define(id, meta, fn)`, with meta = `{file, title, alt, color, badge, kind: 'illustration'|'schematic', titleSize}`
  - `Art.render(id, opts)` returns an SVG string
  - `Art.list` is `[{id, file, title, alt, kind}]`; `Art.has(id)` checks for an id
- Framing: scene files wrap their bodies with `p.frame(meta, body)`. That gives a 1200×800 SVG with a coloured title bar at y 0–96, a white badge pill and a footer. Panels start at y≈112 with 40 px side margins.
- Text: `p.T(x, y, 'text' | ['line', '', 'line'], {size, weight, anchor, fill, lh, base, italic})`. `**bold**` becomes a bold tspan, and `''` is a blank line.
- Primitives live in `Art.p` and return SVG strings unless noted:
  - Kit parts: `battery(x,y,s,o)`, `compass(cx,cy,r,deg,{letters,needleClass})`, `barMagnet`, `barMagnetV`, `block3D(x,y,s,topPole)`, `horseshoe`, `horseshoeC` (lying on its side), `nail`, `coil(x1,y1,x2,y2,n,{ry,w})`, `donut(cx,cy,rx,ry,n,{part:'all'|'back'|'front', spread, tape})`, `clip`, `tape`, `can`, `pencil`, `scissors`
    - `battery` returns `{svg, neg, pos, posMid}`; the centre terminal is − and the corner spring is +
    - `coil` returns `{back, front}`
  - Drawing helpers: `wire(d,{w})`, `copper`, `electron`, `arrow`, `curve`, `wireRings`, `domArrow`, `sinePath`, `panel`, `badge`, `signBadge`, `bolt`, `timer`
  - Schematic symbols: `sLine`, `sBatteryV`, `sSwitchH`, `sCoilH(x1,y,x2,n,core)`, `sMeter`, `sDot`
- Palette `p.C`:
  - north `#E53935` (red), south `#1E6FD9` (blue), field `#7C3AED`
  - wire `#D61F4F`, copper `#C87533`, current `#F59E0B`, electron `#FACC15`

| Scene id | File | Used on |
|---|---|---|
| cover | 00-cover.svg (1200×420, no frame) | home |
| kit | 01-meet-your-kit.svg | #/kit |
| safety | 02-safety-rules.svg | #/mission/0 |
| magnets | 03-magnet-basics.svg | #/mission/1 |
| electricity, oersted | 04-what-is-electricity.svg, 05-oersted-setup.svg | #/mission/2 |
| em-build, em-how | 06-build-electromagnet.svg, 07-how-electromagnets-work.svg | #/mission/3 |
| gen-build, gen-how | 08-build-generator.svg, 09-how-generators-work.svg | #/mission/4 |
| jumping-wire | 10-jumping-wire.svg | #/mission/5 |
| big-idea | 11-the-big-idea.svg | #/big-idea |
| certificate | 12-certificate.svg (1200×848, opts `{name, date, score}`) | #/certificate |
| schem-symbols | 13-circuit-symbols.svg | #/schematics |
| schem-oersted, schem-electromagnet, schem-generator, schem-motor | 14-circuit-mission2 … 17-circuit-bonus | missions 2 to 5 and #/schematics |

**Content** (`window.Content`)
- `pages`, in nav order:
  - kit `#/kit`
  - safety `#/mission/0`
  - m1 to m5: `#/mission/1` to `#/mission/5`
  - schematics
  - big `#/big-idea`
  - quiz
- `extraPages`: certificate, glossary, gallery, grown-ups.
- A mission page runs in this order: Goal → You need → Make a guess → picture → numbered steps → lab notebook → simulator → Why? → history / real life → circuit diagram.
- `bodies[id]` is HTML with placeholders that app.js fills in:
  - `data-art="id"` and `data-sim="id"`
  - `data-predict="key" data-options="A|B"`
  - `data-notebook="key"`
  - `data-chart="key"`, which draws bars from the notebook column marked `chart: true`
  - `data-notes="key" data-label="…"`
  - `data-checklist="key"` and `data-promise`
- Notebook definition: `{caption, cols: [{label, type: 'select'|'number'|'text', options, chart}], rows, short}`. A row label ending in `:` becomes an editable cell. The keys are m1-sticks, m1-strength, m2-results, m3-turns (charted), m4-results and m5-results.
- Also in Content:
  - `glossary` (25 terms)
  - `checklists.kit` (10 items)
  - `quiz` (12 questions, each `{q, a[4], c, e}`)
  - `grownUps`, an HTML page with a session plan, preparation, safety, expected results per mission, the physics with formulas, troubleshooting, and ideas for going further

**App** (`js/app.js`)
- Routes: `#/` (home) plus each page's `route`. Anything else shows "Page not found". Plain `#anchor` links scroll within the page; the grown-ups contents list uses them.
- Saved state in localStorage `electromagnetism-adventure-v1`:
  ```
  { done, predict, nb: {key: {'row_col': v}}, notes, check,
    quiz: {answers, score, best}, promise: {name, signed}, cert: {name, date} }
  ```
- Completion rules:
  - Mission 0 completes when the promise box is ticked. Until then, missions 1 to 5 show a "Safety first" banner.
  - Other pages use a "Mission complete!" toggle.
  - The quiz completes itself once all 12 questions are answered.
  - The nav marks finished pages with ✓. Home shows a progress bar and a "Carry on" button.
- Certificate:
  - Name and date inputs, prefilled from the promise and today's date, plus the quiz score.
  - Print and Download SVG buttons. `body.cert-page` makes only the certificate print.
- The grown-ups page has a "Clear everything saved on this computer" button.

**Sims** (`js/sims.js`; mounted with `Sims.mount(id, el)`)
- The numbers are illustrative, and the UI says so.

| id | Page | Behaviour |
|---|---|---|
| magnets | M1 | Two bar magnets; flip either one. PULL/PUSH readout; optional field lines |
| sticks | M1 | Sort 10 objects into sticks / doesn't stick. Check shows explanations |
| oersted | M2 | Hold to connect; swap ends; wire over or under the compass. Damped needle; warning after 5 s |
| electromagnet | M3 | Turns 0/10/20/40/80; core nail, pencil or none; hold ON; swap wires. Clips = floor(30·(1−e^(−N·f/30))), with f = 1 for the nail and 0.01 otherwise. One clip stays stuck after switch-off at 40+ turns. Heat bar; the compass shows the tip's pole |
| generator | M4 | Drag the magnet (or use the buttons or arrow keys) through the donut. Flux ∝ 1/(1+(z/55)²)^1.5 and current ∝ −N·dΦ/dz·v. Needle plus a scrolling trace. Options: 5/10/20 turns, flip, two magnets, break the loop |
| motor | Bonus | Hold to connect; the swing kicks out or in. Swap wires, turn the magnet over, or remove it |

- Helpers:
  - `shell` and `button`
  - `holdButton`: pointer capture plus Space/Enter
  - `loop`: requestAnimationFrame; stops when the sim leaves the DOM
  - `Needle`: a damped spring

**CSS**
- Each mission's colour comes through `--mc`.
- Breakpoints at 900 px (hamburger menu) and 640 px.
- `prefers-reduced-motion` is supported.
- Print uses A4 and hides the nav, sims, pager and done-row.

## 6. What was verified

Tested in headless Edge 154 on `file://`, with `.tmp-test/cdp-test.js`.

**App**
- All 15 routes render with 0 exceptions or console errors, and every placeholder gets filled.
- The gallery shows 18 pictures.
- Signing the promise completes Mission 0.
- The quiz (11/12 in the test) shows the score box and the certificate link.
- Notebook entries save and drive the bar chart.
- At 390 px wide there's no horizontal overflow.

**Simulators**
- magnets: flipping one gives "S faces S … PUSH apart".
- sticks: 10/10 when answered correctly.
- oersted: holding swings the needle to −76° (west). Swapped, it swings east. Holding past 5 s shows the warning.
- electromagnet: 40 turns on the nail picks up 22 clips, with the point = S. On release one clip stays. The pencil picks up 0.
- generator:
  - push in kicks the needle left (−23°), and pull out kicks it right (+24°)
  - holding still shows "no electricity"
  - a broken loop gives no kick
  - mouse drag works
- motor: the swing kicks "out of the magnet", and with no magnet there's no kick.

**Pictures**
- PNG renders reviewed by eye: 01–11 and 13–16.
- The fixes made after review were confirmed for 14 and 16.

**Not verified yet**
- Pictures changed after their review but not looked at again: 01 (48 mm label), 05 (wire path), 06 (battery and clips).
- Pictures never opened as PNGs: 00-cover, 12-certificate and 17-circuit-bonus. They rendered without errors.
- Simulator screenshots (`.tmp-test\shots\sim-*.png` and `mobile-*.png`) were captured, but the polish pass wasn't finished.
- Printing, keyboard-only and touch use, Firefox and Safari, and screen readers.
- The last code change hasn't been re-run in the browser. `sims.oersted` now animates its dashes as conventional current, flowing north when not swapped, which matches the needle's west swing (SNOW rule). This was reasoned from `stroke-dashoffset` semantics, and `node --check` passes.

## 7. Remaining work, in order

1. **Re-check the pictures.** The export has already run, so just open `images\png\00-cover.png`, `01-meet-your-kit.png`, `05-oersted-setup.png`, `06-build-electromagnet.png`, `12-certificate.png` and `17-circuit-bonus.png` with `read_file`. Fix any overlaps, then re-export those ids.
2. **Polish the simulators.** Run `node .tmp-test/cdp-test.js sims mobile` and look at the PNGs in `.tmp-test\shots\`. Known cosmetic issues:
   - `sims.magnets`, with field lines on:
     - The lower loops peak around y 292 in a 280 px viewBox, so they get clipped, and they cross the ground line at y 230.
     - The upper loops overlap the PULL/PUSH arrows at y 110.
     - Fix: a taller viewBox (about 320) and/or smaller loops, then move the arrows.
   - `sims.oersted`: the dashed current line is drawn over the compass even when the wire is underneath. Dim it (opacity about 0.35) when `st.under` is set.
   - Confirm the dash direction: when not swapped, the dashes should move up the screen and the needle should swing left.
3. **Extend the root `README.md`.** It came from GitHub with the user's two-line description; keep their text and add to it. The README was in the agreed plan, and the user asked for documentation. Keep it short. Cover:
   - the live link, https://kids-electromagnetism.vercel.app
   - how to open the app: double-click, or the optional server with `--bind 127.0.0.1`
   - the folder map
   - printing: each page has a "Print this page" button, and the certificate prints on its own
   - how to regenerate the images
   - a 5-line summary for grown-ups with the safety headline: 6 V only, the 5-second rule, magnets away from pacemakers
4. **Test printing.** Use CDP `Page.printToPDF` on `#/mission/3` and `#/certificate`. Render the pages to PNG with PyMuPDF (`fitz` is installed) and look at them.
5. **Optional:** a keyboard-only pass (Tab to the hold buttons and press Space; the generator's arrow keys) and touch emulation.
6. **Connect Vercel to GitHub**, once the user has given the Vercel GitHub App access (section 2). Then check that a push to `main` starts a production deployment.
7. **Clean up.** Delete `electromagnetism\.tmp-test\` (the harness and screenshots). It's git-ignored, so this is local only.
   - Commit and push the finished work.
   - Redeploy if Git still isn't connected.
   - Give the user a short summary with the live link.

## 8. Gotchas

- **PowerShell 5.1:**
  - There's no `&&`, so use `;`.
  - `Set-Content -Encoding utf8` adds a BOM; Node tolerates it.
  - Use the tool's `cwd` parameter; never `cd`.
- **Smooth scrolling in tests:** the stylesheet sets `scroll-behavior: smooth`. In CDP tests, call `scrollIntoView({block:'center', behavior:'instant'})` before measuring or clicking, or the click lands mid-scroll. This caused false "not connected" results once.
- **Stale exports:** the app draws pictures live from JS, but `images\` is a static export. After editing any scene, run `node tools/build-images.js --png <ids>`. Schematics 14–17 went stale once this session; that's fixed.
- **Export speed:** the PNG export starts Edge once per image, which takes a few seconds each. Edge is at `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`.
- **Local server:** `python -m http.server` listens on every network interface unless you pass `--bind 127.0.0.1`.
- **Physics conventions:**
  - Diagrams use conventional current (+ → −).
  - The compass's red end is north-seeking, so S poles attract it.
  - SNOW rule: current flowing South→North Over the needle turns its north end West. With the wire underneath, the swing reverses.
- **Environment:**
  - Node v24.13.0 has global `fetch` and `WebSocket`, which the harness uses.
  - Python 3.14 is at `C:\Python314`. It has PIL, PyMuPDF (`fitz`) and pypdf, but not cairosvg or markdown.
- **Kiro:** `read_file` on a PNG shows the image, so use it for visual checks.

## 9. Facts checked on the web

- **Battery terminals:** on a 6 V spring-top lantern battery (4R25X/4LR25X, 115 × 68.2 × 68.2 mm), the corner terminal is + and the centre one is − ([batteryequivalents.com](https://batteryequivalents.com/6-volt-lantern-battery.html)). [goneoutdoors.com](https://goneoutdoors.com/install-lantern-battery-5655605.html) says the centred terminal is usually −. The app always tells the user to check the printed marks.
- **Sturgeon's electromagnet:**
  - Made in 1824 and shown in 1825. It weighed about 200 g and held about 4 kg ([Britannica](https://www.britannica.com/biography/William-Sturgeon)).
  - It had 18 turns of bare copper wire ([Wikipedia](https://en.wikipedia.org/wiki/William_Sturgeon)).
- **Dates:** Ørsted made his discovery in 1820 ([Linda Hall Library](https://www.lindahall.org/about/news/scientist-of-the-day/william-sturgeon/)), and Faraday made his in 1831.
- **Rough numbers in the grown-ups guide** (all labelled as estimates):
  - short-circuit current: 3–8 A
  - field 1 cm from a 5 A wire: about 100 µT, versus Earth's horizontal field of about 20 µT
  - induced voltage: about 10 mV
  - motor force: about 5 mN

## 10. Kickoff for the next session

In a new Kiro chat, attach this file (type `#File`, then pick `handoffs/2026-09-30-electromagnetism-adventure.md`) and send:

> Continue the Electromagnetism Adventure from this handoff. Work through section 7 in order, verify each step, then clean up and give me a short summary. Don't stop until it's all done.
