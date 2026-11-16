# Jamii Harness

An open, model-agnostic **harness** that helps a teacher and an AI tutor coordinate formative assessment, with the teacher always in charge.
Phase 1 prototype (v0.1.0) for the K-12 AI Infrastructure program ("Integrating Digital Public Goods to Advance AI-Enabled Formative Assessment").

- Code: MIT. Sample data and misconception set: CC-BY-4.0. No dependencies.
- Data: **synthetic only**. No real students.
- Status: research prototype. Not validated in real classrooms. Not a product.

## Try it
Open `demo.html` in a browser (one file, works offline), or run the tests:

    node --test        # Node 18+; 12 tests

## Four tasks
| Task | What it returns |
|---|---|
| `adaptPlan` | Whole-class lesson changes, tied to shared misconceptions |
| `differentiate` | Per-student next level, scaffold and tutor instruction, honoring teacher input |
| `strategySupport` | One student: hold hints, show a worked example, or escalate to the teacher |
| `goalsTracking` | Measurable goals for the tutor and for the teacher |

## Design
- **Context assembly under a token budget**, with a trace showing what was included or dropped, and why.
- **Skills** grounded in learning science: misconceptions, productive struggle, zone of proximal development, cognitive load, teacher agency.
- **Model adapters:** a deterministic offline `ReferenceModel`, and `OpenAICompatModel` for any OpenAI-compatible endpoint (including open-weight models via Ollama or vLLM).
- **Schema validation** with a safe fallback to the reference model, reported in the trace.
- **Privacy:** pseudonymous ids only; name, email, phone, address and date-of-birth fields are rejected; emails, phone numbers and ID-like numbers are masked.
- **Human in the loop:** `apply()` throws until a teacher approves; `decide()` supports approve, edit, reject; every step is in the audit log.
- **Fairness audit:** support rates by classroom group, with a flag for large gaps. Demographic groups need consent and ethics review.
- **Public goods registry:** accepts only CC-BY-4.0, MIT, Apache-2.0 or CC0-1.0 items.

## Use it
```js
import { createHarness, PublicGoods, OpenAICompatModel } from './src/harness.js';
const goods = new PublicGoods();
goods.register({ id: 'misconceptions', type: 'misconception-set', license: 'CC-BY-4.0', items: [...] });
const h = createHarness({ goods /*, model: new OpenAICompatModel({ baseUrl, model }) */ });
const proposal = await h.run('adaptPlan', { students, tutorStats, teacherInput });
h.decide(proposal.id, 'approve');
const result = h.apply(proposal.id);
```
Rebuild the one-file demo after edits: `python3 build.py`.

## Honest limits
- The reference model is rule-based; the OpenAI-compatible adapter is tested only with a mocked fetch.
- Fairness numbers on six synthetic students are a smoke test, not evidence.
- Real public goods (for example Learning Commons knowledge graphs) are not yet integrated; only the adapter interface and a small synthetic misconception set exist.
- Accessibility and multilingual support are planned for later phases; the demo uses semantic HTML, keyboard access and high-contrast themes but has not been screen-reader tested.

## FAIR
Findable: `CITATION.cff`, `codemeta.json`, versioned releases (plan: archive each release on Zenodo for a DOI). Accessible: open licenses, plain files. Interoperable: JSON schemas and the OpenAI-compatible protocol. Reusable: licenses, provenance in the audit trace, documented limits.

Part of [Jamii Digital](../index.html): free, open digital skills for everyone.
