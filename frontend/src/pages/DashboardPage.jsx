import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import { useAuth } from '../context/AuthContext'
import {
  activities as initialActivities,
  strategicSteps,
  champions,
  strategicIssues as initialIssues,
  initialChangeRequests,
  initialAuditTrail,
} from '../data/mock'

function NavIcon({ type, className = 'h-4 w-4' }) {
  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    roadmap: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M6 9v3a3 3 0 0 0 3 3h6" />
        <path d="m15 12 3 3-3 3" />
      </>
    ),
    wbs: (
      <>
        <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
        <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" />
      </>
    ),
    monitoring: (
      <>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </>
    ),
    issues: (
      <>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    change_request: (
      <>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </>
    ),
    approval: (
      <>
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </>
    ),
    audit_trail: (
      <>
        <path d="M12 8v4l3 3" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type] || paths.dashboard}
    </svg>
  )
}

// SOT 4. Struktur Navigasi Internal (8 Menu)
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'roadmap', label: 'Roadmap', icon: 'roadmap' },
  { id: 'wbs', label: 'WBS', icon: 'wbs' },
  { id: 'monitoring', label: 'Monitoring', icon: 'monitoring' },
  { id: 'issues', label: 'Isu Strategis', icon: 'issues' },
  { id: 'change_request', label: 'Change Request', icon: 'change_request' },
  { id: 'approval', label: 'Approval', icon: 'approval' },
  { id: 'audit_trail', label: 'Audit Trail', icon: 'audit_trail' },
]

function getStatusBadge(status) {
  switch (status) {
    case 'On Track':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'Perlu Perhatian':
      return 'bg-amber-50 text-amber-800 border-amber-300'
    case 'Terlambat':
      return 'bg-red-50 text-red-700 border-red-200'
    case 'Selesai':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout, login } = useAuth()
  const isExecutive = user?.role === 'Executive'

  const [activeTab, setActiveTab] = useState('dashboard')

  // Dashboard perspective state (SOT Section 6: Champion | Langkah Strategis | Champion × Langkah Strategis)
  const [dashboardPerspective, setDashboardPerspective] = useState('champion') // 'champion' | 'step' | 'combined'

  // Master State with mock data
  const [activitiesList, setActivitiesList] = useState(initialActivities)
  const [issuesList, setIssuesList] = useState(initialIssues)
  const [changeRequests, setChangeRequests] = useState(initialChangeRequests)
  const [auditTrail, setAuditTrail] = useState(initialAuditTrail)

  // Drill-down selection state
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [selectedWbs, setSelectedWbs] = useState(null)

  // Modals state
  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false)
  const [isChangeRequestOpen, setIsChangeRequestOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [activeCrToReject, setActiveCrToReject] = useState(null)
  const [rejectionReasonInput, setRejectionReasonInput] = useState('')

  // Form states
  const [progressForm, setProgressForm] = useState({
    actualProgress: 0,
    status: 'On Track',
    catatan: '',
    isu: '',
    rtl: '',
    evidence: '',
  })

  const [crForm, setCrForm] = useState({
    title: '',
    targetElement: '',
    fieldChanged: 'Target Selesai / Bobot / Deskripsi',
    currentValue: '',
    proposedValue: '',
    reason: '',
    impact: '',
    attachments: '',
  })

  // Quick Switch Role helper for testing both user flows
  const handleToggleRole = async () => {
    const nextRole = isExecutive ? 'PMO / Champion' : 'Executive'
    const nextEmail = isExecutive ? 'pmo.champion@kemenkeu.go.id' : 'executive@kemenkeu.go.id'
    await login(nextEmail, 'kemenkeu2026', nextRole)
  }

  // Dashboard Aggregates Calculation (SOT Section 7 & 8)
  const dashboardStats = useMemo(() => {
    let totalPlanned = 0
    let totalActual = 0
    let onTrackCount = 0
    let attentionCount = 0
    let lateCount = 0
    let finishedCount = 0

    activitiesList.forEach((act) => {
      totalPlanned += act.plannedProgress
      totalActual += act.actualProgress
      if (act.status === 'On Track') onTrackCount++
      else if (act.status === 'Perlu Perhatian') attentionCount++
      else if (act.status === 'Terlambat') lateCount++
      else if (act.status === 'Selesai') finishedCount++
    })

    const count = activitiesList.length || 1
    const avgPlanned = (totalPlanned / count).toFixed(1)
    const avgActual = (totalActual / count).toFixed(1)
    const avgDev = (avgActual - avgPlanned).toFixed(1)
    const pendingApprovalsCount = changeRequests.filter((cr) => cr.status === 'Pending Approval').length

    return {
      totalActivities: activitiesList.length,
      avgPlanned,
      avgActual,
      avgDev,
      onTrackCount,
      attentionCount,
      lateCount,
      finishedCount,
      activeIssuesCount: issuesList.filter((i) => i.status !== 'Closed').length,
      pendingApprovalsCount,
    }
  }, [activitiesList, changeRequests, issuesList])

  // Open Progress Update Modal
  const handleOpenProgressUpdate = (act) => {
    setSelectedActivity(act)
    setProgressForm({
      actualProgress: act.actualProgress,
      status: act.status,
      catatan: '',
      isu: '',
      rtl: '',
      evidence: '',
    })
    setIsUpdateProgressOpen(true)
  }

  // Save Progress Update (SOT Section 13: PMO -> Pending Approval, Executive -> Direct Active)
  const handleSaveProgress = (e) => {
    e.preventDefault()
    if (!selectedActivity) return

    const newActual = parseFloat(progressForm.actualProgress) || 0
    const dev = parseFloat((newActual - selectedActivity.plannedProgress).toFixed(1))
    let newStatus = progressForm.status
    if (newActual >= 100) newStatus = 'Selesai'
    else if (dev >= 0) newStatus = 'On Track'
    else if (dev >= -10) newStatus = 'Perlu Perhatian'
    else newStatus = 'Terlambat'

    if (isExecutive) {
      // Executive Direct Edit: immediately active + logged
      setActivitiesList((prev) =>
        prev.map((a) =>
          a.id === selectedActivity.id
            ? { ...a, actualProgress: newActual, deviation: dev, status: newStatus }
            : a
        )
      )
      const newAudit = {
        id: `adt_${Date.now()}`,
        timestamp: new Date().toLocaleString('id-ID') + ' WIB',
        user: user?.name || 'Executive',
        role: 'Executive',
        module: 'Monitoring',
        action: 'Direct Edit Capaian Progress',
        target: `${selectedActivity.kode} — ${selectedActivity.name}`,
        beforeValue: `Realisasi: ${selectedActivity.actualProgress}% (${selectedActivity.status})`,
        afterValue: `Realisasi: ${newActual}% (${newStatus})`,
        approvalStatus: 'Auto-Active (Executive)',
        approver: user?.name || 'Executive',
        reason: progressForm.catatan || 'Penyelarasan langsung pimpinan',
      }
      setAuditTrail((prev) => [newAudit, ...prev])
      alert('Pembaruan progres telah diterapkan langsung sebagai data aktif.')
    } else {
      // PMO / Champion: Create Change Request / Approval submission
      const newCr = {
        id: `cr_${Date.now()}`,
        kode: `CR-2026-0${changeRequests.length + 1}`,
        module: 'Monitoring & Capaian',
        title: `Pembaruan Realisasi ${selectedActivity.kode}`,
        targetElement: `${selectedActivity.kode} — ${selectedActivity.name}`,
        fieldChanged: 'Progress Realisasi & Status',
        currentValue: `Realisasi: ${selectedActivity.actualProgress}% | Dev: ${selectedActivity.deviation}%`,
        proposedValue: `Realisasi: ${newActual}% | Dev: ${dev}% | Status: ${newStatus}`,
        reason: progressForm.catatan || 'Pembaruan berkala milestone oleh Champion',
        impact: `Perubahan capaian agregat langkah strategis sebesar ${(newActual - selectedActivity.actualProgress).toFixed(1)}%`,
        attachments: progressForm.evidence || 'Evidence_Update.pdf',
        submitter: user?.name || 'PMO / Champion',
        submitterRole: 'PMO / Champion',
        submitDate: new Date().toISOString().split('T')[0],
        status: 'Pending Approval',
        approver: null,
        approvalDate: null,
        rejectionReason: null,
      }
      setChangeRequests((prev) => [newCr, ...prev])

      const newAudit = {
        id: `adt_${Date.now()}`,
        timestamp: new Date().toLocaleString('id-ID') + ' WIB',
        user: user?.name || 'PMO / Champion',
        role: 'PMO / Champion',
        module: 'Monitoring',
        action: 'Submit Pembaruan Capaian',
        target: `${selectedActivity.kode} — ${selectedActivity.name}`,
        beforeValue: `Realisasi: ${selectedActivity.actualProgress}%`,
        afterValue: `Usulan: ${newActual}%`,
        approvalStatus: 'Pending Approval',
        approver: 'Menunggu Executive',
        reason: progressForm.catatan || 'Pembaruan berkala milestone',
      }
      setAuditTrail((prev) => [newAudit, ...prev])
      alert('Pembaruan berhasil dikirim! Menunggu persetujuan Executive sebelum menjadi data aktif.')
    }

    setIsUpdateProgressOpen(false)
  }

  // Submit new Change Request (SOT Section 16)
  const handleCreateChangeRequest = (e) => {
    e.preventDefault()
    if (!crForm.title || !crForm.reason) return

    const newCr = {
      id: `cr_${Date.now()}`,
      kode: `CR-2026-0${changeRequests.length + 1}`,
      module: 'Roadmap & Baseline',
      title: crForm.title,
      targetElement: crForm.targetElement || 'Langkah Strategis / Kegiatan Terkait',
      fieldChanged: crForm.fieldChanged,
      currentValue: crForm.currentValue || 'Nilai baseline saat ini',
      proposedValue: crForm.proposedValue || 'Nilai usulan perubahan baru',
      reason: crForm.reason,
      impact: crForm.impact || 'Menjaga akurasi target capaian transformasi',
      attachments: crForm.attachments || 'Dokumen_Pendukung_CR.pdf',
      submitter: user?.name || 'PMO / Champion',
      submitterRole: user?.role || 'PMO / Champion',
      submitDate: new Date().toISOString().split('T')[0],
      status: isExecutive ? 'Approved' : 'Pending Approval',
      approver: isExecutive ? user?.name : null,
      approvalDate: isExecutive ? new Date().toLocaleString('id-ID') + ' WIB' : null,
      rejectionReason: null,
    }

    setChangeRequests((prev) => [newCr, ...prev])

    const newAudit = {
      id: `adt_${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID') + ' WIB',
      user: user?.name || 'PMO / Champion',
      role: user?.role || 'PMO / Champion',
      module: 'Change Request',
      action: isExecutive ? 'Direct Baseline Update' : 'Submit Usulan Perubahan',
      target: newCr.kode,
      beforeValue: crForm.currentValue || 'Nilai baseline lama',
      afterValue: crForm.proposedValue || 'Nilai usulan baru',
      approvalStatus: isExecutive ? 'Approved (Auto-Active)' : 'Pending Approval',
      approver: isExecutive ? user?.name : 'Menunggu Executive',
      reason: crForm.reason,
    }
    setAuditTrail((prev) => [newAudit, ...prev])

    setCrForm({
      title: '',
      targetElement: '',
      fieldChanged: 'Target Selesai / Bobot / Deskripsi',
      currentValue: '',
      proposedValue: '',
      reason: '',
      impact: '',
      attachments: '',
    })
    setIsChangeRequestOpen(false)
    alert(isExecutive ? 'Change Request langsung disetujui & aktif!' : 'Change Request telah disubmit dan menunggu approval Executive.')
  }

  // Executive Approve Change Request (SOT Section 17.2)
  const handleApproveCr = (cr) => {
    setChangeRequests((prev) =>
      prev.map((item) =>
        item.id === cr.id
          ? {
              ...item,
              status: 'Approved',
              approver: user?.name || 'Dr. Sri Mulyono, M.Sc.',
              approvalDate: new Date().toLocaleString('id-ID') + ' WIB',
            }
          : item
      )
    )

    const newAudit = {
      id: `adt_${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID') + ' WIB',
      user: user?.name || 'Executive',
      role: 'Executive',
      module: 'Approval',
      action: 'Approve Change Request',
      target: cr.kode,
      beforeValue: `Status: Pending Approval (${cr.currentValue})`,
      afterValue: `Status: Approved (${cr.proposedValue})`,
      approvalStatus: 'Approved',
      approver: user?.name || 'Executive',
      reason: 'Disetujui oleh Executive setelah verifikasi dampak.',
    }
    setAuditTrail((prev) => [newAudit, ...prev])
    alert(`Change Request ${cr.kode} berhasil disetujui! Baseline diperbarui dan tercatat di Audit Trail.`)
  }

  // Executive Reject Change Request (SOT Section 17.3)
  const handleOpenRejectModal = (cr) => {
    setActiveCrToReject(cr)
    setRejectionReasonInput('')
    setIsRejectModalOpen(true)
  }

  const handleConfirmRejectCr = () => {
    if (!activeCrToReject) return
    if (!rejectionReasonInput.trim()) {
      alert('Alasan penolakan wajib diisi.')
      return
    }

    setChangeRequests((prev) =>
      prev.map((item) =>
        item.id === activeCrToReject.id
          ? {
              ...item,
              status: 'Rejected',
              approver: user?.name || 'Dr. Sri Mulyono, M.Sc.',
              approvalDate: new Date().toLocaleString('id-ID') + ' WIB',
              rejectionReason: rejectionReasonInput,
            }
          : item
      )
    )

    const newAudit = {
      id: `adt_${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID') + ' WIB',
      user: user?.name || 'Executive',
      role: 'Executive',
      module: 'Approval',
      action: 'Reject Change Request',
      target: activeCrToReject.kode,
      beforeValue: 'Status: Pending Approval',
      afterValue: 'Status: Rejected',
      approvalStatus: 'Rejected',
      approver: user?.name || 'Executive',
      reason: `Ditolak: ${rejectionReasonInput}`,
    }
    setAuditTrail((prev) => [newAudit, ...prev])

    setIsRejectModalOpen(false)
    setActiveCrToReject(null)
    alert(`Change Request ditolak dan dikembalikan ke PMO/Champion dengan catatan.`)
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar Navigasi Internal (8 Menu) */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <Brand />
        </div>

        {/* Current User Badge & Quick Switch */}
        <div className="border-b border-slate-200/80 bg-slate-50/70 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-950 font-extrabold text-xs text-white shadow-sm">
              {user?.avatarInitials || (isExecutive ? 'SM' : 'BS')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-navy-950">{user?.name || 'Pengguna KA PNBP'}</p>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    isExecutive ? 'bg-purple-600' : 'bg-emerald-600'
                  }`}
                />
                <span className="truncate text-[11px] font-semibold text-slate-600">{user?.role || 'PMO / Champion'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleRole}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-bold text-navy-900 transition hover:bg-slate-100 hover:border-navy-900 focus:outline-none"
            title="Klik untuk beralih antara PMO / Champion dan Executive guna menguji alur approval"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4M7 4L3 8M7 4L11 8M17 8V20M17 20L21 16M17 20L13 16" />
            </svg>
            Ganti Peran: {isExecutive ? 'ke PMO / Champion' : 'ke Executive'}
          </button>
        </div>

        {/* 8 Menus */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            const showBadge = item.id === 'approval' && dashboardStats.pendingApprovalsCount > 0
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id)
                  setSelectedActivity(null)
                  setSelectedWbs(null)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition ${
                  isActive
                    ? 'bg-navy-950 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-navy-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <NavIcon type={item.icon} className={isActive ? 'text-yellow-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {showBadge ? (
                  <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                    {dashboardStats.pendingApprovalsCount}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/')
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Keluar Sistem
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-64 flex min-h-screen flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Transformasi PNBP 2026</span>
            <span className="text-slate-300">/</span>
            <h1 className="text-base font-extrabold capitalize text-navy-950">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
              Posisi Monitoring: 15 Sep 2026
            </span>
            <Link
              to="/"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-navy-950"
            >
              Lihat Portal Publik
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8">
          {/* ========================================================================= */}
          {/* 1. DASHBOARD VIEW (SOT Section 5 & 6)                                      */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI Banner Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                  <span className="text-xs font-bold text-slate-500">Capaian Keseluruhan</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-navy-950">
                      {dashboardStats.avgActual}%
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        parseFloat(dashboardStats.avgDev) >= 0 ? 'text-emerald-700' : 'text-red-600'
                      }`}
                    >
                      {parseFloat(dashboardStats.avgDev) >= 0 ? `+${dashboardStats.avgDev}%` : `${dashboardStats.avgDev}%`} deviasi
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Target Rencana s.d. saat ini: {dashboardStats.avgPlanned}%
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                  <span className="text-xs font-bold text-slate-500">Total Kegiatan Transformasi</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-navy-950">
                      {dashboardStats.totalActivities}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {dashboardStats.onTrackCount} On Track
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-amber-700">{dashboardStats.attentionCount} Perlu Perhatian</span>
                    <span>•</span>
                    <span className="font-semibold text-red-700">{dashboardStats.lateCount} Terlambat</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                  <span className="text-xs font-bold text-slate-500">Isu Strategis Aktif</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-amber-600">
                      {dashboardStats.activeIssuesCount}
                    </span>
                    <span className="text-xs font-bold text-slate-500">masalah teridentifikasi</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Membutuhkan tindak lanjut pimpinan & PIC
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                  <span className="text-xs font-bold text-slate-500">Approval Menunggu</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold tracking-tight text-navy-950">
                      {dashboardStats.pendingApprovalsCount}
                    </span>
                    <span className="text-xs font-bold text-amber-700">Usulan Pending</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {isExecutive ? 'Menunggu review & approval Anda' : 'Sedang diproses oleh Executive'}
                  </p>
                </div>
              </div>

              {/* SOT Section 6: 3 Perspektif Dashboard */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-navy-950">
                      Perspektif Pemantauan Capaian
                    </h2>
                    <p className="text-xs text-slate-500">
                      Pilih sudut pandang analisis capaian transformasi sesuai SOT KA PNBP
                    </p>
                  </div>

                  {/* 3 Perspective Tabs */}
                  <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => setDashboardPerspective('champion')}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition ${
                        dashboardPerspective === 'champion'
                          ? 'bg-navy-950 text-white shadow-sm'
                          : 'text-slate-600 hover:text-navy-950'
                      }`}
                    >
                      1. Champion
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardPerspective('step')}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition ${
                        dashboardPerspective === 'step'
                          ? 'bg-navy-950 text-white shadow-sm'
                          : 'text-slate-600 hover:text-navy-950'
                      }`}
                    >
                      2. Langkah Strategis
                    </button>
                    <button
                      type="button"
                      onClick={() => setDashboardPerspective('combined')}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-extrabold transition ${
                        dashboardPerspective === 'combined'
                          ? 'bg-navy-950 text-white shadow-sm'
                          : 'text-slate-600 hover:text-navy-950'
                      }`}
                    >
                      3. Champion × Langkah Strategis
                    </button>
                  </div>
                </div>

                {/* Perspective 1: Pivot Berdasarkan Champion (SOT 6.1) */}
                {dashboardPerspective === 'champion' && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Champion</th>
                          <th className="px-4 py-3">PIC</th>
                          <th className="px-4 py-3 text-center">Jumlah Kegiatan</th>
                          <th className="px-4 py-3 text-right">Rencana</th>
                          <th className="px-4 py-3 text-right">Realisasi</th>
                          <th className="px-4 py-3 text-right">Deviasi</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {champions.map((ch) => {
                          const chActivities = activitiesList.filter((a) => a.champion === ch.name)
                          const totalPlan = chActivities.reduce((acc, c) => acc + c.plannedProgress, 0)
                          const totalAct = chActivities.reduce((acc, c) => acc + c.actualProgress, 0)
                          const count = chActivities.length || 1
                          const planAvg = (totalPlan / count).toFixed(1)
                          const actAvg = (totalAct / count).toFixed(1)
                          const devAvg = (actAvg - planAvg).toFixed(1)
                          const status =
                            devAvg >= 0 ? 'On Track' : devAvg >= -10 ? 'Perlu Perhatian' : 'Terlambat'

                          return (
                            <tr key={ch.id} className="hover:bg-slate-50/80 transition">
                              <td className="px-4 py-3.5 font-bold text-navy-950">{ch.name}</td>
                              <td className="px-4 py-3.5 text-slate-600">{ch.pic}</td>
                              <td className="px-4 py-3.5 text-center font-bold">{chActivities.length}</td>
                              <td className="px-4 py-3.5 text-right font-medium">{planAvg}%</td>
                              <td className="px-4 py-3.5 text-right font-bold text-navy-950">{actAvg}%</td>
                              <td className="px-4 py-3.5 text-right font-bold">
                                <span className={devAvg >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                                  {devAvg >= 0 ? `+${devAvg}%` : `${devAvg}%`}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(status)}`}>
                                  {status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('monitoring')
                                  }}
                                  className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-navy-900 hover:bg-slate-100"
                                >
                                  Drill-Down →
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Perspective 2: Pivot Berdasarkan Langkah Strategis (SOT 6.2) */}
                {dashboardPerspective === 'step' && (
                  <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Kode</th>
                          <th className="px-4 py-3">Langkah Strategis</th>
                          <th className="px-4 py-3 text-center">Kegiatan</th>
                          <th className="px-4 py-3 text-right">Rencana</th>
                          <th className="px-4 py-3 text-right">Realisasi</th>
                          <th className="px-4 py-3 text-right">Deviasi</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {strategicSteps.map((step) => {
                          const stepActivities = activitiesList.filter((a) => a.stepId === step.id)
                          const totalPlan = stepActivities.reduce((acc, c) => acc + c.plannedProgress, 0)
                          const totalAct = stepActivities.reduce((acc, c) => acc + c.actualProgress, 0)
                          const count = stepActivities.length || 1
                          const planAvg = (totalPlan / count).toFixed(1)
                          const actAvg = (totalAct / count).toFixed(1)
                          const devAvg = (actAvg - planAvg).toFixed(1)
                          const status =
                            devAvg >= 0 ? 'On Track' : devAvg >= -10 ? 'Perlu Perhatian' : 'Terlambat'

                          return (
                            <tr key={step.id} className="hover:bg-slate-50/80 transition">
                              <td className="px-4 py-3.5 font-mono font-bold text-slate-600">{step.kode}</td>
                              <td className="px-4 py-3.5 font-bold text-navy-950">
                                {step.name}
                                <p className="mt-0.5 text-[11px] font-normal text-slate-500">{step.description}</p>
                              </td>
                              <td className="px-4 py-3.5 text-center font-bold">{stepActivities.length}</td>
                              <td className="px-4 py-3.5 text-right font-medium">{planAvg}%</td>
                              <td className="px-4 py-3.5 text-right font-bold text-navy-950">{actAvg}%</td>
                              <td className="px-4 py-3.5 text-right font-bold">
                                <span className={devAvg >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                                  {devAvg >= 0 ? `+${devAvg}%` : `${devAvg}%`}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(status)}`}>
                                  {status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveTab('monitoring')
                                  }}
                                  className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-navy-900 hover:bg-slate-100"
                                >
                                  Drill-Down →
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Perspective 3: Pivot Champion × Langkah Strategis (SOT 6.3) */}
                {dashboardPerspective === 'combined' && (
                  <div className="mt-6 space-y-4">
                    {champions.map((ch) => {
                      const chActs = activitiesList.filter((a) => a.champion === ch.name)
                      if (chActs.length === 0) return null
                      return (
                        <div key={ch.id} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <h3 className="font-extrabold text-navy-950">
                              {ch.name} <span className="text-xs font-semibold text-slate-500">({ch.pic})</span>
                            </h3>
                            <span className="text-xs font-bold text-slate-600">
                              {chActs.length} Kegiatan Terhubung
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {chActs.map((act) => (
                              <div
                                key={act.id}
                                className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <span className="font-mono text-[11px] font-bold text-slate-500">{act.kode}</span>
                                  <h4 className="font-bold text-navy-950">{act.name}</h4>
                                  <p className="text-[11px] text-slate-500">Langkah Strategis: {act.stepName}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-xs font-bold text-navy-950">
                                      Realisasi: {act.actualProgress}% / Rencana: {act.plannedProgress}%
                                    </div>
                                    <div className={`text-[11px] font-semibold ${act.deviation >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                      Deviasi: {act.deviation >= 0 ? `+${act.deviation}%` : `${act.deviation}%`}
                                    </div>
                                  </div>
                                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(act.status)}`}>
                                    {act.status}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedActivity(act)
                                      setActiveTab('monitoring')
                                    }}
                                    className="rounded border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-bold text-navy-950 hover:bg-slate-100"
                                  >
                                    Detail WBS →
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* SOT Section 9: Drill-Down Quick Cards */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-navy-950">
                      Daftar Kegiatan Prioritas Monitoring
                    </h2>
                    <p className="text-xs text-slate-500">
                      Klik kegiatan untuk melihat rincian WBS, Milestone, dan Evidence pendukung
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('monitoring')}
                    className="text-xs font-bold text-navy-950 hover:underline"
                  >
                    Buka Menu Monitoring Penuh →
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {activitiesList.map((act) => (
                    <div
                      key={act.id}
                      className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/40 p-4 transition hover:border-navy-900 hover:bg-white"
                      onClick={() => {
                        setSelectedActivity(act)
                        setActiveTab('monitoring')
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[11px] font-extrabold text-slate-500">{act.kode}</span>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getStatusBadge(act.status)}`}>
                          {act.status}
                        </span>
                      </div>
                      <h3 className="mt-1 text-sm font-extrabold text-navy-950">{act.name}</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Champion: <strong className="text-slate-700">{act.champion}</strong> ({act.pic})
                      </p>

                      {/* Progress Bar with Rencana vs Realisasi */}
                      <div className="mt-3">
                        <div className="flex justify-between text-[11px] font-semibold">
                          <span className="text-slate-500">Realisasi: {act.actualProgress}%</span>
                          <span className="text-slate-500">Rencana: {act.plannedProgress}%</span>
                        </div>
                        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full ${act.deviation >= 0 ? 'bg-emerald-600' : 'bg-red-600'}`}
                            style={{ width: `${Math.min(act.actualProgress, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. ROADMAP VIEW (SOT Section 10, 11, 12)                                  */}
          {/* ========================================================================= */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-navy-950">Roadmap Transformasi PNBP</h2>
                  <p className="text-xs text-slate-500">
                    Hierarki rencana strategis: Langkah Strategis → Kegiatan → WBS → Milestone
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangeRequestOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-navy-950 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-navy-900"
                  >
                    + Ajukan Usulan Perubahan (CR)
                  </button>
                </div>
              </div>

              {/* Role banner note */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900">
                <span className="font-bold">Mode Akses: {user?.role}</span> —{' '}
                {isExecutive
                  ? 'Sebagai Executive, Anda dapat melakukan Direct Edit baseline data aktif atau menyetujui usulan PMO / Champion.'
                  : 'Sebagai PMO / Champion, setiap usulan atau pembaruan yang Anda buat berstatus Draft / Pending Approval sampai disetujui Executive.'}
              </div>

              {/* Steps & Activities Hierarchy Tree */}
              <div className="space-y-5">
                {strategicSteps.map((step) => {
                  const stepActs = activitiesList.filter((a) => a.stepId === step.id)
                  return (
                    <div key={step.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-navy-950 px-2 py-0.5 font-mono text-xs font-bold text-white">
                              {step.kode}
                            </span>
                            <h3 className="text-base font-extrabold text-navy-950">{step.name}</h3>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">{step.description}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-600">{stepActs.length} Kegiatan Terdaftar</span>
                      </div>

                      <div className="mt-4 space-y-3">
                        {stepActs.map((act) => (
                          <div
                            key={act.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-slate-600">{act.kode}</span>
                                  <h4 className="font-extrabold text-navy-950">{act.name}</h4>
                                </div>
                                <p className="mt-1 text-xs text-slate-500">
                                  Champion: <strong>{act.champion}</strong> | PIC: {act.pic} | Unit Terkait: {act.unitTerkait}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Output: {act.output}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right text-xs">
                                  <span className="font-bold text-navy-950">{act.actualProgress}%</span>
                                  <span className="text-slate-400"> / {act.plannedProgress}%</span>
                                  <div className={`font-semibold text-[11px] ${act.deviation >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                                    {act.deviation >= 0 ? `+${act.deviation}%` : `${act.deviation}%`}
                                  </div>
                                </div>

                                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(act.status)}`}>
                                  {act.status}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleOpenProgressUpdate(act)}
                                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-navy-950 shadow-sm hover:bg-slate-50"
                                >
                                  {isExecutive ? 'Direct Edit' : 'Update Progress'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. WBS VIEW (SOT Section 10 & 14)                                         */}
          {/* ========================================================================= */}
          {activeTab === 'wbs' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-navy-950">Work Breakdown Structure (WBS)</h2>
                <p className="text-xs text-slate-500">
                  Rincian komponen kerja, bobot kontribusi capaian, dan daftar milestone pelaksanaan
                </p>
              </div>

              <div className="space-y-4">
                {activitiesList.map((act) => (
                  <div key={act.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                    <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-slate-500">{act.kode}</span>
                        <h3 className="text-base font-extrabold text-navy-950">{act.name}</h3>
                        <p className="text-xs text-slate-500">Penanggung Jawab: {act.champion} ({act.pic})</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-500">Total Bobot: {act.bobot}%</span>
                        <div className="text-sm font-extrabold text-navy-950">Capaian: {act.actualProgress}%</div>
                      </div>
                    </div>

                    {/* WBS Table */}
                    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                          <tr>
                            <th className="px-4 py-2.5">Kode WBS</th>
                            <th className="px-4 py-2.5">Rincian Paket Kerja</th>
                            <th className="px-4 py-2.5">PIC</th>
                            <th className="px-4 py-2.5 text-center">Bobot</th>
                            <th className="px-4 py-2.5 text-right">Progress</th>
                            <th className="px-4 py-2.5 text-center">Milestones</th>
                            <th className="px-4 py-2.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {act.wbsList?.map((wbs) => (
                            <tr key={wbs.id} className="hover:bg-slate-50/70">
                              <td className="px-4 py-3 font-mono font-bold text-slate-600">{wbs.kode}</td>
                              <td className="px-4 py-3 font-bold text-navy-950">{wbs.title}</td>
                              <td className="px-4 py-3 text-slate-600">{wbs.pic}</td>
                              <td className="px-4 py-3 text-center font-bold">{wbs.bobot}%</td>
                              <td className="px-4 py-3 text-right font-extrabold text-navy-950">{wbs.progress}%</td>
                              <td className="px-4 py-3 text-center font-semibold text-slate-600">
                                {wbs.milestones?.length || 0} milestone
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(wbs.status)}`}>
                                  {wbs.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. MONITORING VIEW & DRILL-DOWN (SOT Section 9 & 14)                       */}
          {/* ========================================================================= */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-navy-950">Monitoring Pelaksanaan Kegiatan</h2>
                  <p className="text-xs text-slate-500">
                    Pemantauan terperinci hingga level milestone, target waktu, dan evidence pendukung
                  </p>
                </div>
                {selectedActivity && (
                  <button
                    type="button"
                    onClick={() => setSelectedActivity(null)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    ← Kembali ke Semua Kegiatan
                  </button>
                )}
              </div>

              {/* Drill-down Detail View when activity is selected */}
              {selectedActivity ? (
                <div className="space-y-6">
                  {/* Activity Detail Card */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-slate-600">{selectedActivity.kode}</span>
                          <h3 className="text-lg font-extrabold text-navy-950">{selectedActivity.name}</h3>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          Langkah Strategis: <strong>{selectedActivity.stepName}</strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadge(selectedActivity.status)}`}>
                          {selectedActivity.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenProgressUpdate(selectedActivity)}
                          className="rounded-xl bg-navy-950 px-4 py-2 text-xs font-extrabold text-white shadow-sm hover:bg-navy-900"
                        >
                          {isExecutive ? 'Direct Edit Capaian' : 'Update Capaian'}
                        </button>
                      </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-4 text-xs md:grid-cols-4">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span className="text-slate-400">Champion:</span>
                        <p className="font-bold text-navy-950">{selectedActivity.champion}</p>
                        <p className="text-[11px] text-slate-500">{selectedActivity.pic}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span className="text-slate-400">Periode Rencana:</span>
                        <p className="font-bold text-navy-950">{selectedActivity.startDate} s.d. {selectedActivity.endDate}</p>
                        <p className="text-[11px] text-slate-500">Durasi: {selectedActivity.totalDays} hari ({selectedActivity.currentDay} berjalan)</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span className="text-slate-400">Progress Rencana:</span>
                        <p className="text-base font-extrabold text-navy-950">{selectedActivity.plannedProgress}%</p>
                        <p className="text-[11px] text-slate-500">Proporsi hari berjalan</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <span className="text-slate-400">Progress Realisasi:</span>
                        <p className="text-base font-extrabold text-navy-950">{selectedActivity.actualProgress}%</p>
                        <p className={`text-[11px] font-bold ${selectedActivity.deviation >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          Deviasi: {selectedActivity.deviation >= 0 ? `+${selectedActivity.deviation}%` : `${selectedActivity.deviation}%`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Milestones and Evidence Drill-Down */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                    <h3 className="text-base font-extrabold text-navy-950">
                      Milestones & Dokumen Evidence
                    </h3>
                    <p className="text-xs text-slate-500">
                      Rincian capaian target per milestone dengan bukti data dukung (Evidence)
                    </p>

                    <div className="mt-4 space-y-4">
                      {selectedActivity.wbsList?.map((wbs) => (
                        <div key={wbs.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="font-bold text-navy-950">
                              {wbs.kode} — {wbs.title}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">
                              Bobot: {wbs.bobot}% | Capaian: {wbs.progress}%
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            {wbs.milestones?.map((m) => (
                              <div
                                key={m.id}
                                className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[11px] font-bold text-slate-500">{m.kode}</span>
                                    <h5 className="font-bold text-navy-950">{m.title}</h5>
                                  </div>
                                  <p className="text-[11px] text-slate-500">
                                    Target Selesai: <strong>{m.targetDate}</strong>
                                    {m.actualDate ? ` | Realisasi: ${m.actualDate}` : ''}
                                  </p>
                                  {m.catatan && (
                                    <p className="mt-0.5 text-[11px] italic text-slate-600">Catatan: {m.catatan}</p>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  {m.evidence ? (
                                    <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-800 border border-blue-200">
                                      📄 {m.evidence}
                                    </span>
                                  ) : (
                                    <span className="text-[11px] italic text-slate-400">Belum ada evidence</span>
                                  )}
                                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(m.status)}`}>
                                    {m.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Activity List Table */
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Kode</th>
                        <th className="px-4 py-3">Nama Kegiatan</th>
                        <th className="px-4 py-3">Champion</th>
                        <th className="px-4 py-3">Periode Rencana</th>
                        <th className="px-4 py-3 text-right">Rencana</th>
                        <th className="px-4 py-3 text-right">Realisasi</th>
                        <th className="px-4 py-3 text-right">Deviasi</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activitiesList.map((act) => (
                        <tr key={act.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-600">{act.kode}</td>
                          <td className="px-4 py-3.5 font-bold text-navy-950">
                            {act.name}
                            <p className="text-[11px] font-normal text-slate-500">{act.stepName}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-slate-700">{act.champion}</span>
                            <p className="text-[11px] text-slate-500">{act.pic}</p>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">
                            {act.startDate} s.d. {act.endDate}
                          </td>
                          <td className="px-4 py-3.5 text-right font-medium">{act.plannedProgress}%</td>
                          <td className="px-4 py-3.5 text-right font-bold text-navy-950">{act.actualProgress}%</td>
                          <td className="px-4 py-3.5 text-right font-bold">
                            <span className={act.deviation >= 0 ? 'text-emerald-700' : 'text-red-600'}>
                              {act.deviation >= 0 ? `+${act.deviation}%` : `${act.deviation}%`}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(act.status)}`}>
                              {act.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => setSelectedActivity(act)}
                              className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-navy-900 hover:bg-slate-100"
                            >
                              Detail & Evidence →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. ISU STRATEGIS VIEW (SOT Section 15)                                    */}
          {/* ========================================================================= */}
          {activeTab === 'issues' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-navy-950">Isu Strategis & Risiko</h2>
                  <p className="text-xs text-slate-500">
                    Kendala utama yang mempengaruhi pencapaian target roadmap dan rencana mitigasinya
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {issuesList.map((issue) => (
                  <div
                    key={issue.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-500">{issue.kode}</span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${
                            issue.priority === 'Tinggi'
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-amber-200 bg-amber-50 text-amber-800'
                          }`}
                        >
                          Prioritas {issue.priority}
                        </span>
                      </div>

                      <h3 className="mt-2 text-base font-extrabold text-navy-950">{issue.title}</h3>
                      <p className="mt-1 text-xs text-slate-600">{issue.description}</p>

                      <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs">
                        <div>
                          <strong className="text-slate-700">Dampak:</strong>
                          <p className="text-slate-600">{issue.dampak}</p>
                        </div>
                        <div>
                          <strong className="text-slate-700">Rencana Tindak Lanjut:</strong>
                          <p className="text-slate-600">{issue.tindakLanjut}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500">
                      <div>
                        Target Selesai: <strong>{issue.targetPenyelesaian}</strong>
                      </div>
                      <span className="rounded bg-navy-950/5 px-2 py-0.5 text-[11px] font-bold text-navy-950">
                        {issue.mitigationStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. CHANGE REQUEST VIEW (SOT Section 16)                                   */}
          {/* ========================================================================= */}
          {activeTab === 'change_request' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-navy-950">Change Request (Usulan Perubahan)</h2>
                  <p className="text-xs text-slate-500">
                    Mekanisme perubahan baseline yang telah aktif (Langkah Strategis, Kegiatan, WBS, Target)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangeRequestOpen(true)}
                  className="rounded-xl bg-navy-950 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-navy-900"
                >
                  + Ajukan Change Request Baru
                </button>
              </div>

              <div className="space-y-4">
                {changeRequests.map((cr) => (
                  <div key={cr.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                    <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-slate-500">{cr.kode}</span>
                          <h3 className="text-base font-extrabold text-navy-950">{cr.title}</h3>
                        </div>
                        <p className="text-xs text-slate-500">
                          Target Objek: <strong>{cr.targetElement}</strong> | Diajukan oleh: {cr.submitter} ({cr.submitDate})
                        </p>
                      </div>

                      <span
                        className={`inline-block rounded-full border px-3 py-1 text-xs font-extrabold ${
                          cr.status === 'Approved'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : cr.status === 'Rejected'
                            ? 'border-red-200 bg-red-50 text-red-700'
                            : 'border-amber-300 bg-amber-50 text-amber-800'
                        }`}
                      >
                        {cr.status}
                      </span>
                    </div>

                    {/* SOT 18: Comparison Table (Current Value vs Proposed Value) */}
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Current Value (Data Aktif Saat Ini)
                        </span>
                        <p className="mt-1 text-xs font-medium text-slate-800">{cr.currentValue}</p>
                      </div>
                      <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                          Proposed Value (Usulan Perubahan)
                        </span>
                        <p className="mt-1 text-xs font-bold text-navy-950">{cr.proposedValue}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1 text-xs text-slate-600">
                      <p>
                        <strong>Alasan Perubahan:</strong> {cr.reason}
                      </p>
                      <p>
                        <strong>Dampak:</strong> {cr.impact}
                      </p>
                      {cr.rejectionReason && (
                        <p className="text-red-700 font-bold">
                          Catatan Penolakan: {cr.rejectionReason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. APPROVAL VIEW (SOT Section 17 & 18)                                     */}
          {/* ========================================================================= */}
          {activeTab === 'approval' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-navy-950">Modul Persetujuan (Approval)</h2>
                <p className="text-xs text-slate-500">
                  Validasi dan penetapan perubahan data baseline dari PMO / Champion oleh Executive
                </p>
              </div>

              {/* Status explanation based on role */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
                {isExecutive ? (
                  <p className="text-slate-700">
                    <strong>Kewenangan Executive:</strong> Anda memiliki hak penuh untuk menyetujui (Approve) atau menolak (Reject) perubahan yang diajukan oleh PMO/Champion. Saat disetujui, baseline lama disimpan sebagai histori dan baseline baru menjadi data aktif.
                  </p>
                ) : (
                  <p className="text-slate-700">
                    <strong>Akses PMO / Champion:</strong> Anda dapat melihat status pengajuan usulan Anda sendiri. Pengajuan yang berstatus Pending Approval sedang menunggu review pimpinan.
                  </p>
                )}
              </div>

              {/* Pending Approvals List */}
              <div className="space-y-4">
                {changeRequests
                  .filter((cr) => isExecutive || cr.submitterRole === 'PMO / Champion')
                  .map((cr) => (
                    <div key={cr.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-500">{cr.kode}</span>
                            <h3 className="text-base font-extrabold text-navy-950">{cr.title}</h3>
                          </div>
                          <p className="text-xs text-slate-500">
                            Pengusul: <strong>{cr.submitter}</strong> ({cr.submitDate}) | Objek: {cr.targetElement}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-extrabold ${
                            cr.status === 'Approved'
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : cr.status === 'Rejected'
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : 'border-amber-300 bg-amber-50 text-amber-800'
                          }`}
                        >
                          {cr.status}
                        </span>
                      </div>

                      {/* SOT 18: Current vs Proposed Value Comparison */}
                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Current Value (Data Eksisting)
                          </span>
                          <p className="mt-1 text-xs text-slate-800">{cr.currentValue}</p>
                        </div>
                        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                            Proposed Value (Usulan Baru)
                          </span>
                          <p className="mt-1 text-xs font-bold text-navy-950">{cr.proposedValue}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs space-y-1">
                        <p><strong>Alasan:</strong> {cr.reason}</p>
                        <p><strong>Dampak:</strong> {cr.impact}</p>
                        {cr.rejectionReason && (
                          <p className="text-red-700 font-bold">Catatan Penolakan: {cr.rejectionReason}</p>
                        )}
                      </div>

                      {/* Executive Action Buttons (Only visible to Executive when Pending) */}
                      {isExecutive && cr.status === 'Pending Approval' && (
                        <div className="mt-5 flex justify-end gap-3 border-t border-slate-200 pt-4">
                          <button
                            type="button"
                            onClick={() => handleOpenRejectModal(cr)}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-extrabold text-red-700 transition hover:bg-red-100"
                          >
                            Tolak (Reject)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveCr(cr)}
                            className="rounded-xl bg-navy-950 px-5 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-navy-900"
                          >
                            Setujui (Approve & Jadikan Aktif)
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. AUDIT TRAIL VIEW (SOT Section 18 & 19)                                 */}
          {/* ========================================================================= */}
          {activeTab === 'audit_trail' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-navy-950">Audit Trail (Rekam Jejak Perubahan)</h2>
                <p className="text-xs text-slate-500">
                  Catatan kronologis perubahan data yang bersifat permanen, akuntabel, dan tidak dapat dimanipulasi
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Waktu & Tanggal</th>
                      <th className="px-4 py-3">Pengguna & Role</th>
                      <th className="px-4 py-3">Modul & Tindakan</th>
                      <th className="px-4 py-3">Nilai Sebelum (Before)</th>
                      <th className="px-4 py-3">Nilai Sesudah (After)</th>
                      <th className="px-4 py-3">Status / Approver</th>
                      <th className="px-4 py-3">Keterangan / Alasan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {auditTrail.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-3.5 font-mono text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-navy-950">{log.user}</span>
                          <p className="text-[11px] font-semibold text-slate-500">{log.role}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {log.module}
                          </span>
                          <p className="mt-1 font-bold text-navy-950">{log.action}</p>
                          <p className="text-[11px] text-slate-500">{log.target}</p>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{log.beforeValue}</td>
                        <td className="px-4 py-3.5 font-bold text-navy-950">{log.afterValue}</td>
                        <td className="px-4 py-3.5">
                          <span className="rounded bg-navy-950/5 px-2 py-0.5 text-[11px] font-bold text-navy-950">
                            {log.approvalStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">{log.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: UPDATE PROGRESS (SOT Section 13)                                    */}
      {/* ========================================================================= */}
      {isUpdateProgressOpen && selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-navy-950">
                  {isExecutive ? 'Direct Edit Capaian (Executive)' : 'Update Progress Kegiatan (PMO / Champion)'}
                </h3>
                <p className="text-xs text-slate-500">{selectedActivity.kode} — {selectedActivity.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsUpdateProgressOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700">Progress Realisasi (%) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={progressForm.actualProgress}
                  onChange={(e) => setProgressForm({ ...progressForm, actualProgress: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 font-bold text-navy-950 focus:border-navy-900 focus:outline-none"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Rencana saat ini: {selectedActivity.plannedProgress}% | Deviasi terhitung otomatis
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700">Catatan Capaian / Uraian Pelaksanaan *</label>
                <textarea
                  rows="3"
                  value={progressForm.catatan}
                  onChange={(e) => setProgressForm({ ...progressForm, catatan: e.target.value })}
                  placeholder="Jelaskan progres milestone yang telah diselesaikan..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 focus:border-navy-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Isu / Kendala (Jika Ada)</label>
                <input
                  type="text"
                  value={progressForm.isu}
                  onChange={(e) => setProgressForm({ ...progressForm, isu: e.target.value })}
                  placeholder="Kendala teknis, regulasi, atau koordinasi..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 focus:border-navy-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Nama Dokumen Evidence (PDF/DOC)</label>
                <input
                  type="text"
                  value={progressForm.evidence}
                  onChange={(e) => setProgressForm({ ...progressForm, evidence: e.target.value })}
                  placeholder="Contoh: Berita_Acara_Hasil_Uji.pdf"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 focus:border-navy-900 focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600">
                {isExecutive ? (
                  <span>Perubahan langsung diaktifkan ke data resmi dan tercatat di Audit Trail.</span>
                ) : (
                  <span>Perubahan disimpan sebagai pengajuan dan memerlukan persetujuan Executive.</span>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateProgressOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-navy-950 px-5 py-2 font-extrabold text-white shadow-sm hover:bg-navy-900"
                >
                  {isExecutive ? 'Simpan & Terapkan' : 'Kirim Usulan Progres'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: AJUKAN CHANGE REQUEST (SOT Section 16)                              */}
      {/* ========================================================================= */}
      {isChangeRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-navy-950">
                  Ajukan Change Request
                </h3>
                <p className="text-xs text-slate-500">Form usulan perubahan baseline resmi KA PNBP</p>
              </div>
              <button
                type="button"
                onClick={() => setIsChangeRequestOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChangeRequest} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700">Judul Usulan Perubahan *</label>
                <input
                  type="text"
                  value={crForm.title}
                  onChange={(e) => setCrForm({ ...crForm, title: e.target.value })}
                  placeholder="Contoh: Perpanjangan Target Penyelesaian WBS Simponi"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 font-semibold text-navy-950 focus:border-navy-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Target Objek yang Diubah *</label>
                <input
                  type="text"
                  value={crForm.targetElement}
                  onChange={(e) => setCrForm({ ...crForm, targetElement: e.target.value })}
                  placeholder="Contoh: KEG-2.1 / WBS-2.1.2 / LS-02"
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 focus:border-navy-900 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700">Current Value (Eksisting)</label>
                  <input
                    type="text"
                    value={crForm.currentValue}
                    onChange={(e) => setCrForm({ ...crForm, currentValue: e.target.value })}
                    placeholder="Nilai data saat ini..."
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 focus:border-navy-900 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700">Proposed Value (Usulan)</label>
                  <input
                    type="text"
                    value={crForm.proposedValue}
                    onChange={(e) => setCrForm({ ...crForm, proposedValue: e.target.value })}
                    placeholder="Nilai baru yang diusulkan..."
                    className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 focus:border-navy-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700">Alasan Perubahan *</label>
                <textarea
                  rows="2"
                  value={crForm.reason}
                  onChange={(e) => setCrForm({ ...crForm, reason: e.target.value })}
                  placeholder="Mengapa perubahan baseline ini diperlukan..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 focus:border-navy-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700">Dampak Perubahan</label>
                <input
                  type="text"
                  value={crForm.impact}
                  onChange={(e) => setCrForm({ ...crForm, impact: e.target.value })}
                  placeholder="Dampak terhadap jadwal, output, atau koordinasi K/L..."
                  className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 focus:border-navy-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangeRequestOpen(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-navy-950 px-5 py-2 font-extrabold text-white shadow-sm hover:bg-navy-900"
                >
                  {isExecutive ? 'Setujui & Terapkan Langsung' : 'Submit ke Executive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REJECT CHANGE REQUEST (SOT Section 17.3)                            */}
      {/* ========================================================================= */}
      {isRejectModalOpen && activeCrToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-navy-950">Tolak Usulan Change Request</h3>
            <p className="mt-1 text-xs text-slate-500">
              Berikan alasan penolakan untuk {activeCrToReject.kode}. Usulan akan dikembalikan ke PMO / Champion untuk direvisi.
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700">Alasan Penolakan *</label>
              <textarea
                rows="3"
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Tuliskan alasan penolakan atau petunjuk perbaikan..."
                className="mt-1 w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:border-navy-900 focus:outline-none"
                required
              />
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false)
                  setActiveCrToReject(null)
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmRejectCr}
                className="rounded-xl bg-red-600 px-5 py-2 text-xs font-extrabold text-white hover:bg-red-700"
              >
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
