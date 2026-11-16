// Jamii Harness v0.1.0 (Phase 1 prototype). MIT License. Zero dependencies.
// A small, model-agnostic harness that orchestrates context + a model + teacher approval
// for formative-assessment coordination between a teacher and an AI tutor.
export const VERSION = '0.1.0';
const est = t => Math.ceil(String(t).length / 4); // rough token estimate, no tokenizer needed

/* ---------- Guards ---------- */
export function maskPII(text) {
  return String(text)
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[id]')
    .replace(/\+?\d[\d\s().-]{8,}\d/g, '[phone]');
}
export function assertPseudonymous(students) {
  for (const s of students) {
    if (!/^[A-Za-z0-9_-]{1,12}$/.test(String(s.id))) throw new Error('Student ids must be short pseudonyms (letters/digits).');
    for (const k of ['name', 'fullName', 'email', 'phone', 'address', 'dob'])
      if (k in s) throw new Error('Field "' + k + '" is not allowed. Use pseudonymous ids only.');
  }
}
const BOUNDARY = /\b(diagnos|disorder|disabilit|medicat|final grade|retain|expel|punish)\w*/i;

/* ---------- Learning-science skills (the "context" the harness can load) ---------- */
export const SKILLS = [
  { id: 'misconceptions', tasks: ['adaptPlan', 'differentiate', 'strategySupport'], concept: 'Misconceptions',
    text: 'Name the specific misconception behind repeated errors, then repair it with a targeted representation before more practice.' },
  { id: 'productive-struggle', tasks: ['differentiate', 'strategySupport', 'goalsTracking'], concept: 'Productive struggle',
    text: 'Learners benefit from effort before help. Delay hints until the learner has tried and explained their thinking. Stop struggle when it turns into repeated, unproductive failure.' },
  { id: 'zpd', tasks: ['differentiate', 'adaptPlan'], concept: 'Zone of proximal development',
    text: 'Aim the next task slightly above current mastery (about +0.15) with scaffolds that fade as mastery grows.' },
  { id: 'cognitive-load', tasks: ['adaptPlan', 'differentiate', 'strategySupport'], concept: 'Cognitive load',
    text: 'When a learner is overloaded, reduce extraneous load: one idea at a time, a worked example, then fade support.' },
  { id: 'teacher-agency', tasks: ['adaptPlan', 'differentiate', 'strategySupport', 'goalsTracking'], concept: 'Teacher agency',
    text: 'Recommend, never decide. Respect teacher constraints exactly. Escalate to the teacher when a student seems disengaged or distressed.' }
];

/* ---------- Public goods registry (adapters) ---------- */
export class PublicGoods {
  constructor() { this.goods = new Map(); }
  register(good) { // {id, type, license, version, source, items | load()}
    if (!good.id || !good.license) throw new Error('A public good needs an id and a license.');
    if (!/^(CC-BY-4\.0|MIT|Apache-2\.0|CC0-1\.0)$/.test(good.license)) throw new Error('License not accepted by this program: ' + good.license);
    this.goods.set(good.id, good);
  }
  async items(id) { const g = this.goods.get(id); if (!g) return []; return g.items || (g.load ? await g.load() : []); }
  list() { return [...this.goods.values()].map(g => ({ id: g.id, type: g.type, license: g.license, version: g.version || '', source: g.source || '' })); }
}

/* ---------- Reference model: deterministic, offline, auditable ---------- */
const byCode = (mis, code) => (mis || []).find(m => m.code === code);
const topError = s => { const c = {}; (s.errors || []).forEach(e => c[e] = (c[e] || 0) + 1); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]; };
const REF = {
  adaptPlan({ students, misconceptions }) {
    const tally = {}; students.forEach(s => (s.errors || []).forEach(e => (tally[e] = tally[e] || new Set()).add(s.id)));
    const items = [];
    Object.entries(tally).sort((a, b) => b[1].size - a[1].size).forEach(([code, ids]) => {
      const m = byCode(misconceptions, code) || { name: code, repair: 'Re-teach with a worked example.' };
      if (ids.size >= 2) items.push({ type: 'reteach', target: [...ids].sort().join(','), misconception: code, action: 'Add a 5-minute mini-lesson: ' + m.repair, rationale: ids.size + ' students show "' + m.name + '". Repair the misconception before more practice.', concept: 'Misconceptions' });
    });
    students.filter(s => s.mastery >= 0.75 && !(s.errors || []).length).forEach(s => items.push({ type: 'extend', target: s.id, misconception: '', action: 'Offer a challenge one step harder (mixed-number sums).', rationale: 'Mastery ' + s.mastery + ' with no errors. Keep the task inside the zone of proximal development.', concept: 'Zone of proximal development' }));
    const overloaded = students.filter(s => s.mood === 'frustrated' && s.hintsUsed >= 4);
    if (overloaded.length) items.push({ type: 'strategy', target: overloaded.map(s => s.id).sort().join(','), misconception: '', action: 'Reduce load: show one worked example, then a matching problem with fewer steps.', rationale: 'Frustration with heavy hint use suggests overload.', concept: 'Cognitive load' });
    return { task: 'adaptPlan', items };
  },
  differentiate({ students, teacherInput, misconceptions }) {
    const minTries = /try before/i.test(teacherInput && teacherInput.focus || '') ? 2 : 1;
    const plans = students.map(s => {
      const te = topError(s), m = te && byCode(misconceptions, te[0]);
      const scaffold = s.mastery < 0.4 ? 'worked example, then faded steps' : s.mastery < 0.7 ? 'guided hint ladder' : 'challenge with minimal hints';
      return { student: s.id, targetDifficulty: Math.min(1, +(s.mastery + 0.15).toFixed(2)), scaffold, focusMisconception: te ? te[0] : '', tutorInstruction: 'Ask the student to try ' + minTries + ' time(s) and explain their thinking before giving a hint. ' + (m ? 'Then repair: ' + m.repair : 'Then extend with a harder problem.'), teacherNote: (teacherInput && teacherInput.pairing && teacherInput.pairing.includes(s.id)) ? 'Teacher constraint: ' + teacherInput.pairing : '' };
    });
    return { task: 'differentiate', plans };
  },
  strategySupport({ student }) {
    const sg = student.signals || {};
    if (sg.mood === 'disengaged') return { task: 'strategySupport', student: student.id, recommendation: 'Pause the tutor and ask the teacher to check in.', why: 'Signals of disengagement. A person should respond.', escalateToTeacher: true };
    if (sg.mood === 'frustrated' && (sg.repeatedError || 0) >= 3) return { task: 'strategySupport', student: student.id, recommendation: 'Stop hints. Show a worked example for the repeated error, then a similar problem with one fewer step.', why: 'The same error three or more times is unproductive struggle and a sign of high cognitive load.', escalateToTeacher: (sg.hintsUsed || 0) >= 4 };
    if ((sg.attempts || 0) < 3 && (sg.minutes || 0) < 5 && (sg.hintsUsed || 0) >= 2) return { task: 'strategySupport', student: student.id, recommendation: 'Hold back the next hint. Ask: "What have you tried, and what do you notice?"', why: 'Hints arrived before real effort. Productive struggle builds understanding.', escalateToTeacher: false };
    return { task: 'strategySupport', student: student.id, recommendation: 'Continue as planned and keep the hint ladder.', why: 'No warning signals.', escalateToTeacher: false };
  },
  goalsTracking({ tutorStats, teacherInput }) {
    const goals = [];
    if (tutorStats.avgSecondsBeforeHint < 30) goals.push({ owner: 'tutor', metric: 'avgSecondsBeforeHint', baseline: tutorStats.avgSecondsBeforeHint, target: 30, how: 'Wait for an attempt before offering a hint.', review: 'weekly' });
    if (tutorStats.avgHintsPerStudent > 1.5) goals.push({ owner: 'tutor', metric: 'avgHintsPerStudent', baseline: tutorStats.avgHintsPerStudent, target: 1.5, how: 'Use the hint ladder: nudge, then example, then step.', review: 'weekly' });
    goals.push({ owner: 'teacher', metric: 'frustratedStudentCheckins', baseline: 0, target: 2, how: 'Check in with students the harness flags, and record what helped.', review: 'weekly' });
    if (teacherInput && teacherInput.focus) goals.push({ owner: 'teacher', metric: 'goalAlignment', baseline: 'unset', target: 'agreed', how: 'Teacher goal: ' + teacherInput.focus, review: 'monthly' });
    return { task: 'goalsTracking', goals };
  }
};
export class ReferenceModel {
  constructor() { this.name = 'reference-model (deterministic, offline)'; }
  async complete(req) { return JSON.stringify(REF[req.task](req.input)); }
}
/* Any OpenAI-compatible endpoint, including open-weight models served locally (Ollama, vLLM, llama.cpp). */
export class OpenAICompatModel {
  constructor({ baseUrl, apiKey = '', model, fetchImpl }) { Object.assign(this, { baseUrl: baseUrl.replace(/\/$/, ''), apiKey, model, fetchImpl: fetchImpl || (typeof fetch !== 'undefined' ? fetch.bind(globalThis) : null) }); this.name = model + ' via ' + baseUrl; }
  async complete(req) {
    const headers = { 'Content-Type': 'application/json' }; if (this.apiKey) headers.Authorization = 'Bearer ' + this.apiKey;
    const r = await this.fetchImpl(this.baseUrl + '/chat/completions', { method: 'POST', headers, body: JSON.stringify({ model: this.model, temperature: 0.2, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: req.system }, { role: 'user', content: req.prompt }] }) });
    if (!r.ok) throw new Error('Model endpoint returned ' + r.status);
    const j = await r.json(); return j.choices[0].message.content;
  }
}

/* ---------- Output validation ---------- */
const SCHEMA = {
  adaptPlan: o => Array.isArray(o.items) && o.items.every(i => i.type && i.action && i.rationale),
  differentiate: o => Array.isArray(o.plans) && o.plans.every(p => p.student && p.scaffold && p.tutorInstruction),
  strategySupport: o => o.student && o.recommendation && o.why && typeof o.escalateToTeacher === 'boolean',
  goalsTracking: o => Array.isArray(o.goals) && o.goals.every(g => g.owner && g.metric && g.how)
};
export const TASKS = Object.keys(SCHEMA);
const scrub = v => typeof v === 'string' ? maskPII(v) : Array.isArray(v) ? v.map(scrub) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, scrub(x)])) : v;
const flatText = v => typeof v === 'string' ? v : Array.isArray(v) ? v.map(flatText).join(' ') : v && typeof v === 'object' ? Object.values(v).map(flatText).join(' ') : '';

/* ---------- Fairness audit (descriptive, for the teacher) ---------- */
export function auditFairness(students, output) {
  const grp = Object.fromEntries(students.map(s => [s.id, s.group || 'all']));
  const rows = {}; const bump = (g, k) => { rows[g] = rows[g] || { n: 0, reteach: 0, workedExample: 0, escalate: 0 }; rows[g][k]++; };
  students.forEach(s => { rows[grp[s.id]] = rows[grp[s.id]] || { n: 0, reteach: 0, workedExample: 0, escalate: 0 }; rows[grp[s.id]].n++; });
  (output.plans || []).forEach(p => { if (/worked example/.test(p.scaffold)) bump(grp[p.student] || 'all', 'workedExample'); });
  (output.items || []).forEach(i => String(i.target).split(',').forEach(t => { if (i.type === 'reteach' && grp[t]) bump(grp[t], 'reteach'); }));
  if (output.escalateToTeacher && output.student) bump(grp[output.student] || 'all', 'escalate');
  const rates = Object.entries(rows).map(([g, r]) => ({ group: g, n: r.n, workedExampleRate: +(r.workedExample / r.n).toFixed(2), reteachRate: +(r.reteach / r.n).toFixed(2) }));
  const mx = Math.max(...rates.map(r => r.workedExampleRate)), mn = Math.min(...rates.map(r => r.workedExampleRate));
  const flags = (mx > 0 && rates.length > 1 && (mn === 0 || mx / mn >= 2)) ? ['Support levels differ across groups (' + mx + ' vs ' + mn + '). Check that differences reflect need, not group labels.'] : [];
  return { rates, flags, note: 'Groups here are classroom groups. Any use of demographic groups needs consent and ethics review.' };
}

/* ---------- The harness ---------- */
export function createHarness({ model = new ReferenceModel(), goods = new PublicGoods(), budgetTokens = 1200, memory = [] } = {}) {
  const proposals = new Map(), audit = []; let seq = 0;
  const log = (event, detail) => audit.push({ t: seq++, event, ...detail });
  async function buildContext(task, input) {
    const items = [{ kind: 'system', id: 'system', text: 'You help a teacher plan formative assessment with an AI tutor. Respond with JSON only. Recommend; the teacher decides. Use only the pseudonymous ids given.', why: 'always' }];
    SKILLS.filter(s => s.tasks.includes(task)).forEach(s => items.push({ kind: 'skill', id: s.id, text: s.text, why: 'relevant to ' + task + ' (' + s.concept + ')' }));
    memory.filter(m => m.tasks.includes(task)).forEach(m => items.push({ kind: 'memory', id: m.id, text: m.text, why: 'teacher memory for ' + task }));
    for (const g of goods.list()) { const it = await goods.items(g.id); if (it.length) items.push({ kind: 'public-good', id: g.id, text: JSON.stringify(it), why: 'public good (' + g.license + ') supplies repair strategies' }); }
    let used = 0; const trace = [];
    for (const it of items) { const t = est(it.text); const ok = used + t <= budgetTokens || it.kind === 'system'; if (ok) used += t; trace.push({ kind: it.kind, id: it.id, tokens: t, included: ok, why: ok ? it.why : 'dropped: over the ' + budgetTokens + '-token budget' }); it.included = ok; }
    return { items: items.filter(i => i.included), trace, tokens: used };
  }
  async function run(task, rawInput) {
    if (!SCHEMA[task]) throw new Error('Unknown task: ' + task);
    const input = scrub(rawInput); if (input.students) assertPseudonymous(input.students); if (input.student) assertPseudonymous([input.student]);
    const ctx = await buildContext(task, input);
    const misconceptions = []; for (const g of goods.list()) (await goods.items(g.id)).forEach(i => { if (i.code) misconceptions.push(i); });
    const req = { task, input: { ...input, misconceptions }, system: ctx.items.find(i => i.kind === 'system').text, prompt: ctx.items.filter(i => i.kind !== 'system').map(i => '[' + i.kind + ':' + i.id + '] ' + i.text).join('\n') + '\nTASK: ' + task + '\nINPUT: ' + JSON.stringify(input) + '\nReturn JSON for the task.' };
    const t0 = Date.now(); let out, fellBack = false, schemaOk = true, err = '';
    try { out = JSON.parse(await model.complete(req)); if (!SCHEMA[task](out)) throw new Error('Output did not match the task schema'); }
    catch (e) { schemaOk = false; err = e.message; out = JSON.parse(await new ReferenceModel().complete(req)); fellBack = true; }
    out = scrub(out); const flags = BOUNDARY.test(flatText(out)) ? ['Output touches a topic reserved for the teacher or specialists. Review carefully.'] : [];
    const p = { id: 'P' + (++seq), task, status: 'pending', output: out, flags, fairness: auditFairness(input.students || (input.student ? [input.student] : []), out), trace: { model: model.name, latencyMs: Date.now() - t0, schemaOk, fellBack, error: err, tokens: ctx.tokens, context: ctx.trace } };
    proposals.set(p.id, p); log('proposed', { id: p.id, task, fellBack }); return p;
  }
  function decide(id, decision, { edit, note } = {}) {
    const p = proposals.get(id); if (!p) throw new Error('No such proposal'); if (!['approve', 'edit', 'reject'].includes(decision)) throw new Error('Decision must be approve, edit or reject');
    if (decision === 'edit') { if (!edit) throw new Error('Provide the edited output'); p.output = scrub(edit); }
    p.status = decision === 'reject' ? 'rejected' : 'approved'; p.note = maskPII(note || ''); log(decision, { id, note: p.note }); return p;
  }
  function apply(id, effect) { const p = proposals.get(id); if (!p || p.status !== 'approved') throw new Error('Teacher approval is required before anything is applied.'); log('applied', { id }); return effect ? effect(p.output) : p.output; }
  return { run, decide, apply, get: id => proposals.get(id), audit: () => audit.slice(), exportTrace: () => JSON.stringify({ version: VERSION, audit, proposals: [...proposals.values()] }, null, 2), goods };
}
