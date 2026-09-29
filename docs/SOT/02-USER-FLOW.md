# USER FLOW — KA PNBP

**Status:** SOT v0.2 (Diselaraskan dengan USER_FLOW_KA_PNBP_vlogin)  
**Notasi:** `[Screen] -> action -> [Screen/state]`. Detail visual mengikuti UI Guideline; payload mengikuti API Spec.

---

## 1. Alur Layanan Publik

### F-PUB-01 — Masukan atas Tarif PNBP
`[Landing] -> pilih “Masukan Tarif PNBP” -> [Form Masukan]`

1. Isi identitas pelapor:
   - Nama lengkap (*wajib)
   - NIK (*wajib, 16 digit angka)
   - Upload KTP (*wajib, format gambar JPG/PNG/PDF, maks 5MB)
   - Email (*wajib, format valid)
   - No. Telp (tidak wajib)
2. Pilih Kementerian / Lembaga (kondisi eksisting).
3. Pilih Jenis Masukan (kondisi eksisting).
4. Tulis Detail Masukan (*wajib).
5. Upload Dokumen / Data Pendukung (tidak wajib, format PDF/DOC/Gambar, maks 10MB).
6. Centang persetujuan privasi.
7. Submit.
8. Sistem validasi.
   - valid → simpan → `[Success]` tampilkan nomor tiket (`ticket_number` / `feedback_reference`).
   - tidak valid → tetap di form, fokus ke field error.
   - gagal server → tampilkan error + tombol coba lagi; jangan hilangkan input lokal.

**Success state:** nomor tiket masukan (`TKT-FB-YYYY-XXXXXX`), nomor referensi pelacakan, waktu submit, ringkasan topik, CTA kembali ke landing.

### F-PUB-02 — Tanya Nita, Temukan tarif PNBP
`[Landing] -> pilih “Tanya Nita, Temukan tarif PNBP” -> [Layanan Tanya Nita]`

1. Isi pertanyaan/kata kunci pada input "ketik pertanyaan anda disini".
2. Opsional pilih K/L dan layanan untuk mempersempit konteks.
3. Submit pencarian/pertanyaan.
4. Sistem mencoba knowledge match.
   - match memadai → `[Hasil Jawaban]` + sumber/metadata resmi yang tersedia.
   - tidak match → tawarkan `Kirim sebagai pertanyaan`.
5. Jika dikirim sebagai tiket, minta kontak bila dibutuhkan untuk respons.
6. Simpan → tampilkan `question_reference`.

**Guardrail:** jawaban publik tidak boleh mengklaim dasar hukum yang tidak tersedia pada sumber terverifikasi.

---

## 2. Aktor Internal

Sistem hanya memiliki dua jenis pengguna internal:

### 2.1 PMO / Champion
PMO / Champion memiliki kewenangan untuk:
- melihat dashboard;
- melihat isu strategis;
- melihat progress dan melakukan *drill-down*;
- meng-update kegiatan yang menjadi tanggung jawabnya;
- mengusulkan *Change Request*;
- mengelola Roadmap;
- mengelola WBS;
- melakukan monitoring;
- membuat dan mengedit data;
- menyimpan perubahan sebagai *draft*;
- mengirim perubahan untuk memperoleh persetujuan Executive; dan
- melihat status pengajuan yang telah dibuat.

Setiap perubahan data yang dilakukan oleh PMO / Champion **tidak langsung menjadi data aktif** dan harus melalui persetujuan Executive.

### 2.2 Executive
Executive memiliki seluruh kewenangan PMO / Champion serta kewenangan tambahan untuk:
- melihat seluruh perubahan yang diajukan PMO / Champion;
- menyetujui perubahan;
- menolak perubahan;
- memberikan alasan penolakan;
- menetapkan perubahan sebagai data aktif; dan
- melakukan perubahan langsung terhadap data.

Perubahan yang dilakukan langsung oleh Executive dapat menjadi data aktif tanpa memerlukan approval tambahan, namun tetap harus tercatat dalam **Audit Trail**.

---

## 3. Alur Login Internal (F-AUTH-01)

```text
Landing Page
    ↓
Klik Login
    ↓
Masukkan Username / Email
    ↓
Masukkan Password
    ↓
Validasi Kredensial
    ↓
Validasi Role
    ├── PMO / Champion
    │       ↓
    │   Dashboard Internal
    │
    └── Executive
            ↓
        Dashboard Internal
```

### Kondisi Login
- **Login berhasil:** validasi kredensial → identifikasi role (PMO / Champion atau Executive) → buat sesi → arahkan ke Dashboard Internal.
- **Login gagal:** tampilkan pesan kesalahan generik tanpa mengungkap apakah user terdaftar → sesi tidak dibuat → tetap di halaman login.
- **Sesi berakhir:** redirect ke `/login?reason=session-expired`.

---

## 4. Struktur Navigasi Internal (8 Menu)

```text
KA PNBP
├── Dashboard
├── Roadmap
├── WBS
├── Monitoring
├── Isu Strategis
├── Change Request
├── Approval
└── Audit Trail
```

### Hak Akses Menu
| Menu | PMO / Champion | Executive |
|---|---|---|
| Dashboard | Lihat | Lihat |
| Roadmap | Lihat / Edit / Usulkan | Lihat / Edit / Finalisasi |
| WBS | Lihat / Edit / Usulkan | Lihat / Edit / Finalisasi |
| Monitoring | Lihat / Update | Lihat / Update |
| Isu Strategis | Lihat / Kelola | Lihat / Kelola |
| Change Request | Buat / Edit / Submit | Buat / Edit / Approve / Reject |
| Approval | Lihat status pengajuan sendiri | Review / Approve / Reject |
| Audit Trail | Lihat sesuai hak akses | Lihat seluruh histori |

---

## 5. Dashboard Internal

Dashboard merupakan halaman utama setelah login yang menampilkan ringkasan capaian transformasi PNBP dan menjadi titik awal *drill-down*.

### Informasi Utama Dashboard
- Capaian keseluruhan Roadmap PNBP;
- Progress rencana;
- Progress realisasi;
- Deviasi;
- Jumlah total kegiatan;
- Jumlah kegiatan *On Track*, *Perlu Perhatian*, *Terlambat*, dan *Selesai*;
- Isu strategis aktif;
- Kegiatan yang membutuhkan perhatian;
- Change Request aktif;
- Perubahan yang menunggu persetujuan Executive.

---

## 6. Tiga Perspektif Dashboard

Dashboard harus dapat ditampilkan dalam 3 perspektif:
1. **Champion**
2. **Langkah Strategis**
3. **Champion × Langkah Strategis**

### 6.1 Pivot Berdasarkan Champion
`Champion -> Jumlah Kegiatan -> Progress Rencana -> Progress Realisasi -> Deviasi -> Status`

### 6.2 Pivot Berdasarkan Langkah Strategis
`Langkah Strategis -> Jumlah Kegiatan -> Progress Rencana -> Progress Realisasi -> Deviasi -> Status`

### 6.3 Pivot Champion × Langkah Strategis
`Champion -> Langkah Strategis -> Kegiatan -> WBS -> Milestone`

---

## 7. Logika Perhitungan Capaian

Dashboard menghitung capaian berdasarkan periode rencana penyelesaian kegiatan.

Setiap kegiatan memiliki atribut:
- Tanggal mulai rencana
- Tanggal selesai rencana
- Durasi / Jumlah hari rencana:  
  `Durasi Rencana = Tanggal Selesai Rencana - Tanggal Mulai Rencana`
- Tanggal posisi monitoring / hari berjalan:  
  `Progress Rencana = (Hari Berjalan / Total Hari Rencana) × 100%`  
  *(Sebelum mulai: 0%, selama periode: proporsional, setelah selesai: 100%)*
- Progress Realisasi: capaian aktual berdasarkan WBS / milestone selesai
- Deviasi:  
  `Deviasi = Progress Realisasi - Progress Rencana`
- Status Capaian kegiatan

---

## 8. Status Capaian Kegiatan

- `Realisasi >= Rencana` → **On Track**
- `Realisasi sedikit di bawah Rencana` → **Perlu Perhatian**
- `Realisasi tertinggal signifikan atau melewati Target Penyelesaian` → **Terlambat**
- `Target selesai 100%` → **Selesai**
- `Belum memasuki periode mulai` → **Belum Mulai**

---

## 9. Dashboard Drill-Down

Semua ringkasan pada dashboard dapat ditelusuri sampai ke detail kegiatan:
```text
Dashboard (Summary)
    ↓
Pilih Champion / Langkah Strategis
    ↓
Daftar Kegiatan
    ↓
Detail Kegiatan
    ↓
WBS
    ↓
Milestone
    ↓
Evidence / Isu / Riwayat Perubahan
```

---

## 10. Struktur Hierarki Roadmap
```text
Roadmap
    ↓
Langkah Strategis
    ↓
Kegiatan
    ↓
WBS
    ↓
Milestone
```
Atribut elemen: Champion, unit terkait, tanggal mulai, tanggal selesai, output, indikator, bobot, status, progress, evidence, dan catatan.

---

## 11. Flow Pengelolaan Roadmap oleh PMO / Champion
`Dashboard -> Roadmap -> Tambah / Edit / Hapus -> Save Draft -> Submit -> Status Pending Approval -> Executive Review (Approve / Reject dengan alasan)`

## 12. Flow Pengelolaan Roadmap oleh Executive
`Dashboard -> Roadmap / WBS -> Tambah / Edit / Hapus -> Save -> Data Langsung Aktif -> Dashboard Recalculate -> Tercatat di Audit Trail`

---

## 13. Flow Update Progress
- **PMO / Champion:** Pilih kegiatan di Monitoring -> Update Realisasi, Status, Isu, RTL, Evidence -> Simpan Draft / Submit -> Pending Approval Executive.
- **Executive:** Pilih kegiatan -> Update Progress -> Simpan -> Data langsung aktif dan ter-update di dashboard & audit trail.

---

## 14. Menu Monitoring
Dapat difilter berdasarkan:
- Tahun anggaran
- Champion
- Langkah Strategis
- Status capaian
- Periode & deviasi
Menyediakan daftar kegiatan dan rincian lengkap progress serta milestone.

---

## 15. Isu Strategis
Menyimpan dan mengelola:
- Judul isu, deskripsi, kegiatan terkait, Champion, Langkah Strategis, prioritas, dampak, rencana tindak lanjut, target penyelesaian, status.
- Terhubung langsung dengan kegiatan dan milestone terkait.

---

## 16. Change Request (Perubahan Baseline)
Digunakan untuk mengubah data baseline yang telah aktif (Langkah Strategis, Kegiatan, WBS, Milestone, Champion, Tanggal/Target).
- **PMO / Champion:** Ajukan Change Request -> Current Value vs Proposed Value -> Alasan & Dampak -> Submit -> Menunggu Approval.
- **Executive Review:** Bandingkan Current Value vs Proposed Value -> Approve (Baseline lama disupersede, baseline baru aktif, dashboard recalculate, audit log) atau Reject (dengan alasan penolakan).

---

## 17. Modul Approval
Mekanisme persetujuan tersentralisasi:
- PMO / Champion memantau status usulan (*Draft, Submitted, Pending, Approved, Rejected*).
- Executive mereview antrean permohonan dengan perbandingan *Current Value vs Proposed Value*, pengusul, tanggal, alasan, dampak, dan dokumen pendukung.

---

## 18. Audit Trail
Semua perubahan data wajib tercatat permanen:
- Waktu perubahan
- Pengguna & Role
- Modul & Jenis Tindakan
- Nilai sebelum (Before) & Nilai setelah (After)
- Status Approval & Approver
- Catatan / Alasan Penolakan jika ada
Data audit trail bersifat *immutable* (tidak dapat diubah atau dihapus).

---

## 19. Prinsip Sistem
1. **Single Source of Truth:** Hanya data aktif yang disetujui yang menjadi rujukan dashboard & monitoring.
2. **Approval-Based Editing:** Modifikasi oleh PMO/Champion wajib melalui persetujuan Executive.
3. **Executive Control:** Executive memegang kewenangan final approval dan dapat melakukan direct edit.
4. **Traceability:** Setiap modifikasi terekam detail pada Audit Trail.
5. **Drill-Down Monitoring:** Kemudahan navigasi dari level agregat hingga bukti capaian/evidence.
6. **Time-Based Progress:** Perhitungan progres berbasis durasi rencana dan hari berjalan.
7. **Pivot-Based Monitoring:** 3 perspektif analisis capaian yang fleksibel.
8. **Baseline Preservation:** Riwayat baseline lama tetap dipertahankan saat perubahan disetujui.

---

## 20. Global Empty / Loading / Error
- **Loading:** Skeleton loading terarah pada kartu metrik dan tabel.
- **Empty:** Tampilkan keterangan konteks kosong disertai satu aksi/CTA yang relevan.
- **Error:** Pesan kesalahan deskriptif dan ramah pengguna dengan tombol `Coba lagi`.
- **Unsaved Changes:** Dialog konfirmasi sebelum navigasi meninggalkan form yang belum disimpan.
