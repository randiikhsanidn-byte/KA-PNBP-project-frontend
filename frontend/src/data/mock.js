// Mock data module for KA PNBP prototype
// Aligned with docs/SOT/04-API-SPEC.md and 01-PRD.md

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

// Dashboard KPI Summary (API Spec 7. Dashboard)
export const dashboardKpis = [
  {
    id: 'kpi_active_programs',
    label: 'Program Transformasi Aktif',
    value: '8',
    note: 'periode anggaran 2026',
    tone: 'navy',
    trend: '+2 program baru',
  },
  {
    id: 'kpi_milestone_completion',
    label: 'Capaian Milestone Selesai',
    value: '68%',
    note: '34 dari 50 milestone tuntas',
    tone: 'green',
    trend: 'On track triwulan III',
  },
  {
    id: 'kpi_open_issues',
    label: 'Isu & Risiko Terbuka',
    value: '12',
    note: '3 bernilai dampak tinggi',
    tone: 'yellow',
    trend: 'Perlu mitigasi PIC',
  },
  {
    id: 'kpi_overdue_tasks',
    label: 'Tindak Lanjut Jatuh Tempo',
    value: '5',
    note: 'melewati target SLA penyelesaian',
    tone: 'red',
    trend: 'Perlu eskalasi segera',
  },
  {
    id: 'kpi_public_feedback',
    label: 'Masukan Publik Periode Ini',
    value: '34',
    note: '8 menunggu klasifikasi / triage',
    tone: 'navy',
    trend: '+12 minggu ini',
  },
  {
    id: 'kpi_public_questions',
    label: 'Pertanyaan Tarif Diterima',
    value: '19',
    note: '5 belum dialokasikan ke PIC',
    tone: 'navy',
    trend: '14 terselesaikan via FAQ',
  },
]

// Programs and Workstreams (PRD FR-INT-02, FR-INT-03)
export const programs = [
  {
    id: 'prog_01',
    name: 'Penguatan Tata Kelola & Harmonisasi Tarif PNBP',
    owner: 'Tim Pokja Kebijakan Fiskal & PNBP',
    progress: 78,
    status: 'On track',
    targetDate: 'Des 2026',
    activeWorkstreams: 4,
    description: 'Penyelarasan PP tarif lintas 15 K/L prioritas serta perumusan pedoman penetapan tarif berbasis biaya riil.',
  },
  {
    id: 'prog_02',
    name: 'Modernisasi & Digitalisasi Kanal Layanan PNBP',
    owner: 'Tim Transformasi Sistem Informasi',
    progress: 61,
    status: 'At risk',
    targetDate: 'Nov 2026',
    activeWorkstreams: 3,
    description: 'Integrasi sistem billing pembayaran Simponi ke portal pelayanan satu pintu dan verifikasi transaksi otomatis.',
  },
  {
    id: 'prog_03',
    name: 'Peningkatan Kualitas Data & Rekonsiliasi Penerimaan',
    owner: 'Tim Manajemen Data & Akuntansi PNBP',
    progress: 84,
    status: 'On track',
    targetDate: 'Okt 2026',
    activeWorkstreams: 2,
    description: 'Pembangunan repositori data terpadu untuk monitoring real-time setoran PNBP dan deteksi anomali kepatuhan.',
  },
  {
    id: 'prog_04',
    name: 'Kajian Keringanan Tarif Afirmatif & UMKM',
    owner: 'Subdit Potensi PNBP Non-Kementerian',
    progress: 45,
    status: 'At risk',
    targetDate: 'Nov 2026',
    activeWorkstreams: 2,
    description: 'Evaluasi dampak skema tarif 0 rupiah bagi pelaku usaha mikro dan kegiatan riset perguruan tinggi negeri.',
  },
]

// Milestones (PRD FR-INT-04, API Spec 8)
export const milestones = [
  {
    id: 'mls_01',
    title: 'Penyelarasan WBS & Rencana Kerja Transformasi 2026',
    program: 'Tata Kelola & Harmonisasi',
    owner: 'Budi Santoso',
    due: '18 Sep 2026',
    status: 'In progress',
    progressPct: 80,
    evidence: 'Dokumen_WBS_Final_v2.pdf',
  },
  {
    id: 'mls_02',
    title: 'Validasi Master Katalog Layanan & Tarif 15 K/L',
    program: 'Digitalisasi Layanan',
    owner: 'Rian Hidayat',
    due: '22 Sep 2026',
    status: 'At risk',
    progressPct: 55,
    evidence: 'BA_Validasi_Katalog_Kemenhub.pdf',
  },
  {
    id: 'mls_03',
    title: 'Peluncuran Modul Publik Triage Masukan Tarif',
    program: 'Tata Kelola & Harmonisasi',
    owner: 'Siti Rahmawati',
    due: '28 Sep 2026',
    status: 'In progress',
    progressPct: 70,
    evidence: 'SOP_Triage_Masukan_Publik.docx',
  },
  {
    id: 'mls_04',
    title: 'Implementasi Dashboard Monitoring Real-Time Tahap I',
    program: 'Peningkatan Kualitas Data',
    owner: 'Ahmad Fauzi',
    due: '05 Okt 2026',
    status: 'On track',
    progressPct: 90,
    evidence: 'Repositori_BI_Dashboard_v1.zip',
  },
  {
    id: 'mls_05',
    title: 'Penyusunan Draf Revisi PP Tarif PNBP Perkeretaapian',
    program: 'Tata Kelola & Harmonisasi',
    owner: 'Hendra Gunawan',
    due: '15 Okt 2026',
    status: 'Not started',
    progressPct: 10,
    evidence: null,
  },
]

// Priority Items: Issues, Risks, & Overdue Tasks (PRD FR-INT-05, FR-INT-06, F-INT-02, F-INT-05 scan step 4)
export const priorityItems = [
  {
    id: 'pri_01',
    type: 'Isu Kritis',
    category: 'Sistem / Data',
    title: 'Sinkronisasi data billing Simponi dengan portal Kemenhub mengalami jeda 4 jam',
    owner: 'Tim Integrasi Sistem',
    dueDate: '14 Sep 2026',
    priority: 'Tinggi',
    status: 'Overdue',
    mitigation: 'Implementasi endpoint webhook real-time dan peningkatan antrean message broker',
  },
  {
    id: 'pri_02',
    type: 'Risiko',
    category: 'Regulasi',
    title: 'Keterlambatan harmonisasi antarkementerian atas rancangan tarif uji berkala',
    owner: 'Biro Hukum & Kebijakan',
    dueDate: '20 Sep 2026',
    priority: 'Tinggi',
    status: 'Blocked',
    mitigation: 'Jadwalkan rapat koordinasi teknis tingkat pimpinan eselon I Kemenhub dan Kemenkeu',
  },
  {
    id: 'pri_03',
    type: 'Tindak Lanjut',
    category: 'Operasional',
    title: 'Penetapan PIC resmi verifikasi masukan tarif untuk 6 unit eselon teknis',
    owner: 'Sekretariat Pokja',
    dueDate: '12 Sep 2026',
    priority: 'Tinggi',
    status: 'Overdue',
    mitigation: 'Penerbitan surat penugasan resmi pejabat fungsional per 15 September',
  },
  {
    id: 'pri_04',
    type: 'Isu',
    category: 'Pelayanan Publik',
    title: 'Lonjakan pertanyaan masyarakat mengenai skema tarif nol rupiah mahasiswa PKL',
    owner: 'Tim Helpdesk Publik',
    dueDate: '18 Sep 2026',
    priority: 'Sedang',
    status: 'Open',
    mitigation: 'Publikasikan panduan teknis dan FAQ resmi PMK 122/2023 pada portal KA PNBP',
  },
]

// Public Feedback Queue (PRD FR-INT-07, F-INT-03)
export const mockFeedbackQueue = [
  {
    id: 'FB-2026-000123',
    agency: 'Kementerian Perhubungan',
    service: 'Sertifikasi Personel Perkeretaapian',
    tariff: 'Ujian Sertifikasi Masinis Pertama',
    category: 'tarif',
    date: '10 Sep 2026',
    submitter: 'Dewan Transportasi Kereta Api',
    summary: 'Usulan peninjauan kembali biaya perpanjangan lisensi masinis muda di masa restrukturisasi armada.',
    status: 'new',
    priority: 'Tinggi',
    assignedTo: 'Belum ditugaskan',
  },
  {
    id: 'FB-2026-000120',
    agency: 'Kementerian ATR/BPN',
    service: 'Pelayanan Informasi Pertanahan Digital',
    tariff: 'Pengecekan Sertipikat Elektronik',
    category: 'layanan',
    date: '09 Sep 2026',
    submitter: 'Asosiasi Notaris & PPAT',
    summary: 'Kendala waktu terbit SKPT digital yang sering melebihi 24 jam kerja.',
    status: 'triaged',
    priority: 'Sedang',
    assignedTo: 'Rian Hidayat',
  },
  {
    id: 'FB-2026-000118',
    agency: 'Kementerian LHK',
    service: 'Pemanfaatan Jasa Lingkungan',
    tariff: 'Karcis Masuk Wisatawan Nusantara',
    category: 'kejelasan informasi',
    date: '07 Sep 2026',
    submitter: 'Komunitas Pecinta Alam',
    summary: 'Permohonan kejelasan rincian asuransi jiwa yang termasuk dalam karcis masuk kawasan lindung.',
    status: 'responded',
    priority: 'Rendah',
    assignedTo: 'Siti Rahmawati',
  },
  {
    id: 'FB-2026-000115',
    agency: 'Kepolisian Negara RI',
    service: 'Penerbitan SIM',
    tariff: 'Penerbitan Baru SIM C',
    category: 'mekanisme',
    date: '05 Sep 2026',
    submitter: 'Masyarakat Umum',
    summary: 'Saran integrasi pembayaran langsung pada loket tanpa perantara pihak ketiga.',
    status: 'closed',
    priority: 'Sedang',
    assignedTo: 'Budi Santoso',
  },
]

// Public Questions Queue (PRD FR-INT-08, F-INT-04)
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
  {
    id: 'Q-2026-000088',
    agency: 'Kementerian Keuangan RI',
    service: 'Kebijakan Umum',
    question: 'Bagaimana prosedur permohonan dispensasi tarif 0 rupiah untuk kegiatan penelitian mahasiswa perguruan tinggi negeri?',
    date: '09 Sep 2026',
    matchedFaq: 'Ketentuan Keringanan Tarif PNBP hingga Nol Rupiah',
    status: 'new',
    assignedTo: 'Belum ditugaskan',
  },
  {
    id: 'Q-2026-000085',
    agency: 'Kementerian Komunikasi dan Digital',
    service: 'Spektrum Frekuensi Radio',
    question: 'Apakah ada pembebasan tarif BHP frekuensi radio untuk radio komunitas penanggulangan bencana daerah?',
    date: '08 Sep 2026',
    matchedFaq: null,
    status: 'assigned',
    assignedTo: 'Ahmad Fauzi',
  },
]

// Recent Activity Log (PRD FR-INT-11, F-INT-05 scan step 6)
export const activity = [
  {
    id: 'act_01',
    time: '14:20 WIB',
    text: 'Milestone “Penyelarasan WBS & Rencana Kerja 2026” diperbarui progresnya menjadi 80% oleh Budi Santoso.',
    type: 'milestone',
  },
  {
    id: 'act_02',
    time: '11:45 WIB',
    text: 'Masukan publik FB-2026-000123 (Sertifikasi Personel Perkeretaapian) diklasifikasikan sebagai prioritas tinggi.',
    type: 'feedback',
  },
  {
    id: 'act_03',
    time: '09:30 WIB',
    text: 'Isu kritis “Sinkronisasi data billing Simponi dengan portal Kemenhub” ditambahkan ke daftar prioritas pemantauan.',
    type: 'issue',
  },
  {
    id: 'act_04',
    time: 'Kemarin, 16:15 WIB',
    text: 'Jawaban resmi untuk tiket pertanyaan tarif Q-2026-000089 telah dikirimkan ke pemohon.',
    type: 'question',
  },
  {
    id: 'act_05',
    time: 'Kemarin, 10:00 WIB',
    text: 'Laporan ringkasan kepatuhan PNBP triwulan II berhasil di-generate untuk sesi evaluasi pimpinan.',
    type: 'report',
  },
]

// User Profiles for Prototype Auth
export const mockUsers = [
  {
    id: 'usr_editor',
    name: 'Budi Santoso, S.E., M.Ak.',
    email: 'budi.santoso@kemenkeu.go.id',
    role: 'Internal Editor',
    agency: 'Staf Ahli Menkeu Bidang PNBP',
    avatarInitials: 'BS',
  },
  {
    id: 'usr_viewer',
    name: 'Siti Rahmawati, S.Sos.',
    email: 'siti.rahmawati@kemenkeu.go.id',
    role: 'Internal Viewer',
    agency: 'Biro Pengawasan Internal',
    avatarInitials: 'SR',
  },
  {
    id: 'usr_admin',
    name: 'Ahmad Fauzi, M.T.',
    email: 'ahmad.fauzi@kemenkeu.go.id',
    role: 'Internal Admin',
    agency: 'Pusat Sistem Informasi Keuangan',
    avatarInitials: 'AF',
  },
]
