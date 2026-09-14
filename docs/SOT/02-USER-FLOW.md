# USER FLOW — KA PNBP

**Status:** SOT v0.1  
**Notasi:** `[Screen] -> action -> [Screen/state]`. Detail visual mengikuti UI Guideline; payload mengikuti API Spec.

## F-PUB-01 — Masukan atas Tarif PNBP
`[Landing] -> pilih “Masukan Tarif PNBP” -> [Form Masukan]`

1. Pilih K/L → layanan → tarif (dependen).
2. Pilih jenis masukan: `tarif | layanan | mekanisme | kejelasan informasi | lainnya`.
3. Isi uraian; kontak opsional sesuai kebijakan; lampiran opsional.
4. Centang persetujuan privasi.
5. Submit.
6. Sistem validasi.
   - valid → simpan → `[Success]` tampilkan `feedback_reference`.
   - tidak valid → tetap di form, fokus ke field error.
   - gagal server → tampilkan error + tombol coba lagi; jangan hilangkan input lokal.

**Success state:** nomor referensi, waktu submit, ringkasan topik, CTA kembali ke landing.

## F-PUB-02 — Pertanyaan tentang Tarif PNBP
`[Landing] -> pilih “Pertanyaan Tarif PNBP” -> [Form Pertanyaan]`

1. Isi pertanyaan/kata kunci.
2. Opsional pilih K/L dan layanan untuk mempersempit konteks.
3. Submit pencarian/pertanyaan.
4. Sistem mencoba knowledge match.
   - match memadai → `[Hasil Jawaban]` + sumber/metadata resmi yang tersedia.
   - tidak match → tawarkan `Kirim sebagai pertanyaan`.
5. Jika dikirim sebagai tiket, minta kontak bila dibutuhkan untuk respons.
6. Simpan → tampilkan `question_reference`.

**Guardrail:** jawaban publik tidak boleh mengklaim dasar hukum yang tidak tersedia pada sumber terverifikasi.

## F-AUTH-01 — Login Internal
`[Landing] -> Login -> [Login] -> submit -> [Dashboard]`

- kredensial valid → buat session → redirect `/dashboard`.
- tidak valid → error generik, tidak mengungkap apakah user terdaftar.
- session kadaluarsa → redirect `/login?reason=session-expired`.
- role tidak cukup → `[403]` + link kembali dashboard.

## F-INT-01 — Monitoring Program Transformasi
`[Dashboard] -> pilih Program/WBS -> [Program Detail]`

1. Lihat ringkasan progres program.
2. Expand workstream.
3. Filter milestone by status/PIC/periode.
4. Pilih milestone.
5. Editor dapat ubah status, tanggal realisasi, evidence, catatan.
6. Save → audit log tercatat → progress program dihitung ulang sesuai rule bisnis.

## F-INT-02 — Kelola Isu/Risiko dan Tindak Lanjut
`[Dashboard/Program] -> Isu & Risiko -> [List] -> [Detail]`

1. Buat/ubah isu atau risiko.
2. Tentukan owner, dampak, probabilitas, mitigasi, due date.
3. Tambah task tindak lanjut bila perlu.
4. Update status.
5. Jika overdue/high risk → tampil sebagai prioritas di dashboard.

## F-INT-03 — Triage Masukan Publik
`[Dashboard] -> Masukan Publik -> [Queue] -> [Detail]`

1. Filter `new`.
2. Buka record, lihat konteks tarif/K/L/layanan.
3. Klasifikasikan, assign PIC, set priority.
4. Tambahkan catatan internal.
5. Susun respons → submit respons.
6. Status `responded`; setelah selesai → `closed`.

**Separation rule:** catatan internal tidak pernah tampil ke publik.

## F-INT-04 — Triage Pertanyaan Tarif
`[Dashboard] -> Pertanyaan Tarif -> [Queue] -> [Detail]`

1. Cek knowledge match.
2. Assign PIC bila perlu.
3. Susun jawaban dengan sumber.
4. Kirim jawaban.
5. Opsional tandai `candidate_for_faq` untuk proses review terpisah.

## F-INT-05 — Dashboard Operasional
`[Login] -> [Dashboard]`

Urutan scan:
1. Header periode/filter.
2. KPI utama.
3. Progress program/milestone.
4. Prioritas: overdue, blocked, high risk.
5. Queue masukan/pertanyaan publik.
6. Aktivitas terbaru.

## Global Empty / Loading / Error
- **Loading:** skeleton secukupnya, bukan spinner full-screen jika data parsial dapat tampil.
- **Empty:** jelaskan kosong karena apa + satu CTA yang relevan.
- **Error:** pesan singkat, request ID bila ada, `Coba lagi`.
- **Unsaved changes:** konfirmasi sebelum keluar dari form internal.
