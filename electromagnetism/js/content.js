/*!
 * Electromagnetism Adventure - all the words.
 *
 * Page bodies are HTML strings. The app fills these placeholders:
 *   <div data-art="id"></div>              an illustration or circuit diagram from Art (js/scenes*.js)
 *   <div data-sim="id"></div>              an interactive simulator from js/sims.js
 *   <div data-predict="key" data-options="A|B|C"></div>   a "make a guess" button row (saved)
 *   <div data-notebook="key"></div>        a results table defined in Content.notebooks (saved)
 *   <div data-chart="key"></div>           a bar chart drawn from a notebook's number column
 *   <div data-notes="key"></div>           a free-text note box (saved)
 *   <div data-checklist="key"></div>       a tick list defined in Content.checklists (saved)
 */
(function (root) {
  'use strict';

  var pages = [
    { id: 'kit', route: 'kit', nav: 'Kit', kicker: 'Start here', title: 'Your Science Kit', icon: '🧰', color: '#0284c7', sub: 'Meet the things you will use' },
    { id: 'safety', route: 'mission/0', nav: 'Safety', kicker: 'Mission 0', title: 'Safety First', icon: '🦺', color: '#dc2626', sub: 'Eight rules every scientist follows' },
    { id: 'm1', route: 'mission/1', nav: 'Mission 1', kicker: 'Mission 1', title: 'Magnet Detective', icon: '🧲', color: '#7c3aed', sub: 'How do magnets push, pull and point?' },
    { id: 'm2', route: 'mission/2', nav: 'Mission 2', kicker: 'Mission 2', title: '\u00D8rsted\u2019s Surprise', icon: '🧭', color: '#0891b2', sub: 'Can electricity move a compass?' },
    { id: 'm3', route: 'mission/3', nav: 'Mission 3', kicker: 'Mission 3', title: 'Build an Electromagnet', icon: '🔩', color: '#2563eb', sub: 'Turn a nail into a magnet you can switch on and off' },
    { id: 'm4', route: 'mission/4', nav: 'Mission 4', kicker: 'Mission 4', title: 'Faraday\u2019s Challenge', icon: '⚡', color: '#16a34a', sub: 'Make electricity with a magnet, no battery!' },
    { id: 'm5', route: 'mission/5', nav: 'Bonus', kicker: 'Bonus mission', title: 'The Jumping Wire', icon: '🎢', color: '#db2777', sub: 'Make a wire move: the secret of motors' },
    { id: 'schematics', route: 'schematics', nav: 'Diagrams', kicker: 'Scientist drawings', title: 'Circuit Diagrams', icon: '📐', color: '#334155', sub: 'Read circuits like a real engineer' },
    { id: 'big', route: 'big-idea', nav: 'Big Idea', kicker: 'Wrap-up', title: 'The Big Idea', icon: '💡', color: '#0f766e', sub: 'How it all fits together' },
    { id: 'quiz', route: 'quiz', nav: 'Quiz', kicker: 'Test yourself', title: 'The Big Quiz', icon: '🏆', color: '#d97706', sub: 'Twelve questions, then your certificate' }
  ];

  var extraPages = [
    { id: 'certificate', route: 'certificate', title: 'Your Certificate', kicker: 'Well done!', icon: '📜', color: '#1d4ed8' },
    { id: 'glossary', route: 'glossary', title: 'Word Bank', kicker: 'Science words', icon: '📖', color: '#475569' },
    { id: 'gallery', route: 'gallery', title: 'All Pictures and Diagrams', kicker: 'Print or share', icon: '🖼️', color: '#475569' },
    { id: 'grown-ups', route: 'grown-ups', title: 'Guide for Grown-ups', kicker: 'Teacher notes', icon: '🧑‍🏫', color: '#1e293b' }
  ];

  // ------------------------------------------------------------------ home
  var home = `
<p class="lead">Hi, scientist! About 200 years ago, scientists found out a secret: <strong>electricity and magnetism are connected</strong>.
Electricity can make a magnet. And a moving magnet can make electricity!</p>
<p>Almost everything electric in your home works because of this secret: fridges, fans, speakers, even the power station that sends electricity to your house.
With a battery, a wire and some magnets, you are going to discover it for yourself.</p>
<div class="box tip">
  <p class="box-title"><span class="ico" aria-hidden="true">🗺️</span> How the adventure works</p>
  <ul>
    <li>Do the missions in order. Each one has a <strong>goal</strong>, a <strong>guess</strong>, a <strong>hands-on experiment</strong>, a <strong>simulator</strong> to practise with, and a <strong>"Why?"</strong> explanation.</li>
    <li>Write your results in the lab notebook tables. They are saved on this computer.</li>
    <li>Finish a mission, press <strong>"Mission complete"</strong> and watch your progress bar grow.</li>
    <li>At the end, take the Big Quiz and print your certificate!</li>
  </ul>
</div>`;

  // ------------------------------------------------------------------ kit
  var kit = `
<div data-art="kit"></div>
<h2>What each thing does</h2>
<div class="cols">
  <div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">🔋</span> 6-volt battery</p>
    <p>The "pump" that pushes electricity round the wire. On top there are two <strong>terminals</strong>: a spring in the corner and a post in the middle.
    One is <strong>+</strong> and one is <strong>\u2212</strong>. Look for the little signs printed on YOUR battery.</p></div>
  <div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">〰️</span> 6 metres of copper wire</p>
    <p>Copper inside carries the electricity. The red plastic coat keeps it inside the wire. We connect things using the <strong>bare copper ends</strong>.</p></div>
  <div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">⬛</span> 2 ceramic block magnets</p>
    <p>Strong magnets, but brittle like a plate: they can chip if they crash together. Their poles are usually on the two big flat faces.</p></div>
  <div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">🧲</span> Horseshoe magnet</p>
    <p>A magnet bent into a U, so both poles sit side by side. That makes a strong magnetic field in the gap between its silver tips.</p></div>
</div>
<h2>Also grab these from home</h2>
<div data-checklist="kit"></div>
<div class="box grown">
  <p class="box-title"><span class="ico" aria-hidden="true">🧑‍🔧</span> Grown-up job before you start</p>
  <ol>
    <li>Strip about <strong>2 cm</strong> of plastic off <strong>both ends</strong> of the wire (wire strippers, or carefully with scissors).</li>
    <li>Find the <strong>+</strong> and <strong>\u2212</strong> marks on the battery top.</li>
    <li>Check the nail is iron or plain steel: a magnet should stick to it. Stainless steel often does not work.</li>
  </ol>
  <p>More tips are in the <a href="#/grown-ups">guide for grown-ups</a>.</p>
</div>`;

  // ------------------------------------------------------------------ safety
  var safety = `
<p class="lead">Real scientists stay safe, so they can keep doing experiments for a long time. Learn these 8 rules before Mission 1.</p>
<div data-art="safety"></div>
<h2>Why these rules matter</h2>
<div class="cols">
  <div class="box warning"><p class="box-title"><span class="ico" aria-hidden="true">⏱️</span> The 5-second rule</p>
    <p>In our experiments the battery is joined up with nothing but a wire. There is almost nothing to slow the electricity down, so a LOT flows.
    That makes the wire and the battery warm, and it empties the battery fast. So: <strong>connect for 5 seconds at most</strong>, then let go and rest for half a minute.</p></div>
  <div class="box warning"><p class="box-title"><span class="ico" aria-hidden="true">🔌</span> Never wall sockets</p>
    <p>Our battery pushes with 6 volts, which is safe to touch. The sockets in the wall push 20 to 40 times harder and <strong>can kill</strong>. Never put wires, magnets or anything else into a socket.</p></div>
  <div class="box warning"><p class="box-title"><span class="ico" aria-hidden="true">🧲</span> Magnets and machines</p>
    <p>Strong magnets can wipe bank cards, confuse phones and watches, and upset <strong>pacemakers</strong> (heart helpers). Keep them away. Don't put magnets or clips on top of the battery either: they could join its terminals.</p></div>
  <div class="box warning"><p class="box-title"><span class="ico" aria-hidden="true">🧭</span> Protect the compass</p>
    <p>A magnet pressed right against a compass can re-magnetise the needle so it points the wrong way forever. Keep magnets and your electromagnet at least a hand-width (10 cm) away.</p></div>
</div>
<div class="box goal">
  <p class="box-title"><span class="ico" aria-hidden="true">✍️</span> The Scientist's Promise</p>
  <div data-promise></div>
</div>`;

  // ------------------------------------------------------------------ mission 1
  var m1 = `
<div class="box goal"><p class="box-title"><span class="ico" aria-hidden="true">🎯</span> Goal</p>
  <p>Find out how magnets push, pull and point, and which things they stick to.</p></div>
<div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">🧰</span> You need</p>
  <p>2 block magnets, the horseshoe magnet, a compass, paper clips, small sticky labels and a pen, and a pile of things to test.</p></div>
<div data-art="magnets"></div>

<h2>Experiment 1A: Push and pull</h2>
<div class="box predict"><p class="box-title"><span class="ico" aria-hidden="true">🤔</span> Make a guess</p>
  <p class="q-label">If you flip one magnet over, will they still pull together?</p>
  <div data-predict="m1-flip" data-options="Yes, still pull|No, they will push|Not sure"></div></div>
<div class="box steps"><ol class="steps-list">
  <li>Hold one block magnet in each hand, big flat faces towards each other.</li>
  <li>Slowly bring them closer. Can you feel them pull? <strong>Don't let them crash</strong>: they can chip.</li>
  <li>Flip one magnet over and try again. What do you feel now?</li>
  <li>Try to push the two "pushing" faces together. It's like squeezing an invisible spring!</li>
</ol></div>

<h2>Experiment 1B: Find north and south</h2>
<div class="box steps"><ol class="steps-list">
  <li>Put the compass flat on the table, far away from the magnets. Wait until the needle stops. Its red end points north.</li>
  <li>Slowly slide a block magnet towards the compass, big face first. <strong>Stop a hand-width away.</strong></li>
  <li>If the red end of the needle swings towards the magnet, that face is <strong>S</strong> (opposites pull!). Stick an "S" label on it and an "N" label on the other face.</li>
  <li>Do the same with the other block magnet and with both tips of the horseshoe magnet.</li>
  <li>Check: an N face and an S face should pull together. Two N faces should push apart.</li>
</ol></div>

<h2>Practise in the simulator</h2>
<div data-sim="magnets"></div>

<h2>Experiment 1C: What sticks?</h2>
<p>First sort these in the game. Then test real things and fill in your notebook.</p>
<div data-sim="sticks"></div>
<div data-notebook="m1-sticks"></div>

<h2>Experiment 1D: Strength test</h2>
<div class="box steps"><ol class="steps-list">
  <li>Hang a paper clip from a magnet. Touch a second clip to the bottom of the first. Does it hang on? Keep adding clips to make a chain.</li>
  <li>Try each magnet, and different parts of the horseshoe magnet (the tips and the bend).</li>
  <li>Can a magnet pull a paper clip through a sheet of paper? Through a book? Through your hand?</li>
</ol></div>
<div data-notebook="m1-strength"></div>

<div class="box why"><p class="box-title"><span class="ico" aria-hidden="true">💡</span> Why does it happen?</p>
  <p>Every magnet is surrounded by an invisible <strong>magnetic field</strong>. You can't see it, but you can feel it push and pull.
  Every magnet has two <strong>poles</strong>: north (N) and south (S). <strong>Different poles pull together</strong> and <strong>the same poles push apart</strong>.</p>
  <p>Magnetic fields pull on iron and steel (like paper clips and nails), but not on copper, aluminium, plastic, wood or paper. The field even goes through paper and your hand!</p>
  <p>A compass needle is a tiny magnet on a pin. The whole Earth is a giant magnet, so the needle turns to line up with it and points north.</p></div>
<div class="box fact"><p class="box-title"><span class="ico" aria-hidden="true">🤯</span> Brain twister</p>
  <p>The red end of a compass is a north pole, and north poles are pulled towards south poles. So near the Earth's North Pole there must be a magnetic... <strong>south pole</strong>! Scientists still call it the "North Magnetic Pole" because it's in the north.</p></div>
<div class="box tip"><p class="box-title"><span class="ico" aria-hidden="true">🔍</span> Remember this</p>
  <p>Hold a magnet next to the copper wire. It doesn't stick: copper is <strong>not</strong> magnetic. Remember that, because something surprising happens in Mission 2...</p></div>`;

  // ------------------------------------------------------------------ mission 2
  var m2 = `
<div class="box goal"><p class="box-title"><span class="ico" aria-hidden="true">🎯</span> Goal</p>
  <p>Find out whether electricity flowing in a wire can move a compass needle.</p></div>
<h2>First: what is electricity?</h2>
<div data-art="electricity"></div>
<p>Everything is made of tiny particles called atoms, and atoms contain even tinier <strong>electrons</strong>. In copper, some electrons can move freely.
When the battery pushes them all the way round a loop of wire, that flow is <strong>electricity</strong> (scientists call it an electric <strong>current</strong>).
If there's a gap anywhere in the loop, the flow stops.</p>

<div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">🧰</span> You need</p>
  <p>The battery, the wire (with both ends stripped), the compass, sticky tape and your grown-up.</p></div>
<div class="box predict"><p class="box-title"><span class="ico" aria-hidden="true">🤔</span> Make a guess</p>
  <p class="q-label">When electricity flows through the wire, will the compass needle move?</p>
  <div data-predict="m2-move" data-options="Yes|No|Not sure"></div></div>
<div data-art="oersted"></div>
<div class="box steps"><ol class="steps-list">
  <li>Put the compass flat on the table, away from magnets and metal. Wait for the needle to stop: it points north.</li>
  <li>Lay a straight part of the wire across the top of the compass, <strong>lined up with the needle</strong>. Tape it down on both sides.</li>
  <li>Keep the battery at least 30 cm (a ruler's length) from the compass. Let the rest of the wire make a big loop.</li>
  <li>Push one bare end into one battery terminal.</li>
  <li>Watch the needle, and touch the other bare end on the other terminal. Count "one elephant, two elephant..." up to five, then let go.</li>
  <li>Swap the two ends over and try again.</li>
  <li>Extra: tape the wire <strong>under</strong> the compass instead, and do it again.</li>
</ol></div>
<div data-notebook="m2-results"></div>
<h2>Practise in the simulator</h2>
<div data-sim="oersted"></div>
<div class="box why"><p class="box-title"><span class="ico" aria-hidden="true">💡</span> Why does it happen?</p>
  <p>Electricity flowing in a wire makes an invisible <strong>magnetic field that circles round the wire</strong>, like rings round your finger.
  The compass needle is a tiny magnet, so these magnetic circles push it round.</p>
  <p>Swap the ends and the electricity flows the other way. The circles turn the other way too, so the needle swings the other way.
  Under the wire, the circles go the opposite way to above it, so moving the wire underneath also flips the swing.</p>
  <p>Let go, and the electricity stops. No electricity, no magnetism: the needle swings back to north.</p></div>
<div class="box history"><p class="box-title"><span class="ico" aria-hidden="true">📜</span> History: 1820, Denmark</p>
  <p>Hans Christian \u00D8rsted noticed a compass needle move when he switched on an electric current. It was the very first clue that electricity and magnetism are connected. Now YOU have seen it too!</p></div>
<h2>The circuit diagram</h2>
<div data-art="schem-oersted"></div>`;

  // ------------------------------------------------------------------ mission 3
  var m3 = `
<div class="box goal"><p class="box-title"><span class="ico" aria-hidden="true">🎯</span> Goal</p>
  <p>Turn an iron nail into a magnet you can switch on and off, and find out what makes it stronger.</p></div>
<div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">🧰</span> You need</p>
  <p>The battery, the wire, a big iron nail, about 30 paper clips, sticky tape, a pencil and the compass.</p></div>
<div class="box predict"><p class="box-title"><span class="ico" aria-hidden="true">🤔</span> Make a guess</p>
  <p class="q-label">Will MORE turns of wire make the magnet stronger?</p>
  <div data-predict="m3-turns" data-options="Stronger|The same|Weaker"></div>
  <p class="q-label">Will a coil wrapped round a pencil (no iron) pick up paper clips?</p>
  <div data-predict="m3-pencil" data-options="Yes, lots|Only a few|None"></div></div>
<div data-art="em-build"></div>
<div class="box steps"><ol class="steps-list">
  <li><strong>Test the nail first.</strong> Does it pick up paper clips all by itself? (It shouldn't.)</li>
  <li>Leave about 50 cm of wire free. Then wrap <strong>10 turns</strong> tightly round the nail, all in the <strong>same direction</strong>, with the turns touching.</li>
  <li>Tape both ends of the coil so it can't unwind.</li>
  <li>Push bare end A into one battery terminal.</li>
  <li>Hold the nail's point over the paper clips. Touch bare end B on the other terminal (<strong>5 seconds max!</strong>) and lift. How many clips did you catch?</li>
  <li>Let go of end B. What happens to the clips?</li>
  <li>Add more turns: go up to 20, then 40, then 80. Wrap the new turns on top of the old ones, always turning the same way. Test and count each time.</li>
  <li><strong>No-iron test:</strong> wrap 20 turns round a pencil instead of the nail and try again.</li>
  <li><strong>Pole test:</strong> switch the electromagnet on and slowly bring the compass towards the nail's point (stop a hand-width away). Which end of the needle points at it? Swap the battery wires and try again.</li>
</ol></div>
<div class="box tip"><p class="box-title"><span class="ico" aria-hidden="true">🧪</span> Make it a fair test</p>
  <p>Keep everything the same except the number of turns: the same nail, the same clips, the same battery, the whole wire still in the loop. Then you know the turns made the difference.</p></div>
<div data-notebook="m3-turns"></div>
<p class="small">Your bar chart grows as you fill in the clip numbers:</p>
<div data-chart="m3-turns"></div>
<div data-notes="m3-notes" data-label="What did the compass do when you swapped the battery wires? Did any clips stay stuck after you let go?"></div>
<h2>Practise in the simulator</h2>
<div data-sim="electromagnet"></div>
<h2>How does it work?</h2>
<div data-art="em-how"></div>
<div class="box why"><p class="box-title"><span class="ico" aria-hidden="true">💡</span> Why does it happen?</p>
  <p>Remember Mission 2: electricity in a wire makes magnetic circles round it. When you wind the wire into a <strong>coil</strong>, all those circles add up in the middle, and the coil acts like a bar magnet with an N end and an S end.</p>
  <p>Iron is full of billions of tiny magnets called <strong>domains</strong>. Normally they point every which way, so they cancel out. The coil's field lines them all up, and the nail becomes a <strong>much</strong> stronger magnet. Switch off, and most of them jumble up again.</p>
  <p>More turns means more circles adding up, so the magnet gets stronger. But at some point the nail is "full": all its tiny magnets are already lined up. Scientists call that <strong>saturated</strong>. So your numbers might stop growing!</p>
  <p><strong>Why the same direction?</strong> If you wrap some turns the other way, their magnetism points the other way and cancels out the rest.</p></div>
<div class="box fact"><p class="box-title"><span class="ico" aria-hidden="true">🤔</span> Did a clip stay stuck?</p>
  <p>Steel can keep a little magnetism after the power goes off. The nail "remembers" a bit of its magnetism. That's a real discovery, not a mistake!</p></div>
<div class="box real"><p class="box-title"><span class="ico" aria-hidden="true">🌍</span> In real life</p>
  <p>Electromagnets are useful because you can switch them on and off. Giant ones lift cars in scrapyards and drop them when switched off. Others work doorbells, door locks, loudspeakers and headphones, hospital MRI scanners, and even trains that float above their track.</p></div>
<div class="box history"><p class="box-title"><span class="ico" aria-hidden="true">📜</span> History: 1825, England</p>
  <p>William Sturgeon showed off the first electromagnet: a horseshoe-shaped piece of iron wrapped in 18 turns of bare copper wire. It weighed about 200 grams but could hold up 4 kilograms of iron: 20 times its own weight!</p></div>
<h2>The circuit diagram</h2>
<div data-art="schem-electromagnet"></div>`;

  // ------------------------------------------------------------------ mission 4
  var m4 = `
<div class="box goal"><p class="box-title"><span class="ico" aria-hidden="true">🎯</span> Goal</p>
  <p>Make electricity using only a magnet and a wire: <strong>no battery at all!</strong></p></div>
<div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">🧰</span> You need</p>
  <p>The wire, both block magnets, the horseshoe magnet, the compass, a drink can or jar (6 to 7 cm wide), sticky tape and a partner.</p></div>
<div class="box predict"><p class="box-title"><span class="ico" aria-hidden="true">🤔</span> Make a guess</p>
  <p class="q-label">Will a magnet make electricity while it sits STILL inside the coil?</p>
  <div data-predict="m4-still" data-options="Yes|No|Not sure"></div>
  <p class="q-label">Will a MOVING magnet make electricity?</p>
  <div data-predict="m4-moving" data-options="Yes|No|Not sure"></div></div>
<div data-art="gen-build"></div>
<h2>Build your generator and detector</h2>
<div class="box steps"><ol class="steps-list">
  <li>Unwind your electromagnet. Put the battery away: you won't need it!</li>
  <li>Leave about 1 metre of wire free. Wrap <strong>10 turns</strong> round the can, slide the coil off and tape it in 3 places. This is your <strong>wire donut</strong>.</li>
  <li>From the donut, run about 1 metre of wire along the table.</li>
  <li>Wrap the next part of the wire round the compass <strong>about 15 times</strong>, over the top and under the bottom, lined up with N and S. Keep about 20 cm spare at the end.</li>
  <li>Twist the two bare ends together tightly. Now the wire is one big loop.</li>
  <li>Put the compass at least 1 metre from where you will use the magnet. Turn it so the needle lines up with the wires, and wait until it is still.</li>
</ol></div>
<div class="box tip"><p class="box-title"><span class="ico" aria-hidden="true">👀</span> Why does the compass need a coil?</p>
  <p>Remember Mission 2 and 3: electricity in a coil makes magnetism, and magnetism moves a compass needle. So if your magnet makes electricity in the donut, it flows all the way round the loop, through the coil on the compass, and nudges the needle.
  Your detector uses Mission 2 to spot Mission 4! Scientists call a detector like this a <strong>galvanometer</strong>.</p></div>
<h2>Make electricity!</h2>
<p>Choose a <strong>Magnet Mover</strong> and a <strong>Needle Watcher</strong>. Swap jobs halfway.</p>
<div class="box steps"><ol class="steps-list">
  <li>Magnet Mover: push a block magnet, big face first, <strong>quickly</strong> into the donut. Needle Watcher: what did the needle do?</li>
  <li>Hold the magnet <strong>still</strong> in the middle of the donut. Watch the needle.</li>
  <li>Pull the magnet out quickly.</li>
  <li>Now try: slow and fast; the magnet flipped over; both magnets stuck together; moving the donut instead of the magnet; one leg of the horseshoe magnet.</li>
  <li><strong>Detective test:</strong> untwist the joint so the loop is broken, and push the magnet in again. Then twist the joint back. What does this prove?</li>
</ol></div>
<div data-notebook="m4-results"></div>
<h2>Practise in the simulator</h2>
<div data-sim="generator"></div>
<h2>How does it work?</h2>
<div data-art="gen-how"></div>
<div class="box why"><p class="box-title"><span class="ico" aria-hidden="true">💡</span> Why does it happen?</p>
  <p>A magnet is surrounded by field lines. When the magnet moves, its field lines <strong>sweep across the wire</strong> and shove the electrons along. That's an electric current, made by movement!</p>
  <ul>
    <li><strong>No movement, no electricity.</strong> A still magnet's field lines don't sweep, even inside the coil.</li>
    <li><strong>In and out push opposite ways</strong>, so the current (and the needle) goes the opposite way.</li>
    <li><strong>Faster, stronger magnets, or more turns</strong> make more electricity.</li>
  </ul>
  <p>The detective test proves it's electricity: when the loop is broken, the electricity can't flow, so the needle stays still (as long as the magnet is far enough from the compass).</p>
  <p>Where did the energy come from? From <strong>your arm</strong>! Your movement energy turned into electrical energy.</p></div>
<div class="box fact"><p class="box-title"><span class="ico" aria-hidden="true">🔦</span> Why can't we light a bulb?</p>
  <p>Our donut makes a tiny amount of electricity: roughly a hundredth of a volt. A small light needs about 2 volts. Power stations use giant magnets, thousands of turns of wire, and spin them super fast.</p></div>
<div class="box history"><p class="box-title"><span class="ico" aria-hidden="true">📜</span> History: 1831, England</p>
  <p>Michael Faraday wondered: if electricity can make magnetism, can magnetism make electricity? He pushed a magnet into a coil and his meter twitched. Faraday left school young and started work at 14 binding books. He read the science books he was binding, and became one of the greatest scientists ever.</p></div>
<div class="box real"><p class="box-title"><span class="ico" aria-hidden="true">🌍</span> In real life</p>
  <p>Power stations, wind turbines and dams all spin magnets and coils to make electricity. So do bike dynamo lights and wind-up torches. Electric guitars use magnets and coils to "hear" the strings, and wireless phone chargers use changing magnetism in coils too.</p></div>
<h2>The circuit diagram</h2>
<div data-art="schem-generator"></div>`;

  // ------------------------------------------------------------------ mission 5
  var m5 = `
<div class="box goal"><p class="box-title"><span class="ico" aria-hidden="true">🎯</span> Goal</p>
  <p>Use electricity and a magnet to make a wire jump. This push is the secret inside every electric motor!</p></div>
<div class="box need"><p class="box-title"><span class="ico" aria-hidden="true">🧰</span> You need</p>
  <p>The battery, the wire, the horseshoe magnet, a pencil, two stacks of books, a small box and sticky tape.</p></div>
<div class="box predict"><p class="box-title"><span class="ico" aria-hidden="true">🤔</span> Make a guess</p>
  <p class="q-label">When the electricity flows, what will the wire swing do?</p>
  <div data-predict="m5-move" data-options="Jump|Stay still|Get pulled onto the magnet"></div></div>
<div data-art="jumping-wire"></div>
<div class="box steps"><ol class="steps-list">
  <li>Make two stacks of books about 25 cm apart and lay the pencil across the top, like a bridge.</li>
  <li>Bend the middle of the wire into a U about 15 cm deep and hang it over the pencil: that's the swing. Tape the rest of the wire to the table so it can't tug.</li>
  <li>Lie the horseshoe magnet on its side on the box, so the bottom of the swing hangs <strong>between its tips</strong> without touching. Add books under the box to get the height right.</li>
  <li>Push one bare end into a battery terminal. Watch the swing and touch the other end on for <strong>1 to 2 seconds</strong>.</li>
  <li>Swap the battery wires and try again.</li>
  <li>Turn the magnet over so the other tip is on top. Try again.</li>
</ol></div>
<div class="box tip"><p class="box-title"><span class="ico" aria-hidden="true">🔎</span> Tips</p>
  <p>The kick is quick, so watch closely. A loose, light swing moves best. If it barely moves, try holding the two arms of the U lightly in your fingertips: you can feel the kick!</p></div>
<div data-notebook="m5-results"></div>
<h2>Practise in the simulator</h2>
<div data-sim="motor"></div>
<div class="box why"><p class="box-title"><span class="ico" aria-hidden="true">💡</span> Why does it happen?</p>
  <p>The current makes magnetic circles round the wire (Mission 2 again!). Those circles push against the horseshoe magnet's field, and the wire gets shoved sideways.</p>
  <p>Swap the battery wires or turn the magnet over, and the push goes the other way.</p>
  <p>An electric motor has coils of wire and magnets arranged so this push keeps going round and round. That's how fans, drills, washing machines and electric cars move!</p></div>
<h2>The circuit diagram</h2>
<div data-art="schem-motor"></div>`;

  // ------------------------------------------------------------------ schematics
  var schematics = `
<p class="lead">Engineers don't draw every battery and wire as a picture. They use simple <strong>symbols</strong>, so anyone in the world can read the drawing. These drawings are called <strong>circuit diagrams</strong> or <strong>schematics</strong>.</p>
<div data-art="schem-symbols"></div>
<div class="box tip"><p class="box-title"><span class="ico" aria-hidden="true">🧭</span> How to read a circuit diagram</p>
  <ol>
    <li>Find the battery. The long line is its + side.</li>
    <li>Put your finger on the + side and follow the lines all the way round.</li>
    <li>If your finger gets back to the \u2212 side without jumping a gap, the circuit is complete and electricity can flow.</li>
    <li>An open switch is a gap. Closing it (touching the wire on) completes the loop.</li>
  </ol></div>
<h2>Mission 2: wire over a compass</h2>
<div data-art="schem-oersted"></div>
<h2>Mission 3: the electromagnet</h2>
<div data-art="schem-electromagnet"></div>
<h2>Mission 4: the magnet generator</h2>
<div data-art="schem-generator"></div>
<h2>Bonus: the jumping wire</h2>
<div data-art="schem-motor"></div>
<div class="box predict"><p class="box-title"><span class="ico" aria-hidden="true">🕵️</span> Diagram detective</p>
  <p class="q-label">Which circuit has no battery at all?</p>
  <div data-predict="sch-nobattery" data-options="Mission 2|Mission 3|Mission 4|Bonus"></div>
  <p class="q-label">Which circuit has an iron core?</p>
  <div data-predict="sch-core" data-options="Mission 2|Mission 3|Mission 4|Bonus"></div>
  <p class="small">Answers: the Mission 4 circuit has no battery (the moving magnet is the power source), and the Mission 3 circuit has the iron core (the nail).</p></div>`;

  // ------------------------------------------------------------------ big idea
  var big = `
<div data-art="big-idea"></div>
<h2>Your discoveries</h2>
<div class="cols">
  <div class="box why"><p class="box-title"><span class="ico" aria-hidden="true">🧭</span> Electricity makes magnetism</p>
    <p>Current flowing in a wire makes magnetic circles round it (Mission 2). Coil the wire and add iron, and you get a strong electromagnet you can switch on and off (Mission 3).</p></div>
  <div class="box observe"><p class="box-title"><span class="ico" aria-hidden="true">⚡</span> Moving magnets make electricity</p>
    <p>A magnet moving in or out of a coil pushes electrons round the wire (Mission 4). No movement, no electricity. This is how power stations work.</p></div>
  <div class="box fact"><p class="box-title"><span class="ico" aria-hidden="true">🎢</span> Electricity + magnets make movement</p>
    <p>A current in a magnet's field gets a push (Bonus mission). That push spins electric motors.</p></div>
</div>
<div class="box real"><p class="box-title"><span class="ico" aria-hidden="true">🏠</span> Home hunt</p>
  <p>With your grown-up, hunt around your home. How many things can you find that use an electromagnet, a motor, or electricity from a generator? (Hint: the fridge, the washing machine, a fan, speakers, the doorbell, a hair dryer...)</p>
  <div data-notes="big-hunt" data-label="Things I found:"></div></div>
<p class="center"><a class="btn primary big" href="#/quiz">Take the Big Quiz 🏆</a></p>`;

  // ------------------------------------------------------------------ glossary
  var glossary = [
    ['Magnet', 'Something with an invisible field that pulls on iron and steel, and pushes or pulls other magnets.'],
    ['Pole', 'One of the two ends of a magnet, where it is strongest: north (N) or south (S).'],
    ['Attract', 'To pull together. Different poles (N and S) attract.'],
    ['Repel', 'To push apart. The same poles (N and N, or S and S) repel.'],
    ['Magnetic field', 'The invisible area round a magnet (or a wire with current in it) where you can feel its push and pull.'],
    ['Compass', 'A tiny magnet on a pin that lines up with the Earth\u2019s magnetic field and points north.'],
    ['Electron', 'A super-tiny particle inside atoms. Moving electrons are electricity.'],
    ['Current', 'A flow of electricity through a wire. Measured in amps.'],
    ['Circuit', 'A complete loop that electricity can flow all the way round.'],
    ['Conductor', 'A material electricity flows through easily, like copper.'],
    ['Insulator', 'A material electricity can\u2019t get through, like the plastic coat on the wire.'],
    ['Battery', 'A store of energy that pushes electricity round a circuit. Ours has 4 cells inside.'],
    ['Volt (V)', 'How hard a battery pushes the electricity. Ours: 6 volts.'],
    ['Amp (A)', 'How much electricity flows each second.'],
    ['Short circuit', 'A loop with almost nothing to slow the electricity down. Lots flows, so things get hot.'],
    ['Coil', 'Wire wound round and round in turns.'],
    ['Electromagnet', 'A coil of wire (often with iron inside) that becomes a magnet when electricity flows through it.'],
    ['Iron core', 'The piece of iron inside a coil, like our nail, that makes the electromagnet much stronger.'],
    ['Domain', 'A tiny magnetic region inside iron. A strong field lines them up.'],
    ['Saturated', 'When all the domains in the iron are already lined up, so it can\u2019t get much stronger.'],
    ['Induction', 'Making electricity with a moving (changing) magnetic field. Faraday discovered it in 1831.'],
    ['Generator', 'A machine that makes electricity by moving magnets and coils.'],
    ['Galvanometer', 'A meter that detects small electric currents. Ours is a compass with a coil round it.'],
    ['Motor', 'A machine that uses electricity and magnets to make movement.'],
    ['Circuit diagram', 'A drawing of a circuit using simple symbols. Also called a schematic.']
  ];

  // ------------------------------------------------------------------ notebooks + checklists
  var STICK = ['?', 'Sticks', 'Doesn\u2019t stick'];
  var notebooks = {
    'm1-sticks': {
      caption: 'Lab notebook: what sticks to a magnet?',
      cols: [{ label: 'Object' }, { label: 'My guess', type: 'select', options: STICK }, { label: 'What happened', type: 'select', options: STICK }],
      rows: ['Paper clip', 'Iron nail', 'Copper wire', 'Aluminium foil', 'Wooden pencil', 'Food tin (the can for beans)', 'Drink can', 'Plastic toy', 'A coin', 'A key', 'Something I chose:']
    },
    'm1-strength': {
      caption: 'Lab notebook: strength test',
      cols: [{ label: 'Magnet (and which part)' }, { label: 'Paper clips in a chain', type: 'number' }, { label: 'Pulls through paper? Book? Hand?', type: 'text' }],
      rows: ['Block magnet 1', 'Block magnet 2', 'Both block magnets stuck together', 'Horseshoe magnet: the tips', 'Horseshoe magnet: the bend']
    },
    'm2-results': {
      caption: 'Lab notebook: what did the needle do?',
      cols: [{ label: 'Test' }, { label: 'What the needle did', type: 'select', options: ['?', 'Didn\u2019t move', 'Swung left', 'Swung right'] }, { label: 'Notes', type: 'text' }],
      rows: ['Wire on top', 'Wire on top, ends swapped', 'Wire underneath', 'Wire underneath, ends swapped', 'Battery not connected']
    },
    'm3-turns': {
      caption: 'Lab notebook: turns and paper clips',
      cols: [{ label: 'Coil' }, { label: 'My guess (clips)', type: 'number' }, { label: 'Clips picked up', type: 'number', chart: true }],
      rows: ['10 turns on the nail', '20 turns on the nail', '40 turns on the nail', '80 turns on the nail', '20 turns on a pencil'],
      short: ['10', '20', '40', '80', 'pencil']
    },
    'm4-results': {
      caption: 'Lab notebook: making electricity',
      cols: [{ label: 'What I did' }, { label: 'Needle moved?', type: 'select', options: ['?', 'Yes', 'No'] },
        { label: 'Which way?', type: 'select', options: ['?', 'Left', 'Right', 'Both ways', '-'] },
        { label: 'Kick size', type: 'select', options: ['?', 'None', 'Small', 'Big'] }],
      rows: ['Push in slowly', 'Push in fast', 'Hold still inside the donut', 'Pull out fast', 'Flip the magnet, push in', 'Both magnets together',
        'Move the donut, not the magnet', 'Horseshoe magnet: one leg in', 'Loop broken (joint untwisted)']
    },
    'm5-results': {
      caption: 'Lab notebook: the jumping wire',
      cols: [{ label: 'Test' }, { label: 'What the swing did', type: 'select', options: ['?', 'Kicked into the magnet', 'Kicked out of the magnet', 'Didn\u2019t move'] }, { label: 'Notes', type: 'text' }],
      rows: ['Battery connected', 'Battery wires swapped', 'Magnet turned over', 'No magnet at all']
    }
  };

  var checklists = {
    kit: [
      'A big iron nail, 10 to 15 cm long (not stainless steel)',
      'About 30 steel paper clips',
      'A compass with a needle',
      'Sticky tape',
      'A pencil',
      'A drink can or jar, 6 to 7 cm wide',
      'Wire strippers or scissors (for grown-ups)',
      'Small sticky labels and a pen',
      'Two stacks of books and a small box (bonus mission)',
      'A clock or timer that shows seconds'
    ]
  };

  // ------------------------------------------------------------------ quiz
  var quiz = [
    { q: 'What are the two ends of a magnet called?', a: ['Poles', 'Tips', 'Charges', 'Batteries'], c: 0,
      e: 'Every magnet has a north pole and a south pole.' },
    { q: 'You bring the N pole of one magnet close to the N pole of another. What happens?', a: ['They pull together', 'They push apart', 'Nothing at all', 'They both turn into S poles'], c: 1,
      e: 'The same poles push apart (repel). Different poles pull together.' },
    { q: 'Which of these does a magnet pull on?', a: ['A copper wire', 'Aluminium foil', 'A steel paper clip', 'A wooden pencil'], c: 2,
      e: 'Magnets pull on iron and steel. Copper, aluminium and wood are not magnetic.' },
    { q: 'What did \u00D8rsted discover in 1820?', a: ['Magnets are made of iron', 'Electricity flowing in a wire can move a compass needle', 'Batteries contain tiny magnets', 'The Earth is round'], c: 1,
      e: 'A current makes magnetic circles round the wire. That was the first clue that electricity and magnetism are linked.' },
    { q: 'Why do we only connect the battery for 5 seconds at a time?', a: ['The wire and battery get hot and the battery runs down', 'The magnet will break', 'The compass will fall off the table', 'The wire will turn into a magnet forever'], c: 0,
      e: 'Our loops are almost short circuits, so lots of electricity flows. That makes heat and empties the battery.' },
    { q: 'How can you make your electromagnet stronger?', a: ['Use a plastic straw instead of the nail', 'Wrap half the turns the other way', 'Add more turns of wire', 'Leave a longer free end'], c: 2,
      e: 'More turns means more magnetic circles adding up. An iron core and more current help too.' },
    { q: 'Why does the iron nail make the electromagnet so much stronger?', a: ['Iron is full of electricity', 'The tiny magnets (domains) in the iron line up', 'The nail is sharp', 'The nail makes the wire longer'], c: 1,
      e: 'The coil\u2019s field lines up billions of tiny domains in the iron, and they all add their magnetism together.' },
    { q: 'What happens if you swap the battery wires on your electromagnet?', a: ['Its N and S poles swap over', 'It stops working forever', 'It gets twice as strong', 'The battery explodes'], c: 0,
      e: 'The current flows the other way, so the magnetic field points the other way.' },
    { q: 'A magnet sits perfectly still inside the wire donut. Does the compass needle move?', a: ['Yes, a lot', 'No: the magnet has to move to make electricity', 'Only at night', 'Only if it is the horseshoe magnet'], c: 1,
      e: 'Electricity is only made while the magnetic field through the coil is changing, so the magnet must move.' },
    { q: 'You push the magnet in and the needle kicks left. What happens when you pull it out?', a: ['It kicks left again', 'It doesn\u2019t move', 'It kicks right: the current flows the other way', 'It spins round and round'], c: 2,
      e: 'In and out sweep the field lines across the wire in opposite directions, so the current reverses.' },
    { q: 'Who discovered that a moving magnet can make electricity?', a: ['Michael Faraday', 'Isaac Newton', 'Hans Christian \u00D8rsted', 'William Sturgeon'], c: 0,
      e: 'Michael Faraday discovered it in 1831. \u00D8rsted found the opposite: electricity makes magnetism.' },
    { q: 'How do most power stations make electricity?', a: ['They collect lightning', 'They spin giant magnets and coils', 'They squeeze batteries', 'They use giant compasses'], c: 1,
      e: 'Steam, wind or water turns a generator: magnets and coils spinning past each other, just like your donut but much bigger.' }
  ];

  // ------------------------------------------------------------------ grown-ups guide
  var grownUps = `
<div class="grown-guide">
<p class="lead">This pack turns the kit in your photo (a 6 V lantern battery, 6 m of red PVC-insulated copper wire, two ceramic block magnets and a horseshoe magnet) into five hands-on missions for a 10-year-old. The two main goals: <strong>a current in a coil makes a magnet</strong>, and <strong>a moving magnet makes a current</strong>.</p>
<div class="box grown toc">
  <p class="box-title">Contents</p>
  <ol>
    <li><a href="#g-plan">Session plan</a></li>
    <li><a href="#g-prep">Before you start</a></li>
    <li><a href="#g-safety">Safety details</a></li>
    <li><a href="#g-missions">Mission notes and expected results</a></li>
    <li><a href="#g-science">The science, for grown-ups</a></li>
    <li><a href="#g-trouble">Troubleshooting</a></li>
    <li><a href="#g-further">Going further</a></li>
  </ol>
</div>

<h2 id="g-plan">1. Session plan</h2>
<table>
  <tr><th>Session</th><th>Missions</th><th>Time</th></tr>
  <tr><td>1</td><td>Kit, Safety (Mission 0), Magnet Detective (Mission 1)</td><td>about 45 min</td></tr>
  <tr><td>2</td><td>\u00D8rsted\u2019s Surprise (Mission 2), Build an Electromagnet (Mission 3)</td><td>about 60 min</td></tr>
  <tr><td>3</td><td>Faraday\u2019s Challenge (Mission 4), Jumping Wire (bonus), Big Idea, Quiz, certificate</td><td>about 60 min</td></tr>
</table>
<p>Let your child make the guesses before each experiment, even wrong ones. A wrong guess followed by a surprising result is where the learning sticks. The simulators are for practice and for explaining; the real experiments are the main event.</p>

<h2 id="g-prep">2. Before you start</h2>
<ul>
  <li><strong>Strip both wire ends</strong> (about 2 cm). If the wire is stranded, twist the strands tightly.</li>
  <li><strong>Find the battery polarity.</strong> On most spring-top 6 V lantern batteries (type 4R25 / 4LR25) the centre terminal is negative and the corner spring is positive, but check the marks on yours. The bare wire can be pushed between the coils of a spring terminal.</li>
  <li><strong>Get a real compass</strong> with a freely swinging needle. It is needed for Missions 1, 2, 3 and 4 (it is the electricity detector in Mission 4). A phone compass app will not work as a needle detector.</li>
  <li><strong>Check the nail</strong>: plain or galvanised steel works; many stainless steels don't. A magnet should stick to it firmly.</li>
  <li><strong>Check your block magnets' poles.</strong> Ceramic blocks are normally magnetised through their thickness, so the poles are the two big faces. If yours snap together face to face, that's the case.</li>
</ul>

<h2 id="g-safety">3. Safety details</h2>
<ul>
  <li><strong>Why the 5-second rule:</strong> every circuit here is the battery plus a few metres of thick copper wire. The wire's resistance is only a fraction of an ohm, so the current is limited mainly by the battery itself: expect roughly <strong>3 to 8 amps</strong>. That is a near short circuit. A few seconds is fine; a minute makes the wire and battery noticeably warm and drains the battery. Never leave it connected.</li>
  <li><strong>Tiny sparks</strong> when disconnecting are normal at 6 V and harmless, but do the experiments away from anything flammable.</li>
  <li><strong>Never let the battery terminals get bridged</strong> by a short piece of wire, a key, the horseshoe magnet or a paper clip, including in storage.</li>
  <li><strong>6 V is safe to touch.</strong> Mains electricity is not: make the "never use wall sockets" rule absolute.</li>
  <li><strong>Ceramic magnets are brittle.</strong> If they slam together they can chip and throw small sharp flakes. Slide them apart; consider eye protection for enthusiastic magnet play.</li>
  <li><strong>Keep magnets away</strong> from pacemakers and other implanted medical devices, bank cards, mechanical watches and hearing aids.</li>
  <li><strong>The compass</strong> can be permanently re-magnetised by a strong magnet held against it. Keep magnets at least 10 cm away.</li>
</ul>

<h2 id="g-missions">4. Mission notes and expected results</h2>
<h3>Mission 1: Magnet Detective</h3>
<p>The red (north-seeking) end of the needle is attracted to a magnet's S pole. Label the faces with stickers; the labels are used later. Many "copper" coins are copper-plated steel and do stick, and most keys are brass and don't: good surprises for the sorting table.</p>
<h3>Mission 2: \u00D8rsted's Surprise</h3>
<p>With a current of several amps, a wire lying across the compass swings the needle by a large angle, often close to 90 degrees. Keep the rest of the loop wide: if the wire comes back close to the compass, its field partly cancels the effect. A handy rule is <strong>SNOW</strong>: current flowing <strong>S</strong>outh to <strong>N</strong>orth <strong>O</strong>ver the needle turns its north end <strong>W</strong>est. With the wire underneath, the swing reverses.</p>
<h3>Mission 3: Build an Electromagnet</h3>
<p>Because the whole 6 m of wire stays in the circuit whatever the number of turns, the current stays roughly the same, so "number of turns" is a genuinely fair test. Expect a handful of clips at 10 turns, more at 20 and 40, and then the numbers level off as the nail saturates. The pencil coil usually picks up nothing. A clip or two may stay stuck after switch-off (remanence in the steel). The compass near the nail tip flips when the battery connections are swapped.</p>
<h3>Mission 4: Faraday's Challenge</h3>
<p>This is the one to set up carefully. The loop is: donut (about 10 turns) \u2192 about 1 m of leads \u2192 about 15 turns round the compass \u2192 twisted joint back to the start. The thick, low-resistance wire actually helps here: the tiny voltage still drives a useful current through the compass coil. Expect a clear kick of the needle when the magnet is pushed in or pulled out quickly, nothing while it is held still, and opposite kicks for in and out. Keep the compass 1 m or more from the moving magnet, and use the "broken loop" test to show that the kick is caused by current, not by the magnet's own field.</p>
<h3>Bonus: The Jumping Wire</h3>
<p>The force is small (a few thousandths of a newton, about the weight of half a gram), so the swing must be light and free to pivot over the pencil. The kick direction reverses when either the current or the magnet is reversed. If the swing is too stiff, holding the two arms of the U loosely lets your child feel the kick.</p>

<h2 id="g-science">5. The science, for grown-ups</h2>
<ul>
  <li><strong>Current and field:</strong> a current I produces a circular magnetic field around the wire, B = \u03BC\u2080I / (2\u03C0r). At 5 A and 1 cm that is about 100 \u00B5T, several times the Earth's horizontal field (roughly 20 \u00B5T in many places), which is why the needle swings so far.</li>
  <li><strong>Direction conventions:</strong> diagrams use conventional current (+ to \u2212). Electrons actually drift the other way. The right-hand grip rule: curl your right-hand fingers the way the conventional current goes round the coil and your thumb points to the coil's N end.</li>
  <li><strong>Solenoid and core:</strong> a coil's field inside is roughly \u03BC\u2080NI / L. A steel core multiplies it many times by aligning magnetic domains, until the steel saturates (roughly 1.5 to 2 T). Some magnetisation remains after switch-off (remanence).</li>
  <li><strong>Induction:</strong> Faraday's law, EMF = \u2212N \u0394\u03A6/\u0394t. Pushing a ceramic block through a 10-turn coil in about a tenth of a second changes the flux by very roughly 10\u207B\u2074 Wb per turn, giving an EMF of the order of 10 mV. That's far below the ~2 V an LED needs, which is why we use a compass galvanometer instead of a bulb. Lenz's law says the induced current opposes the change; with our currents the opposing force is too small to feel.</li>
  <li><strong>Why the galvanometer works:</strong> the loop resistance is only a fraction of an ohm, so millivolts drive tens of milliamps. Through about 15 turns around the compass that makes a field comparable to the Earth's, enough for a visible kick.</li>
  <li><strong>Motor effect:</strong> F = BIL. With about 0.05 T in the horseshoe gap, 5 A and 2 cm of wire in the field, F is about 5 mN.</li>
  <li>All figures above are rough estimates for this kit; your battery, wire gauge and magnets will change them.</li>
</ul>

<h2 id="g-trouble">6. Troubleshooting</h2>
<table>
  <tr><th>Problem</th><th>Try this</th></tr>
  <tr><td>Nothing happens when the battery is touched</td><td>Make sure bare copper (not plastic) touches the metal of both terminals. Scrape the ends shiny. Check the + and \u2212 terminals, not the case.</td></tr>
  <tr><td>Electromagnet is weak</td><td>Are all turns wound the same way? Wrap tightly, add turns, use a thicker plain-steel nail or bolt. A tired battery gives less current.</td></tr>
  <tr><td>Wire or battery gets hot</td><td>Normal for a near short circuit. Shorter connections and rests between tries.</td></tr>
  <tr><td>Clips stay stuck after switch-off</td><td>That's remanence, a real effect. Tap the nail on the table, or pull the clips off.</td></tr>
  <tr><td>Mission 2 needle barely moves</td><td>Line the wire up with the needle (north\u2013south), put it right on the compass, and keep the rest of the loop far away.</td></tr>
  <tr><td>Compass points the wrong way or feels "lazy"</td><td>It may have been re-magnetised by a magnet held too close. Use a new compass and keep magnets 10 cm away.</td></tr>
  <tr><td>Mission 4: no kick</td><td>Twist the joint tighter (bare copper on bare copper). Line the compass coil up with the needle. Move the magnet faster and right through the donut. Stack both magnets. Try more turns on the compass.</td></tr>
  <tr><td>Mission 4: needle moves even with the loop broken</td><td>The magnet is too close to the compass. Move the compass further away (1.5 m) or keep the magnet on the far side of the donut.</td></tr>
  <tr><td>Swing doesn't jump</td><td>Make the U lighter and looser, make sure its bottom hangs right between the tips, and tape the leads down so they don't pull.</td></tr>
</table>

<h2 id="g-further">7. Going further</h2>
<ul>
  <li><strong>Light an LED:</strong> a coil of hundreds of turns of thin enamelled "magnet wire" and a strong neodymium magnet shaken quickly through it can flash an LED, the idea behind shake torches. Neodymium magnets need extra care: they pinch hard and are dangerous if swallowed.</li>
  <li><strong>Measure it:</strong> a multimeter on its millivolt range shows the Mission 4 voltage as numbers. The free phyphox app can use a phone's magnetometer to graph how strong your electromagnet is at a fixed distance.</li>
  <li><strong>Build a motor:</strong> a simple coil motor needs a 1.5 V D cell, enamelled wire, two paper clips and one of your ceramic block magnets.</li>
</ul>
<p class="small">The pictures and circuit diagrams are also saved as separate files in the <code>images</code> folder (see <a href="#/gallery">All pictures</a>) so you can print or share them.</p>
</div>`;

  root.Content = {
    pages: pages,
    extraPages: extraPages,
    home: home,
    bodies: { kit: kit, safety: safety, m1: m1, m2: m2, m3: m3, m4: m4, m5: m5, schematics: schematics, big: big },
    glossary: glossary,
    notebooks: notebooks,
    checklists: checklists,
    quiz: quiz,
    grownUps: grownUps
  };
}(typeof self !== 'undefined' ? self : this));
