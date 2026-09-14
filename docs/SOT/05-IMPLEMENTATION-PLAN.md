# IMPLEMENTATION PLAN — KA PNBP

**Status:** SOT v0.1  
**Frontend target:** React + Vite + Tailwind CSS, responsive HTML.  
**Prinsip:** bangun tipis per vertical slice, validasi UX lebih awal, backend terhubung melalui adapter/API client.

## 1. Struktur Target
```text
KA-PNBP/
├─ docs/SOT/
├─ AGENTS.md
├─ PROMPT-EXECUTION.md
└─ frontend/
   ├─ src/
   │  ├─ assets/
   │  ├─ components/
   │  ├─ data/
   │  ├─ pages/
   │  ├─ App.jsx
   │  ├─ main.jsx
   │  └─ styles.css
   ├─ tailwind.config.js
   ├─ vite.config.js
   └─ package.json
```

## 2. Phase & Gate
### Phase 0 — SOT Lock
**Output:** lima dokumen SOT disetujui.  
**Gate:** tidak ada requirement ambigu yang menghalangi prototype.

### Phase 1 — UI Prototype
**Output:** Landing, Login, Dashboard memakai mock data.  
**Tasks:**
- setup Vite/React/Tailwind;
- implement design tokens;
- gunakan `Background.png` di hero;
- route `/`, `/login`, `/dashboard`;
- responsive states;
- mock form submit + mock login.

**Gate:** build lulus, UI sesuai guideline, mobile/desktop usable, tidak ada console error utama.

### Phase 2 — Public Vertical Slice
**Output:** master data + feedback + question flow terhubung backend.
- reference data K/L, layanan, tarif;
- submit feedback;
- search FAQ/knowledge;
- submit unresolved question;
- validation, anti-spam, reference number.

**Gate:** end-to-end public submit berhasil dan data tampil di queue internal.

### Phase 3 — Internal Core
**Output:** auth/RBAC + project management minimum.
- SSO/auth integration;
- programs, workstreams, milestones;
- tasks, issues/risks;
- dashboard summary;
- audit mutation.

**Gate:** Viewer tidak dapat mutate; Editor dapat update sesuai scope; audit log tercatat.

### Phase 4 — Triage & Reporting
**Output:** queue publik, response workflow, filter, export minimum.

**Gate:** feedback/question dapat diproses dari `new` sampai `closed` tanpa kehilangan audit/history.

### Phase 5 — Hardening & Production Readiness
- security review/OWASP;
- accessibility audit;
- performance budget;
- log/monitoring;
- backup/retention policy;
- UAT, SOP, deployment checklist.

## 3. Frontend Implementation Rules
- React functional components.
- Tailwind utility-first; custom CSS hanya untuk base token/complex reusable pattern.
- Komponen reusable dibuat setelah ada ≥2 penggunaan nyata.
- Hindari state management global tambahan sampai kebutuhan terbukti; mulai dengan React state/context.
- API access melalui satu module/client; page tidak memanggil `fetch` tersebar.
- Route internal harus memakai auth guard pada implementasi backend-ready.
- Mock data dipisahkan dari component agar mudah diganti API.

## 4. Environment Contract
Contoh `.env`:
```bash
VITE_API_BASE_URL=/api/v1
VITE_AUTH_MODE=mock
VITE_APP_ENV=development
```
Production tidak boleh menyimpan secret di Vite env karena seluruh `VITE_*` terekspos ke browser.

## 5. Testing Minimum
- **Unit:** formatter, status mapping, validation helper.
- **Component:** form required/error/success, KPI/table empty state.
- **E2E:** landing → feedback submit; landing → question; login → dashboard; role guard.
- **Visual QA:** 360, 768, 1280, 1440 widths.
- **A11y:** keyboard flow + automated scan baseline.

## 6. Definition of Done
Satu feature dianggap Done jika:
1. requirement ID terkait terpenuhi;
2. loading/empty/error state tersedia;
3. responsive dan keyboard usable;
4. tidak ada hardcoded secret;
5. lint/build/test relevan lulus;
6. perubahan kontrak dicatat di SOT yang sesuai sebelum kode bergantung padanya.

## 7. Initial Prototype Deliverable
Paket awal dalam repository ini hanya mencakup UI prototype dengan mock data untuk validasi desain dan arsitektur frontend. Tidak mengklaim backend production, SSO nyata, legal workflow, ataupun integrasi sistem eksternal.
