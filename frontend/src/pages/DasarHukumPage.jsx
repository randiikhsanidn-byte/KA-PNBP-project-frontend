import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { regulationsData } from '../data/mock'

export default function DasarHukumPage() {
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(initialQ)
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedYear, setSelectedYear] = useState('Semua')
  const [selectedStatus, setSelectedStatus] = useState('Semua')
  const [activeModalReg, setActiveModalReg] = useState(null)
  const [downloadToast, setDownloadToast] = useState(null)

  useEffect(() => {
    const qFromUrl = searchParams.get('q')
    if (qFromUrl !== null) {
      setSearchQuery(qFromUrl)
    }
  }, [searchParams])

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const categories = ['Semua', 'UU', 'PP', 'PMK', 'Permenhub']
  const years = ['Semua', '2025', '2023', '2022', '2021', '2020', '2018', '2016']
  const statuses = ['Semua', 'Berlaku', 'Diubah', 'Dicabut']

  // Filter regulations based on inputs
  const filteredRegulations = useMemo(() => {
    return regulationsData.filter((item) => {
      // Category filter
      if (selectedCategory !== 'Semua' && item.kategori.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false
      }
      // Year filter
      if (selectedYear !== 'Semua' && String(item.tahun) !== selectedYear) {
        return false
      }
      // Status filter
      if (selectedStatus !== 'Semua' && item.status.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchNomor = item.nomor.toLowerCase().includes(q)
        const matchTentang = item.tentang.toLowerCase().includes(q)
        const matchSummary = item.ringkasan_tarif.toLowerCase().includes(q)
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q))
        return matchNomor || matchTentang || matchSummary || matchTags
      }
      return true
    })
  }, [searchQuery, selectedCategory, selectedYear, selectedStatus])

  const handleDownload = (reg) => {
    setDownloadToast(`Mengunduh berkas ${reg.file_name} (${reg.file_size})...`)
    setTimeout(() => {
      setDownloadToast(null)
    }, 3500)
  }

  const handleTagClick = (tag) => {
    setSearchQuery(tag.replace('#', ''))
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* HERO SEARCH SECTION */}
        <section className="relative bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950 text-white py-16 sm:py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-yellow-300 border border-white/15 mb-4 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              </svg>
              <span>Repositori Regulasi Resmi PNBP & Perkeretaapian</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
              Dasar Hukum Tarif PNBP
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mb-8">
              Cari dan telusuri peraturan perundang-undangan, Peraturan Pemerintah (PP), Peraturan Menteri Keuangan (PMK), dan Permenhub terkait penetapan tarif serta pengelolaan PNBP.
            </p>

            {/* Centered Search Box */}
            <div className="relative max-w-3xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full shadow-2xl border-2 border-slate-200/80 hover:border-yellow-400 focus-within:border-yellow-500 focus-within:ring-4 focus-within:ring-yellow-400/20 transition-all p-1.5 sm:p-2">
                <div className="pl-3.5 sm:pl-4 text-slate-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik kata kunci, nomor peraturan, atau jenis tarif (misal: PP 15/2016, Kereta Api, Sewa Aset)..."
                  className="w-full bg-transparent px-3 py-2.5 sm:py-3 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
                  aria-label="Pencarian Dasar Hukum PNBP"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition mr-1"
                    title="Hapus pencarian"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  className="rounded-full bg-navy-950 px-5 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-navy-900 transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Cari</span>
                </button>
              </div>

              {/* Popular Query Chips below search box */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400">Pencarian populer:</span>
                {['#KeretaApi', '#TrackAccessCharge', '#PP15Tahun2016', '#SertifikasiMasinis', '#Denda', '#Simponi'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="rounded-full bg-white/10 hover:bg-white/20 px-2.5 py-0.5 text-xs text-slate-200 transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MAIN REPOSITORY CONTENT & FILTERS */}
        <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10">
          {/* Quick Category Tab Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">Jenis:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                    selectedCategory === cat
                      ? 'bg-navy-950 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat === 'Semua' ? 'Semua Regulasi' : cat}
                </button>
              ))}
            </div>

            {/* Secondary Select Filters: Tahun & Status */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <label htmlFor="filter-tahun" className="font-semibold text-slate-600">
                  Tahun:
                </label>
                <select
                  id="filter-tahun"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-800"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y === 'Semua' ? 'Semua Tahun' : y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <label htmlFor="filter-status" className="font-semibold text-slate-600">
                  Status:
                </label>
                <select
                  id="filter-status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-navy-800"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s === 'Semua' ? 'Semua Status' : s}
                    </option>
                  ))}
                </select>
              </div>

              {(searchQuery || selectedCategory !== 'Semua' || selectedYear !== 'Semua' || selectedStatus !== 'Semua') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('Semua')
                    setSelectedYear('Semua')
                    setSelectedStatus('Semua')
                  }}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
            <div>
              Menampilkan <strong className="text-slate-900 font-bold">{filteredRegulations.length}</strong> dasar hukum
              {selectedCategory !== 'Semua' && ` kategori ${selectedCategory}`}
              {searchQuery && ` dengan kata kunci "${searchQuery}"`}
            </div>
            <div className="hidden sm:block">
              Diperbarui sesuai lembaran negara resmi Republik Indonesia
            </div>
          </div>

          {/* Regulations List Grid */}
          {filteredRegulations.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {filteredRegulations.map((reg) => (
                <article
                  key={reg.id}
                  className="group bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Meta Row: Badges, Instansi, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                            reg.kategori === 'UU'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : reg.kategori === 'PP'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : reg.kategori === 'PMK'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}
                        >
                          {reg.kategori}
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          {reg.status}
                        </span>

                        <span className="text-xs text-slate-500 hidden sm:inline">
                          • {reg.instansi}
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                        <span>Ditetapkan: {reg.tanggal_penetapan}</span>
                      </div>
                    </div>

                    {/* Regulation Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-navy-950 group-hover:text-blue-900 transition">
                      {reg.nomor}
                    </h2>
                    <h3 className="text-sm font-semibold text-slate-700 mt-1 mb-3">
                      Tentang: {reg.tentang}
                    </h3>

                    {/* Summary Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {reg.ringkasan_tarif}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {reg.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className="cursor-pointer rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:bg-slate-200 transition"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Quick Tariff Snippets Preview (if any) */}
                    {reg.matriks_tarif && reg.matriks_tarif.length > 0 && (
                      <div className="rounded-lg bg-slate-50 border border-slate-100 p-3 mb-4">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Cuplikan Matriks Tarif PNBP:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {reg.matriks_tarif.slice(0, 4).map((t, idx) => (
                            <div key={idx} className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-1">
                              <span className="text-slate-700">{t.jenis}</span>
                              <span className="font-bold text-navy-950 whitespace-nowrap">{t.tarif}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="text-xs text-slate-400">
                      Format: PDF Resmi ({reg.file_size})
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModalReg(reg)}
                        className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        Lihat Rincian & Pasal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(reg)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-navy-950 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-900 transition"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        <span>Unduh Dokumen</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
              <svg viewBox="0 0 24 24" className="h-12 w-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <h3 className="text-base font-bold text-navy-950 mb-1">
                Tidak ada dasar hukum yang sesuai kriteria pencarian
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Coba gunakan kata kunci yang lebih umum seperti "Kereta Api", "Tarif", "PP", atau atur ulang filter pencarian Anda.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('Semua')
                  setSelectedYear('Semua')
                  setSelectedStatus('Semua')
                }}
                className="rounded-lg bg-navy-950 px-4 py-2 text-xs font-bold text-white hover:bg-navy-900 transition"
              >
                Reset Semua Filter
              </button>
            </div>
          )}
        </main>

        {/* REGULATION DETAIL MODAL */}
        {activeModalReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="rounded bg-navy-100 text-navy-950 font-bold px-2 py-0.5 text-xs">
                      {activeModalReg.kategori}
                    </span>
                    <span className="rounded bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-xs">
                      {activeModalReg.status}
                    </span>
                    <span className="text-xs text-slate-400">Tahun {activeModalReg.tahun}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-navy-950">
                    {activeModalReg.nomor}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Tentang: {activeModalReg.tentang}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalReg(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  aria-label="Tutup modal"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="py-6 space-y-6 text-sm text-slate-700">
                {/* Poin Penting / Pasal */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 mb-2">
                    Ketentuan & Poin Pokok Regulasi
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {activeModalReg.poin_penting.map((poin, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{poin}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Matriks Lengkap Tarif */}
                {activeModalReg.matriks_tarif && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 mb-2">
                      Rincian Besaran Tarif Resmi
                    </h4>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3 font-bold">Uraian Jenis Pelayanan / Sarana</th>
                            <th className="py-2.5 px-3 font-bold text-right">Tarif Resmi PNBP</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeModalReg.matriks_tarif.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-medium text-slate-800">{item.jenis}</td>
                              <td className="py-2.5 px-3 font-bold text-navy-950 text-right whitespace-nowrap">
                                {item.tarif}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Metadata Instansi */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Instansi Penerbit:</span>
                    <span className="font-semibold text-slate-800">{activeModalReg.instansi}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Tanggal Penetapan:</span>
                    <span className="font-semibold text-slate-800">{activeModalReg.tanggal_penetapan}</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveModalReg(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(activeModalReg)}
                  className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-4 py-2 text-xs font-bold text-white hover:bg-navy-900 transition"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  <span>Unduh Dokumen Lengkap (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Download Toast Notification */}
        {downloadToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-navy-950 text-white px-5 py-3 rounded-xl shadow-2xl border border-navy-800 flex items-center gap-3 animate-in slide-in-from-bottom duration-200 text-xs sm:text-sm font-semibold">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <span>{downloadToast}</span>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
