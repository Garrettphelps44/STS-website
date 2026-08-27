const MS_DAY = 86400000;
const MONTH_NAMES = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const WD = ["M","T","W","T","F","S","S"];

function utc(y,m,d){ return new Date(Date.UTC(y,m,d)); }
function addDays(date,n){ return new Date(date.getTime() + n*MS_DAY); }
function mondayIndex(date){ const day = date.getUTCDay(); return (day+6)%7; }
function dayIndexOf(date, start){ return Math.round((date - start)/MS_DAY); }
function fmt(date){ return MONTH_NAMES[date.getUTCMonth()] + " " + date.getUTCDate() + ", " + date.getUTCFullYear(); }

// ============================================================
// OPTION 1 — THE FULL INSTALL (9 on-site visits)
// ============================================================
const PHASES_1 = [
  {s:0,  e:6,  wk:"Week 0", name:"Baseline"},
  {s:7,  e:13, wk:"Week 1", name:"The Standard"},
  {s:14, e:20, wk:"Week 2", name:"The Floor"},
  {s:21, e:27, wk:"Week 3", name:"The Program"},
  {s:28, e:34, wk:"Week 4", name:"The Coaches"},
  {s:35, e:41, wk:"Week 5", name:"The Athlete"},
  {s:42, e:48, wk:"Week 6", name:"The Parents"},
  {s:49, e:55, wk:"Week 7", name:"The Hurt Athlete"},
  {s:56, e:60, wk:"Week 8", name:"Proof & Handover"},
  {s:61, e:90, wk:"Days 61–90", name:"The Cadence — retainer, not install"}
];

const EVENTS_1 = [
{s:0,e:0,type:"onsite",title:"Audit Day",meta:"On-site · 4 hrs · you + owner · walk the floor during live sessions",
 sections:[
  {label:"Doc",items:["None. Today you only take — you do not write a single standard."]},
  {label:"App",items:["<b>Adoption Audit</b> — 6-part day-zero baseline, scored while you walk","<b>Continuity Check</b> — the 20-item walk-out test, scored in the building"]},
  {label:"Collect",items:["Constraint Set per time slot: stations, athletes, coaches, slot length, turnover, ESL mix","Full coach list, including weekend part-timers","Current schedule and roster count","Per-athlete monthly price (needed for Open Seat Cost)"]},
  {label:"Observe (for ABIR)",items:["Score P and RI indicators from watching, not from asking","Note distraction points as you see them — don't score them yet"]}
 ],
 output:"Leaves the building with two app-generated findings blocks, a constraint set per slot, and a coach list."},

{s:1,e:1,type:"desk",title:"Score the baseline",meta:"Your desk · 1 hr · alone",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>Buy-In Scorecard Console</b> — ABIR = (P × RI × 4) − DP, one score per training group"]}],
 output:"The ABIR number you re-run on Day 89. Write it down somewhere you cannot lose it."},

{s:2,e:2,type:"desk",title:"Load the constraint set",meta:"Your desk · 1 hr · alone",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>Flow &amp; Capacity Console</b> — enter every slot, get APS / CAR / DT% / breaches","Calculate Open Seat Cost in dollars per week"]}],
 output:"Breach count and a weekly dollar figure for empty staffed seats — the number that makes the install feel like recovered money."},

{s:3,e:3,type:"zoom",title:"Baseline call",meta:"Zoom · 45 min · owner only",
 sections:[{label:"Doc",items:["None. This call is a read-out, not a build."]},{label:"App — share screen",items:["Adoption %, Continuity score /20, ABIR, breach count, Open Seat Cost"]}],
 output:"The standards session date on the calendar, and the owner's commitment that every coach attends."},

{s:4,e:6,type:"desk",title:"Prep week",meta:"Your desk · 2 hrs total",
 sections:[{label:"Doc",items:["Print the Standards Document Template, one per coach","Print the signature page"]},{label:"App",items:["<b>Standards Session Console</b> — pre-load facility name and coach roster"]}],
 flag:"Owner's homework — confirm attendance in writing. A coach who wasn't in the room did not agree to anything, and he'll tell you so in week six."},

{s:7,e:7,type:"onsite",title:"The Standards Session",meta:"On-site · 3 hrs · EVERY coach + owner · non-negotiable, cannot be Zoom",
 sections:[
  {label:"Doc — this is the whole day",items:["§1 Non-Negotiables — max 7, each observable from the door","§2 Floor Standard — phase, time, coach position, transition rules, late arrival, end reset","§3 Coaching Standard — teaching sequence, correction hierarchy, load selection, buy-in behaviors","§4 Data Standard — what's recorded, by whom, by when, where it lives","§5 Ownership — a named owner and review date per section","§6 Commitment — read out loud, then signed by every coach and the owner"]},
  {label:"App — live in the room",items:["<b>Standards Session Console</b> — you type as they talk, projected if possible","<b>Expectations Builder</b> — last 20 min, write Day-One Expectations"]}
 ],
 flag:"You hold the pen. They supply the words. Walk in with their standards pre-written and you've built one more thing your coaches ignore.",
 output:"Nobody leaves without signing §6."},

{s:8,e:8,type:"onsite",title:"Post the emergency plan",meta:"On-site (30 min) or owner-executed · you + owner + head coach",
 sections:[{label:"Doc",items:["<b>In-Session Emergency Protocol</b> — facility address, AED location, nearest ER, phone tree, named roles"]},{label:"App",items:["<b>EAP Console</b> — enter it, print the card"]}],
 flag:"Why this jumps the queue — every other system is sold on what it adds. This one is sold on what it prevents. Post it at every entrance and the desk."},

{s:9,e:9,type:"desk",title:"Type it",meta:"Your desk · 2 hrs · alone",
 sections:[{label:"Doc",items:["Clean typed Standards Document, STS-branded, PDF"]},{label:"App",items:["Export Standards Session Console → seeds the <b>Certification Tracker</b> Tier 1 and Tier 2 items"]}]},

{s:10,e:10,type:"other",title:"72-hour close-out",meta:"Email · 15 min · owner sends it, not you",
 sections:[{label:"Doc",items:["Signed standards doc distributed to every coach","Printed and posted in the weight room"]},{label:"App",items:["None."]}],
 flag:"Hard deadline — momentum from a standards session decays fast. No typed copy in hand within 3 days, the room's energy converts into nothing."},

{s:11,e:11,type:"onsite",title:"Core 4 install",meta:"On-site · 90 min · all coaches, on the floor, moving",
 sections:[{label:"Doc",items:["Core 4 protocol guide","Facility's selected prep by need, printed and posted at the entry"]},{label:"App",items:["None. This is taught body-to-body."]}],
 output:"Coaches run it starting their very next session. Days 12–13 you're off."},

{s:14,e:14,type:"onsite",title:"Flow & Capacity Day",meta:"On-site · 3 hrs · you + owner (first 90 min) · + coaches (last 90 min)",
 sections:[
  {label:"Doc — with the owner",items:["<b>Quality Ceiling</b> — APS max (3 high-touch / 4 volume), CAR max 20, hard ceiling 25","Start State — defined and photographed, then posted"]},
  {label:"Doc — with the coaches",items:["<b>Filler Standard</b> by station, three tiers, posted at each station"]},
  {label:"App",items:["<b>Flow &amp; Capacity Console</b> — capacity map, utilization bands, breach panel resolved first","Generate the 8/15/37/30/10 block template per distinct slot length","Print block templates → post at the door"]}
 ],
 output:"Slot Capacity = min(S × APS max, C × CAR max). Whichever binds first tells the owner whether to add stations or add a coach."},

{s:15,e:16,type:"other",title:"Owner reschedules the breaches",meta:"Owner's work · you're available by text",
 sections:[{label:"Doc",items:["Revised schedule, one constraint set per slot"]},{label:"App",items:["Re-run <b>Flow &amp; Capacity Console</b> until the breach panel is clear"]}]},

{s:17,e:17,type:"zoom",title:"Makeup policy decision",meta:"Zoom · 45 min · owner only — business decision, keep coaches out",
 sections:[{label:"Doc",items:["<b>Makeup Session Policy</b> — notice window, 2 per cycle cap, 14-day expiry","Eligibility table — no-show and late arrival are the two hard nos","Four front-desk scripts handed to whoever answers the phone"]},{label:"App",items:["<b>Flow &amp; Capacity Console</b> makeup ledger — rules eligibility, counts the cap, computes expiry"]}],
 output:"The standard to hold: a makeup is a seat, not a session."},

{s:18,e:18,type:"other",title:"Dead Time Audit baseline",meta:"On-site or coach-executed · one session observed",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>Flow &amp; Capacity Console</b> audit log — ≤10% healthy, &gt;20% is a capacity problem, not a coaching one"]}]},

{s:21,e:21,type:"onsite",title:"Exercise Selection install",meta:"On-site · 3 hrs · you + whoever writes programming — one person, not a committee",
 sections:[{label:"Doc",items:["<b>Substitution rules</b> for this facility's equipment — macro swap vs micro swap, written and posted","Progression standard — same exercise ~20 weeks during volume progression"]},{label:"App",items:["<b>Facility System Builder</b> — build the 52-week calendar, group by group","52 weeks generates in under 3 minutes. Let him watch it happen."]}],
 output:"The first day the owner sees the system running instead of being described."},

{s:22,e:23,type:"desk",title:"Generate and export everything",meta:"Your desk · 2 hrs",
 sections:[{label:"Doc",items:["Session codes — every training day findable in under 60 seconds"]},{label:"App",items:["<b>Facility System Builder</b> — all groups exported"]}]},

{s:24,e:24,type:"zoom",title:"Coach read-and-log call",meta:"Zoom · 45 min · all coaches",
 sections:[{label:"Doc",items:["Activate §4 Data Standard from the standards doc — no new writing, just enforcement"]},{label:"App",items:["Walk through where logging happens and what shows up in the SAR if it doesn't"]}],
 flag:"Say this out loud — logging lives in the close block. Cut the close block and the reporting layer starves; the guarantee can't be measured."},

{s:28,e:28,type:"onsite",title:"Certification Day",meta:"On-site · 3 hrs · all coaches, observed while coaching",
 sections:[{label:"Doc",items:["<b>Certification Checklist</b> — Tier 1 and Tier 2 items generated from this facility's own standards doc, not a template"]},{label:"App",items:["<b>Certification Tracker</b> — load every coach, set current tier, sign off Tier 1 items live"]}],
 output:"Only Tier 2+ writes a modification or advances a return-to-train rung."},

{s:29,e:29,type:"zoom",title:"Coverage & handoff",meta:"Zoom · 45 min · owner + head coach",
 sections:[{label:"Doc",items:["<b>Coverage &amp; Handoff Protocol</b> — who runs which group when a coach is out, by name, with a backup column"]},{label:"App",items:["<b>Coverage Console</b> — reads the Certification Tracker so it won't let an uncertified coach cover a slot"]}]},

{s:30,e:30,type:"desk",title:"Day 30 Checkpoint",meta:"Your desk, then Zoom next day · trajectory only, not a grade",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>SAR dashboard</b> — first real read","<b>90-Day Certification</b> — Day 30 stop"]}],
 flag:"The only thing that has to be true at Day 30: logging is moving. If logging is flat, stop installing new systems and fix logging."},

{s:35,e:35,type:"onsite",title:"ABIR install",meta:"On-site · 2 hrs · owner + all coaches",
 sections:[{label:"Doc",items:["<b>Athlete Onboarding Standard</b> — every step with a named coach who owns it","<b>Day-One Expectations</b> — written back on Day 7, now printed and handed to athletes"]},{label:"App",items:["<b>Onboarding Board</b> — load current unonboarded athletes and clear the backlog"]}],
 flag:"Feeds backward — unonboarded athletes tighten the slot's supervision ceiling. Clearing the backlog is a capacity gain, not just a culture win."},

{s:36,e:36,type:"zoom",title:"Progress-visibility bands",meta:"Zoom · 45 min · owner + head coach",
 sections:[{label:"Doc",items:["<b>Progress-Visibility Protocol</b> — set the change bands. Same bands feed the Proof Report, so decide them once."]},{label:"App",items:["Visibility Console — not built yet. Run it on the printed protocol for now."]}]},

{s:37,e:37,type:"zoom",title:"Testing day plan",meta:"Zoom · 30 min · owner + coaches",
 sections:[{label:"Doc",items:["Which tests, which week of the cycle, who runs each station"]},{label:"App",items:["None yet — you run testing manually for install #1."]}]},

{s:42,e:42,type:"onsite",title:"Cadence build",meta:"On-site or Zoom · 2 hrs · owner + every coach who owns a group + front desk",
 sections:[{label:"Doc — the Facility Cadence Sheet",items:["Silence threshold in days · channel of record · review day and time","Inbound standard: 1 day to acknowledge, 3 to resolve or schedule","Group → owning coach → rhythm send day → backup","Testing cycle length and the week the Proof Report goes out","Three Onboarding Touches written · Rhythm Touch template, 150-word cap"]},{label:"App",items:["<b>Silence Gap Console</b> — load active families, measure the day-one Silence Gap"]}],
 output:"Write down: active families on install day, Silence Gap on install day, and the target date for Silence Gap = 0."},

{s:43,e:43,type:"other",title:"Post the trigger table",meta:"15 min · owner",
 sections:[{label:"Doc",items:["Trigger table posted in the same place coaches see the standards doc"]},{label:"App",items:["Confirm attendance logging works — the absence triggers can't fire without it"]}]},

{s:44,e:44,type:"zoom",title:"Complaint protocol",meta:"Zoom · 45 min · owner + front desk",
 sections:[{label:"Doc",items:["<b>Complaint Protocol</b> — escalation ladder, who owns what, response windows"]},{label:"App",items:["<b>Complaint Log</b> — live from today"]}],
 flag:"Diagnostic — complaints that arrive already escalated (angry, at the owner, first contact) mean the small version had nowhere to go. That's a cadence failure, not a parent problem."},

{s:45,e:45,type:"other",title:"Owner's recurring review goes on the calendar",meta:"5 min · owner · same day and time every week, permanently",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>Silence Gap Console</b> — weekly. Climbing two weeks in a row means cadence is dying."]}]},

{s:49,e:49,type:"onsite",title:"Return-to-Train install",meta:"On-site · 2.5 hrs · all coaches",
 sections:[{label:"Doc",items:["<b>Train-Around Standard</b> — what a limited athlete does instead, by region","<b>Return-to-Lift Progression</b> — the rungs, and what earns advancement","Written rule: only Tier 2+ writes a modification or advances a rung"]},{label:"App — they chain in this order",items:["<b>Limitation Board</b> — open a record","→ <b>Ladder Board</b> — run the rungs","→ <b>Handoff Desk</b> — release back to full training"]}],
 flag:"Your coaches are making the call on a hurt athlete in the next ninety seconds whether or not anything is written down."},

{s:50,e:50,type:"zoom",title:"Medical handoff — the referral channel",meta:"Zoom · 45 min · owner",
 sections:[{label:"Doc",items:["<b>Medical Handoff</b> — name the three clinics already on the facility's intake forms","Release summary template"]},{label:"App",items:["<b>Handoff Desk</b> — loaded with the three clinics"]}],
 output:"The only piece in the stack that pays for itself in new athletes — release summaries to clinics build a referral channel out of paperwork already being generated."},

{s:51,e:51,type:"other",title:"EAP rehearsal",meta:"On-site or coach-run · 20 min · all coaches",
 sections:[{label:"Doc",items:["Log the rehearsal date — rehearsal age is a Command Center compliance read"]},{label:"App",items:["<b>EAP Console</b> — certification currency, AED check date, rehearsal age"]}]},

{s:56,e:56,type:"onsite",title:"Run the first testing day",meta:"On-site · 3 hrs · you run it once, coaches run it next cycle",
 sections:[{label:"Doc",items:["Testing day run sheet — stations, order, who owns each"]},{label:"App",items:["Facility's tracking stack — VBT, jump, speed, whatever they own"]}],
 flag:"Timing matters for the guarantee — the retest cycle has to complete before Day 90, which is why testing lands in week 8, not week 11."},

{s:57,e:58,type:"desk",title:"Data in, first Proof Report built",meta:"Your desk · 2 hrs",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>Proof Report Builder</b> — build one group's report as the template the owner copies"]}],
 output:"A limited or returning athlete reports as \"held,\" with the reason named — never flat."},

{s:60,e:60,type:"onsite",title:"Handover + Day 60 checkpoint",meta:"On-site or Zoom · 90 min · owner",
 sections:[
  {label:"Doc — hand over the binder",items:["Standards Document (signed) · Certification Checklist · Coverage Protocol · Drift Protocol","Makeup Policy + desk scripts · Cadence Sheet · Complaint Protocol","Train-Around Standard · Rung Progression · EAP · Medical Handoff","Core 4 guide · Substitution rules"]},
  {label:"App — hand over the files",items:["Every HTML tool + its saved export file","Facility System Builder login","Owner is shown how to run the SAR himself","<b>Continuity Check</b> re-run — compare to Day 0","<b>90-Day Certification</b> — Day 60 stop. Two gates short here escalates to the owner in writing."]}
 ],
 output:"Install complete. Retainer begins. From here you are auditing, not building."},

{s:63,e:63,type:"zoom",title:"Weekly retainer rhythm begins",meta:"Zoom · 30 min · same day, every week, forever",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>SAR</b> read + the one flagged coach, if there is one"]}]},

{s:65,e:65,type:"other",title:"Proof Reports go to every family",meta:"Owner sends · you review the first batch",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>Proof Report Builder</b>, every group"]}],
 output:"This is the day the price increase becomes defensible. Nothing else in the stack connects that visibly to pricing power."},

{s:70,e:70,type:"zoom",title:"Re-enrollment loaded",meta:"Zoom · 30 min · owner",
 sections:[{label:"Doc",items:["<b>Re-Enrollment Conversation</b> script — for the owner, not for you"]},{label:"App",items:["<b>Re-Enrollment Board</b> — loaded with cycle-end dates"]}]},

{s:75,e:75,type:"zoom",title:"Drift check",meta:"On-site if you can, Zoom if you can't · 45 min",
 sections:[{label:"Doc",items:["<b>Drift-Correction Protocol</b> — applied, not written. It was written in week 4."]},{label:"App",items:["<b>Drift Log</b> — individual drift vs systemic drift routed differently"]}],
 flag:"Tell systemic from individual — Rhythm Touches reading identical cycle to cycle, and trigger touches sent by the owner instead of the coach, are systemic drift. Route them here, not into a one-off conversation."},

{s:77,e:77,type:"zoom",title:"Weekly retainer check-in",meta:"Zoom · 30 min · standing weekly rhythm",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>SAR</b> read before the call, never during · Silence Gap Console reviewed"]}]},

{s:80,e:80,type:"desk",title:"Certification sweep",meta:"Your desk · 1 hr",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>Certification Tracker</b> — every coach at Tier 2 or on a dated plan to get there"]}]},

{s:84,e:84,type:"zoom",title:"Weekly retainer check-in",meta:"Zoom · 30 min · standing weekly rhythm",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>SAR</b> read before the call, never during · Silence Gap Console reviewed"]}]},

{s:85,e:85,type:"other",title:"Pre-certification fix window",meta:"Whatever it takes · last chance to move a gate",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>90-Day Certification</b> — run it early against the trailing 28 days and see what's short"]}]},

{s:89,e:89,type:"onsite",title:"Re-run ABIR",meta:"On-site observation · 90 min · scored by you, same as Day 1",
 sections:[{label:"Doc",items:["None."]},{label:"App",items:["<b>Buy-In Scorecard Console</b> — same groups, same indicators, against the Day 1 baseline"]}],
 output:"The cleanest proof you have — the only number in the stack that puts a figure on athlete buy-in before and after. It brackets the install rather than sitting inside it."},

{s:90,e:90,type:"onsite",title:"Certification",meta:"On-site or Zoom · 90 min · owner",
 sections:[{label:"Doc",items:["Certification result, dated, in writing — issued or extension declared"]},{label:"App",items:["<b>90-Day Certification</b> — four gates, scored on the 28 days ending today","<b>Continuity Check</b> — third and final run"]}]}
];

// ============================================================
// OPTION 2 — SCHEDULE A: THE ONE-VISIT INSTALL (remote, 1 on-site day)
// ============================================================
const PHASES_A = [
  {s:0,  e:6,  wk:"Week 0", name:"Baseline"},
  {s:7,  e:13, wk:"Week 1", name:"The Standard"},
  {s:14, e:20, wk:"Week 2", name:"The Floor"},
  {s:21, e:27, wk:"Week 3", name:"The Program"},
  {s:28, e:34, wk:"Week 4", name:"The Coaches"},
  {s:35, e:41, wk:"Week 5", name:"Athlete & Injury"},
  {s:42, e:48, wk:"Week 6", name:"The Parents"},
  {s:49, e:55, wk:"Week 7", name:"Certification Evidence"},
  {s:56, e:60, wk:"Week 8", name:"Proof & Handover"},
  {s:61, e:90, wk:"Days 61–90", name:"Proof & Certification — retainer"}
];

const EVENTS_A = [
{s:0,e:0,type:"zoom",title:"Remote Audit Day",meta:"Facility executes capture · 45-min Zoom · you + owner",
 sections:[
  {label:"Facility does",items:["Films every training group — full session, all three angles (A unbroken, B correction, C reset), audio running","Owner shoots the 12-photo checklist that morning"]},
  {label:"You do",items:["45-min Zoom while the owner walks the building on his phone — live, unrehearsed, camera on the room","This is your walk-around read and the one thing photos can't replace","Ask him to open storage, show you the whiteboard, and walk to the AED without prompting"]},
  {label:"Collect",items:["Constraint Set per slot · full coach list including weekend part-timers · roster · per-athlete monthly price"]}
 ]},

{s:1,e:1,type:"desk",title:"Score everything",meta:"Your desk · 2.5 hrs",
 sections:[
  {label:"App",items:["<b>Adoption Audit</b> — behavior scored from video, physical scored from photos","<b>Continuity Check</b> — domains 1–4","ABIR baseline per group, scored from Angle A"]},
  {label:"Hold",items:["Continuity domain 5 (The Access) is unscorable remotely — score it on Day 7 when you're in the building"]}
 ]},

{s:2,e:2,type:"desk",title:"Load the constraint set",meta:"Your desk · 1 hr",
 sections:[{label:"App",items:["<b>Flow &amp; Capacity Console</b> — APS, CAR, DT%, breach count, Open Seat Cost in dollars per week"]}]},

{s:3,e:3,type:"zoom",title:"Baseline call",meta:"Zoom · 45 min · owner",
 sections:[
  {label:"App — share screen",items:["Adoption %, Continuity /20, ABIR, breaches, Open Seat Cost"]},
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
 output:"Install complete. Retainer begins. From here you audit, you don't build."},

{s:63,e:63,type:"zoom",title:"Weekly rhythm begins",meta:"Zoom · 30 min · same day every week",
 sections:[{label:"App",items:["Read the SAR before the call, never during it"]}]},

{s:65,e:65,type:"other",title:"Proof Reports to every family",meta:"Owner sends",
 sections:[{label:"App",items:["<b>Proof Report Builder</b>, every group"]}],
 output:"The day the price increase becomes defensible."},

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

// ============================================================
// OPTION 3 — SCHEDULE B: THE ZERO-VISIT INSTALL (fully remote)
// ============================================================
const PHASES_B = [
  {s:-7, e:-1, wk:"Week −1", name:"Pre-Work"},
  {s:0,  e:6,  wk:"Week 0",  name:"Baseline"},
  {s:7,  e:14, wk:"Week 1",  name:"The Standards Session — three video blocks"},
  {s:21, e:27, wk:"Week 2",  name:"The Floor"},
  {s:28, e:34, wk:"Week 3",  name:"The Program"},
  {s:35, e:41, wk:"Week 4",  name:"The Coaches"},
  {s:42, e:48, wk:"Week 5",  name:"Athlete & Injury"},
  {s:49, e:55, wk:"Week 6",  name:"The Parents"},
  {s:56, e:62, wk:"Week 7",  name:"Certification Evidence"},
  {s:63, e:67, wk:"Week 8",  name:"Proof & Handover"},
  {s:68, e:97, wk:"Days 68–97", name:"Proof & Certification — retainer"}
];

const EVENTS_B = [
{s:-7,e:-7,type:"other",title:"The kit ships",meta:"You send · 30 min",
 sections:[{label:"Doc",items:["Printed standards workbooks, one per coach, with his name on it","Signature page on heavy stock · wall poster blanks · EAP card blanks · Core 4 posters · Start State placard","Camera mount and a clip-on lav"]}],
 output:"The box is doing real work — it makes a remote install a physical object in the room instead of a face on a laptop."},

{s:-5,e:-5,type:"zoom",title:"Owner co-facilitator training",meta:"Zoom · 60 min · owner alone",
 sections:[
  {label:"Train him on",items:["The one rule — you hold the pen, they supply the words","How to pull the quiet coach in by name","How to shut down the dominant one without making it a moment"]},
  {label:"He also owns",items:["Camera setup — one wide camera on the room, not on a table","Your face on a TV at the front, large — a laptop lid at the end of a table will sink this session"]}
 ]},

{s:-3,e:-3,type:"other",title:"Five questions, in writing",meta:"Async · 10 min per coach",
 sections:[{label:"Every coach answers before session one",items:["What are the three things every session must have?","What does a good correction look like?","What should get recorded, by whom, by when?","What happens when an athlete walks in late?","What is the one thing we do inconsistently?"]}],
 output:"The counter to the silent-coach problem — nobody gets to hide behind the loudest guy, because his position is already on the page."},

{s:0,e:0,type:"zoom",title:"Remote Audit Day",meta:"Facility executes capture · 45-min Zoom · you + owner",
 sections:[
  {label:"Facility does",items:["Films every training group — full session, all three angles, audio running","Owner shoots the 12-photo checklist that morning"]},
  {label:"You do",items:["45-min Zoom while the owner walks the building on his phone — live, camera on the room","Ask him to open storage, show you the whiteboard, and walk to the AED without prompting"]},
  {label:"Collect",items:["Constraint Set per slot · full coach list including weekend part-timers · roster · per-athlete monthly price"]}
 ],
 flag:"Continuity domain 5 (The Access) has no in-person day to fall back on in this schedule. Run the filmed Access test at baseline today as well as at Day 94 — now you have a before and after on the domain you'd otherwise lose entirely."},

{s:1,e:1,type:"desk",title:"Score everything",meta:"Your desk · 2.5 hrs",
 sections:[{label:"App",items:["<b>Adoption Audit</b> — behavior from video, physical from photos","<b>Continuity Check</b> domains 1–4","ABIR baseline per group from Angle A"]}]},

{s:2,e:2,type:"desk",title:"Load the constraint set",meta:"Your desk · 1 hr",
 sections:[{label:"App",items:["<b>Flow &amp; Capacity Console</b> — APS, CAR, DT%, breach count, Open Seat Cost in dollars per week"]}]},

{s:3,e:3,type:"zoom",title:"Baseline call",meta:"Zoom · 45 min · owner",
 sections:[{label:"App — share screen",items:["Adoption %, Continuity /20, ABIR, breaches, Open Seat Cost"]},{label:"Doc",items:["Lock the standards session date and get attendance confirmed in writing"]}]},

{s:7,e:7,type:"zoom",title:"Block 1 — Non-Negotiables + Floor Standard",meta:"Live video · 75 min · every coach",
 sections:[
  {label:"Open with",items:["Their own five written answers, read back to the room anonymised — where they already agree, write it and move; where they split, that's the discussion"]},
  {label:"Produces",items:["§1 Non-Negotiables, max seven, each observable from the door","§2 Floor Standard — phase, time, coach position, coach behavior, transition rules, late arrival, end reset"]}
 ]},

{s:9,e:9,type:"zoom",title:"Block 2 — The Coaching Standard",meta:"Live video · 75 min · every coach",
 sections:[{label:"Produces",items:["The block that needs real argument: teaching sequence, correction hierarchy, load selection, what gets corrected immediately vs held to the next set, buy-in behaviors in the first five minutes"]},{label:"Owner runs the room",items:["You drive content from the screen; he manages the humans. Try to do both from a TV and you'll do neither."]}]},

{s:11,e:11,type:"zoom",title:"Block 3 — Data Standard, Ownership, Signatures",meta:"Live video · 75 min · every coach",
 sections:[
  {label:"Produces",items:["§4 Data Standard — what's recorded, who records it, by when, where it lives","§5 named owner and review date per section","§6 Commitment"]},
  {label:"Signatures",items:["Wet ink on the shipped heavy stock. Read §6 out loud first.","Photographed and sent to you before anyone leaves the room — not that evening, not the next morning"]}
 ],
 flag:"Do not substitute DocuSign here. The ceremony is the mechanism."},

{s:12,e:12,type:"zoom",title:"Core 4 install",meta:"Zoom 60 min + async correction",
 sections:[
  {label:"Doc / App",items:["You teach it on video, they run it on the floor immediately after and film themselves doing it","You send corrections within 24 hours, by name"]},
  {label:"Also today",items:["Start State defined, photographed by the owner, placard posted","Day-One Expectations written"]}
 ]},

{s:13,e:13,type:"other",title:"EAP posted, filmed",meta:"Owner executes · you review",
 sections:[{label:"Owner does",items:["Films the walk to every entrance with the card going up, and the AED with the pad expiry legible"]}],
 flag:"This is the liability item — it does not go up on trust."},

{s:14,e:14,type:"desk",title:"Type it and close out",meta:"Your desk 2 hrs · owner sends",
 sections:[{label:"Doc",items:["Typed doc distributed within 72 hours of Block 3, posted, photographed posted"]},{label:"App",items:["Console export seeds the Certification Tracker"]}]},

{s:21,e:21,type:"zoom",title:"Flow & Capacity",meta:"Zoom · 2 hrs · owner",
 sections:[{label:"Doc",items:["Quality Ceiling set once — APS max 3 high-touch or 4 volume, CAR max 20, hard ceiling 25"]},{label:"App",items:["Capacity map, breach panel resolved live, block templates generated per slot length"]},{label:"Owner",items:["Prints and posts block templates at the door, sends a photo"]}]},

{s:22,e:22,type:"zoom",title:"Filler Standard",meta:"Zoom · 45 min · coaches",
 sections:[{label:"Doc",items:["Written live with the coaches, station by station — owner posts and photographs each station"]}]},

{s:24,e:24,type:"zoom",title:"Makeup policy",meta:"Zoom · 45 min · owner only",
 sections:[{label:"Doc",items:["Notice window, two per cycle, 14-day expiry, eligibility table, four desk scripts"]}]},

{s:25,e:25,type:"desk",title:"Dead Time baseline",meta:"Your desk · 45 min",
 sections:[{label:"App",items:["Scored off the Day 0 footage you already have"]}]},

{s:28,e:28,type:"zoom",title:"Exercise Selection",meta:"Zoom · 2.5 hrs · one person",
 sections:[{label:"App",items:["Screen-share the Facility System Builder, build all 52 weeks live, group by group"]},{label:"Doc",items:["Substitution rules for this facility's equipment, written and posted"]}]},

{s:31,e:31,type:"zoom",title:"Read-and-log call",meta:"Zoom · 45 min · all coaches",
 sections:[{label:"Doc",items:["Activate §4 Data Standard — enforcement, not new writing"]}],
 flag:"Logging lives in the close block."},

{s:35,e:35,type:"other",title:"Capture Cycle 2",meta:"Facility executes",
 sections:[{label:"Facility does",items:["Every group filmed again, photo checklist again, three different stations chosen by you"]}]},

{s:36,e:36,type:"zoom",title:"Coverage & handoff",meta:"Zoom · 45 min",
 sections:[{label:"Doc",items:["Who runs which group when a coach is out, by name, with a backup column"]}]},

{s:37,e:37,type:"desk",title:"Day 30-equivalent checkpoint",meta:"Your desk 1 hr + Zoom 30 min",
 sections:[{label:"App",items:["SAR first real read","Certification-90 checkpoint","Tier 1 sign-offs scored from cycle-2 video"]}],
 flag:"The only gate that matters today: logging is moving."},

{s:42,e:42,type:"zoom",title:"ABIR + Return-to-Train",meta:"Zoom · 2.5 hrs · all coaches",
 sections:[{label:"Doc",items:["Athlete Onboarding Standard · Train-Around Standard · Return-to-Lift rungs · Tier 2+ modification rule"]},{label:"App",items:["Onboarding Board · Limitation Board → Ladder Board → Handoff Desk chain demonstrated"]}]},

{s:44,e:44,type:"zoom",title:"Bands, clinics, rehearsal",meta:"Zoom · 60 min · owner",
 sections:[{label:"Doc",items:["Progress-visibility bands set once · three clinics named and loaded into the Handoff Desk · EAP rehearsal scheduled, to be filmed"]}]},

{s:49,e:49,type:"zoom",title:"Cadence build",meta:"Zoom · 2 hrs · owner + group coaches",
 sections:[{label:"Doc",items:["Facility Cadence Sheet — silence threshold, channel of record, inbound standard, testing cycle, three Onboarding Touches"]},{label:"App",items:["<b>Silence Gap Console</b> — baseline measured today"]}]},

{s:51,e:51,type:"zoom",title:"Complaint protocol",meta:"Zoom · 45 min · owner + desk",
 sections:[{label:"Doc",items:["Escalation ladder, ownership, response windows"]},{label:"App",items:["Complaint Log live from today"]}]},

{s:52,e:52,type:"other",title:"Owner's recurring review",meta:"5 min · permanent",
 sections:[{label:"App",items:["Silence Gap review on his calendar, same day/time, forever"]}]},

{s:56,e:56,type:"other",title:"EAP rehearsal, filmed",meta:"Facility executes · you review",
 sections:[{label:"Facility does",items:["Coaches run it, someone films it, you watch"]}]},

{s:58,e:58,type:"other",title:"Capture Cycle 3 — Tier 2 footage",meta:"Facility executes",
 sections:[{label:"Facility does",items:["One full unbroken session per coach — not clips"]}]},

{s:59,e:62,type:"desk",title:"Score Tier 2",meta:"Your desk · 3 hrs",
 sections:[{label:"App",items:["<b>Certification Tracker</b> — you sign these yourself"]}]},

{s:63,e:63,type:"zoom",title:"Testing Day",meta:"Coach-run · you on Zoom hour 1",
 sections:[{label:"Facility does",items:["They run it, filmed throughout"]},{label:"You do",items:["Live on screen the first hour as backup, then drop off"]}],
 flag:"The retest cycle must complete before Day 97 or the testing gate cannot score 100%."},

{s:65,e:65,type:"zoom",title:"First Proof Report",meta:"Zoom · 45 min · owner",
 sections:[{label:"App",items:["Build one group's report as the template he copies"]}]},

{s:67,e:67,type:"zoom",title:"Handover + Day 60 stop",meta:"Zoom · 90 min · owner",
 sections:[{label:"Doc",items:["Binder and file handover by screen-share"]},{label:"App",items:["Owner runs the SAR himself while you watch","Continuity Check re-run on domains 1–4"]}],
 flag:"Certify a Tier 3 champion inside the building by today, or accept that this facility is a one-off. Zero-visit as a repeatable product needs someone certified on-site — otherwise every future audit depends on the facility remembering to film."},

{s:70,e:70,type:"zoom",title:"Weekly rhythm begins",meta:"Zoom · 30 min · same day every week",
 sections:[{label:"App",items:["Read the SAR before the call, never during it"]}]},

{s:72,e:72,type:"other",title:"Proof Reports to every family",meta:"Owner sends",
 sections:[{label:"App",items:["Proof Report Builder, every group"]}]},

{s:77,e:77,type:"zoom",title:"Re-enrollment loaded",meta:"Zoom · 30 min",
 sections:[{label:"App",items:["Board loaded with cycle-end dates"]},{label:"Doc",items:["Conversation script handed to the owner"]}]},

{s:82,e:82,type:"zoom",title:"Drift check",meta:"Zoom · 45 min + Capture Cycle 4",
 sections:[{label:"App",items:["Drift Log — individual vs systemic drift routed differently"]}]},

{s:87,e:87,type:"desk",title:"Certification sweep",meta:"Your desk · 1 hr",
 sections:[{label:"App",items:["Every coach at Tier 2 or on a dated plan to get there"]}]},

{s:92,e:92,type:"desk",title:"Pre-certification fix window",meta:"Whatever it takes",
 sections:[{label:"App",items:["Run certification-90 early against the trailing 28 days"]}]},

{s:94,e:94,type:"other",title:"The Access Test — filmed",meta:"Facility executes",
 sections:[{label:"Facility does",items:["The newest coach or front desk attempts to open and run the first 20 minutes unaided, on camera. Nobody helps, nobody prompts."]}],
 output:"Scored against the baseline Access test filmed on Day 0."},

{s:96,e:96,type:"desk",title:"ABIR re-run",meta:"Your desk · 90 min",
 sections:[{label:"App",items:["Scored off capture cycle 4 — same groups, same indicators, against the Day 1 baseline"]}]},

{s:97,e:97,type:"zoom",title:"Certification",meta:"Zoom · 90 min · owner",
 sections:[{label:"App",items:["Four gates: logged 90%, attendance 90%, testing 100%, on plan 85% — all four, not the average"]},{label:"Doc",items:["Result dated and issued in writing, or the extension declared"]}]}
];

// ============================================================
// SCHEDULE REGISTRY
// ============================================================
const SCHEDULES = {
 1:{ id:1, label:"The Full Install", tag:"9 visits",
     stats:"9 on-site sessions · ~46 hrs across 90 days",
     minDay:0, maxDay:90, events:EVENTS_1, phases:PHASES_1,
     dayZeroLabel:"Day 0 — audit day (on-site)" },
 2:{ id:2, label:"The One-Visit Install", tag:"1 visit",
     stats:"1 on-site day (Day 7, 5 hrs) · ~26 hrs across 90 days",
     minDay:0, maxDay:90, events:EVENTS_A, phases:PHASES_A,
     dayZeroLabel:"Day 0 — remote audit day" },
 3:{ id:3, label:"The Zero-Visit Install", tag:"0 visits",
     stats:"Never on-site · ~28 hrs across 97 days (incl. pre-work)",
     minDay:-7, maxDay:97, events:EVENTS_B, phases:PHASES_B,
     dayZeroLabel:"Day 0 — remote audit day (kit ships 7 days earlier)" }
};

// ============================================================
// STATE
// ============================================================
let INSTALL_START = null;
let SELECTED_SCHED = 1;
let SCHED = SCHEDULES[1];

function isAppSection(label){
  return /app/i.test(label || "");
}

function buildSchedPicker(){
  const wrap = document.getElementById('schedGrid');
  wrap.innerHTML = '';
  [1,2,3].forEach(id=>{
    const s = SCHEDULES[id];
    const card = document.createElement('div');
    card.className = 'schedcard' + (id===SELECTED_SCHED ? ' selected' : '');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.onclick = function(){ selectSched(id); };
    card.onkeydown = function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); selectSched(id); } };
    card.innerHTML =
      "<div class='stop'><div class='stop2'><span class='sradio'></span><span class='snm'>Option "+id+" — "+s.label+"</span></div><span class='stag'>"+s.tag+"</span></div>"+
      "<div class='sstats'>"+s.stats+"</div>";
    wrap.appendChild(card);
  });
}

function selectSched(id){
  SELECTED_SCHED = id;
  SCHED = SCHEDULES[id];
  buildSchedPicker();
  const label = document.getElementById('startLabel');
  if(label) label.textContent = SCHED.dayZeroLabel;
  generateCalendar();
}

function generateCalendar(){
  const startVal = document.getElementById('startInput').value;
  const err = document.getElementById('setupErr');
  if(!startVal || !SELECTED_SCHED){
    if(err) err.style.display = 'block';
    return;
  }
  if(err) err.style.display = 'none';
  const parts = startVal.split('-').map(Number);
  INSTALL_START = utc(parts[0], parts[1]-1, parts[2]);
  SCHED = SCHEDULES[SELECTED_SCHED];

  const calApp = document.getElementById('calApp');
  if(calApp) calApp.style.display = 'block';

  const end = addDays(INSTALL_START, SCHED.maxDay);
  const startLine = SCHED.minDay < 0 ? (fmt(addDays(INSTALL_START,SCHED.minDay)) + " (kit ships)") : fmt(INSTALL_START);
  document.getElementById('dateRange').innerHTML =
    "<b>Starts:</b> " + startLine + " &nbsp;·&nbsp; <b>Certification:</b> " + fmt(end);
  document.getElementById('schedTag').textContent = "Option " + SCHED.id + " — " + SCHED.label;

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

  grid.style.gridTemplateColumns = "78px repeat(" + (maxWeeks*7) + ", minmax(30px,1fr))";

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
      (d<0 ? "This falls in the pre-work window before Day 0." :
       d<=SCHED.events.reduce(function(mx,e){ return Math.max(mx,e.e); },0) ?
       "The facility runs on whatever has been installed so far — no new session today." :
       "This falls inside the retainer window between the fixed check-ins below.") +
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

buildSchedPicker();
(function(){
  const t = new Date();
  const iso = t.getFullYear() + '-' + String(t.getMonth()+1).padStart(2,'0') + '-' + String(t.getDate()).padStart(2,'0');
  const startInput = document.getElementById('startInput');
  startInput.value = iso;
  startInput.addEventListener('change', generateCalendar);
  generateCalendar();
})();
