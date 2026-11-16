import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHarness, PublicGoods, OpenAICompatModel, maskPII, auditFairness, TASKS, SKILLS } from '../src/harness.js';

const room = JSON.parse(readFileSync(new URL('../data/sample-classroom.json', import.meta.url)));
const mis = JSON.parse(readFileSync(new URL('../data/misconceptions.json', import.meta.url)));
const mk = (opts = {}) => { const goods = new PublicGoods(); goods.register({ id: mis.id, type: 'misconception-set', license: 'CC-BY-4.0', version: mis.version, items: mis.items }); return createHarness({ goods, ...opts }); };
const input = { students: room.students, tutorStats: room.tutorStats, teacherInput: room.teacherInput };

test('four tasks run and match their schema', async () => {
  const h = mk();
  assert.equal(TASKS.length, 4);
  for (const t of TASKS) { const p = await h.run(t, t === 'strategySupport' ? { student: { id: 'S1', signals: { mood: 'frustrated', repeatedError: 3, hintsUsed: 4, attempts: 5, minutes: 9 } } } : input); assert.equal(p.trace.schemaOk, true, t); assert.equal(p.status, 'pending'); }
});
test('adaptPlan finds the shared misconception and names the repair', async () => {
  const p = await mk().run('adaptPlan', input);
  const r = p.output.items.find(i => i.type === 'reteach' && i.misconception === 'add-denominators');
  assert.ok(r); assert.match(r.action, /fraction bar/); assert.deepEqual(r.target.split(',').sort(), ['S1', 'S2', 'S6']);
});
test('differentiate respects teacher input and the ZPD', async () => {
  const p = await mk().run('differentiate', input);
  const s1 = p.output.plans.find(x => x.student === 'S1');
  assert.equal(s1.targetDifficulty, 0.45); assert.match(s1.scaffold, /worked example/); assert.match(s1.tutorInstruction, /try 2 time/); assert.match(s1.teacherNote, /Avoid pairing/);
});
test('strategySupport: frustration escalates, disengagement goes to a person, early hints are held back', async () => {
  const h = mk();
  const a = await h.run('strategySupport', { student: { id: 'S1', signals: { mood: 'frustrated', repeatedError: 3, hintsUsed: 4 } } });
  assert.match(a.output.recommendation, /worked example/); assert.equal(a.output.escalateToTeacher, true);
  const b = await h.run('strategySupport', { student: { id: 'S6', signals: { mood: 'disengaged' } } }); assert.equal(b.output.escalateToTeacher, true);
  const c = await h.run('strategySupport', { student: { id: 'S2', signals: { attempts: 1, minutes: 2, hintsUsed: 2, mood: 'engaged' } } }); assert.match(c.output.recommendation, /Hold back/);
});
test('goals give tutor and teacher measurable targets', async () => {
  const p = await mk().run('goalsTracking', input);
  assert.ok(p.output.goals.some(g => g.owner === 'tutor' && g.metric === 'avgSecondsBeforeHint' && g.target === 30));
  assert.ok(p.output.goals.some(g => g.owner === 'teacher'));
});
test('nothing is applied without teacher approval; decisions are audited', async () => {
  const h = mk(); const p = await h.run('goalsTracking', input);
  assert.throws(() => h.apply(p.id), /approval/);
  h.decide(p.id, 'approve', { note: 'Looks good. Call me on 617-555-0100' });
  assert.ok(h.apply(p.id)); assert.ok(!h.get(p.id).note.includes('617')); assert.ok(h.audit().some(a => a.event === 'applied'));
  const q = await h.run('goalsTracking', input); h.decide(q.id, 'reject'); assert.throws(() => h.apply(q.id), /approval/);
});
test('privacy: PII masked, real names rejected', async () => {
  assert.equal(maskPII('mail a@b.org or 617-555-0100'), 'mail [email] or [phone]');
  await assert.rejects(() => mk().run('adaptPlan', { ...input, students: [{ id: 'S1', name: 'Real Name', mastery: 0.2, errors: [] }] }), /not allowed/);
  await assert.rejects(() => mk().run('adaptPlan', { ...input, students: [{ id: 'Jane Doe at home', mastery: 0.2, errors: [] }] }), /pseudonyms/);
});
test('context is minimal and observable: skills are task-specific and a budget is enforced', async () => {
  const p = await mk({ budgetTokens: 60 }).run('goalsTracking', input);
  assert.ok(p.trace.context.some(c => !c.included && /over the 60/.test(c.why)));
  assert.ok(!p.trace.context.some(c => c.id === 'misconceptions' && c.included));
  const full = await mk().run('adaptPlan', input); assert.ok(full.trace.context.find(c => c.id === 'misconceptions').included);
  assert.ok(SKILLS.every(s => s.concept && s.text));
});
test('bad model output falls back safely and is reported', async () => {
  const h = mk({ model: { name: 'broken', complete: async () => 'not json' } });
  const p = await h.run('adaptPlan', input); assert.equal(p.trace.fellBack, true); assert.equal(p.trace.schemaOk, false);
});
test('OpenAI-compatible adapter: user chooses model and key, request is well formed', async () => {
  let seen;
  const fetchImpl = async (url, init) => { seen = { url, init }; return { ok: true, json: async () => ({ choices: [{ message: { content: JSON.stringify({ goals: [{ owner: 'teacher', metric: 'm', how: 'h' }] }) } }] }) }; };
  const model = new OpenAICompatModel({ baseUrl: 'http://localhost:11434/v1/', apiKey: 'k', model: 'llama3', fetchImpl });
  const p = await mk({ model }).run('goalsTracking', input);
  assert.equal(seen.url, 'http://localhost:11434/v1/chat/completions'); assert.equal(JSON.parse(seen.init.body).model, 'llama3'); assert.equal(seen.init.headers.Authorization, 'Bearer k');
  assert.equal(p.trace.fellBack, false); assert.equal(p.output.goals[0].metric, 'm');
  const sent = JSON.parse(seen.init.body).messages[1].content;
  assert.ok(sent.includes('"id":"S1"')); assert.ok(!/"(fullName|email|phone|address|dob)"/.test(sent));
});
test('public goods must carry an accepted open license', () => {
  const g = new PublicGoods(); assert.throws(() => g.register({ id: 'x', license: 'proprietary' }), /License/); assert.throws(() => g.register({ id: 'y' }), /license/);
});
test('fairness audit reports rates by group and flags big gaps', async () => {
  const p = await mk().run('differentiate', input); const a = p.fairness;
  assert.ok(a.rates.length === 3 && a.note.includes('consent')); assert.ok(Array.isArray(a.flags));
  const f = auditFairness([{ id: 'A1', group: 'x' }, { id: 'B1', group: 'y' }], { plans: [{ student: 'A1', scaffold: 'worked example, then faded steps' }, { student: 'B1', scaffold: 'challenge' }] });
  assert.equal(f.flags.length, 1);
});
