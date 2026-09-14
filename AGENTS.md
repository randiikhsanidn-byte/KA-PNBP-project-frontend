# AGENTS.md — Initial Contract for KA PNBP

## 1. Mission
Implement KA PNBP exactly from the SOT, prioritizing clarity, security boundaries, responsive UX, and low-complexity maintainable code.

## 2. Source of Truth Order
1. `docs/SOT/01-PRD.md`
2. `docs/SOT/02-USER-FLOW.md`
3. `docs/SOT/03-UI-GUIDELINE.md`
4. `docs/SOT/04-API-SPEC.md`
5. `docs/SOT/05-IMPLEMENTATION-PLAN.md`
6. This `AGENTS.md`
7. `PROMPT-EXECUTION.md`

If two SOT files appear inconsistent: stop, identify the conflict using requirement IDs, and request/record a SOT change before inventing behavior.

## 3. Hard Constraints
- Stack: React + Vite + Tailwind CSS; responsive semantic HTML.
- Preserve public vs internal security boundary.
- Landing must use the supplied `Background.png` train/Indonesia landscape visual.
- Brand: white + navy + Ministry-of-Finance-style yellow accent + limited green.
- Do not add slogans, decorative AI-style copy, neon glow, blobs, excessive gradients, or decorative card grids.
- Do not expose internal notes/data on public routes.
- Do not invent real government integrations, credentials, legal citations, or official tariff data.
- Prototype may use mock data but must clearly isolate it from API-ready code.

## 4. Coding Rules
- Small, readable components; no premature abstraction.
- Shared UI only when actually reused.
- Keep page data dependencies explicit.
- Use Tailwind tokens from config; avoid random hex values in JSX.
- Keep accessibility: labels, focus states, semantic landmarks, keyboard navigation.
- No secrets in frontend source or `VITE_*` variables.
- Every internal mutation design assumes server-side authorization and audit logging.

## 5. Change Protocol
For a requirement change:
1. identify affected SOT file(s) and requirement/flow ID;
2. update SOT first;
3. update code/tests second;
4. summarize change and migration impact.

## 6. Quality Gates Before Hand-off
Run and report:
- `npm run build`
- lint/test if configured
- desktop + mobile visual smoke check
- no obvious console errors
- public routes do not require auth; internal route does
- empty/error/loading states for implemented async flows

## 7. Completion Output
Return only:
- files changed;
- commands run + status;
- requirement IDs completed;
- known gaps/blockers;
- screenshots/preview paths when available.
