import { useState, useId, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Field, inputClass, selectClass, textareaClass } from '../components/Field'
import { agencies } from '../data/mock'
import { api } from '../api/client'

export default function MasukanTarifPage() {
  const consentId = useId()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Form State
  const [name, setName] = useState('')
  const [nik, setNik] = useState('')
  const [ktpPreview, setKtpPreview] = useState(null)
  const [ktpFile, setKtpFile] = useState(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [agencyId, setAgencyId] = useState(agencies[0]?.id || '')
  const [category, setCategory] = useState('Keberatan Tarif')
  const [message, setMessage] = useState('')
  const [supportingFile, setSupportingFile] = useState(null)
  const [consent, setConsent] = useState(false)

  // Status submission state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successTicket, setSuccessTicket] = useState(null)

  // Handle file uploads
  const handleKtpChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran file KTP maksimal 5MB.')
        return
      }
      setKtpFile(file)
      const reader = new FileReader()
      reader.onload = (event) => setKtpPreview(event.target.result)
      reader.readAsDataURL(file)
      setErrorMessage('')
    }
  }

  const handleSupportingChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Ukuran berkas pendukung maksimal 10MB.')
        return
      }
      setSupportingFile(file)
      setErrorMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const cleanNik = nik.replace(/\D/g, '')
    if (cleanNik.length !== 16) {
      setErrorMessage('Nomor Induk Kependudukan (NIK) harus tepat 16 digit angka.')
      return
    }

    if (!ktpFile) {
      setErrorMessage('Wajib mengunggah scan / foto KTP resmi.')
      return
    }

    if (!name.trim()) {
      setErrorMessage('Nama lengkap wajib diisi.')
      return
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Alamat email valid wajib diisi untuk pengiriman tiket dan respons.')
      return
    }

    if (!message.trim() || message.trim().length < 20) {
      setErrorMessage('Detail masukan minimal 20 karakter agar dapat ditelaah secara substantif.')
      return
    }

    if (!consent) {
      setErrorMessage('Anda wajib mencentang persetujuan keabsahan data dan privasi.')
      return
    }

    setIsSubmitting(true)
    try {
      const selectedAgency = agencies.find((a) => a.id === agencyId)
      const res = await api.submitFeedback({
        name: name.trim(),
        nik: cleanNik,
        ktp_file: { name: ktpFile.name, size: ktpFile.size },
        email: email.trim(),
        phone: phone.trim() || null,
        agency_id: agencyId,
        agency_name: selectedAgency?.name || 'Kementerian Perhubungan',
        service_id: selectedAgency?.services[0]?.id || 'svc_hub_01',
        service_name: selectedAgency?.services[0]?.name || 'Layanan Perkeretaapian',
        tariff_id: selectedAgency?.services[0]?.tariffs[0]?.id || 'trf_01',
        tariff_name: selectedAgency?.services[0]?.tariffs[0]?.name || 'Tarif Terkait',
        category,
        message: message.trim(),
        supporting_file: supportingFile ? { name: supportingFile.name, size: supportingFile.size } : null,
        consent,
      })

      const now = new Date()
      const formattedDate =
        now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
        ' pukul ' +
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
        ' WIB'

      setSuccessTicket({
        ticketNumber: res.data.ticket_number || `TKT-${res.data.reference}`,
        reference: res.data.reference,
        statusLabel: res.data.status_label || 'Baru (Menunggu Triage)',
        submittedAt: formattedDate,
        name: name.trim(),
        nik: cleanNik,
        email: email.trim(),
        agencyName: selectedAgency?.name || 'Kementerian Perhubungan',
        category,
        message: message.trim(),
      })
    } catch (err) {
      setErrorMessage(err.message || 'Gagal mengirim formulir masukan. Silakan periksa kembali isian Anda.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyReference = (refText) => {
    navigator.clipboard?.writeText(refText)
    alert(`Nomor tiket referensi ${refText} berhasil disalin!`)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Page Breadcrumb / Top Banner */}
        <section className="bg-navy-950 text-white py-10 sm:py-12 border-b border-navy-900 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-2 text-xs text-yellow-300 font-semibold mb-2">
              <Link to="/" className="hover:underline">Beranda</Link>
              <span>/</span>
              <span>Layanan Publik</span>
              <span>/</span>
              <span className="text-white">Form Masukan Tarif PNBP</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Formulir Masukan & Aspirasi Tarif PNBP
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Saluran resmi partisipasi masyarakat, pelaku usaha, dan akademisi dalam menyampaikan masukan, keberatan tarif, usulan keringanan, atau penyesuaian tarif PNBP sesuai PP No. 59/2020 dan PP No. 69/2020.
            </p>
          </div>
        </section>

        {/* Form Container */}
        <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          {successTicket ? (
            /* SUCCESS TICKET ISSUED CARD */
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-xl p-6 sm:p-10 animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-3 text-emerald-600 mb-4">
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-navy-950">Masukan Berhasil Diterima</h2>
                  <p className="text-xs text-slate-500">Tiket pelacakan resmi telah diterbitkan</p>
                </div>
              </div>

              {/* Ticket Details Panel */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-4 my-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Nomor Tiket Referensi
                    </span>
                    <span className="text-xl font-black text-navy-950 font-mono">
                      {successTicket.ticketNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyReference(successTicket.ticketNumber)}
                      className="rounded-lg bg-navy-950 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-navy-900 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      <span>Salin Tiket</span>
                    </button>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      {successTicket.statusLabel}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Nama Pelapor:</span>
                    <span className="font-bold text-slate-800">{successTicket.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Waktu Penyerahan:</span>
                    <span className="font-bold text-slate-800">{successTicket.submittedAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Instansi Tujuan:</span>
                    <span className="font-bold text-slate-800">{successTicket.agencyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Kategori Masukan:</span>
                    <span className="font-bold text-slate-800">{successTicket.category}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block font-semibold">Ringkasan Masukan:</span>
                    <p className="mt-1 text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                      "{successTicket.message}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Simpan nomor tiket Anda untuk memantau status telaah oleh Tim Pokja Tarif PNBP.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSuccessTicket(null)
                      setName('')
                      setNik('')
                      setKtpPreview(null)
                      setKtpFile(null)
                      setEmail('')
                      setPhone('')
                      setMessage('')
                      setSupportingFile(null)
                      setConsent(false)
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Kirim Masukan Lain
                  </button>
                  <Link
                    to="/"
                    className="rounded-lg bg-navy-950 px-5 py-2 text-xs font-bold text-white hover:bg-navy-900 transition"
                  >
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* THE INPUT FORM */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10">
              <div className="border-b border-slate-100 pb-5 mb-8">
                <h2 className="text-lg font-bold text-navy-950">
                  Identitas & Uraian Masukan Tarif
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Harap mengisi data diri dengan benar. Seluruh informasi pribadi dilindungi oleh UU Perlindungan Data Pribadi (UU PDP).
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700 flex items-start gap-2.5">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bagian 1: Identitas Wajib */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    1. Data Identitas Pemohon / Pelapor
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nama Lengkap Pemohon *" hint="Sesuai kartu identitas resmi">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        required
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Nomor Induk Kependudukan (NIK) *" hint="Wajib 16 digit angka">
                      <input
                        type="text"
                        maxLength={16}
                        value={nik}
                        onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                        placeholder="16 digit angka NIK"
                        required
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Alamat Email *" hint="Untuk pengiriman tanda terima tiket">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        required
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Nomor Telepon / WhatsApp (Opsional)">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Contoh: 081234567890"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  {/* Upload KTP */}
                  <Field label="Upload Kartu Tanda Penduduk (KTP) *" hint="Format JPG/PNG/PDF, maksimal 5MB">
                    <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-navy-800" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Pilih Berkas KTP</span>
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleKtpChange}
                          className="sr-only"
                        />
                      </label>
                      {ktpFile ? (
                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <span>✓ {ktpFile.name} ({(ktpFile.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada berkas dipilih</span>
                      )}
                    </div>
                  </Field>
                </div>

                {/* Bagian 2: Data Objek PNBP */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    2. Instansi & Objek Tarif PNBP
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Kementerian / Lembaga Terkait *">
                      <select
                        value={agencyId}
                        onChange={(e) => setAgencyId(e.target.value)}
                        className={selectClass}
                      >
                        {agencies.map((agency) => (
                          <option key={agency.id} value={agency.id}>
                            {agency.name}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Kategori Jenis Masukan *">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={selectClass}
                      >
                        <option value="Keberatan Tarif">Keberatan atas Penetapan Tarif (PP 59/2020)</option>
                        <option value="Usulan Penyesuaian">Usulan Penyesuaian / Evaluasi Tarif Baru</option>
                        <option value="Permohonan Keringanan">Permohonan Keringanan / Penundaan Bayar PNBP</option>
                        <option value="Klarifikasi Perhitungan">Klarifikasi Formula Tarif (Misal: Track Access Charge)</option>
                        <option value="Keluhan Layanan">Keluhan Kualitas Layanan PNBP</option>
                      </select>
                    </Field>
                  </div>

                  <Field
                    label="Detail Uraian Masukan / Aspirasi Tarif *"
                    hint="Jelaskan objek tarif, alasan keberatan/usulan, dampak ekonomi, serta dasar pertimbangan (minimal 20 karakter)"
                  >
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Uraikan masukan secara rinci..."
                      required
                      className={textareaClass}
                    />
                  </Field>

                  <Field label="Unggah Dokumen Pendukung (Opsional)" hint="Proposal, hitungan komparasi, bukti pembayaran, dokumen legal (PDF/DOC/ZIP, max 10MB)">
                    <div className="mt-1 flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-2xs">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>Pilih Berkas Lampiran</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                          onChange={handleSupportingChange}
                          className="sr-only"
                        />
                      </label>
                      {supportingFile && (
                        <span className="text-xs font-semibold text-slate-700">
                          {supportingFile.name} ({(supportingFile.size / 1024).toFixed(1)} KB)
                        </span>
                      )}
                    </div>
                  </Field>
                </div>

                {/* Bagian 3: Persetujuan */}
                <div className="pt-4 border-t border-slate-100">
                  <label htmlFor={consentId} className="flex items-start gap-3 cursor-pointer">
                    <input
                      id={consentId}
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-950 focus:ring-navy-900"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      Saya menyatakan bahwa data identitas dan informasi yang disampaikan adalah benar dan dapat dipertanggungjawabkan secara hukum sesuai ketentuan perundang-undangan di Republik Indonesia.
                    </span>
                  </label>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4 flex items-center justify-between">
                  <Link
                    to="/"
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                  >
                    ← Batal & Kembali
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-7 py-3 text-sm font-bold text-white shadow-md hover:bg-navy-900 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Memproses Pengajuan...</span>
                      </>
                    ) : (
                      <>
                        <span>Kirim Masukan Tarif</span>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Quick Legal Guidance Accordion Box */}
          <div className="mt-8 rounded-xl bg-slate-100/80 border border-slate-200 p-6 text-xs text-slate-600">
            <h4 className="font-bold text-navy-950 mb-2 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Ketentuan Dasar Pengajuan Masukan & Keberatan Tarif PNBP</span>
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600 leading-relaxed">
              <li>
                <strong>Hak Wajib Bayar (PP No. 59/2020):</strong> Wajib bayar berhak mengajukan keberatan penetapan surat tagihan PNBP dalam kurun waktu 30 hari kalender sejak penetapan.
              </li>
              <li>
                <strong>Evaluasi Berkala Tarif (PP No. 69/2020):</strong> Tarif PNBP Kementerian/Lembaga ditelaah secara periodik minimal 1 kali dalam 2 tahun dengan mempertimbangkan daya beli masyarakat dan biaya operasional pelayanan.
              </li>
              <li>
                <strong>Keringanan PNBP:</strong> Dapat diberikan berupa angsuran atau penundaan pembayaran hingga 12 bulan dalam kondisi kahar (force majeure) atau kesulitan keuangan.
              </li>
            </ul>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
