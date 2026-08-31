const MS_DAY = 86400000;
const MONTH_NAMES = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const WD = ["M","T","W","T","F","S","S"];

function utc(y,m,d){ return new Date(Date.UTC(y,m,d)); }
function addDays(date,n){ return new Date(date.getTime() + n*MS_DAY); }
function mondayIndex(date){ const day = date.getUTCDay(); return (day+6)%7; }
function dayIndexOf(date, start){ return Math.round((date - start)/MS_DAY); }
function fmt(date){ return MONTH_NAMES[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear(); }


const PHASES = [
  {s:0,  e:6,  wk:"Week 0", name:"Baseline"},
  {s:7,  e:13, wk:"Week 1", name:"The Standard"},
  {s:14, e:20, wk:"Week 2", name:"The Floor"},
  {s:21, e:27, wk:"Week 3", name:"The Program"},
  {s:28, e:34, wk:"Week 4", name:"The Coaches"},
  {s:35, e:41, wk:"Week 5", name:"Athlete & Injury"},
  {s:42, e:48, wk:"Week 6", name:"The Parents"},
  {s:49, e:55, wk:"Week 7", name:"Certification Evidence"},
  {s:56, e:60, wk:"Week 8", name:"Proof & Handover"},
  {s:61, e:90, wk:"Days 61–90", name:"Proof & Certification"}
];

const EVENTS = [
{s:0,e:0,type:"zoom",title:"Remote Audit Day",meta:"Facility executes capture · 45-min Zoom · you + owner",
 sections:[
  {label:"Facility does",items:["Films every training group — full session, all three angles (A unbroken, B correction, C reset), audio running","Owner shoots the 12-photo checklist that morning"]},
  {label:"You do",items:["45-min Zoom while the owner walks the building on his phone — live, unrehearsed, camera on the room","This is your walk-around read and the one thing photos can't replace","Ask him to open storage, show you the whiteboard, and walk to the AED without prompting"]},
  {label:"Collect",items:["Constraint Set per slot · full coach list including weekend part-timers · roster"]}
 ]},

{s:1,e:1,type:"desk",title:"Score everything",meta:"Your desk · 2.5 hrs",
 sections:[
  {label:"App",items:["<b>Adoption Audit</b> — behavior scored from video, physical scored from photos","<b>Continuity Check</b> — domains 1–4","ABIR baseline per group, scored from Angle A"]},
  {label:"Hold",items:["Continuity domain 5 (The Access) is unscorable remotely — score it on Day 7 when you're in the building"]}
 ]},

{s:2,e:2,type:"desk",title:"Load the constraint set",meta:"Your desk · 1 hr",
 sections:[{label:"App",items:["<b>Flow &amp; Capacity Console</b> — APS, CAR, DT%, breach count, open-seat load per week"]}]},

{s:3,e:3,type:"zoom",title:"Baseline call",meta:"Zoom · 45 min · owner",
 sections:[
  {label:"App — share screen",items:["Adoption %, Continuity /20, ABIR, breaches, open-seat load"]},
  {label:"Doc",items:["Lock the standards session date and get attendance confirmed in writing"]}
 ],
 output:"Ship the standards kit box today — printed workbooks one per coach, signature page on heavy stock, wall posters, EAP card blanks, Core 4 posters, Start State placard."},

{s:7,e:7,type:"onsite",title:"The One Trip",meta:"On-site · 5 hrs · every coach — this is the only day you get",
 sections:[
  {label:"Hour 0–3",items:["Standards session — all six sections, written by them, signed before anyone leaves. You hold the pen; they supply the words."]},
  {label:"Hour 3–4.5",items:["Core 4 install on the floor, moving","Photograph Start State and post the placard"]},
  {label:"Hour 4.5–5",items:["EAP — walk to every entrance, post the card, confirm the AED","Day-One Expectations written while the room is still in standards headspace"]},
  {label:"While you're there",items:["Score Continuity domain 5 — test whether a new person could physically operate the floor (logins, keys, equipment). It's the only day of the install you can."]}
 ],
 flag:"Load this day. It is the only one you get."},

{s:8,e:8,type:"desk",title:"Type it",meta:"Your desk · 2 hrs",
 sections:[{label:"Doc",items:["Clean STS-branded standards document"]},{label:"App",items:["Export the session console → seeds Certification Tracker Tiers 1 and 2"]}]},

{s:9,e:9,type:"other",title:"72-hour close-out",meta:"Owner sends · 15 min",
 sections:[{label:"Doc",items:["Signed doc to every coach, printed and posted","Owner photographs it posted and sends the shot"]}],
 flag:"Hard deadline — momentum decays fast."},

{s:14,e:14,type:"zoom",title:"Flow & Capacity",meta:"Zoom · 2 hrs · owner",
 sections:[
  {label:"Doc",items:["<b>Quality Ceiling</b> set once — APS max 3 high-touch or 4 volume, CAR max 20, hard ceiling 25"]},
  {label:"App",items:["Capacity map, breach panel resolved live on screen, block templates generated per slot length"]},
  {label:"Owner",items:["Prints and posts block templates at the door, sends a photo — no photo, not installed"]}
 ]},

{s:15,e:15,type:"zoom",title:"Filler Standard",meta:"Zoom · 45 min · coaches",
 sections:[{label:"Doc",items:["Written live with the coaches, station by station","Owner posts at each station and photographs"]}],
 output:"A filler never raises the fatigue cost of the primary."},

{s:17,e:17,type:"zoom",title:"Makeup policy",meta:"Zoom · 45 min · owner only — business decision, keep coaches out",
 sections:[{label:"Doc",items:["Notice window, two per cycle, 14-day expiry","Eligibility table","Four desk scripts handed to whoever answers the phone"]}]},

{s:18,e:18,type:"desk",title:"Dead Time baseline",meta:"Your desk · 45 min",
 sections:[{label:"App",items:["Scored off the Day 0 footage you already have — scrub and timestamp every gap"]}],
 output:"More accurate than the estimate you'd have made standing there."},

{s:21,e:21,type:"zoom",title:"Exercise Selection",meta:"Zoom · 2.5 hrs · one person",
 sections:[
  {label:"App",items:["Screen-share the Facility System Builder and build all 52 weeks live, group by group"]},
  {label:"Doc",items:["Substitution rules for this facility's equipment — macro swap vs micro swap — written and posted"]}
 ],
 output:"The first day the owner sees the system running instead of being described. It costs you a Zoom."},

{s:24,e:24,type:"zoom",title:"Read-and-log call",meta:"Zoom · 45 min · all coaches",
 sections:[{label:"Doc",items:["Activate §4 Data Standard — nothing new gets written, this is enforcement"]}],
 flag:"Say it plainly: logging lives in the close block, and if the close block gets cut the guarantee can't be measured."},

{s:28,e:28,type:"other",title:"Capture Cycle 2",meta:"Facility executes",
 sections:[{label:"Facility does",items:["Every group filmed again","Photo checklist again, with three different stations chosen by you so it can't be gamed"]}]},

{s:29,e:29,type:"zoom",title:"Coverage & handoff",meta:"Zoom · 45 min",
 sections:[{label:"Doc",items:["Who runs which group when a coach is out, by name, with a backup column"]},{label:"App",items:["The console reads the Certification Tracker so it won't let an uncertified coach cover"]}]},

{s:30,e:30,type:"desk",title:"Day 30 Checkpoint",meta:"Your desk 1 hr + Zoom 30 min",
 sections:[{label:"App",items:["SAR first real read","Certification-90 Day 30 stop","Tier 1 sign-offs scored from cycle-2 video"]}],
 flag:"The only gate that matters today: logging is moving. If it's flat, stop installing and fix logging."},

{s:35,e:35,type:"zoom",title:"ABIR + Return-to-Train",meta:"Zoom · 2.5 hrs · all coaches",
 sections:[
  {label:"Doc",items:["Athlete Onboarding Standard with a named owner per step","Train-Around Standard by region","Return-to-Lift rungs","Written rule that only Tier 2+ writes a modification"]},
  {label:"App",items:["Onboarding Board loaded with the unonboarded backlog","Limitation Board → Ladder Board → Handoff Desk chain demonstrated"]}
 ]},

{s:37,e:37,type:"zoom",title:"Bands, clinics, rehearsal",meta:"Zoom · 60 min · owner",
 sections:[{label:"Doc",items:["Progress-visibility change bands set once — they feed the Proof Report too","Three clinics named off the intake forms and loaded into the Handoff Desk","EAP rehearsal scheduled, coach-run, to be filmed"]}]},

{s:42,e:42,type:"zoom",title:"Cadence build",meta:"Zoom · 2 hrs · owner + group coaches",
 sections:[
  {label:"Doc — the Facility Cadence Sheet",items:["Silence threshold, channel of record, review day","Inbound standard, group → coach → send day → backup","Testing cycle, three Onboarding Touches, Rhythm template at a 150-word cap"]},
  {label:"App",items:["<b>Silence Gap Console</b> — baseline measured today"]}
 ],
 output:"Write down the target date for Silence Gap = 0."},

{s:44,e:44,type:"zoom",title:"Complaint protocol",meta:"Zoom · 45 min · owner + desk",
 sections:[{label:"Doc",items:["Escalation ladder, ownership, response windows"]},{label:"App",items:["<b>Complaint Log</b> live from today"]}],
 output:"Trigger table posted beside the standards doc and photographed."},

{s:45,e:45,type:"other",title:"Owner's recurring review",meta:"5 min · permanent",
 sections:[{label:"App",items:["Silence Gap review on his calendar, same day and time, forever"]}],
 flag:"Two consecutive climbs means cadence is dying."},

{s:49,e:49,type:"other",title:"EAP rehearsal, filmed",meta:"Facility executes · you review",
 sections:[{label:"Facility does",items:["Coaches run it, someone films it, you watch"]}],
 output:"Log the rehearsal date — rehearsal age is a Command Center compliance read."},

{s:51,e:51,type:"other",title:"Capture Cycle 3 — Tier 2 footage",meta:"Facility executes",
 sections:[{label:"Facility does",items:["One full unbroken session per coach — not clips"]}],
 output:"Tier 2 authorizes modifications and rung advancement, so the evidence standard is higher than Tier 1."},

{s:52,e:55,type:"desk",title:"Score Tier 2",meta:"Your desk · 3 hrs",
 sections:[{label:"App",items:["<b>Certification Tracker</b> — you sign these yourself, not the owner, not a coach"]}],
 output:"This is the compromise in Schedule A — Tier 2 from video instead of your own eyes. Full sessions, not clips, is what makes it defensible."},

{s:56,e:56,type:"zoom",title:"Testing Day",meta:"Coach-run · you on Zoom hour 1",
 sections:[{label:"Facility does",items:["They run it, filmed throughout"]},{label:"You do",items:["Live on a screen for the first hour as backup, then drop off"]}],
 flag:"The retest cycle must complete before Day 90 or the testing gate cannot score 100%."},

{s:58,e:58,type:"zoom",title:"First Proof Report",meta:"Zoom · 45 min · owner",
 sections:[{label:"App",items:["Build one group's report as the template he copies"]}],
 output:"Limited or returning athletes report as held, with the reason named — never as flat."},

{s:60,e:60,type:"zoom",title:"Handover + Day 60 stop",meta:"Zoom · 90 min · owner",
 sections:[
  {label:"Doc",items:["Binder and file handover by screen-share"]},
  {label:"App",items:["Owner runs the SAR himself while you watch","<b>Continuity Check</b> re-run on domains 1–4","Two gates short here escalates in writing"]}
 ],
 output:"Install complete. From here you audit, you don't build."},

{s:63,e:63,type:"zoom",title:"Weekly rhythm begins",meta:"Zoom · 30 min · same day every week",
 sections:[{label:"App",items:["Read the SAR before the call, never during it"]}]},

{s:65,e:65,type:"other",title:"Proof Reports to every family",meta:"Owner sends",
 sections:[{label:"App",items:["<b>Proof Report Builder</b>, every group"]}],
 output:"The day proof of results is visible to every family."},

{s:70,e:70,type:"zoom",title:"Re-enrollment loaded",meta:"Zoom · 30 min",
 sections:[{label:"App",items:["Board loaded with cycle-end dates"]},{label:"Doc",items:["Conversation script handed to the owner — it's his to run, not yours"]}]},

{s:75,e:75,type:"zoom",title:"Drift check",meta:"Zoom · 45 min + Capture Cycle 4",
 sections:[{label:"App",items:["<b>Drift Log</b> — individual drift and systemic drift route differently"]}],
 flag:"Identical rhythm touches cycle to cycle, and trigger touches sent by the owner instead of the coach, are systemic."},

{s:80,e:80,type:"desk",title:"Certification sweep",meta:"Your desk · 1 hr",
 sections:[{label:"App",items:["Every coach at Tier 2 or on a dated plan to get there"]}]},

{s:85,e:85,type:"desk",title:"Pre-certification fix window",meta:"Whatever it takes",
 sections:[{label:"App",items:["Run certification-90 early against the trailing 28 days and see what's short while there's still time to move it"]}]},

{s:87,e:87,type:"other",title:"The Access Test — filmed",meta:"Facility executes",
 sections:[{label:"Facility does",items:["The newest coach or the front desk person attempts to open and run the first 20 minutes of a session unaided, on camera. Nobody helps, nobody prompts."]}],
 output:"This replaces your Day 90 walkthrough — a harder, more honest test than the one you were running in person."},

{s:89,e:89,type:"desk",title:"ABIR re-run",meta:"Your desk · 90 min",
 sections:[{label:"App",items:["Scored off capture cycle 4 — same groups, same indicators, against the Day 1 baseline"]}]},

{s:90,e:90,type:"zoom",title:"Certification",meta:"Zoom · 90 min · owner",
 sections:[{label:"App",items:["Four gates: logged 90%, attendance 90%, testing 100%, on plan 85% — all four, not the average"]},{label:"Doc",items:["Result dated and issued in writing, or the extension declared"]}]}
];

const SCHED = {
  label: "The One-Visit Install",
  tag: "1 in-person day",
  stats: "1 on-site day (Day 7, 5 hrs) · rest remote across 90 days",
  minDay: 0,
  maxDay: 90,
  events: EVENTS,
  phases: PHASES,
  dayZeroLabel: "Day 0 — remote audit day"
};

let INSTALL_START = null;

function isAppSection(label){
  return /app/i.test(label || "");
}

function generateCalendar(){
  const startVal = document.getElementById('startInput').value;
  const err = document.getElementById('setupErr');
  if(!startVal){
    if(err) err.style.display = 'block';
    return;
  }
  if(err) err.style.display = 'none';
  const parts = startVal.split('-').map(Number);
  INSTALL_START = utc(parts[0], parts[1]-1, parts[2]);

  const calApp = document.getElementById('calApp');
  if(calApp) calApp.style.display = 'block';

  const end = addDays(INSTALL_START, SCHED.maxDay);
  document.getElementById('dateRange').innerHTML =
    "<b>Starts:</b> " + fmt(INSTALL_START) + " &nbsp;·&nbsp; <b>Certification:</b> " + fmt(end);
  const tag = document.getElementById('schedTag');
  if(tag) tag.textContent = SCHED.label;

  renderPhases();
  renderCalendar();
}

function renderPhases(){
  const wrap = document.getElementById('phaseStrip');
  if(!wrap) return;
  wrap.innerHTML = SCHED.phases.map(function(p){
    return "<div class='pchip'><span class='pwk'>"+p.wk+"</span><span class='pnm'>"+p.name+"</span></div>";
  }).join('');
}

function eventFor(d){ return SCHED.events.find(e=>d>=e.s&&d<=e.e) || null; }
function phaseFor(d){ return SCHED.phases.find(p=>d>=p.s&&d<=p.e) || null; }

function renderCalendar(){
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';

  const rangeStart = addDays(INSTALL_START, SCHED.minDay);
  const rangeEnd = addDays(INSTALL_START, SCHED.maxDay);
  const startMonth = {y:rangeStart.getUTCFullYear(), m:rangeStart.getUTCMonth()};
  const endMonth = {y:rangeEnd.getUTCFullYear(), m:rangeEnd.getUTCMonth()};

  const months = [];
  let y = startMonth.y, m = startMonth.m;
  while(y < endMonth.y || (y===endMonth.y && m<=endMonth.m)){
    months.push({y,m});
    m++; if(m>11){m=0;y++;}
  }

  let maxWeeks = 1;
  const monthCells = months.map(({y,m})=>{
    const first = utc(y,m,1);
    const startWd = mondayIndex(first);
    const gridStart = addDays(first,-startWd);
    const daysInMonth = utc(y,m+1,0).getUTCDate();
    const cells = [];
    for(let d=1; d<=daysInMonth; d++){
      const date = utc(y,m,d);
      const wIndex = Math.floor((date-gridStart)/(7*MS_DAY));
      const wd = mondayIndex(date);
      cells.push({date,d,col:2+wIndex*7+wd});
      maxWeeks = Math.max(maxWeeks, wIndex+1);
    }
    return {y,m,cells};
  });

  grid.style.gridTemplateColumns = "42px repeat(" + (maxWeeks*7) + ", minmax(0,1fr))";

  const corner = document.createElement('div');
  corner.style.gridRow = 1; corner.style.gridColumn = 1;
  grid.appendChild(corner);
  for(let w=0; w<maxWeeks; w++){
    for(let wd=0; wd<7; wd++){
      const el = document.createElement('div');
      el.className = 'wd';
      el.textContent = WD[wd];
      el.style.gridRow = 1;
      el.style.gridColumn = 2 + w*7 + wd;
      grid.appendChild(el);
    }
  }

  let lastYear = null;
  monthCells.forEach((mo, idx)=>{
    const row = idx + 2;
    const label = document.createElement('div');
    label.className = 'mlabel';
    label.style.gridRow = row;
    label.style.gridColumn = 1;
    let txt = MONTH_NAMES[mo.m];
    if(lastYear !== mo.y){ txt += "<span class='yr'>'" + String(mo.y).slice(2) + "</span>"; lastYear = mo.y; }
    label.innerHTML = txt;
    grid.appendChild(label);

    mo.cells.forEach(c=>{
      const dIdx = dayIndexOf(c.date, INSTALL_START);
      const cell = document.createElement('div');
      cell.style.gridRow = row;
      cell.style.gridColumn = c.col;

      if(dIdx < SCHED.minDay || dIdx > SCHED.maxDay){
        cell.className = 'cell outside';
        cell.innerHTML = "<span class='dnum'>"+c.d+"</span>";
      } else {
        const ev = eventFor(dIdx);
        if(ev){
          cell.className = 'cell ev-' + ev.type;
          cell.innerHTML = "<span class='dnum'>"+c.d+"</span><span class='badge'>D"+dIdx+"</span>";
        } else {
          cell.className = 'cell inwindow';
          cell.innerHTML = "<span class='dnum'>"+c.d+"</span>";
        }
        cell.onclick = (function(day){ return function(){ openModal(day); }; })(dIdx);
      }
      grid.appendChild(cell);
    });
  });
}

function badgeClassFor(type){
  return {onsite:'badge-onsite',zoom:'badge-zoom',desk:'badge-desk',other:'badge-other'}[type] || 'badge-routine';
}
function typeLabel(type){
  return {onsite:'ON-SITE',zoom:'ZOOM / VIDEO',desk:'DESK / ASYNC',other:'FACILITY / OWNER TASK'}[type] || 'NO MILESTONE';
}

function nearestEvents(d){
  let prev=null, next=null;
  SCHED.events.forEach(ev=>{
    if(ev.e < d && (!prev || ev.e>prev.e)) prev = ev;
    if(ev.s > d && (!next || ev.s<next.s)) next = ev;
  });
  return {prev,next};
}

function openModal(d){
  const date = addDays(INSTALL_START, d);
  const ev = eventFor(d);
  const phase = phaseFor(d);
  const body = document.getElementById('modalBody');

  let html = "<button class='xbtn' type='button' onclick='closeModal()'>&times;</button>";

  if(ev){
    const dayLabel = ev.s===ev.e ? ("DAY "+ev.s) : ("DAYS "+ev.s+"–"+ev.e);
    html += "<span class='dbadge "+badgeClassFor(ev.type)+"'>"+typeLabel(ev.type)+" · "+dayLabel+"</span>";
    html += "<div class='mdate'>"+fmt(date)+(ev.s!==ev.e?(" – "+fmt(addDays(INSTALL_START,ev.e))):"")+"</div>";
    html += "<h2>"+ev.title+"</h2>";
    html += "<div class='mmeta'>"+ev.meta+"</div>";
    if(phase) html += "<div class='phaseline'>"+phase.wk+" — "+phase.name+"</div>";
    const sections = (ev.sections || []).filter(function(sec){ return !isAppSection(sec.label); });
    if(sections.length){
      html += "<div class='mgrid'>";
      sections.forEach(function(sec){
        html += "<div class='mbox d'><h4>"+sec.label+"</h4>";
        html += "<ul>" + sec.items.map(function(it){ return "<li>"+it+"</li>"; }).join('') + "</ul>";
        html += "</div>";
      });
      html += "</div>";
    }
    if(ev.output) html += "<div class='mout'><b>Why it matters</b>"+ev.output+"</div>";
    if(ev.flag) html += "<div class='mflag'><b>Watch for</b>"+ev.flag+"</div>";
  } else {
    html += "<span class='dbadge badge-routine'>NO MILESTONE · DAY "+d+"</span>";
    html += "<div class='mdate'>"+fmt(date)+"</div>";
    html += "<h2>Running under the systems already installed</h2>";
    if(phase) html += "<div class='phaseline'>"+phase.wk+" — "+phase.name+"</div>";
    html += "<div class='mmeta' style='margin-top:12px'>Nothing scheduled today. "+
      (d<=SCHED.events.reduce(function(mx,e){ return Math.max(mx,e.e); },0) ?
       "The facility runs on whatever has been installed so far — no new session today." :
       "This falls between the fixed check-ins below.") +
      "</div>";
  }

  const nav = nearestEvents(d);
  html += "<div class='mnav'>";
  html += nav.prev ? ("<a onclick='openModal("+nav.prev.s+")'>&larr; <span>Day "+nav.prev.s+"</span> "+nav.prev.title+"</a>") : "<span></span>";
  html += nav.next ? ("<a onclick='openModal("+nav.next.s+")' style='text-align:right'>Day "+nav.next.s+" "+nav.next.title+" <span>&rarr;</span></a>") : "<span></span>";
  html += "</div>";

  body.innerHTML = html;
  document.getElementById('overlay').classList.add('show');
}
function closeModal(){ document.getElementById('overlay').classList.remove('show'); }

document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

(function(){
  const t = new Date();
  const iso = t.getFullYear() + '-' + String(t.getMonth()+1).padStart(2,'0') + '-' + String(t.getDate()).padStart(2,'0');
  const startInput = document.getElementById('startInput');
  if(!startInput) return;
  startInput.value = iso;
  startInput.addEventListener('change', generateCalendar);
  generateCalendar();
})();
