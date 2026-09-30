import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PnbpRealizationSection from '../components/PnbpRealizationSection'
import heroImage from '../assets/Background.png'
import nitaAvatar from '../assets/nita-avatar.jpg'
import { agencies, faqs } from '../data/mock'
import { api } from '../api/client'

export default function LandingPage() {
  const navigate = useNavigate()
  const [heroSearch, setHeroSearch] = useState('')

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault()
    if (heroSearch.trim()) {
      navigate(`/dasar-hukum?q=${encodeURIComponent(heroSearch.trim())}`)
    } else {
      navigate('/dasar-hukum')
    }
  }
  // Knowledge & Question Chat State (Tanya Nita, Navigator Informasi Tarif)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'system',
      text: 'Halo! Saya Nita, Navigator Informasi Tarif berbasis AI Kementerian Keuangan & Perhubungan. Silakan tanyakan informasi tarif PNBP, regulasi PP/PMK, atau biaya layanan perkeretaapian.',
      citation: 'PP No. 15 Tahun 2016 & UU No. 9 Tahun 2018',
    },
    {
      sender: 'user',
      text: 'Berapa besaran tarif pengujian sarana lokomotif diesel?',
    },
    {
      sender: 'nita',
      text: 'Berdasarkan PP No. 15 Tahun 2016 dan Permenhub PM 17 Tahun 2022, tarif jasa pengujian sarana perkeretaapian lokomotif diesel elektrik adalah sebesar Rp 17.500.000 per unit yang disetorkan langsung ke Kas Negara via Simponi.',
      citation: 'PP No. 15/2016 (Lampiran Tarif Sarana)',
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const chatEndRef = useRef(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    // Pada mount awal, pastikan scroll selalu di paling atas (Hero view)
    if (isInitialMount.current) {
      isInitialMount.current = false
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }
    // Hanya scroll chat ketika pengguna atau AI mengirim pesan baru
    if (chatMessages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatMessages, aiTyping])

  // RAG query search over faqs and agencies
  const queryAiRag = (userQuestion) => {
    const q = userQuestion.toLowerCase().trim()

    // 1. Match in faqs
    for (const item of faqs) {
      const matchesKeyword = item.keywords.some((k) => q.includes(k.toLowerCase()))
      const titleWords = item.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
      const matchesTitle = titleWords.some((w) => q.includes(w))
      if (matchesKeyword || matchesTitle) {
        return {
          text: `Berdasarkan regulasi resmi, ${item.answer}`,
          citation: `${item.regulation} (${item.agency})`,
          found: true,
        }
      }
    }

    // 2. Match in agency services & tariffs
    for (const agy of agencies) {
      for (const svc of agy.services) {
        if (q.includes(svc.name.toLowerCase().slice(0, 10))) {
          const tariffList = svc.tariffs.map((t) => `• ${t.name}: ${t.nominal}`).join('\n')
          return {
            text: `Untuk layanan "${svc.name}" pada ${agy.name}, ketentuan tarif resmi yang berlaku adalah:\n${tariffList}\n\nPembayaran disetorkan langsung ke Kas Negara via kode billing Simponi.`,
            citation: `Katalog Tarif PNBP ${agy.name}`,
            found: true,
          }
        }
        for (const trf of svc.tariffs) {
          if (q.includes(trf.name.toLowerCase().slice(0, 8))) {
            return {
              text: `Terkait tarif "${trf.name}" pada ${agy.name} (${svc.name}), besaran tarif resmi adalah sebesar ${trf.nominal}. Pembayaran disetorkan langsung ke Kas Negara.`,
              citation: `Katalog Tarif PNBP ${agy.name}`,
              found: true,
            }
          }
        }
      }
    }

    // 3. Fallback answers
    if (q.includes('kereta') || q.includes('masinis') || q.includes('rel') || q.includes('tac')) {
      return {
        text: 'Berdasarkan PP No. 15 Tahun 2016 dan Permenhub PM 17 Tahun 2022, tarif jasa transportasi perkeretaapian mencakup pengujian sarana (lokomotif, kereta, gerbong), sertifikasi masinis, dan Track Access Charge (TAC) yang dihitung berdasarkan formula tonase dan jarak tempuh.',
        citation: 'PP No. 15/2016 & Permenhub PM 17/2022',
        found: true,
      }
    }

    return {
      text: 'Pertanyaan Anda memerlukan telaah spesifik oleh Tim Pokja Regulasi Tarif PNBP. Anda dapat mengajukan pertanyaan ini secara resmi atau menyampaikan masukan melalui formulir Masukan Tarif untuk ditindaklanjuti.',
      citation: null,
      found: false,
    }
  }

  const handleSendChat = (e) => {
    e.preventDefault()
    if (!chatInput.trim() || aiTyping) return

    const userText = chatInput.trim()
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }])
    setChatInput('')
    setAiTyping(true)

    setTimeout(() => {
      const response = queryAiRag(userText)
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'nita',
          text: response.text,
          citation: response.citation,
          found: response.found,
        },
      ])
      setAiTyping(false)
    }, 700)
  }

  const handleQuickAsk = (questionText) => {
    setChatMessages((prev) => [...prev, { sender: 'user', text: questionText }])
    setAiTyping(true)

    setTimeout(() => {
      const response = queryAiRag(questionText)
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'nita',
          text: response.text,
          citation: response.citation,
          found: response.found,
        },
      ])
      setAiTyping(false)
    }, 600)
  }

  // Status Tracking Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [statusQuery, setStatusQuery] = useState('')
  const [statusSearching, setStatusSearching] = useState(false)
  const [statusResult, setStatusResult] = useState(null)
  const [statusError, setStatusError] = useState('')

  const handleSearchStatus = async (e) => {
    e.preventDefault()
    setStatusError('')
    setStatusResult(null)
    if (!statusQuery.trim()) return

    setStatusSearching(true)
    try {
      const res = await api.getFeedbackStatus(statusQuery.trim().toUpperCase())
      setStatusResult(res.data)
    } catch (err) {
      setStatusError(err.message || 'Nomor tiket tidak ditemukan. Pastikan format benar, misal: FB-2026-000123 atau TKT-FB-2026-000123')
    } finally {
      setStatusSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar onOpenStatusModal={() => setStatusModalOpen(true)} />

        {/* HERO SECTION — Full Viewport First Fold exactly matching attached photo */}
        <section className="relative isolate overflow-hidden bg-navy-950 min-h-[calc(100vh-72px)] flex flex-col justify-center">
          {/* Cinematic Slow Motion Landscape Background */}
          <img
            src={heroImage}
            alt="Lanskap perkeretaapian Indonesia"
            className="absolute inset-0 h-full w-full object-cover object-[68%_center] animate-cinematic-bg"
          />

          {/* Subtle Golden Horizon Sunbeam Light (Natural Ministry Ambient Glow) */}
          <div
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[480px] w-[880px] rounded-full bg-gradient-to-b from-amber-400/20 via-amber-500/5 to-transparent blur-3xl animate-ambient-sunbeam"
            aria-hidden="true"
          />

          {/* Balanced cinematic gradient overlay */}
          <div className="absolute inset-0 bg-navy-950/45 backdrop-brightness-95" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-navy-950/50" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-50 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 text-center my-auto">
            {/* Category Badge with Active Radar Beacon (3s cycle) */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-yellow-300 border border-white/20 backdrop-blur-md shadow-xs transition hover:bg-white/15">
              <span className="relative flex h-2 w-2">
                <span className="animate-beacon-ping-3s absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>Kanal Aspirasi PNBP</span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-md">
              KA PNBP
            </h1>

            {/* Synchronized Container: Sejajar antara Teks dan Box Pencarian */}
            <div className="mt-2.5 sm:mt-3 w-fit max-w-full mx-auto flex flex-col items-center">
              {/* Hero Subtitle */}
              <p className="text-sm sm:text-base md:text-lg text-slate-100 leading-relaxed drop-shadow-sm font-normal sm:whitespace-nowrap w-full text-center">
                Sampaikan masukan atas tarif PNBP atau ajukan pertanyaan terkait tarif PNBP.
              </p>

              {/* Centered Search Bar - Luminous Focus & 3s Periodic Golden Glow */}
              <form
                onSubmit={handleHeroSearchSubmit}
                className="mt-5 sm:mt-6 w-full relative flex items-center bg-white rounded-full shadow-2xl border-2 border-white/90 animate-search-pulse-3s hover:border-yellow-400 focus-within:border-yellow-500 focus-within:ring-4 focus-within:ring-yellow-400/30 transition-all duration-300 p-1.5 sm:p-2 text-left"
              >
                <div className="pl-4 sm:pl-5 text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Cari Dasar Hukum, PP Tarif PNBP, PMK, atau Layanan KA..."
                  className="w-full bg-transparent px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  aria-label="Cari Regulasi atau Tarif PNBP"
                />
                <button
                  type="submit"
                  className="rounded-full bg-navy-950 px-6 sm:px-7 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-navy-900 active:scale-95 transition-all duration-200 flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <span>Cari</span>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-yellow-400 animate-arrow-nudge-3s" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </form>
            </div>

            {/* 3 Main Action Cards - Sapuan Berkas Cahaya Halus Berjalan Otomatis Setiap 3 Detik */}
            <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 w-full max-w-5xl">
              {/* 1. Dasar Hukum: Neraca Keadilan / Timbangan Hukum Resmi (JDIH / Regulasi) */}
              <Link
                to="/dasar-hukum"
                className="gov-card-auto-sheen gov-card-delay-1 group relative flex flex-col items-center justify-between rounded-2xl bg-white p-5 sm:p-7 text-center shadow-xl border border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 min-h-[210px]"
              >
                {/* Subtle top indicator glow */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-navy-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-blue-50/80 text-navy-950 flex items-center justify-center mb-3 sm:mb-4 border border-blue-100/80 group-hover:scale-110 group-hover:bg-blue-100/90 group-hover:text-navy-900 transition-all duration-300 shadow-2xs">
                    <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8 text-navy-950 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {/* Tiang Utama & Penopang */}
                      <path d="M12 3v17" strokeWidth="2" />
                      <path d="M5 6.5h14" strokeWidth="2" />
                      <path d="M8 20h8" strokeWidth="2" />
                      <circle cx="12" cy="3.5" r="1.5" fill="currentColor" />
                      {/* Piringan Timbangan Kiri */}
                      <path d="M5 6.5L2 12.5h6L5 6.5z" />
                      <path d="M2 12.5a3 3 0 0 0 6 0" />
                      {/* Piringan Timbangan Kanan */}
                      <path d="M19 6.5L16 12.5h6l-3-6.5z" />
                      <path d="M16 12.5a3 3 0 0 0 6 0" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-navy-950 group-hover:text-blue-900 transition-colors duration-200">
                    Dasar Hukum PNBP
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Telusuri regulasi UU, PP tarif resmi, PMK, dan ketentuan perkeretaapian
                  </p>
                </div>
              </Link>

              {/* 2. Masukan Tarif: Berkas Formulir Aspirasi & Pena Resmi Pemerintah */}
              <Link
                to="/masukan-tarif"
                className="gov-card-auto-sheen gov-card-delay-2 group relative flex flex-col items-center justify-between rounded-2xl bg-white p-5 sm:p-7 text-center shadow-xl border border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 min-h-[210px]"
              >
                {/* Subtle top indicator glow */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-blue-50/80 text-navy-950 flex items-center justify-center mb-3 sm:mb-4 border border-blue-100/80 group-hover:scale-110 group-hover:bg-blue-100/90 group-hover:text-navy-900 transition-all duration-300 shadow-2xs">
                    <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8 text-navy-950 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {/* Lembar Dokumen Formulir Aspirasi */}
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      {/* Baris Berkas Isian */}
                      <path d="M8 12h5" />
                      <path d="M8 16h4" />
                      {/* Pena Resmi Pemerintahan */}
                      <path d="M18 11.5l1.5-1.5a1.414 1.414 0 0 0-2-2L13 12.5V15h2.5L18 11.5z" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-navy-950 group-hover:text-blue-900 transition-colors duration-200">
                    Masukan Tarif
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Formulir usulan penyesuaian, evaluasi tarif, & keberatan resmi masyarakat
                  </p>
                </div>
              </Link>

              {/* 3. Realisasi PNBP: Gedung Perbendaharaan Negara / Kas Negara (Kemenkeu) */}
              <a
                href="#realisasi"
                className="gov-card-auto-sheen gov-card-delay-3 group relative flex flex-col items-center justify-between rounded-2xl bg-white p-5 sm:p-7 text-center shadow-xl border border-slate-100 hover:border-slate-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 min-h-[210px]"
              >
                {/* Subtle top indicator glow */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-600/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                <div className="flex flex-col items-center">
                  <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-blue-50/80 text-navy-950 flex items-center justify-center mb-3 sm:mb-4 border border-blue-100/80 group-hover:scale-110 group-hover:bg-blue-100/90 group-hover:text-navy-900 transition-all duration-300 shadow-2xs">
                    <svg viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8 text-navy-950 transition-transform duration-300 group-hover:scale-105" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {/* Atap Segitiga Gedung Perbendaharaan / Treasury Pediment */}
                      <path d="M3 9.5L12 3l9 6.5" strokeWidth="2" />
                      {/* Pilar-Pilar Kas Negara */}
                      <path d="M6 10v8" strokeWidth="2" />
                      <path d="M10 10v8" strokeWidth="2" />
                      <path d="M14 10v8" strokeWidth="2" />
                      <path d="M18 10v8" strokeWidth="2" />
                      {/* Pondasi Lantai Gedung */}
                      <path d="M3 18h18" strokeWidth="2" />
                      <path d="M2 21h20" strokeWidth="2" />
                      {/* Lambang Segel Kas Negara */}
                      <circle cx="12" cy="6.8" r="1.2" fill="currentColor" />
                    </svg>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-navy-950 group-hover:text-blue-900 transition-colors duration-200">
                    Realisasi PNBP
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                    Data capaian PNBP dari Target APBN dan kinerja tahun 2021–2025
                  </p>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 2: TANYA NITA (AI REGULATORY NAVIGATOR) & FITUR MASUKAN */}
        <section id="tanya-nita" className="py-14 sm:py-16 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: Tanya Nita AI Assistant (7 Cols) - Ukuran Lebih Besar & Multi Percakapan Terlihat */}
              {/* Left Column: Tanya Nita AI Assistant (7 Cols) - Ukuran Font Diperkecil & Tampilan Rapi */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl overflow-hidden border border-slate-200 shadow-xs shrink-0">
                      <img src={nitaAvatar} alt="Nita Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-navy-950">
                        Tanya Nita, Temukan Tarif PNBP
                      </h2>
                      <p className="text-xs text-slate-500">
                        Navigator Informasi & Regulasi Tarif PNBP Berbasis AI
                      </p>
                    </div>
                  </div>

                  {/* Chat Box Conversation - Font Diperkecil agar Lebih Banyak Percakapan Terbaca */}
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 flex flex-col min-h-[350px] max-h-[440px] overflow-hidden justify-between">
                    <div className="overflow-y-auto space-y-3 pr-1.5 mb-2.5 flex-1 max-h-[290px]">
                      {chatMessages.map((msg, idx) =>
                        msg.sender !== 'user' ? (
                          <div key={idx} className="flex items-start gap-2">
                            <img src={nitaAvatar} alt="Nita" className="h-6 w-6 rounded-full object-cover border border-slate-200 shrink-0" />
                            <div className="max-w-[88%] rounded-xl rounded-tl-none bg-slate-50 border border-slate-200/80 p-2.5 sm:p-3 text-[11px] sm:text-xs text-slate-800 leading-relaxed shadow-2xs">
                              <p className="whitespace-pre-line">{msg.text}</p>
                              {msg.citation && (
                                <div className="mt-1.5 pt-1.5 border-t border-slate-200 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium">
                                  <span>📖 Dasar Hukum:</span>
                                  <span className="font-bold text-navy-950">{msg.citation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div key={idx} className="flex justify-end">
                            <div className="max-w-[85%] rounded-xl rounded-tr-none bg-navy-950 p-2.5 text-[11px] sm:text-xs text-white shadow-2xs leading-relaxed">
                              <p>{msg.text}</p>
                            </div>
                          </div>
                        )
                      )}
                      {aiTyping && (
                        <div className="flex items-start gap-2">
                          <img src={nitaAvatar} alt="Nita" className="h-6 w-6 rounded-full object-cover border border-slate-200 shrink-0" />
                          <div className="rounded-xl rounded-tl-none bg-slate-50 border border-slate-200 p-2 text-[11px] sm:text-xs text-slate-500 flex items-center gap-2">
                            <span className="flex gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                            <span>Nita sedang menelusuri database regulasi PNBP...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick question suggestion chips */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      <span className="text-[10px] sm:text-[11px] text-slate-400 self-center mr-1">Pertanyaan cepat:</span>
                      {['Sertifikasi Masinis', 'Track Access Charge', 'Uji Lokomotif', 'Tarif KRL Commuter', 'Keberatan Tarif PP 59'].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleQuickAsk(q)}
                          className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-slate-700 hover:bg-slate-100 hover:text-navy-950 transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Chat */}
                  <form onSubmit={handleSendChat} className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ketik pertanyaan tarif atau regulasi di sini..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-900"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || aiTyping}
                      className="rounded-xl bg-navy-950 px-4 sm:px-5 py-2 text-xs font-bold text-white hover:bg-navy-900 transition disabled:opacity-50 flex items-center gap-1.5 shadow-xs shrink-0"
                    >
                      <span>Kirim</span>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: CTA Banner Masukan Tarif & Lacak Status (5 Cols - Seimbang & Solutif) */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-4 sm:gap-5">
                {/* Banner 1: Masukan Tarif PNBP */}
                <div className="flex-1 flex flex-col justify-between bg-gradient-to-br from-navy-950 to-navy-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-navy-900/60">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
                      <span>Saluran Aspirasi Publik</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug mb-2">
                      Ajukan Masukan & Keberatan Tarif PNBP
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      Pemerintah membuka ruang aspirasi publik untuk dijadikan bahan pertimbangan dalam proses penyusunan kebijakan dan regulasi.
                    </p>

                    {/* 3 Kategori Aspirasi Publik */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start gap-2.5 rounded-xl bg-white/5 border border-white/10 p-2.5 hover:bg-white/10 transition">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-yellow-400/20 text-yellow-300 text-[11px] font-bold">1</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Keberatan Besaran Tarif</h4>
                          <p className="text-[11px] text-slate-300 leading-snug">Keberatan atas tarif PNBP yang terlalu memberatkan masyarakat dan pelaku usaha.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 rounded-xl bg-white/5 border border-white/10 p-2.5 hover:bg-white/10 transition">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-yellow-400/20 text-yellow-300 text-[11px] font-bold">2</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Usulan Penyesuaian Tarif</h4>
                          <p className="text-[11px] text-slate-300 leading-snug">Aspirasi evaluasi dan usulan perubahan besaran tarif PNBP.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 rounded-xl bg-white/5 border border-white/10 p-2.5 hover:bg-white/10 transition">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-yellow-400/20 text-yellow-300 text-[11px] font-bold">3</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">Ketidakjelasan Regulasi / Dasar Hukum</h4>
                          <p className="text-[11px] text-slate-300 leading-snug">Klarifikasi aturan multitafsir terhadap ketentuan PP/PMK atau pungutan tanpa dasar hukum.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <Link
                      to="/masukan-tarif"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-500 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-navy-950 hover:bg-yellow-400 transition shadow-sm w-full sm:w-auto"
                    >
                      <span>Buka Halaman Masukan Tarif</span>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Banner 2: Lacak Status Tiket */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 text-navy-950 flex items-center justify-center border border-blue-100/80 shrink-0">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                        <rect x="9" y="3" width="6" height="4" rx="2" />
                        <path d="m9 14 2 2 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Sudah Mengirim Masukan?
                      </h4>
                      <p className="text-sm font-extrabold text-navy-950 mt-0.5">
                        Lacak Progres Tindak Lanjut Tiket
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(true)}
                    className="rounded-xl bg-navy-950 px-4 sm:px-5 py-2 text-xs font-bold text-white hover:bg-navy-900 active:scale-95 transition shadow-xs shrink-0 w-full sm:w-auto"
                  >
                    Lacak Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: REALISASI PNBP 2021 - 2025 (KEMENKEU OFFICIAL DATA) (FOTO 2) */}
        <PnbpRealizationSection />

        {/* STATUS TRACKING MODAL */}
        {statusModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-lg font-bold text-navy-950">Lacak Status Masukan</h3>
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSearchStatus} className="space-y-4">
                <div>
                  <label htmlFor="modal-tracking-input" className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Tiket / Referensi:
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="modal-tracking-input"
                      type="text"
                      value={statusQuery}
                      onChange={(e) => setStatusQuery(e.target.value)}
                      placeholder="Contoh: FB-2026-000123"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-900 font-mono"
                    />
                    <button
                      type="submit"
                      disabled={statusSearching || !statusQuery.trim()}
                      className="rounded-xl bg-navy-950 px-4 py-2 text-xs font-bold text-white hover:bg-navy-900 transition disabled:opacity-50 shrink-0"
                    >
                      {statusSearching ? 'Mencari...' : 'Cari'}
                    </button>
                  </div>
                </div>

                {statusError && (
                  <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 font-medium">
                    {statusError}
                  </div>
                )}

                {statusResult && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-navy-950 font-mono">{statusResult.ticket_number}</span>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                        {statusResult.status_label || statusResult.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400 block">K/L:</span>
                        <span className="font-semibold text-slate-800">{statusResult.agency}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Tanggal:</span>
                        <span className="font-semibold text-slate-800">{statusResult.date}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Ringkasan:</span>
                      <p className="text-slate-700 font-medium">{statusResult.summary}</p>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setStatusModalOpen(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Tutup
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
