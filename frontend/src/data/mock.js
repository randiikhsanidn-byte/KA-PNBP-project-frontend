// Mock data module for KA PNBP prototype
// Fully aligned with docs/SOT/02-USER-FLOW.md, 01-PRD.md, and 04-API-SPEC.md

export const agencies = [
  {
    id: 'agy_kemenhub',
    name: 'Kementerian Perhubungan',
    code: 'KEMENHUB',
    services: [
      {
        id: 'svc_hub_01',
        name: 'Pengujian Berkala Kendaraan Bermotor',
        tariffs: [
          { id: 'trf_hub_01a', name: 'Uji Berkala Pertama Truk/Bus', nominal: 'Rp 150.000 / unit' },
          { id: 'trf_hub_01b', name: 'Uji Berkala Lanjutan Truk/Bus', nominal: 'Rp 100.000 / unit' },
          { id: 'trf_hub_01c', name: 'Kalibrasi Alat Uji Kendaraan', nominal: 'Rp 500.000 / alat' },
        ],
      },
      {
        id: 'svc_hub_02',
        name: 'Sertifikasi & Lisensi Personel Perkeretaapian',
        tariffs: [
          { id: 'trf_hub_02a', name: 'Ujian Sertifikasi Masinis Pertama', nominal: 'Rp 350.000 / orang' },
          { id: 'trf_hub_02b', name: 'Perpanjangan Sertifikat Masinis', nominal: 'Rp 200.000 / orang' },
          { id: 'trf_hub_02c', name: 'Sertifikasi Pengatur Perjalanan Kereta Api', nominal: 'Rp 300.000 / orang' },
        ],
      },
      {
        id: 'svc_hub_03',
        name: 'Penggunaan Jalur Kereta Api (Track Access Charge)',
        tariffs: [
          { id: 'trf_hub_03a', name: 'Lintas Utama Jawa - Tarif Reguler', nominal: 'Sesuai formula ton/km' },
          { id: 'trf_hub_03b', name: 'Lintas Sumatera - Tarif Barang', nominal: 'Sesuai formula ton/km' },
        ],
      },
    ],
  },
  {
    id: 'agy_esdm',
    name: 'Kementerian Energi dan Sumber Daya Mineral',
    code: 'KESDM',
    services: [
      {
        id: 'svc_esdm_01',
        name: 'Sertifikasi Uji Emisi & Efisiensi Energi Mesin',
        tariffs: [
          { id: 'trf_esdm_01a', name: 'Uji Kinerja Turbin Pembangkit', nominal: 'Rp 2.500.000 / uji' },
          { id: 'trf_esdm_01b', name: 'Sertifikasi Kelayakan Instalasi Tenaga Listrik', nominal: 'Rp 1.200.000 / sertifikat' },
        ],
      },
      {
        id: 'svc_esdm_02',
        name: 'Jasa Informasi Geologi & Eksplorasi',
        tariffs: [
          { id: 'trf_esdm_02a', name: 'Data Digital Seismik Eksplorasi', nominal: 'Rp 5.000.000 / lembar peta' },
          { id: 'trf_esdm_02b', name: 'Analisis Laboratorium Sampel Batuan', nominal: 'Rp 450.000 / sampel' },
        ],
      },
    ],
  },
  {
    id: 'agy_klhk',
    name: 'Kementerian Lingkungan Hidup dan Kehutanan',
    code: 'KLHK',
    services: [
      {
        id: 'svc_klhk_01',
        name: 'Pemanfaatan Jasa Lingkungan Kawasan Konservasi',
        tariffs: [
          { id: 'trf_klhk_01a', name: 'Karcis Masuk Wisatawan Nusantara - Hari Kerja', nominal: 'Rp 10.000 / orang' },
          { id: 'trf_klhk_01b', name: 'Karcis Masuk Wisatawan Nusantara - Hari Libur', nominal: 'Rp 15.000 / orang' },
          { id: 'trf_klhk_01c', name: 'Izin Pengambilan Video Komersial', nominal: 'Rp 10.000.000 / kegiatan' },
        ],
      },
      {
        id: 'svc_klhk_02',
        name: 'Pengujian Mutu Hasil Hutan',
        tariffs: [
          { id: 'trf_klhk_02a', name: 'Uji Kadar Air & Kerapatan Kayu', nominal: 'Rp 180.000 / sampel' },
          { id: 'trf_klhk_02b', name: 'Sertifikasi Hasil Hutan Bukan Kayu', nominal: 'Rp 750.000 / sertifikat' },
        ],
      },
    ],
  },
  {
    id: 'agy_komdigi',
    name: 'Kementerian Komunikasi dan Digital',
    code: 'KOMDIGI',
    services: [
      {
        id: 'svc_kom_01',
        name: 'Penggunaan Spektrum Frekuensi Radio',
        tariffs: [
          { id: 'trf_kom_01a', name: 'Biaya Hak Penggunaan (BHP) Frekuensi Radio', nominal: 'Sesuai formula pita lebar' },
          { id: 'trf_kom_01b', name: 'Izin Stasiun Radio Maritim', nominal: 'Rp 300.000 / stasiun / tahun' },
        ],
      },
      {
        id: 'svc_kom_02',
        name: 'Sertifikasi Alat & Perangkat Telekomunikasi',
        tariffs: [
          { id: 'trf_kom_02a', name: 'Uji Kompatibilitas Elektromagnetik (EMC)', nominal: 'Rp 3.500.000 / perangkat' },
          { id: 'trf_kom_02b', name: 'Penerbitan Sertifikat Tipe Perangkat', nominal: 'Rp 1.000.000 / sertifikat' },
        ],
      },
    ],
  },
  {
    id: 'agy_atrbpn',
    name: 'Kementerian Agraria dan Tata Ruang / BPN',
    code: 'ATR/BPN',
    services: [
      {
        id: 'svc_bpn_01',
        name: 'Pelayanan Informasi Pertanahan Digital',
        tariffs: [
          { id: 'trf_bpn_01a', name: 'Surat Keterangan Pendaftaran Tanah (SKPT) Elektronik', nominal: 'Rp 50.000 / dokumen' },
          { id: 'trf_bpn_01b', name: 'Pengecekan Sertipikat Elektronik', nominal: 'Rp 50.000 / sertipikat' },
          { id: 'trf_bpn_01c', name: 'Hak Tanggungan Elektronik', nominal: 'Mulai Rp 50.000 sesuai nilai tanggungan' },
        ],
      },
      {
        id: 'svc_bpn_02',
        name: 'Pengukuran dan Pemetaan Batas Bidang Tanah',
        tariffs: [
          { id: 'trf_bpn_02a', name: 'Pengukuran Bidang Tanah s.d. 10 Hektar', nominal: 'Dihitung berdasarkan rumus luas' },
          { id: 'trf_bpn_02b', name: 'Pemeriksaan Tanah oleh Panitia A', nominal: 'Dihitung berdasarkan formula luas' },
        ],
      },
    ],
  },
  {
    id: 'agy_polri',
    name: 'Kepolisian Negara Republik Indonesia',
    code: 'POLRI',
    services: [
      {
        id: 'svc_pol_01',
        name: 'Penerbitan Surat Izin Mengemudi (SIM)',
        tariffs: [
          { id: 'trf_pol_01a', name: 'Penerbitan Baru SIM C / C I / C II', nominal: 'Rp 100.000 / penerbitan' },
          { id: 'trf_pol_01b', name: 'Perpanjangan SIM C / C I / C II', nominal: 'Rp 75.000 / penerbitan' },
          { id: 'trf_pol_01c', name: 'Penerbitan Baru SIM A', nominal: 'Rp 120.000 / penerbitan' },
          { id: 'trf_pol_01d', name: 'Perpanjangan SIM A', nominal: 'Rp 80.000 / penerbitan' },
        ],
      },
      {
        id: 'svc_pol_02',
        name: 'Penerbitan Surat Keterangan Catatan Kepolisian (SKCK)',
        tariffs: [
          { id: 'trf_pol_02a', name: 'Penerbitan SKCK Baru / Perpanjangan', nominal: 'Rp 30.000 / lembar' },
        ],
      },
    ],
  },
]

// FAQ / Knowledge Base for Tariff Questions
export const faqs = [
  {
    id: 'faq_01',
    keywords: ['masinis', 'kereta', 'sertifikasi', 'perkeretaapian', 'kemenhub', 'ujian'],
    title: 'Ketentuan Tarif Ujian dan Sertifikasi Masinis Kereta Api',
    answer:
      'Biaya uji pertama sertifikasi masinis diatur sebesar Rp 350.000 per orang, sedangkan perpanjangan dikenakan Rp 200.000 per orang. Pembayaran disetorkan langsung ke Kas Negara via kode billing Simponi.',
    regulation: 'PP No. 15 Tahun 2016 tentang Jenis dan Tarif PNBP Kemenhub',
    agency: 'Kementerian Perhubungan',
    service: 'Sertifikasi Personel Perkeretaapian',
  },
  {
    id: 'faq_02',
    keywords: ['uji', 'kendaraan', 'berkala', 'truk', 'bus', 'kir'],
    title: 'Tarif Pelayanan Uji Berkala Kendaraan Bermotor',
    answer:
      'Tarif uji berkala pertama kendaraan bermotor kategori truk dan bus adalah Rp 150.000 per unit, dan untuk uji berkala perpanjangan sebesar Rp 100.000 per unit.',
    regulation: 'PP No. 15 Tahun 2016 jo. Kepmenhub No. KM 67 Tahun 2022',
    agency: 'Kementerian Perhubungan',
    service: 'Pengujian Berkala Kendaraan Bermotor',
  },
  {
    id: 'faq_03',
    keywords: ['skpt', 'pertanahan', 'sertifikat', 'bpn', 'atr', 'elektronik', 'pengecekan'],
    title: 'Tarif Pengecekan Sertipikat Tanah dan SKPT Elektronik',
    answer:
      'Layanan pengecekan sertipikat tanah secara elektronik dan penerbitan Surat Keterangan Pendaftaran Tanah (SKPT) elektronik dikenakan tarif tetap sebesar Rp 50.000 per berkas layanan.',
    regulation: 'PP No. 128 Tahun 2015 tentang Jenis dan Tarif PNBP Kementerian ATR/BPN',
    agency: 'Kementerian ATR/BPN',
    service: 'Pelayanan Informasi Pertanahan Digital',
  },
  {
    id: 'faq_04',
    keywords: ['sim', 'polri', 'perpanjangan', 'sim c', 'sim a', 'mengemudi'],
    title: 'Tarif Resmi Penerbitan dan Perpanjangan SIM',
    answer:
      'Sesuai ketentuan, tarif penerbitan baru SIM C adalah Rp 100.000 (perpanjangan Rp 75.000). SIM A baru Rp 120.000 (perpanjangan Rp 80.000). Tarif ini di luar biaya tes kesehatan dan tes psikologi pihak ketiga.',
    regulation: 'PP No. 76 Tahun 2020 tentang Jenis dan Tarif atas Jenis PNBP yang Berlaku pada Polri',
    agency: 'Kepolisian Negara RI',
    service: 'Penerbitan Surat Izin Mengemudi (SIM)',
  },
  {
    id: 'faq_05',
    keywords: ['wisata', 'konservasi', 'taman nasional', 'klhk', 'tiket', 'karcis'],
    title: 'Tarif Tiket Masuk Kawasan Konservasi & Taman Nasional',
    answer:
      'Tarif karcis masuk wisatawan nusantara ke kawasan taman nasional berkisar antara Rp 10.000 s.d. Rp 15.000 per orang per hari sesuai klasifikasi taman nasional dan status hari kerja/libur.',
    regulation: 'PP No. 12 Tahun 2014 tentang Tarif PNBP pada Kementerian Kehutanan',
    agency: 'Kementerian LHK',
    service: 'Pemanfaatan Jasa Lingkungan Kawasan Konservasi',
  },
  {
    id: 'faq_06',
    keywords: ['keringanan', 'dispensasi', 'tarif', '0', 'nol rupiah', 'usaha mikro', 'bencana'],
    title: 'Ketentuan Keringanan Tarif PNBP hingga Nol Rupiah',
    answer:
      'Menteri/Pimpinan Lembaga dapat mengajukan permohonan penetapan tarif sampai dengan Rp 0,00 (nol rupiah) atau 0% (nol persen) untuk kondisi tertentu seperti kegiatan sosial keagamaan, bencana alam, dan pengembangan Usaha Mikro, Kecil, dan Menengah (UMKM).',
    regulation: 'PMK No. 122/PMK.02/2023 tentang Tata Cara Penetapan Tarif PNBP',
    agency: 'Kementerian Keuangan RI',
    service: 'Kebijakan Umum Tarif PNBP',
  },
]

// ==========================================
// INTERNAL USERS — Strictly 2 Roles per SOT
// ==========================================
export const mockUsers = [
  {
    id: 'usr_pmo',
    name: 'Budi Santoso, S.E., M.Ak.',
    email: 'pmo.champion@kemenkeu.go.id',
    role: 'PMO / Champion',
    agency: 'Sekretariat PMO Transformasi PNBP',
    avatarInitials: 'BS',
  },
  {
    id: 'usr_executive',
    name: 'Dr. Sri Mulyono, M.Sc.',
    email: 'executive@kemenkeu.go.id',
    role: 'Executive',
    agency: 'Pimpinan Pengarah / Direktur PNBP',
    avatarInitials: 'SM',
  },
]

// Champions Reference
export const champions = [
  { id: 'ch_sda', name: 'Direktorat PNBP SDA', pic: 'Budi Santoso', color: 'blue' },
  { id: 'ch_kl', name: 'Direktorat PNBP K/L', pic: 'Rian Hidayat', color: 'emerald' },
  { id: 'ch_ti', name: 'Direktorat Teknis & TI', pic: 'Ahmad Fauzi', color: 'purple' },
  { id: 'ch_regulasi', name: 'Sekretariat Tim Regulasi', pic: 'Siti Rahmawati', color: 'amber' },
]

// Langkah Strategis Reference
export const strategicSteps = [
  {
    id: 'ls_01',
    kode: 'LS-01',
    name: 'Penguatan Regulasi & Harmonisasi Tarif',
    description: 'Penyusunan dan revisi regulasi tarif PNBP lintas sektor agar berdaya saing dan akuntabel.',
  },
  {
    id: 'ls_02',
    kode: 'LS-02',
    name: 'Modernisasi Sistem Informasi & Billing Terpadu',
    description: 'Integrasi sistem billing Simponi dan automasi rekonsiliasi penerimaan negara bukan pajak.',
  },
  {
    id: 'ls_03',
    kode: 'LS-03',
    name: 'Optimalisasi Penggalian Potensi & Kepatuhan',
    description: 'Pengawasan, audit kepatuhan, dan identifikasi potensi objek PNBP baru secara proaktif.',
  },
  {
    id: 'ls_04',
    kode: 'LS-04',
    name: 'Peningkatan Kualitas Layanan & Keterbukaan Publik',
    description: 'Transparansi informasi tarif, perluasan kanal masukan masyarakat, dan evaluasi kepuasan.',
  },
]

// =========================================================================
// HIERARCHICAL ROADMAP: Langkah Strategis -> Kegiatan -> WBS -> Milestone
// Calculation: Durasi Rencana = Selesai - Mulai
// Progress Rencana = (Hari Berjalan / Total Hari Rencana) * 100%
// Progress Realisasi = Aktual WBS/Milestone
// Deviasi = Realisasi - Rencana
// Status: On Track (Realisasi >= Rencana), Perlu Perhatian (selisih < 10%), Terlambat (selisih >= 10%), Selesai (100%), Belum Mulai (hari berjalan <= 0)
// =========================================================================
export const activities = [
  {
    id: 'keg_01',
    kode: 'KEG-1.1',
    name: 'Penyelarasan Draf Revisi PP Tarif PNBP 15 K/L Prioritas',
    stepId: 'ls_01',
    stepName: 'Penguatan Regulasi & Harmonisasi Tarif',
    champion: 'Direktorat PNBP K/L',
    pic: 'Rian Hidayat',
    unitTerkait: 'Kemenhub, KESDM, KLHK, ATR/BPN, Polri',
    startDate: '2026-01-10',
    endDate: '2026-11-20',
    totalDays: 314,
    currentDay: 248, // per mid-September 2026
    plannedProgress: 79.0,
    actualProgress: 82.5,
    deviation: 3.5,
    status: 'On Track',
    bobot: 30,
    output: 'Draf RPP Hasil Harmonisasi Kemenkumham & Kemenkeu',
    indicator: '15 RPP terharmonisasi dan siap penetapan Presiden',
    wbsList: [
      {
        id: 'wbs_01_1',
        kode: 'WBS-1.1.1',
        title: 'Inventarisasi Usulan Tarif dan Evaluasi Biaya Pokok Layanan (BPL)',
        pic: 'Rian Hidayat',
        bobot: 40,
        progress: 95,
        status: 'On Track',
        milestones: [
          {
            id: 'mls_111_1',
            kode: 'M.1.1.1.A',
            title: 'Konsinyasi Teknis Penghitungan BPL Sektor Perhubungan',
            targetDate: '2026-03-15',
            actualDate: '2026-03-12',
            status: 'Selesai',
            progress: 100,
            evidence: 'BA_Konsinyasi_BPL_Kemenhub.pdf',
            catatan: 'Formulasi tarif uji berkala disepakati 100%.',
          },
          {
            id: 'mls_111_2',
            kode: 'M.1.1.1.B',
            title: 'Kompilasi Matriks Usulan Tarif 15 K/L Terverifikasi',
            targetDate: '2026-05-30',
            actualDate: '2026-05-28',
            status: 'Selesai',
            progress: 100,
            evidence: 'Matriks_Tarif_15KL_Final.xlsx',
            catatan: 'Semua K/L telah melengkapi data dukung.',
          },
        ],
      },
      {
        id: 'wbs_01_2',
        kode: 'WBS-1.1.2',
        title: 'Penyusunan Naskah Urgensi dan Uji Publik Tarif Afirmatif UMKM',
        pic: 'Siti Rahmawati',
        bobot: 60,
        progress: 74,
        status: 'Perlu Perhatian',
        milestones: [
          {
            id: 'mls_112_1',
            kode: 'M.1.1.2.A',
            title: 'Penyusunan Naskah Akademis & Analisis Dampak Ekonomi',
            targetDate: '2026-07-20',
            actualDate: '2026-07-25',
            status: 'Selesai',
            progress: 100,
            evidence: 'Naskah_Akademis_RPP_PNBP.pdf',
            catatan: 'Disetujui Tim Ahli Badan Kebijakan Fiskal.',
          },
          {
            id: 'mls_112_2',
            kode: 'M.1.1.2.B',
            title: 'Pelaksanaan Uji Publik Terbuka dengan Asosiasi Pelaku Usaha',
            targetDate: '2026-09-30',
            actualDate: null,
            status: 'On Track',
            progress: 60,
            evidence: 'Undangan_Uji_Publik_Asosiasi.pdf',
            catatan: 'Jadwal putaran 1 di Jakarta selesai, putaran 2 di Surabaya.',
          },
        ],
      },
    ],
  },
  {
    id: 'keg_02',
    kode: 'KEG-2.1',
    name: 'Modernisasi Billing Simponi & Gateway Integrasi Portal K/L',
    stepId: 'ls_02',
    stepName: 'Modernisasi Sistem Informasi & Billing Terpadu',
    champion: 'Direktorat Teknis & TI',
    pic: 'Ahmad Fauzi',
    unitTerkait: 'Pusintek, Bank Persepsi, Lembaga Switching',
    startDate: '2026-02-01',
    endDate: '2026-11-30',
    totalDays: 302,
    currentDay: 226,
    plannedProgress: 74.8,
    actualProgress: 61.0,
    deviation: -13.8,
    status: 'Terlambat',
    bobot: 35,
    output: 'Modul API Billing Simponi v3 & Verifikasi Real-Time',
    indicator: 'Jeda transmisi data setoran < 10 detik ke kas negara',
    wbsList: [
      {
        id: 'wbs_02_1',
        kode: 'WBS-2.1.1',
        title: 'Pengembangan Microservices Gateway API Billing',
        pic: 'Ahmad Fauzi',
        bobot: 50,
        progress: 75,
        status: 'Perlu Perhatian',
        milestones: [
          {
            id: 'mls_211_1',
            kode: 'M.2.1.1.A',
            title: 'Rilis Arsitektur Microservice Simponi Next-Gen',
            targetDate: '2026-04-10',
            actualDate: '2026-04-10',
            status: 'Selesai',
            progress: 100,
            evidence: 'Arsitektur_Simponi_v3.pdf',
            catatan: 'Dokumen arsitektur disahkan Kepala Pusintek.',
          },
          {
            id: 'mls_211_2',
            kode: 'M.2.1.1.B',
            title: 'SIT (System Integration Testing) Gateway dengan 5 K/L Pilot',
            targetDate: '2026-08-15',
            actualDate: '2026-09-02',
            status: 'Selesai',
            progress: 100,
            evidence: 'BA_SIT_Simponi_Gateway.pdf',
            catatan: 'Sempat kendala firewall di Kemenhub, sudah resolved.',
          },
        ],
      },
      {
        id: 'wbs_02_2',
        kode: 'WBS-2.1.2',
        title: 'Migrasi Database Transaksi & Stress Testing Beban Puncak',
        pic: 'Ahmad Fauzi',
        bobot: 50,
        progress: 47,
        status: 'Terlambat',
        milestones: [
          {
            id: 'mls_212_1',
            kode: 'M.2.1.2.A',
            title: 'Performance & Load Testing 50.000 Concurrent Transactions',
            targetDate: '2026-09-10',
            actualDate: null,
            status: 'Terlambat',
            progress: 40,
            evidence: null,
            catatan: 'Server staging mengalami bottleneck I/O; butuh scale up VM.',
          },
          {
            id: 'mls_212_2',
            kode: 'M.2.1.2.B',
            title: 'Cut-off & Go-Live Sistem Baru',
            targetDate: '2026-11-15',
            actualDate: null,
            status: 'Belum Mulai',
            progress: 0,
            evidence: null,
            catatan: 'Menunggu rekomendasi BSSN terkait enkripsi.',
          },
        ],
      },
    ],
  },
  {
    id: 'keg_03',
    kode: 'KEG-3.1',
    name: 'Pengawasan Kepatuhan & Audit Analitik Penerimaan PNBP SDA',
    stepId: 'ls_03',
    stepName: 'Optimalisasi Penggalian Potensi & Kepatuhan',
    champion: 'Direktorat PNBP SDA',
    pic: 'Budi Santoso',
    unitTerkait: 'Ditjen Minerba KESDM, Ditjen Migas, BPKP',
    startDate: '2026-01-15',
    endDate: '2026-12-15',
    totalDays: 334,
    currentDay: 243,
    plannedProgress: 72.7,
    actualProgress: 84.0,
    deviation: 11.3,
    status: 'On Track',
    bobot: 20,
    output: 'Dashboard Kepatuhan Royalti Minerba & Migas Berbasis Big Data',
    indicator: 'Tingkat kepatuhan pembayaran tepat waktu > 92%',
    wbsList: [
      {
        id: 'wbs_03_1',
        kode: 'WBS-3.1.1',
        title: 'Integrasi Data Produksi Riil vs Setoran Royalti',
        pic: 'Budi Santoso',
        bobot: 100,
        progress: 84,
        status: 'On Track',
        milestones: [
          {
            id: 'mls_311_1',
            kode: 'M.3.1.1.A',
            title: 'Rekonsiliasi Data Triwulan I & II Bersama Ditjen Minerba',
            targetDate: '2026-06-30',
            actualDate: '2026-06-25',
            status: 'Selesai',
            progress: 100,
            evidence: 'Berita_Acara_Rekonsiliasi_TW2.pdf',
            catatan: 'Ditemukan potensi selisih volume Rp 14,2 M yang ditagihkan.',
          },
          {
            id: 'mls_311_2',
            kode: 'M.3.1.1.B',
            title: 'Automasi Deteksi Anomali Tarif pada Dashboard Pengawasan',
            targetDate: '2026-10-15',
            actualDate: null,
            status: 'On Track',
            progress: 75,
            evidence: 'Tangkapan_Layar_Modul_Anomali.png',
            catatan: 'Model deteksi anomali sudah dilatih dengan 3 tahun data.',
          },
        ],
      },
    ],
  },
  {
    id: 'keg_04',
    kode: 'KEG-4.1',
    name: 'Transformasi Kanal Masukan Publik & Layanan Tanya Nita AI',
    stepId: 'ls_04',
    stepName: 'Peningkatan Kualitas Layanan & Keterbukaan Publik',
    champion: 'Sekretariat Tim Regulasi',
    pic: 'Siti Rahmawati',
    unitTerkait: 'Biro Komunikasi Kemenkeu, Helpdesk Ditjen Anggaran',
    startDate: '2026-03-01',
    endDate: '2026-10-31',
    totalDays: 244,
    currentDay: 198,
    plannedProgress: 81.1,
    actualProgress: 88.0,
    deviation: 6.9,
    status: 'On Track',
    bobot: 15,
    output: 'Portal Terpadu KA PNBP dengan Form Masukan Terverifikasi & AI Nita',
    indicator: 'Penyelesaian triage masukan publik < 48 jam kerja',
    wbsList: [
      {
        id: 'wbs_04_1',
        kode: 'WBS-4.1.1',
        title: 'Implementasi Form Masukan Publik & Generator Nomor Tiket Resmi',
        pic: 'Siti Rahmawati',
        bobot: 50,
        progress: 100,
        status: 'Selesai',
        milestones: [
          {
            id: 'mls_411_1',
            kode: 'M.4.1.1.A',
            title: 'Rilis Form Masukan dengan Verifikasi KTP & NIK Mandatori',
            targetDate: '2026-07-15',
            actualDate: '2026-07-10',
            status: 'Selesai',
            progress: 100,
            evidence: 'Dokumentasi_Rilis_Form_Publik.pdf',
            catatan: 'Beroperasi stabil di landing page portal.',
          },
        ],
      },
      {
        id: 'wbs_04_2',
        kode: 'WBS-4.1.2',
        title: 'Peningkatan Knowledge Base Tanya Nita AI Navigator',
        pic: 'Siti Rahmawati',
        bobot: 50,
        progress: 76,
        status: 'On Track',
        milestones: [
          {
            id: 'mls_412_1',
            kode: 'M.4.1.2.A',
            title: 'Injeksi Regulasi PP Tarif 15 K/L ke Knowledge Engine Nita',
            targetDate: '2026-10-01',
            actualDate: null,
            status: 'On Track',
            progress: 76,
            evidence: 'Laporan_Indeks_Regulasi_Nita.pdf',
            catatan: 'Akurasi kecocokan pencarian mencapai 94.2%.',
          },
        ],
      },
    ],
  },
]

// ==========================================
// ISU STRATEGIS (SOT Section 15)
// ==========================================
export const strategicIssues = [
  {
    id: 'isu_01',
    kode: 'ISU-01',
    title: 'Jeda Transmisi Data Simponi dengan Sistem Pembayaran Kemenhub',
    description: 'Terjadi latency sinkronisasi setoran hingga 4 jam pada waktu beban puncak jam kerja.',
    kegiatanId: 'keg_02',
    kegiatanName: 'Modernisasi Billing Simponi & Gateway Integrasi Portal K/L',
    champion: 'Direktorat Teknis & TI',
    langkahStrategis: 'Modernisasi Sistem Informasi & Billing Terpadu',
    priority: 'Tinggi',
    dampak: 'Konfirmasi bukti bayar bagi pemohon uji kendaraan tertahan di gerbang loket uji.',
    tindakLanjut: 'Peningkatan antrean message broker dan implementasi webhook event-driven.',
    targetPenyelesaian: '2026-09-25',
    status: 'Open',
    mitigationStatus: 'Dalam Eksekusi',
  },
  {
    id: 'isu_02',
    kode: 'ISU-02',
    title: 'Belum Adanya Kesepakatan Biaya Pokok Layanan Penggunaan Jalur Rel',
    description: 'Perbedaan perhitungan depresiasi prasarana jalan rel antara operator dan Kemenhub.',
    kegiatanId: 'keg_01',
    kegiatanName: 'Penyelarasan Draf Revisi PP Tarif PNBP 15 K/L Prioritas',
    champion: 'Direktorat PNBP K/L',
    langkahStrategis: 'Penguatan Regulasi & Harmonisasi Tarif',
    priority: 'Tinggi',
    dampak: 'Penyelesaian naskah revisi PP terancam mundur 1 bulan.',
    tindakLanjut: 'Fasilitasi mediasi tripartit Kemenkeu, Kemenhub, dan BPKP pekan depan.',
    targetPenyelesaian: '2026-09-28',
    status: 'Open',
    mitigationStatus: 'Rakor Terjadwal',
  },
  {
    id: 'isu_03',
    kode: 'ISU-03',
    title: 'Kebutuhan Standardisasi Bukti Verifikasi Dispensasi Tarif 0 Rupiah UMKM',
    description: 'Unit teknis K/L meminta pedoman operasional baku terkait validasi surat keterangan UMKM.',
    kegiatanId: 'keg_04',
    kegiatanName: 'Transformasi Kanal Masukan Publik & Layanan Tanya Nita AI',
    champion: 'Sekretariat Tim Regulasi',
    langkahStrategis: 'Peningkatan Kualitas Layanan & Keterbukaan Publik',
    priority: 'Sedang',
    dampak: 'Potensi disparitas perlakuan antar balai layanan di daerah.',
    tindakLanjut: 'Terbitkan Surat Edaran Bersama Ditjen Anggaran dan Kemenkop UKM.',
    targetPenyelesaian: '2026-10-10',
    status: 'Open',
    mitigationStatus: 'Penyusunan Draf SE',
  },
  {
    id: 'isu_04',
    kode: 'ISU-04',
    title: 'Keterbatasan Lisensi Database Staging Uji Beban Transaksi',
    description: 'Server staging belum dapat mereplikasi skala 50.000 transaksi bersamaan.',
    kegiatanId: 'keg_02',
    kegiatanName: 'Modernisasi Billing Simponi & Gateway Integrasi Portal K/L',
    champion: 'Direktorat Teknis & TI',
    langkahStrategis: 'Modernisasi Sistem Informasi & Billing Terpadu',
    priority: 'Tinggi',
    dampak: 'Jadwal stress testing tertunda dari tanggal 10 September.',
    tindakLanjut: 'Pengalihan sementara kuota komputasi cloud dari cluster testing cadangan.',
    targetPenyelesaian: '2026-09-22',
    status: 'In Progress',
    mitigationStatus: 'Proses Alokasi Cloud',
  },
]

// ==========================================
// CHANGE REQUESTS (SOT Section 16)
// ==========================================
export const initialChangeRequests = [
  {
    id: 'cr_01',
    kode: 'CR-2026-003',
    module: 'Kegiatan',
    title: 'Penyesuaian Target Penyelesaian & Bobot Staging Simponi Gateway',
    targetElement: 'KEG-2.1 — Modernisasi Billing Simponi & Gateway',
    fieldChanged: 'Target Selesai & Bobot WBS',
    currentValue: 'Target Selesai: 2026-10-31 | Bobot WBS Testing: 40%',
    proposedValue: 'Target Selesai: 2026-11-30 | Bobot WBS Testing: 50%',
    reason: 'Kebutuhan penguatan uji keamanan siber (pentest BSSN) dan migrasi data historis 5 tahun.',
    impact: 'Mundurnya go-live 3 minggu tanpa mengubah batas tahun anggaran 2026.',
    attachments: 'Surat_Rekomendasi_Pusintek_CR03.pdf',
    submitter: 'Ahmad Fauzi, M.T.',
    submitterRole: 'PMO / Champion',
    submitDate: '2026-09-12',
    status: 'Pending Approval', // 'Pending Approval', 'Approved', 'Rejected', 'Draft'
    approver: null,
    approvalDate: null,
    rejectionReason: null,
  },
  {
    id: 'cr_02',
    kode: 'CR-2026-002',
    module: 'Langkah Strategis',
    title: 'Penambahan Indikator Keterbukaan Tarif Publik pada LS-04',
    targetElement: 'LS-04 — Peningkatan Kualitas Layanan & Keterbukaan Publik',
    fieldChanged: 'Indikator Utama Keberhasilan',
    currentValue: 'Indikator: Rilis modul tanya nita dasar',
    proposedValue: 'Indikator: Rilis modul tanya nita AI + Form Masukan KTP terverifikasi dengan SLA < 48 jam',
    reason: 'Menindaklanjuti arahan Pimpinan terkait penguatan akuntabilitas data masukan masyarakat.',
    impact: 'Peningkatan kepatuhan dan validitas masukan tarif publik.',
    attachments: 'Nota_Dinas_Pimpinan_Aspirasi_Publik.pdf',
    submitter: 'Siti Rahmawati, S.Sos.',
    submitterRole: 'PMO / Champion',
    submitDate: '2026-09-08',
    status: 'Approved',
    approver: 'Dr. Sri Mulyono, M.Sc.',
    approvalDate: '2026-09-09 10:15 WIB',
    rejectionReason: null,
  },
  {
    id: 'cr_03',
    kode: 'CR-2026-001',
    module: 'Kegiatan',
    title: 'Perubahan PIC Utama Uji Publik Tarif Perkeretaapian',
    targetElement: 'KEG-1.1 — Penyelarasan Draf Revisi PP Tarif PNBP',
    fieldChanged: 'Penanggung Jawab (PIC)',
    currentValue: 'PIC: Hendra Gunawan',
    proposedValue: 'PIC: Rian Hidayat (Plt. Kasubdit PNBP Transportasi)',
    reason: 'Pejabat sebelumnya memasuki masa penugasan studi lanjutan.',
    impact: 'Kontinuitas koordinasi dengan Kemenhub tetap terjaga.',
    attachments: 'SK_Pelaksana_Tugas_Kasubdit.pdf',
    submitter: 'Budi Santoso, S.E., M.Ak.',
    submitterRole: 'PMO / Champion',
    submitDate: '2026-08-25',
    status: 'Approved',
    approver: 'Dr. Sri Mulyono, M.Sc.',
    approvalDate: '2026-08-26 14:30 WIB',
    rejectionReason: null,
  },
]

// ==========================================
// AUDIT TRAIL (SOT Section 18)
// ==========================================
export const initialAuditTrail = [
  {
    id: 'adt_01',
    timestamp: '2026-09-15 11:20:15 WIB',
    user: 'Dr. Sri Mulyono, M.Sc.',
    role: 'Executive',
    module: 'Monitoring',
    action: 'Direct Edit Capaian',
    target: 'KEG-3.1 — Royalti Minerba',
    beforeValue: 'Progress Realisasi: 80.0%',
    afterValue: 'Progress Realisasi: 84.0%',
    approvalStatus: 'Auto-Active (Executive)',
    approver: 'Dr. Sri Mulyono, M.Sc.',
    reason: 'Sinkronisasi berita acara rekonsiliasi triwulan II Ditjen Minerba',
  },
  {
    id: 'adt_02',
    timestamp: '2026-09-12 16:45:00 WIB',
    user: 'Ahmad Fauzi, M.T.',
    role: 'PMO / Champion',
    module: 'Change Request',
    action: 'Submit Usulan Perubahan',
    target: 'CR-2026-003',
    beforeValue: 'Target: 2026-10-31 | Bobot: 40%',
    afterValue: 'Target: 2026-11-30 | Bobot: 50%',
    approvalStatus: 'Pending Approval',
    approver: 'Menunggu Executive',
    reason: 'Penambahan lingkup pengujian pentest siber BSSN',
  },
  {
    id: 'adt_03',
    timestamp: '2026-09-09 10:15:22 WIB',
    user: 'Dr. Sri Mulyono, M.Sc.',
    role: 'Executive',
    module: 'Approval',
    action: 'Approve Change Request',
    target: 'CR-2026-002',
    beforeValue: 'Status: Pending Approval',
    afterValue: 'Status: Approved (Baseline Disimpan)',
    approvalStatus: 'Approved',
    approver: 'Dr. Sri Mulyono, M.Sc.',
    reason: 'Disetujui sesuai arahan penguatan akuntabilitas data publik',
  },
  {
    id: 'adt_04',
    timestamp: '2026-09-08 14:10:05 WIB',
    user: 'Siti Rahmawati, S.Sos.',
    role: 'PMO / Champion',
    module: 'Change Request',
    action: 'Submit Usulan Perubahan',
    target: 'CR-2026-002',
    beforeValue: 'Indikator Rilis Nita Dasar',
    afterValue: 'Indikator Rilis Nita AI + Form Masukan KTP',
    approvalStatus: 'Submitted',
    approver: 'Menunggu Executive',
    reason: 'Penyelarasan mandat PRD vlogin',
  },
  {
    id: 'adt_05',
    timestamp: '2026-08-26 14:30:18 WIB',
    user: 'Dr. Sri Mulyono, M.Sc.',
    role: 'Executive',
    module: 'Approval',
    action: 'Approve Change Request',
    target: 'CR-2026-001',
    beforeValue: 'PIC: Hendra Gunawan',
    afterValue: 'PIC: Rian Hidayat',
    approvalStatus: 'Approved',
    approver: 'Dr. Sri Mulyono, M.Sc.',
    reason: 'Disetujui karena pejabat lama tugas belajar',
  },
]

// Legacy feedback & question queues preserved for background tracking
export const mockFeedbackQueue = [
  {
    id: 'FB-2026-000123',
    ticket_number: 'TKT-FB-2026-000123',
    agency: 'Kementerian Perhubungan',
    service: 'Sertifikasi Personel Perkeretaapian',
    tariff: 'Ujian Sertifikasi Masinis Pertama',
    category: 'Tarif',
    date: '10 Sep 2026',
    submitter: 'Dewan Transportasi Kereta Api',
    summary: 'Usulan peninjauan kembali biaya perpanjangan lisensi masinis muda di masa restrukturisasi armada.',
    status: 'new',
    priority: 'Tinggi',
    assignedTo: 'Belum ditugaskan',
  },
  {
    id: 'FB-2026-000120',
    ticket_number: 'TKT-FB-2026-000120',
    agency: 'Kementerian ATR/BPN',
    service: 'Pelayanan Informasi Pertanahan Digital',
    tariff: 'Pengecekan Sertipikat Elektronik',
    category: 'Layanan',
    date: '09 Sep 2026',
    submitter: 'Asosiasi Notaris & PPAT',
    summary: 'Kendala waktu terbit SKPT digital yang sering melebihi 24 jam kerja.',
    status: 'triaged',
    priority: 'Sedang',
    assignedTo: 'Rian Hidayat',
  },
  {
    id: 'FB-2026-000118',
    ticket_number: 'TKT-FB-2026-000118',
    agency: 'Kementerian LHK',
    service: 'Pemanfaatan Jasa Lingkungan',
    tariff: 'Karcis Masuk Wisatawan Nusantara',
    category: 'Kejelasan Informasi',
    date: '07 Sep 2026',
    submitter: 'Komunitas Pecinta Alam',
    summary: 'Permohonan kejelasan rincian asuransi jiwa yang termasuk dalam karcis masuk kawasan lindung.',
    status: 'responded',
    priority: 'Rendah',
    assignedTo: 'Siti Rahmawati',
  },
]

export const mockQuestionsQueue = [
  {
    id: 'Q-2026-000089',
    agency: 'Kementerian Perhubungan',
    service: 'Sertifikasi Masinis',
    question: 'Berapa besaran biaya resmi ujian sertifikasi ulang bila peserta dinyatakan tidak lulus pada tahap praktik?',
    date: '10 Sep 2026',
    matchedFaq: 'Ketentuan Tarif Ujian dan Sertifikasi Masinis Kereta Api',
    status: 'answered',
    assignedTo: 'Tim Regulasi Perhubungan',
  },
]

// Re-exports for client.js backward compatibility
export const dashboardKpis = [
  { id: 'kpi_1', label: 'Capaian Transformasi', value: '78.9%', note: 'agregat seluruh K/L' },
  { id: 'kpi_2', label: 'Kegiatan Aktif', value: '4', note: '2026' },
]
export const programs = [
  { id: 'prog_01', name: 'Penguatan Regulasi & Harmonisasi', progress: 82.5, status: 'On Track' },
]
export const priorityItems = [
  { id: 'pri_01', title: 'Sinkronisasi Billing Simponi', priority: 'Tinggi', status: 'In Progress' },
]
export const milestones = [
  { id: 'mls_01', title: 'Harmonisasi RPP 15 K/L', status: 'In Progress', progressPct: 80 },
]
export const activity = [
  { id: 'act_01', time: '11:20 WIB', text: 'Executive memperbarui capaian KEG-3.1 menjadi 84.0%' },
]

