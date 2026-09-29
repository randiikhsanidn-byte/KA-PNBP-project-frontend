import { useState, useId, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../components/Brand'
import { Field, inputClass, selectClass, textareaClass } from '../components/Field'
import heroImage from '../assets/Background.png'
import nitaAvatar from '../assets/nita-avatar.jpg'
import { agencies, faqs } from '../data/mock'
import { api } from '../api/client'

function ArrowIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12 4 4L19 6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export default function LandingPage() {
  const feedbackConsentId = useId()
  const questionConsentId = useId()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Knowledge & Question Chat State (Tanya Nita, Temukan tarif PNBP)
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'system',
      text: 'Halo! Saya Nita, Navigator Informasi Tarif berbasis AI. Ada yang bisa saya bantu terkait tarif PNBP pada instansi tertentu?',
      citation: null,
    },
  ])
  const [chatInput, setChatInput] = useState('')
  const [aiTyping, setAiTyping] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, aiTyping])

  // RAG query search over faqs and agencies
  const queryAiRag = (userQuestion) => {
    const q = userQuestion.toLowerCase().trim()

    // 1. Direct keywords match in faqs
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

    // 2. Direct match in agency services and tariffs
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

    // 3. Specific common queries
    if (q.includes('sim') || q.includes('mengemudi') || q.includes('polri')) {
      return {
        text: 'Tarif resmi penerbitan SIM baru C adalah Rp 100.000 (perpanjangan Rp 75.000). SIM A baru Rp 120.000 (perpanjangan Rp 80.000). Ketentuan ini berlaku nasional di luar biaya tes kesehatan & psikologi pihak ketiga.',
        citation: 'PP No. 76 Tahun 2020 (Polri)',
        found: true,
      }
    }

    if (q.includes('kereta') || q.includes('masinis') || q.includes('kemenhub')) {
      return {
        text: 'Tarif sertifikasi masinis pertama diatur sebesar Rp 350.000 per orang, dan perpanjangan Rp 200.000 per orang sesuai regulasi PNBP Kementerian Perhubungan.',
        citation: 'PP No. 15 Tahun 2016 (Kemenhub)',
        found: true,
      }
    }

    if (q.includes('tanah') || q.includes('bpn') || q.includes('sertipikat') || q.includes('skpt')) {
      return {
        text: 'Biaya pengecekan sertipikat tanah elektronik dan penerbitan SKPT elektronik dikenakan tarif tetap Rp 50.000 per berkas layanan.',
        citation: 'PP No. 128 Tahun 2015 (Kementerian ATR/BPN)',
        found: true,
      }
    }

    if (q.includes('0') || q.includes('nol') || q.includes('keringanan') || q.includes('umkm') || q.includes('bencana')) {
      return {
        text: 'Kementerian/Lembaga dapat mengusulkan tarif sampai dengan Rp 0,00 (nol rupiah) atau 0% bagi masyarakat tertentu seperti kegiatan sosial keagamaan, korban bencana alam, dan pelaku UMKM.',
        citation: 'PMK No. 122/PMK.02/2023 (Kemenkeu)',
        found: true,
      }
    }

    // 4. Fallback intelligent response
    return {
      text: `Terima kasih atas pertanyaannya mengenai "${userQuestion}". Menurut penelusuran arsitektur RAG pada basis data regulasi aktif, informasi rinci tarif untuk kata kunci tersebut belum terindeks pada pencarian cepat.\n\nAnda dapat menyampaikan masukan tarif atau permohonan kejelasan regulasi melalui formulir di sebelah kanan agar dapat ditelaah lebih lanjut.`,
      citation: 'UU No. 9 Tahun 2018 tentang PNBP',
      found: false,
    }
  }

  const handleSendChat = (e) => {
    if (e) e.preventDefault()
    const q = chatInput.trim()
    if (!q) return

    setChatMessages((prev) => [...prev, { sender: 'user', text: q }])
    setChatInput('')
    setAiTyping(true)

    setTimeout(() => {
      const result = queryAiRag(q)
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: result.text,
          citation: result.citation,
        },
      ])
      setAiTyping(false)
    }, 600)
  }

  const handleQuickAsk = (tag) => {
    setChatMessages((prev) => [...prev, { sender: 'user', text: tag }])
    setAiTyping(true)

    setTimeout(() => {
      const result = queryAiRag(tag)
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: result.text,
          citation: result.citation,
        },
      ])
      setAiTyping(false)
    }, 500)
  }

  // Feedback Form State (Masukan atas Tarif PNBP)
  const [feedbackName, setFeedbackName] = useState('')
  const [feedbackNik, setFeedbackNik] = useState('')
  const [feedbackKtpFile, setFeedbackKtpFile] = useState(null)
  const [feedbackEmail, setFeedbackEmail] = useState('')
  const [feedbackPhone, setFeedbackPhone] = useState('')
  const [feedbackAgencyId, setFeedbackAgencyId] = useState('')
  const [feedbackCategory, setFeedbackCategory] = useState('')
  const [feedbackDetail, setFeedbackDetail] = useState('')
  const [feedbackSupportingFile, setFeedbackSupportingFile] = useState(null)
  const [feedbackConsent, setFeedbackConsent] = useState(true)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [feedbackResult, setFeedbackResult] = useState(null)
  const [feedbackError, setFeedbackError] = useState('')

  const ktpInputRef = useRef(null)
  const supportingInputRef = useRef(null)

  const handleKtpChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setFeedbackError('File KTP harus berformat gambar (JPG, PNG) atau PDF.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedbackError('Ukuran file KTP maksimal 5MB.')
      return
    }
    setFeedbackError('')
    setFeedbackKtpFile(file)
  }

  const handleSupportingChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setFeedbackError('Ukuran file data pendukung maksimal 10MB.')
      return
    }
    setFeedbackError('')
    setFeedbackSupportingFile(file)
  }

  const resetFeedbackForm = () => {
    setFeedbackName('')
    setFeedbackNik('')
    setFeedbackKtpFile(null)
    setFeedbackEmail('')
    setFeedbackPhone('')
    setFeedbackAgencyId('')
    setFeedbackCategory('')
    setFeedbackDetail('')
    setFeedbackSupportingFile(null)
    setFeedbackConsent(true)
    setFeedbackResult(null)
    setFeedbackError('')
    if (ktpInputRef.current) ktpInputRef.current.value = ''
    if (supportingInputRef.current) supportingInputRef.current.value = ''
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    setFeedbackError('')

    if (!feedbackName.trim()) {
      setFeedbackError('Nama lengkap wajib diisi.')
      return
    }
    const cleanNik = feedbackNik.trim()
    if (!cleanNik) {
      setFeedbackError('NIK wajib diisi.')
      return
    }
    if (!/^\d{16}$/.test(cleanNik)) {
      setFeedbackError('NIK harus terdiri dari 16 digit angka.')
      return
    }
    if (!feedbackKtpFile) {
      setFeedbackError('Upload KTP (*wajib) belum dipilih.')
      return
    }
    if (!feedbackEmail.trim()) {
      setFeedbackError('Email wajib diisi.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(feedbackEmail.trim())) {
      setFeedbackError('Format email tidak valid.')
      return
    }
    if (!feedbackAgencyId) {
      setFeedbackError('Silakan pilih Kementerian / Lembaga terlebih dahulu.')
      return
    }
    if (!feedbackCategory) {
      setFeedbackError('Silakan pilih Jenis Masukan terlebih dahulu.')
      return
    }
    if (!feedbackDetail.trim()) {
      setFeedbackError('Detail masukan wajib diisi.')
      return
    }
    if (!feedbackConsent) {
      setFeedbackError('Persetujuan privasi wajib dicentang sebelum mengirim.')
      return
    }

    setFeedbackSubmitting(true)

    try {
      const selectedAgencyObj = agencies.find((a) => a.id === feedbackAgencyId)
      const res = await api.submitFeedback({
        name: feedbackName.trim(),
        nik: cleanNik,
        ktp_file: { name: feedbackKtpFile.name, size: feedbackKtpFile.size },
        email: feedbackEmail.trim(),
        phone: feedbackPhone.trim() || null,
        agency_id: feedbackAgencyId,
        agency_name: selectedAgencyObj?.name,
        service_id: selectedAgencyObj?.services[0]?.id || 'svc_general',
        service_name: selectedAgencyObj?.services[0]?.name || 'Layanan Terkait',
        tariff_id: selectedAgencyObj?.services[0]?.tariffs[0]?.id || 'trf_general',
        tariff_name: selectedAgencyObj?.services[0]?.tariffs[0]?.name || 'Tarif Terkait',
        category: feedbackCategory,
        message: feedbackDetail.trim(),
        supporting_file: feedbackSupportingFile
          ? { name: feedbackSupportingFile.name, size: feedbackSupportingFile.size }
          : null,
        consent: feedbackConsent,
      })

      const now = new Date()
      const formattedTime =
        now.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' ' +
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
        ' WIB'

      const ticketNumber = res.data.ticket_number || `TKT-${res.data.reference}`

      setFeedbackResult({
        ticketNumber: ticketNumber,
        reference: res.data.reference,
        statusLabel: res.data.status_label || 'Baru (Menunggu Triage)',
        submittedAt: formattedTime,
        agencyName: selectedAgencyObj?.name || 'Instansi Terkait',
        category: feedbackCategory,
        message: feedbackDetail.trim(),
        name: feedbackName.trim(),
        nik: cleanNik,
        email: feedbackEmail.trim(),
        phone: feedbackPhone.trim(),
        ktpName: feedbackKtpFile.name,
        supportingName: feedbackSupportingFile?.name || null,
      })
    } catch (err) {
      setFeedbackError(err.message || 'Gagal mengirim masukan. Silakan coba lagi.')
    } finally {
      setFeedbackSubmitting(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text)
    alert(`Kode referensi ${text} berhasil disalin!`)
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
      setStatusError(err.message || 'Nomor referensi tidak ditemukan. Pastikan format benar, misal: FB-2026-000123')
    } finally {
      setStatusSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header — 72px, white/translucent, brand badge, login at right (FR-PUB-01) */}
      <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-8">
            <Brand />
            <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi publik">
              <a
                href="#masukan"
                className="text-sm font-semibold text-slate-600 transition hover:text-navy-950 focus:outline-none focus-visible:text-navy-950"
              >
                Masukan Tarif
              </a>
              <a
                href="#pertanyaan"
                className="text-sm font-semibold text-slate-600 transition hover:text-navy-950 focus:outline-none focus-visible:text-navy-950"
              >
                Pertanyaan Tarif
              </a>
              <button
                type="button"
                onClick={() => setStatusModalOpen(true)}
                className="text-sm font-semibold text-slate-600 transition hover:text-navy-950 focus:outline-none focus-visible:text-navy-950"
              >
                Lacak Status
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy-950 px-5 text-sm font-bold text-white transition hover:bg-navy-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-navy-700/20"
            >
              <span>Login</span>
              <ArrowIcon />
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
              aria-label="Toggle navigasi publik"
              aria-expanded={mobileMenuOpen}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen ? (
          <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <a
                href="#masukan"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Masukan Tarif PNBP
              </a>
              <a
                href="#pertanyaan"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Pertanyaan Tarif PNBP
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setStatusModalOpen(true)
                }}
                className="rounded-lg px-3 py-2 text-left text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Lacak Status Masukan
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <main>
        {/* HERO SECTION — Uses Background.png, keeps train visible on right, left panel (FR-PUB-02, FR-PUB-03) */}
        <section className="relative isolate overflow-hidden bg-navy-950">
          <img
            src={heroImage}
            alt="Kereta api melintasi lanskap pegunungan dan persawahan di Indonesia"
            className="absolute inset-0 h-full w-full object-cover object-[64%_center]"
          />
          {/* Subtle directional gradient to keep text readable on left and train vivid on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950/25 to-transparent" aria-hidden="true" />

          <div className="relative mx-auto flex min-h-[610px] max-w-[1480px] items-center px-5 py-16 sm:px-8 lg:min-h-[660px] lg:px-12">
            <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/95 p-7 shadow-soft backdrop-blur-sm sm:p-9 lg:p-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-eco-600" aria-hidden="true" />
                <span className="font-['Roboto',sans-serif] text-xs font-bold uppercase tracking-tight text-slate-600">
                  Kanal Aspirasi PNBP
                </span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-navy-950 sm:text-5xl lg:text-[56px] lg:leading-[1.02]">
                KA PNBP
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                Sampaikan masukan atas tarif PNBP atau ajukan pertanyaan terkait tarif melalui layanan publik di bawah ini.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <a
                  href="#pertanyaan"
                  className="group flex min-h-24 flex-col justify-between rounded-2xl bg-yellow-500 p-5 text-navy-950 transition hover:-translate-y-0.5 hover:bg-yellow-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-500/40 shadow-sm"
                >
                  <span className="text-sm font-bold">Pertanyaan Tarif PNBP</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-navy-900 group-hover:text-navy-950">
                    Cari atau ajukan <ArrowIcon />
                  </span>
                </a>
                <a
                  href="#masukan"
                  className="group flex min-h-24 flex-col justify-between rounded-2xl bg-navy-950 p-5 text-white transition hover:-translate-y-0.5 hover:bg-navy-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-500/40"
                >
                  <span className="text-sm font-bold">Masukan Tarif PNBP</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 group-hover:text-white">
                    Buka formulir <ArrowIcon />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Asisten AI & Masukan atas Tarif PNBP (Side-by-side Layout) */}
        <section id="layanan" className="scroll-mt-16 border-b border-slate-200 bg-slate-100/70 py-16 lg:py-24">
          <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
              
              {/* LEFT CARD: Asisten AI Tarif PNBP */}
              <div
                id="pertanyaan"
                className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden">
                      <img src={nitaAvatar} alt="Nita Avatar" className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-navy-950">
                        Tanya Nita, Temukan tarif PNBP
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Navigator Informasi Tarif berbasis AI
                      </p>
                    </div>
                  </div>

                  {/* Chat Box Container */}
                  <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 sm:p-5 flex flex-col min-h-[380px] max-h-[460px] overflow-hidden justify-between">
                    {/* Chat Messages List */}
                    <div className="overflow-y-auto space-y-4 pr-1 mb-3 flex-1 max-h-[320px]">
                      {chatMessages.map((msg, idx) =>
                        msg.sender !== 'user' ? (
                          <div key={idx} className="flex items-start gap-3">
                            <img src={nitaAvatar} alt="Nita" className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs" />
                            <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-slate-200/80 bg-white p-4 text-sm leading-relaxed text-slate-800 shadow-xs">
                              <p className="whitespace-pre-line">{msg.text}</p>
                              {msg.citation && (
                                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                                  <span>📚 Dasar Regulasi:</span>
                                  <span className="font-semibold text-navy-950">{msg.citation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div key={idx} className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-navy-950 p-3.5 text-sm leading-relaxed text-white shadow-xs">
                              <p>{msg.text}</p>
                            </div>
                          </div>
                        )
                      )}
                      {aiTyping && (
                        <div className="flex items-start gap-3">
                          <img src={nitaAvatar} alt="Nita" className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs" />
                          <div className="rounded-2xl rounded-tl-none border border-slate-200/80 bg-white p-3.5 text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                            <span className="flex gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                            <span>Nita sedang menelusuri regulasi & data tarif PNBP...</span>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                      <span className="text-[11px] font-medium text-slate-400 self-center mr-1">Tanya cepat:</span>
                      {['Tarif SIM C', 'Sertifikasi Masinis', 'Uji Truk KIR', 'Cek Sertipikat Tanah', 'Tarif 0 Rupiah'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleQuickAsk(tag)}
                          className="rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:border-navy-950 hover:text-navy-950 transition"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendChat} className="mt-4 flex gap-2.5">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ketik pertanyaan anda disini..."
                      className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950/20"
                      disabled={aiTyping}
                    />
                    <button
                      type="submit"
                      disabled={aiTyping || !chatInput.trim()}
                      className="rounded-xl bg-navy-950 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-navy-900 disabled:opacity-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-navy-700/20"
                    >
                      Kirim
                    </button>
                  </form>
                </div>
              </div>

              {/* RIGHT CARD: Masukan atas Tarif PNBP */}
              <div
                id="masukan"
                className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-soft"
              >
                <div className="flex items-center gap-3.5 mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-eco-50 text-2xl border border-eco-100/80 shadow-xs">
                    ✏️
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-navy-950">
                      Masukan atas Tarif PNBP
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sampaikan masukan, aspirasi, atau usulan penyesuaian tarif PNBP secara resmi dan terverifikasi.
                    </p>
                  </div>
                </div>

                {feedbackResult ? (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-eco-100 text-eco-700">
                      <CheckCircleIcon />
                    </div>
                    <span className="mt-3 inline-flex items-center rounded-full bg-eco-100 px-3 py-1 text-xs font-bold text-eco-700">
                      {feedbackResult.statusLabel}
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold text-navy-950">
                      Masukan Berhasil Diterima
                    </h3>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Nomor Tiket Anda:
                    </p>
                    <div className="mt-1 flex items-center justify-center">
                      <span className="font-mono text-2xl font-black text-navy-950 tracking-wider bg-yellow-400/25 border-2 border-yellow-500/50 px-5 py-2 rounded-2xl shadow-xs">
                        {feedbackResult.ticketNumber}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      No. Referensi: <span className="font-mono font-semibold text-slate-700">{feedbackResult.reference}</span>
                    </p>

                    {/* Summary Card */}
                    <div className="mt-4 w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left text-xs text-slate-700 space-y-2">
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500 font-medium">Nomor Tiket:</span>
                        <span className="font-mono font-extrabold text-navy-950">{feedbackResult.ticketNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500 font-medium">Pelapor:</span>
                        <span className="font-semibold text-navy-950">{feedbackResult.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500 font-medium">NIK:</span>
                        <span className="font-mono font-semibold text-navy-950">
                          {feedbackResult.nik ? `${feedbackResult.nik.slice(0, 4)}********${feedbackResult.nik.slice(-4)}` : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500 font-medium">Email / Telp:</span>
                        <span className="font-medium text-slate-800">
                          {feedbackResult.email} {feedbackResult.phone ? `(${feedbackResult.phone})` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500 font-medium">Instansi / Kategori:</span>
                        <span className="font-semibold text-navy-950 text-right max-w-[220px] truncate">
                          {feedbackResult.agencyName} • {feedbackResult.category}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                        <span className="text-slate-500 font-medium">Berkas KTP:</span>
                        <span className="font-medium text-slate-800 truncate max-w-[220px]">
                          📎 {feedbackResult.ktpName}
                        </span>
                      </div>
                      {feedbackResult.supportingName && (
                        <div className="flex justify-between border-b border-slate-200/80 pb-1.5">
                          <span className="text-slate-500 font-medium">Data Pendukung:</span>
                          <span className="font-medium text-slate-800 truncate max-w-[220px]">
                            📎 {feedbackResult.supportingName}
                          </span>
                        </div>
                      )}
                      <div className="pt-1">
                        <span className="text-slate-500 font-medium block mb-1">Uraian Masukan:</span>
                        <p className="rounded-lg bg-white p-2.5 text-slate-800 border border-slate-200/80 italic line-clamp-3">
                          "{feedbackResult.message}"
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 max-w-sm">
                      Masukan Anda telah masuk ke antrean triage internal. Simpan nomor tiket di atas untuk memantau status tindak lanjut.
                    </p>
                    <div className="mt-5 flex gap-3 w-full max-w-xs">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(feedbackResult.ticketNumber)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Salin No. Tiket
                      </button>
                      <button
                        type="button"
                        onClick={resetFeedbackForm}
                        className="flex-1 rounded-xl bg-navy-950 py-2.5 text-xs font-bold text-white hover:bg-navy-900"
                      >
                        Kirim Baru
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    {feedbackError && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 flex items-start gap-2">
                        <span className="text-base leading-none">⚠️</span>
                        <span>{feedbackError}</span>
                      </div>
                    )}

                    {/* Row: Nama Lengkap & NIK */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Field 1: Nama Lengkap (*wajib) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={feedbackName}
                          onChange={(e) => setFeedbackName(e.target.value)}
                          placeholder="Contoh: Budi Santoso"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950/20"
                          required
                        />
                      </div>

                      {/* Field 2: NIK (*wajib) */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            NIK <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">
                            {feedbackNik.length}/16 digit
                          </span>
                        </div>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={16}
                          value={feedbackNik}
                          onChange={(e) => setFeedbackNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          placeholder="16 digit NIK"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950/20"
                          required
                        />
                      </div>
                    </div>

                    {/* Field 3: Upload KTP (*wajib) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Upload KTP <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={ktpInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleKtpChange}
                        className="hidden"
                      />
                      {feedbackKtpFile ? (
                        <div className="flex items-center justify-between rounded-xl border border-eco-200 bg-eco-50/70 p-3">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-eco-600 text-white text-sm font-bold">
                              ✓
                            </span>
                            <div className="truncate">
                              <p className="truncate text-xs font-bold text-eco-950">{feedbackKtpFile.name}</p>
                              <p className="text-[11px] text-eco-700">
                                {(feedbackKtpFile.size / 1024).toFixed(1)} KB • Siap diunggah
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackKtpFile(null)
                              if (ktpInputRef.current) ktpInputRef.current.value = ''
                            }}
                            className="ml-2 shrink-0 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => ktpInputRef.current?.click()}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-4 text-center transition hover:border-navy-950/40 hover:bg-slate-100/60"
                        >
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-xs mb-1.5">
                            🪪
                          </div>
                          <p className="text-xs font-bold text-navy-950">
                            Pilih berkas KTP pelapor <span className="text-eco-600 font-semibold">(Wajib)</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Format JPG, PNG, atau PDF (maksimal 5MB)
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Row: Email & Telp */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Field 4: Email (*wajib) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={feedbackEmail}
                          onChange={(e) => setFeedbackEmail(e.target.value)}
                          placeholder="nama@email.com"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950/20"
                          required
                        />
                      </div>

                      {/* Field 5: Telp (tidak wajib) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          No. Telepon / WhatsApp <span className="text-slate-400 font-normal normal-case text-[11px]">(Tidak Wajib)</span>
                        </label>
                        <input
                          type="tel"
                          value={feedbackPhone}
                          onChange={(e) => setFeedbackPhone(e.target.value.replace(/[^\d+ -]/g, '').slice(0, 20))}
                          placeholder="Contoh: 081234567890"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950/20"
                        />
                      </div>
                    </div>

                    {/* Row: Kementerian/Lembaga & Jenis Masukan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Field 6: Kementerian / Lembaga (tetap kondisi eksisting) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Kementerian / Lembaga <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={feedbackAgencyId}
                          onChange={(e) => setFeedbackAgencyId(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950/20"
                          required
                        >
                          <option value="">Pilih instansi...</option>
                          {agencies.map((agy) => (
                            <option key={agy.id} value={agy.id}>
                              {agy.name} ({agy.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Field 7: Jenis Masukan (tetap kondisi eksisting) */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Jenis Masukan <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={feedbackCategory}
                          onChange={(e) => setFeedbackCategory(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950/20"
                          required
                        >
                          <option value="">Pilih kategori...</option>
                          <option value="Keberatan Besaran Tarif">Keberatan Besaran Tarif</option>
                          <option value="Usulan Penyesuaian Tarif">Usulan Penyesuaian Tarif</option>
                          <option value="Ketidakjelasan Regulasi & Dasar Hukum">Ketidakjelasan Regulasi & Dasar Hukum</option>
                          <option value="Permohonan Tarif Nol Rupiah / Keringanan">Permohonan Tarif Nol Rupiah / Keringanan</option>
                          <option value="Kualitas Layanan & Prosedur">Kualitas Layanan & Prosedur</option>
                          <option value="Lainnya">Lainnya</option>
                        </select>
                      </div>
                    </div>

                    {/* Field 8: Detail Masukan (wajib) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Detail Masukan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={feedbackDetail}
                        onChange={(e) => setFeedbackDetail(e.target.value)}
                        placeholder="Tuliskan masukan Anda secara jelas, termasuk nomor PP/PMK atau nama layanan bila ada..."
                        rows={4}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy-950 focus:outline-none focus:ring-2 focus:ring-navy-950/20"
                        required
                      />
                    </div>

                    {/* Field 9: Upload Data Pendukung (tidak wajib) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Upload Data Pendukung <span className="text-slate-400 font-normal normal-case text-[11px]">(Tidak Wajib)</span>
                      </label>
                      <input
                        ref={supportingInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                        onChange={handleSupportingChange}
                        className="hidden"
                      />
                      {feedbackSupportingFile ? (
                        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-white text-sm font-bold">
                              📄
                            </span>
                            <div className="truncate">
                              <p className="truncate text-xs font-bold text-slate-900">{feedbackSupportingFile.name}</p>
                              <p className="text-[11px] text-slate-500">
                                {(feedbackSupportingFile.size / 1024).toFixed(1)} KB • Dokumen terlampir
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackSupportingFile(null)
                              if (supportingInputRef.current) supportingInputRef.current.value = ''
                            }}
                            className="ml-2 shrink-0 text-xs font-semibold text-red-600 hover:text-red-700 hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => supportingInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 py-2.5 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-100/70 hover:border-slate-400 transition"
                        >
                          <span>📎 Unggah Dokumen / Bukti Pendukung</span>
                          <span className="text-[11px] text-slate-400">(PDF, DOC, XLS, maks 10MB)</span>
                        </button>
                      )}
                    </div>

                    {/* Persetujuan Privasi (SOT NFR-02, F-PUB-01) */}
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        id={feedbackConsentId}
                        type="checkbox"
                        checked={feedbackConsent}
                        onChange={(e) => setFeedbackConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-eco-600 focus:ring-eco-500"
                        required
                      />
                      <label htmlFor={feedbackConsentId} className="text-xs text-slate-600 leading-relaxed cursor-pointer select-none">
                        Saya menyatakan bahwa identitas dan masukan yang disampaikan adalah benar dan bersedia diverifikasi untuk tindak lanjut evaluasi PNBP.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={feedbackSubmitting}
                        className="w-full h-12 rounded-xl bg-eco-600 hover:bg-eco-700 text-sm font-bold text-white transition disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-eco-600/20 shadow-sm"
                      >
                        {feedbackSubmitting ? 'Mengirim Masukan...' : 'Kirim Masukan'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="border-t border-slate-200 bg-navy-950 text-slate-300">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-9 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <Brand inverted />
          <p className="text-xs leading-5 text-slate-400 max-w-lg">
            KA PNBP Prototype v0.1 — Portal layanan masukan tarif, pencarian pertanyaan tarif, dan monitoring proyek transformasi PNBP.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <a href="#masukan" className="hover:text-white">Masukan Tarif</a>
            <span>•</span>
            <a href="#pertanyaan" className="hover:text-white">Pertanyaan</a>
            <span>•</span>
            <Link to="/login" className="hover:text-yellow-400">Login Internal</Link>
          </div>
        </div>
      </footer>
      {/* Public Status Tracking Modal (FR-PUB-05, 04-API-SPEC.md Section 4) */}
      {statusModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-navy-950">Lacak Status Masukan</h3>
                <p className="text-xs text-slate-500">Periksa perkembangan tiket masukan tarif Anda.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStatusModalOpen(false)
                  setStatusResult(null)
                  setStatusError('')
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSearchStatus} className="mt-5 space-y-4">
              {statusError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                  {statusError}
                </div>
              ) : null}

              <div>
                <label className="block mb-1.5 text-xs font-bold text-slate-700">
                  Nomor Referensi (Contoh: FB-2026-000123)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={statusQuery}
                    onChange={(e) => setStatusQuery(e.target.value)}
                    placeholder="FB-2026-000123"
                    className={`${inputClass} uppercase`}
                    required
                  />
                  <button
                    type="submit"
                    disabled={statusSearching}
                    className="inline-flex items-center justify-center rounded-xl bg-navy-950 px-5 text-xs font-bold text-white transition hover:bg-navy-900 disabled:opacity-60"
                  >
                    {statusSearching ? '...' : 'Periksa'}
                  </button>
                </div>
              </div>

              {statusResult ? (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Status Saat Ini:</span>
                    <span className="rounded-full bg-eco-100 px-2.5 py-0.5 font-extrabold text-eco-700 uppercase text-[11px]">
                      {statusResult.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-slate-600">
                    <span>Nomor Tiket:</span>
                    <span className="font-bold text-navy-950">{statusResult.reference}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-slate-600">
                    <span>Kategori:</span>
                    <span className="uppercase text-slate-800">{statusResult.category}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-slate-600">
                    <span>Tanggal Masuk:</span>
                    <span className="text-slate-800">{statusResult.date || 'Terkini'}</span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400 italic pt-1 border-t border-slate-200">
                    Catatan internal penelaah dilindungi dan tidak ditampilkan secara publik demi integritas proses evaluasi.
                  </p>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
