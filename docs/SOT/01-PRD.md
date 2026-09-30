# PRD — KA PNBP

**Status:** SOT v0.1  
**Owner bisnis:** Staf Ahli Menteri Keuangan bidang PNBP  
**Produk:** KA PNBP — aplikasi web publik + dashboard internal  
**Tujuan dokumen:** mendefinisikan kebutuhan produk tanpa menduplikasi detail flow, UI, API, dan rencana implementasi.

## 1. Tujuan Produk
KA PNBP menyediakan satu pintu untuk:
- **PUB-01** menerima masukan publik atas setiap tarif PNBP;
- **PUB-02** menerima dan merespon pertanyaan publik tentang tarif PNBP melalui AI Nita/Chatbot;
- **PUB-03** memberikan informasi peraturan dasar hukum tarif PNBP;
- **PUB-04** memberikan informasi statistik dan visualisasi data realisasi PNBP Kemenkeu 2021–2025;
- **INT-01** menyusun dan memantau proyek manajemen transformasi PNBP melalui area internal yang wajib login.

## 2. Prinsip Produk
1. **Public-first, internal-secure:** fitur publik mudah diakses; data internal tidak terekspos tanpa autentikasi.
2. **Traceable:** setiap masukan, pertanyaan, perubahan proyek, milestone, isu, dan tindak lanjut memiliki ID, status, waktu, dan audit trail.
3. **Single source of truth:** referensi kebutuhan hanya lima dokumen SOT dalam folder `docs/SOT`.
4. **No AI slop:** UI bersih, minim ornamen dekoratif, mengutamakan hierarki informasi, whitespace, dan konsistensi.
5. **Responsive & accessible:** desktop sebagai primary internal workspace; publik tetap nyaman di mobile.

## 3. Pengguna & Hak Akses
| Role | Akses | Kebutuhan utama |
|---|---|---|
| Publik | Tanpa login | Kirim masukan tarif, ajukan pertanyaan, menerima nomor referensi |
| Internal Viewer | Login | Melihat dashboard, program, milestone, isu, masukan, pertanyaan |
| Internal Editor | Login | Mengubah proyek/WBS, milestone, status isu, tindak lanjut |
| Internal Admin | Login | Kelola master data, user/role, SLA, kategori, konfigurasi |

## 4. Ruang Lingkup Fungsional
### 4.1 Landing Page & Layanan Publik
- **FR-PUB-01** Header dengan brand KA PNBP, navigasi publik (Beranda, Dasar Hukum PNBP, Masukan Tarif, Tanya Nita), tombol **Login** di kanan atas.
- **FR-PUB-02** Hero menggunakan foto kereta/pemandangan Indonesia terlampir (`Background.png`) sebagai background utama dengan tata letak bersih dan proporsional terinspirasi standar INSW INTR.
- **FR-PUB-03** CTA dan navigasi langsung ke fitur utama: **Dasar Hukum PNBP**, **Masukan Tarif PNBP**, dan **Tanya Nita**.
- **FR-PUB-04** Visualisasi Data Realisasi PNBP Kemenkeu 2021–2025:
  - Bar/Line Chart perbandingan Target APBN vs Realisasi Aktual tiap tahun (2021–2025).
  - Indicator Card pertumbuhan tahunan (Growth YoY %) dan persentase capaian terhadap target APBN.
  - Breakdown kategori PNBP: PNBP Sumber Daya Alam (SDA), PNBP Kekayaan Negara Dipisahkan (KND / Dividen BUMN), PNBP Lainnya / K/L, dan Pendapatan BLU (Badan Layanan Umum) berbasis data resmi Kementerian Keuangan RI.
- **FR-PUB-05** Halaman Baru "Dasar Hukum PNBP" (`/dasar-hukum`):
  - Kotak pencarian besar dan panjang di posisi tengah halaman (ala Google / INSW INTR https://insw.go.id/intr).
  - Filter kategori peraturan (UU, PP, PMK, Permenhub, Kepmen/SE), filter tahun, dan status keberlakuan.
  - Matriks & daftar regulasi terkait tarif PNBP, nomor peraturan, judul, tanggal penetapan, ringkasan tarif, tautan unduh PDF resmi.
- **FR-PUB-06** Halaman Baru "Masukan Tarif PNBP" (`/masukan-tarif`):
  - Formulir pengajuan masukan masyarakat atas tarif PNBP kereta api pada halaman tersendiri dengan identitas wajib (Nama lengkap, NIK 16 digit, Upload KTP, Email), K/L, jenis masukan, detail usulan, data pendukung opsional, dan persetujuan privasi.
  - Setelah submit, sistem menerbitkan nomor tiket referensi pelacakan (`TKT-FB-YYYY-XXXXXX`).
- **FR-PUB-07** Tanya Nita (Navigator Informasi Tarif berbasis AI): asisten pencarian tarif dan regulasi PNBP interaktif dengan avatar kartun wanita berhijab (Nita), pencarian kata kunci/pertanyaan, dan referensi dasar hukum terverifikasi.
- **FR-PUB-08** Format tata letak, penyajian, dan tipografi menyelaraskan standar portal INSW (https://insw.go.id/intr): clean typography, spacing terstruktur, palet navy-emas-slate institusional.
- **FR-PUB-09** Anti-spam: rate limit, validation, honeypot/CAPTCHA sesuai kebutuhan implementasi.

### 4.2 Login Internal
- **FR-AUTH-01** Login wajib untuk seluruh route internal.
- **FR-AUTH-02** Dukungan target SSO pemerintah/identity provider; fase awal boleh mock/local auth untuk prototipe.
- **FR-AUTH-03** Session timeout, logout, role-based access, dan audit autentikasi.

### 4.3 Dashboard & Operasional Internal
- **FR-INT-01** Ringkasan KPI: program aktif, progres milestone, isu terbuka, tindak lanjut jatuh tempo, volume masukan/pertanyaan publik.
- **FR-INT-02** Kelola **Program/Proyek Transformasi**: nama, owner, periode, status, progres, target, keterkaitan roadmap.
- **FR-INT-03** Kelola **WBS/Workstream** dan deliverable.
- **FR-INT-04** Kelola **Milestone**: target tanggal, realisasi, status, evidence/link.
- **FR-INT-05** Kelola **Task/Tindak Lanjut**: PIC, due date, priority, status.
- **FR-INT-06** Kelola **Isu & Risiko**: kategori, dampak, probabilitas, mitigasi, owner, status.
- **FR-INT-07** Triage **Masukan Publik**: klasifikasi, assign, status, catatan internal, respons.
- **FR-INT-08** Triage **Pertanyaan Tarif**: kategorisasi, assign, knowledge match, respons, publish-as-FAQ opsional.
- **FR-INT-09** Filter dan pencarian lintas modul berdasarkan status, PIC, K/L, periode, kata kunci.
- **FR-INT-10** Export laporan terpilih ke CSV/XLSX/PDF pada fase lanjutan.
- **FR-INT-11** Audit log untuk perubahan data penting.

## 5. Model Status Minimum
- Program: `draft | active | on_hold | completed | archived`
- Milestone: `not_started | in_progress | at_risk | done | overdue`
- Task: `todo | in_progress | blocked | done`
- Issue/Risk: `open | monitoring | mitigated | closed`
- Public Feedback: `new | triaged | assigned | responded | closed`
- Public Question: `new | matched | assigned | answered | closed`

## 6. Entitas Data Inti
`User`, `Role`, `Program`, `Workstream`, `Milestone`, `Task`, `IssueRisk`, `TariffMaster`, `MinistryAgency`, `Service`, `PublicFeedback`, `PublicQuestion`, `Response`, `Attachment`, `AuditLog`.

## 7. Non-Functional Requirements
- **NFR-01 Security:** HTTPS, secure cookies/token handling, RBAC, input sanitization, upload validation, OWASP baseline.
- **NFR-02 Privacy:** minimisasi data pribadi, consent, retention policy, masking pada view yang tidak perlu.
- **NFR-03 Performance:** LCP landing target ≤ 2.5s pada koneksi wajar; dashboard interaction terasa responsif.
- **NFR-04 Availability:** target operasional ditentukan pada fase infrastruktur; desain harus mendukung stateless frontend/backend.
- **NFR-05 Accessibility:** WCAG 2.1 AA sebagai target desain.
- **NFR-06 Auditability:** perubahan status/record kritikal tercatat user, timestamp, before/after.
- **NFR-07 Observability:** structured logs, error tracking, request ID/correlation ID.
- **NFR-08 Browser:** Chrome/Edge modern; Safari/Firefox modern best effort.
- **NFR-09 Responsive:** publik: 360px+; internal optimal 1280px+, usable 768px+.

## 8. Out of Scope v0.1
- Pembayaran PNBP, billing, settlement, atau integrasi transaksi.
- Penetapan tarif secara legal/formal di aplikasi.
- Chatbot generatif otonom sebagai pengganti jawaban resmi.
- Integrasi penuh dengan seluruh sistem K/L tanpa kontrak API yang telah disepakati.
- Workflow tanda tangan elektronik dan persuratan formal.

## 9. Acceptance Criteria Produk Awal
Produk awal dianggap memenuhi PRD bila:
1. Landing page sesuai brand, menggunakan background terlampir, dan memiliki dua fungsi publik.
2. Tombol Login membawa pengguna ke layar login.
3. Login prototipe dapat membuka dashboard internal.
4. Dashboard menampilkan KPI, progres, daftar workstream/milestone, isu, dan ringkasan masukan publik.
5. Semua layar konsisten dengan `03-UI-GUIDELINE.md`.
6. Route publik dan internal mengikuti `02-USER-FLOW.md`.
7. Struktur data dan kontrak endpoint mengacu `04-API-SPEC.md`.
8. Implementasi mengikuti gate pada `05-IMPLEMENTATION-PLAN.md`.
