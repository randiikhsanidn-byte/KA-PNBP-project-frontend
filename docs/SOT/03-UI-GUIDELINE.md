# UI GUIDELINE — KA PNBP

**Status:** SOT v0.1  
**Arah:** modern-futuristik, profesional, institusional, tenang; tidak menyerupai template AI generik.

## 1. Brand Tokens
### Warna
| Token | Hex | Pemakaian |
|---|---:|---|
| `navy-950` | `#071B33` | sidebar, heading kuat |
| `navy-900` | `#0B2748` | primary surface/action |
| `navy-700` | `#164A73` | secondary accent |
| `yellow-500` | `#F7C948` | brand highlight, active marker |
| `yellow-400` | `#FFD768` | hover/soft highlight |
| `green-600` | `#2E7D62` | success/environment accent |
| `green-100` | `#E8F3EE` | soft green surface |
| `slate-950` | `#16202A` | body heading |
| `slate-600` | `#667085` | secondary text |
| `slate-200` | `#E4E7EC` | border |
| `slate-50` | `#F8FAFC` | app background |
| `white` | `#FFFFFF` | main surface |

**Rule:** kuning hanya aksen; hijau hanya status/aksen sekunder; jangan membuat background pelangi/gradient dekoratif besar.

## 2. Typography
- Font stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- H1 landing: 40–56px desktop, 34–40px mobile, weight 700–800.
- H1 dashboard: 28–32px, weight 700.
- H2: 22–26px.
- Body: 14–16px, line-height 1.5–1.65.
- Label: 12–14px, weight 600.
- Angka KPI: tabular numerals jika tersedia.

## 3. Layout
### Landing
- Header 72px, putih/translucent ringan, border-bottom tipis.
- Brand kiri: kotak kuning `KA` + teks `PNBP`; tanpa tulisan “Kementerian Keuangan Republik Indonesia”.
- Login di kanan atas.
- Hero: foto terlampir sebagai background penuh; focal point kereta di sisi kanan dijaga.
- Overlay hanya untuk keterbacaan; konten utama di kiri agar tidak menutupi kereta.
- Dua CTA publik tampil jelas dan langsung menuju area/form terkait.

### Internal
- Desktop: sidebar 264px + content fluid.
- Tablet/mobile: sidebar menjadi drawer/top navigation.
- Content max readable width ± 1440px.
- Grid 12 kolom, gap 20–24px desktop.

## 4. Shape & Depth
- Radius: 12px default, 16px untuk panel utama, 999px hanya chip.
- Border: 1px `slate-200`.
- Shadow: lembut dan jarang; gunakan untuk floating panel/modal, bukan semua card.
- Jangan gunakan glassmorphism berat, neon glow, orb dekoratif, ilustrasi 3D abstrak, atau gradient warna-warni.

## 5. Components
### Header
- Brand, nav publik, Login.
- Active nav: text navy + underline/marker kuning halus.

### Button
- Primary: navy background, putih.
- Accent: kuning background, navy text.
- Secondary: putih, border slate.
- Danger hanya untuk destructive internal action.
- Minimum hit area 44px.

### Form
- Label selalu terlihat, placeholder bukan pengganti label.
- Height input 44–48px.
- Focus ring navy/yellow yang jelas.
- Error message dekat field.
- Public form wajib menyebut privasi sebelum submit.

### KPI Card
- Judul kecil + angka utama + delta/status optional.
- Maksimal 4–5 KPI di first viewport.
- Ikon hanya jika membantu scanning; hindari ikon dekoratif berlebihan.

### Table/List
- Header sticky pada list panjang.
- Status sebagai compact chip.
- Row hover ringan.
- Action utama ditempatkan konsisten di kanan.

### Progress
- Gunakan bar/timeline sederhana.
- `green` = on track/done, `yellow` = attention, `red` = blocked/overdue.

## 6. Screen Spec
### `/`
1. Header.
2. Hero background foto terlampir.
3. Panel kiri: `KA PNBP`, dua pilihan publik, teks fungsional singkat.
4. Section `Masukan Tarif PNBP`.
5. Section `Pertanyaan Tarif PNBP`.
6. Footer minimal.

### `/login`
- Brand konsisten.
- Split layout: foto sebagai visual pendukung + form login putih.
- Tidak perlu slogan.

### `/dashboard`
- Sidebar navy.
- Header page + periode/filter + user chip.
- KPI row.
- Progress program/milestone.
- Prioritas/isu.
- Queue publik dan aktivitas terbaru.

## 7. Motion
- 120–200ms ease-out untuk hover, drawer, tab.
- Tidak ada parallax, looping animation, atau animasi dekoratif yang mengganggu.
- Hormati `prefers-reduced-motion`.

## 8. Accessibility
- Kontras text/action minimal WCAG AA.
- Semua kontrol keyboard-accessible.
- `:focus-visible` jelas.
- Gunakan semantic HTML, heading berurutan, label input eksplisit, aria untuk icon-only button.
- Jangan mengandalkan warna saja untuk status.

## 9. Anti-AI-Slop Checklist
Sebelum UI dianggap selesai, pastikan:
- tidak ada copy pemasaran kosong/jargon;
- tidak ada 6+ card dekoratif tanpa fungsi;
- tidak ada glow/neon/orb/blob generik;
- foto asli menjadi focal visual landing;
- warna institusional dominan putih + navy, kuning sebagai aksen, hijau secukupnya;
- alignment dan spacing konsisten;
- dashboard mengutamakan data operasional, bukan dekorasi.
