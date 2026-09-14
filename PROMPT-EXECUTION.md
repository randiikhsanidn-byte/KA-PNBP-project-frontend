# Prompt Execution — KA PNBP Initial Build

Use this prompt with a coding agent from the repository root:

---

You are the implementation agent for **KA PNBP**.

Read `AGENTS.md` first, then read all five files under `docs/SOT/` in numeric order. Treat them as the only product source of truth.

## Objective
Deliver the initial frontend prototype defined in **Phase 1 — UI Prototype** of `05-IMPLEMENTATION-PLAN.md` using **React + Vite + Tailwind CSS**.

## Required screens
1. `/` Landing page
   - white header;
   - yellow `KA` brand badge + `PNBP` label;
   - public nav for Masukan Tarif and Pertanyaan Tarif;
   - Login button at top-right;
   - hero uses `src/assets/Background.png` as the primary photo and keeps the train visible;
   - two public entry points and clean functional sections/forms for feedback and tariff questions.
2. `/login`
   - consistent visual language;
   - prototype login form;
   - successful prototype login navigates to `/dashboard`.
3. `/dashboard`
   - navy internal sidebar;
   - KPI summary;
   - program/milestone progress;
   - priority issues/tasks;
   - public feedback/question queue summary;
   - recent activity;
   - responsive behavior.

## Constraints
- Follow `03-UI-GUIDELINE.md` literally for colors, hierarchy, spacing philosophy, and anti-AI-slop rules.
- Use mock data only from a dedicated data module.
- Do not add backend, fake official tariff content, or unrequested integrations.
- Do not add marketing slogans.
- Keep code API-ready but simple.

## Validation
Run `npm install` if dependencies are missing, then `npm run build`.
Perform a visual smoke check at desktop and mobile widths. Fix build/runtime issues before finishing.

## Final report
Return:
- changed files;
- build status;
- requirement/flow IDs implemented;
- known gaps;
- preview/screenshot locations.

---
