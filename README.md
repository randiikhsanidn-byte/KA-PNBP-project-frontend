# KA PNBP — SOT + Initial Frontend Prototype

Paket ini berisi lima dokumen SOT, kontrak coding agent, prompt eksekusi, serta prototype frontend React + Vite + Tailwind yang mengikuti konsep KA PNBP.

## Review SOT
| Dokumen | Isi utama | Keputusan penting |
|---|---|---|
| `01-PRD.md` | tujuan, role, scope, requirement, NFR, out-of-scope | publik untuk masukan/pertanyaan; internal wajib login; dashboard fokus operasional transformasi |
| `02-USER-FLOW.md` | alur publik, login, monitoring, triage, error states | semua submit menghasilkan reference; internal note tidak boleh bocor ke publik |
| `03-UI-GUIDELINE.md` | token warna, tipografi, layout, components, accessibility | putih/navy dominan, kuning aksen, hijau terbatas; foto kereta menjadi focal visual; anti-AI-slop eksplisit |
| `04-API-SPEC.md` | kontrak endpoint publik/internal, auth, audit | REST `/api/v1`; public POST rate-limited; RBAC dan audit mutation di server |
| `05-IMPLEMENTATION-PLAN.md` | fase, gate, struktur, test, DoD | fase awal hanya prototype UI; integrasi backend/SSO dikerjakan setelah validasi |

## Review Tampilan Prototype
- **Landing:** header putih minimal, brand `KA PNBP`, tombol login kanan atas, hero memakai `Background.png`, dua fungsi publik tampil langsung tanpa jargon.
- **Login:** split layout yang mempertahankan foto dan identitas warna yang sama.
- **Dashboard:** sidebar navy, KPI operasional, progress program, milestone, isu, queue publik dan aktivitas terbaru.
- **Responsive:** layout desktop-first untuk internal, tetap usable pada tablet/mobile.

## Menjalankan
```bash
cd frontend
npm install
npm run dev
```
Build production:
```bash
npm run build
```

## Catatan
Prototype memakai mock data untuk review UI/UX. Backend production, SSO pemerintah, integrasi K/L, dan data tarif resmi belum diimplementasikan.
