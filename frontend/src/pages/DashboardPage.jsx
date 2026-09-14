import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Brand from '../components/Brand'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/client'
import {
  dashboardKpis as initialKpis,
  programs as initialPrograms,
  milestones as initialMilestones,
  priorityItems as initialPriorityItems,
  mockFeedbackQueue as initialFeedbackQueue,
  mockQuestionsQueue as initialQuestionsQueue,
  activity as initialActivity,
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
    program: (
      <>
        <path d="M4 19V5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M14 3v6h6M8 13h8M8 17h5" />
      </>
    ),
    milestone: <path d="M5 3v18M5 6h10l-2 4 2 4H5" />,
    risk: (
      <>
        <path d="M12 3 2.8 19h18.4L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    feedback: (
      <>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
        <path d="M8 9h8M8 13h5" />
      </>
    ),
    question: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
      </>
    ),
    report: <path d="M4 20V10M10 20V4M16 20v-7M22 20V7" />,
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

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'program', label: 'Program & WBS', icon: 'program' },
  { id: 'milestone', label: 'Milestone', icon: 'milestone' },
  { id: 'risk', label: 'Isu & Risiko', icon: 'risk' },
  { id: 'feedback', label: 'Masukan Publik', icon: 'feedback' },
  { id: 'question', label: 'Pertanyaan Tarif', icon: 'question' },
  { id: 'report', label: 'Laporan', icon: 'report' },
]

const statusBadgeClass = {
  'On track': 'bg-eco-100 text-eco-700 border border-eco-600/20',
  'At risk': 'bg-yellow-500/20 text-navy-950 border border-yellow-500/40',
  'In progress': 'bg-blue-50 text-blue-800 border border-blue-200',
  'Not started': 'bg-slate-100 text-slate-600 border border-slate-200',
  'Overdue': 'bg-red-50 text-red-700 border border-red-200',
  'Blocked': 'bg-red-50 text-red-700 border border-red-200',
  'Open': 'bg-yellow-500/15 text-navy-900 border border-yellow-500/30',
  new: 'bg-yellow-500/20 text-navy-950 font-bold',
  triaged: 'bg-blue-50 text-blue-700',
  responded: 'bg-eco-100 text-eco-700',
  closed: 'bg-slate-100 text-slate-600',
  answered: 'bg-eco-100 text-eco-700',
  assigned: 'bg-purple-50 text-purple-700',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isEditor = user?.role !== 'Internal Viewer'

  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [queueTab, setQueueTab] = useState('feedback')

  // Live state
  const [kpis, setKpis] = useState(initialKpis)
  const [programsList, setProgramsList] = useState(initialPrograms)
  const [priorityList, setPriorityList] = useState(initialPriorityItems)
  const [milestoneList, setMilestoneList] = useState(initialMilestones)
  const [feedbackList, setFeedbackList] = useState(initialFeedbackQueue)
  const [questionList, setQuestionList] = useState(initialQuestionsQueue)
  const [activityList, setActivityList] = useState(initialActivity)

  // Task creation modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskOwner, setNewTaskOwner] = useState(user?.name?.split(',')[0] || 'Budi Santoso')
  const [newTaskPriority, setNewTaskPriority] = useState('Tinggi')
  const [newTaskDueDate, setNewTaskDueDate] = useState('2026-09-30')
  const [newTaskType, setNewTaskType] = useState('Tindak Lanjut')

  // Feedback Triage Drawer/Modal
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [triageCategory, setTriageCategory] = useState('')
  const [triagePic, setTriagePic] = useState('')
  const [triageInternalNote, setTriageInternalNote] = useState('')
  const [triageResponse, setTriageResponse] = useState('')

  // Question Answer Modal
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [questionAnswerText, setQuestionAnswerText] = useState('')
  const [candidateFaq, setCandidateFaq] = useState(false)

  // Milestone Update Modal
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [milestoneNewStatus, setMilestoneNewStatus] = useState('In progress')
  const [milestoneNewProgress, setMilestoneNewProgress] = useState(50)

  useEffect(() => {
    let isMounted = true
    api
      .getDashboardSummary(2026)
      .then((res) => {
        if (!isMounted) return
        if (res.data) {
          if (res.data.kpi) setKpis(res.data.kpi)
          if (res.data.programs) setProgramsList(res.data.programs)
          if (res.data.priority_items) setPriorityList(res.data.priority_items)
          if (res.data.milestones) setMilestoneList(res.data.milestones)
          if (res.data.recent_activity) setActivityList(res.data.recent_activity)
        }
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Handle Task Creation
  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const res = await api.createTask({
      title: newTaskTitle,
      type: newTaskType,
      owner: newTaskOwner,
      dueDate: newTaskDueDate,
      priority: newTaskPriority,
    })

    setPriorityList([res.data, ...priorityList])
    setActivityList([
      {
        id: `act_${Date.now()}`,
        time: 'Baru saja',
        text: `${newTaskType} "${newTaskTitle}" ditambahkan oleh ${newTaskOwner}.`,
        type: 'task',
      },
      ...activityList,
    ])

    setNewTaskTitle('')
    setModalOpen(false)
  }

  // Handle Feedback Triage Save
  const handleSaveFeedbackTriage = async (e) => {
    e.preventDefault()
    if (!selectedFeedback) return

    const newStatus = triageResponse ? 'responded' : triagePic ? 'triaged' : selectedFeedback.status
    const res = await api.updateFeedbackTriage(selectedFeedback.id, {
      category: triageCategory || selectedFeedback.category,
      assignedTo: triagePic || selectedFeedback.assignedTo,
      internalNote: triageInternalNote,
      response: triageResponse,
      status: newStatus,
    })

    setFeedbackList(feedbackList.map((f) => (f.id === selectedFeedback.id ? res.data : f)))
    setActivityList([
      {
        id: `act_${Date.now()}`,
        time: 'Baru saja',
        text: `Masukan publik ${selectedFeedback.id} statusnya diperbarui menjadi "${newStatus}" oleh ${user?.name?.split(',')[0] || 'Editor'}.`,
        type: 'feedback',
      },
      ...activityList,
    ])

    setSelectedFeedback(null)
  }

  // Handle Question Response Save
  const handleSaveQuestionResponse = async (e) => {
    e.preventDefault()
    if (!selectedQuestion) return

    const res = await api.answerQuestion(selectedQuestion.id, {
      answer: questionAnswerText,
      candidateFaq,
      assignedTo: user?.name?.split(',')[0] || 'Tim Regulasi',
    })

    setQuestionList(questionList.map((q) => (q.id === selectedQuestion.id ? res.data : q)))
    setActivityList([
      {
        id: `act_${Date.now()}`,
        time: 'Baru saja',
        text: `Jawaban resmi untuk tiket pertanyaan ${selectedQuestion.id} telah dikirimkan.`,
        type: 'question',
      },
      ...activityList,
    ])

    setSelectedQuestion(null)
    setQuestionAnswerText('')
  }

  // Handle Milestone Status Save
  const handleSaveMilestone = async (e) => {
    e.preventDefault()
    if (!selectedMilestone) return

    const res = await api.updateMilestone(selectedMilestone.id, {
      status: milestoneNewStatus,
      progressPct: Number(milestoneNewProgress),
    })

    setMilestoneList(milestoneList.map((m) => (m.id === selectedMilestone.id ? res.data : m)))
    setActivityList([
      {
        id: `act_${Date.now()}`,
        time: 'Baru saja',
        text: `Milestone "${selectedMilestone.title}" diperbarui progresnya menjadi ${milestoneNewProgress}%.`,
        type: 'milestone',
      },
      ...activityList,
    ])

    setSelectedMilestone(null)
  }

  // Handle CSV Download Simulation (FR-INT-10)
  const handleDownloadCsv = (type) => {
    let rows = []
    let filename = `laporan_${type}_2026.csv`

    if (type === 'masukan') {
      rows = [
        ['ID Referensi', 'Instansi', 'Layanan', 'Tarif', 'Kategori', 'Tanggal', 'Status', 'PIC'],
        ...feedbackList.map((f) => [f.id, f.agency, f.service, f.tariff, f.category, f.date, f.status, f.assignedTo]),
      ]
    } else if (type === 'isu') {
      rows = [
        ['ID', 'Tipe', 'Judul Isu', 'Kategori', 'Owner', 'Batas Waktu', 'Prioritas', 'Status'],
        ...priorityList.map((p) => [p.id, p.type, `"${p.title}"`, p.category, p.owner, p.dueDate, p.priority, p.status]),
      ]
    } else {
      rows = [
        ['ID', 'Milestone', 'Program', 'Target', 'Status', 'Progres (%)'],
        ...milestoneList.map((m) => [m.id, `"${m.title}"`, m.program, m.due, m.status, m.progressPct]),
      ]
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Filtered Priority Items
  const filteredPriorityItems = priorityList.filter((item) => {
    if (priorityFilter === 'overdue') return item.status === 'Overdue'
    if (priorityFilter === 'high') return item.priority === 'Tinggi'
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[264px_minmax(0,1fr)]">
      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen ? (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      ) : null}

      {/* Internal Sidebar — Navy (03-UI-GUIDELINE section 1 & 3) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-950 px-5 py-6 text-white transition-transform duration-200 ease-out lg:static lg:w-auto lg:translate-x-0 ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-2 pb-7">
          <Brand inverted />
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            className="rounded-lg p-1 text-slate-400 hover:text-white lg:hidden"
            aria-label="Tutup menu sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-1" aria-label="Navigasi internal">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id)
                  setMobileDrawerOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white/10 text-white ring-1 ring-white/10'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-yellow-500' : 'text-slate-400'}>
                  <NavIcon type={item.icon} />
                </span>
                <span>{item.label}</span>
                {item.id === 'risk' ? (
                  <span className="ml-auto rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-yellow-400">
                    {priorityList.filter((p) => p.status === 'Overdue').length}
                  </span>
                ) : null}
              </button>
            )
          })}
        </nav>

        {/* Active Period / Context Card */}
        <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.04] p-4 text-xs">
          <p className="font-bold uppercase tracking-[0.14em] text-slate-400">Periode Aktif</p>
          <p className="mt-1 text-lg font-extrabold text-white tabular-nums">Tahun 2026</p>
          <p className="mt-1 leading-5 text-slate-400">
            Monitoring transformasi kebijakan & digitalisasi PNBP
          </p>
          <div className="mt-3 border-t border-white/10 pt-2.5 flex items-center justify-between text-[11px] text-slate-400">
            <span>SLA Monitoring:</span>
            <span className="font-bold text-eco-100">Aktif</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="min-w-0">
        {/* Sticky Header Page */}
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-[72px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 lg:hidden"
                aria-label="Buka menu navigasi"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="hidden sm:block">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  KA PNBP / Internal Workspace / {navItems.find((n) => n.id === activeTab)?.label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Period Filter Chip */}
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 sm:inline-flex">
                <span className="h-2 w-2 rounded-full bg-eco-600" />
                <span>Periode: 2026</span>
              </div>

              {/* User Profile Chip */}
              <div className="flex h-10 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 pl-2 pr-3.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-950 text-[11px] font-extrabold text-yellow-500">
                  {user?.avatarInitials || 'IN'}
                </span>
                <div className="hidden flex-col text-left sm:flex">
                  <span className="text-xs font-bold text-slate-800 leading-none">
                    {user?.name?.split(',')[0] || 'Internal User'}
                  </span>
                  <span className="mt-0.5 text-[10px] text-slate-500 leading-none">
                    {user?.role || 'Internal Editor'}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-600 transition hover:border-red-300 hover:text-red-700"
              >
                Keluar
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1540px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {/* VIEW 1: Dashboard Overview (Default) */}
          {activeTab === 'dashboard' ? (
            <div>
              {/* Dashboard Title & Action Row (F-INT-05 scan step 1) */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full bg-eco-100 px-2.5 py-0.5 text-[11px] font-bold text-eco-700">
                      Operasional Transformasi PNBP
                    </span>
                    <span className="text-xs text-slate-400">• Triwulan III / 2026</span>
                  </div>
                  <h1 className="mt-1.5 text-3xl font-extrabold tracking-[-0.035em] text-navy-950 sm:text-4xl">
                    Dashboard Monitoring
                  </h1>
                  <p className="mt-1.5 text-sm text-slate-500 max-w-2xl">
                    Ringkasan capaian program transformasi, pemantauan isu prioritas, dan antrean triage layanan publik.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {isEditor ? (
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-500 px-5 text-sm font-extrabold text-navy-950 transition hover:bg-yellow-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-500/30"
                    >
                      + Tambah Tindak Lanjut
                    </button>
                  ) : (
                    <span className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500">
                      Mode Viewer (Read-only)
                    </span>
                  )}
                </div>
              </div>

              {/* SECTION 1: KPI Summary Row (FR-INT-01, API Spec 7. Dashboard) */}
              <section className="mt-8" aria-label="Ringkasan KPI Operasional">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                  {kpis.map((kpi) => (
                    <article
                      key={kpi.id}
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">
                          {kpi.label}
                        </p>
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                            kpi.tone === 'green'
                              ? 'bg-eco-600'
                              : kpi.tone === 'yellow'
                              ? 'bg-yellow-500'
                              : kpi.tone === 'red'
                              ? 'bg-red-500'
                              : 'bg-navy-700'
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-4">
                        <p className="text-3xl font-extrabold tracking-[-0.04em] text-navy-950 tabular-nums">
                          {kpi.value}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 leading-snug">{kpi.note}</p>
                      </div>
                      <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] font-semibold text-slate-400">
                        {kpi.trend}
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* SECTION 2: Program Progress & Workstream (FR-INT-02, F-INT-01, scan step 3) */}
              <section className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-extrabold text-navy-950">Progres Program Transformasi</h2>
                      <p className="text-xs text-slate-500">Status penyelesaian roadmap percontohan 2026.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('program')}
                      className="text-xs font-bold text-navy-700 hover:text-navy-950"
                    >
                      Kelola Detail WBS →
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    {programsList.map((prog) => (
                      <div key={prog.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-50">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="max-w-md">
                            <h3 className="text-sm font-bold text-slate-900">{prog.name}</h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                              PIC: <span className="font-semibold text-slate-700">{prog.owner}</span> • Target:{' '}
                              <span className="font-semibold text-slate-700">{prog.targetDate}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass[prog.status]}`}>
                              {prog.status}
                            </span>
                            <span className="w-12 text-right text-sm font-extrabold text-navy-950 tabular-nums">
                              {prog.progress}%
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              prog.status === 'At risk' ? 'bg-yellow-500' : 'bg-eco-600'
                            }`}
                            style={{ width: `${prog.progress}%` }}
                          />
                        </div>
                        <p className="mt-2.5 text-[11px] text-slate-500 leading-normal">{prog.description}</p>
                      </div>
                    ))}
                  </div>
                </article>

                {/* Public Queue Snapshot Card */}
                <article className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-navy-950 p-6 text-white shadow-sm">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                          Layanan Publik
                        </span>
                        <h2 className="mt-1 text-xl font-extrabold">Antrean Triage Hari Ini</h2>
                      </div>
                      <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-extrabold text-navy-950">
                        {feedbackList.length + questionList.length} Total Masuk
                      </span>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-300">
                      Data masukan dan pertanyaan publik yang memerlukan telaah kebijakan atau alokasi ke tim teknis kementerian.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                        <p className="text-xs text-slate-400">Masukan Tarif</p>
                        <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">{feedbackList.length}</p>
                        <p className="mt-1 text-xs text-yellow-400 font-semibold">
                          {feedbackList.filter((f) => f.status === 'new').length} belum ditriage
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                        <p className="text-xs text-slate-400">Pertanyaan Tarif</p>
                        <p className="mt-2 text-3xl font-extrabold tabular-nums text-white">{questionList.length}</p>
                        <p className="mt-1 text-xs text-slate-300">
                          {questionList.filter((q) => q.status === 'new').length} tiket baru
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('feedback')}
                      className="h-10 w-full rounded-xl bg-white/10 text-xs font-bold text-white hover:bg-white/15 transition"
                    >
                      Buka Triage Masukan Publik →
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('question')}
                      className="h-10 w-full rounded-xl border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition"
                    >
                      Buka Triage Pertanyaan →
                    </button>
                  </div>
                </article>
              </section>

              {/* SECTION 3: Priority Items — Issues, Risks, & Overdue Tasks (F-INT-05 scan step 4, PRD FR-INT-05, FR-INT-06) */}
              <section className="mt-8">
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
                    <div>
                      <h2 className="text-lg font-extrabold text-navy-950">
                        Isu Kritis & Tindak Lanjut Prioritas
                      </h2>
                      <p className="text-xs text-slate-500">
                        Item berstatus Overdue, Blocked, atau berdampak tinggi yang memerlukan atensi segera.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPriorityFilter('all')}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          priorityFilter === 'all'
                            ? 'bg-navy-950 text-white'
                            : 'border border-slate-200 bg-white text-slate-600 hover:border-navy-700'
                        }`}
                      >
                        Semua ({priorityList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriorityFilter('overdue')}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          priorityFilter === 'overdue'
                            ? 'bg-red-600 text-white'
                            : 'border border-slate-200 bg-white text-red-600 hover:border-red-400'
                        }`}
                      >
                        Jatuh Tempo ({priorityList.filter((p) => p.status === 'Overdue').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriorityFilter('high')}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          priorityFilter === 'high'
                            ? 'bg-yellow-500 text-navy-950'
                            : 'border border-slate-200 bg-white text-slate-700 hover:border-yellow-500'
                        }`}
                      >
                        Dampak Tinggi ({priorityList.filter((p) => p.priority === 'Tinggi').length})
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-6 py-3.5">Tipe & Kategori</th>
                          <th className="px-6 py-3.5">Deskripsi Isu / Tindak Lanjut</th>
                          <th className="px-6 py-3.5">PIC / Owner</th>
                          <th className="px-6 py-3.5">Target</th>
                          <th className="px-6 py-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredPriorityItems.map((item) => (
                          <tr key={item.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4 align-top">
                              <span className="font-bold text-navy-950">{item.type}</span>
                              <span className="block text-[11px] text-slate-400">{item.category}</span>
                            </td>
                            <td className="px-6 py-4 align-top max-w-md">
                              <p className="font-bold text-slate-800">{item.title}</p>
                              <p className="mt-1 text-[11px] text-slate-500 leading-normal">{item.mitigation}</p>
                            </td>
                            <td className="px-6 py-4 align-top font-semibold text-slate-700">{item.owner}</td>
                            <td className="px-6 py-4 align-top tabular-nums text-slate-600">{item.dueDate}</td>
                            <td className="px-6 py-4 align-top">
                              <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadgeClass[item.status]}`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>
              </section>

              {/* SECTION 4: Milestones & Recent Activity (F-INT-05 scan step 3 & 6) */}
              <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                {/* Milestone Schedule */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                      <h2 className="text-lg font-extrabold text-navy-950">Milestone Terdekat</h2>
                      <p className="text-xs text-slate-500">Jadwal target penyelesaian deliverable triwulan berjalan.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('milestone')}
                      className="text-xs font-bold text-navy-700 hover:text-navy-950"
                    >
                      Kelola Semua Milestone →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-6 py-3.5">Milestone</th>
                          <th className="px-6 py-3.5">Program</th>
                          <th className="px-6 py-3.5">Target</th>
                          <th className="px-6 py-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {milestoneList.map((m) => (
                          <tr key={m.id} className="transition hover:bg-slate-50/70">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900">{m.title}</p>
                              {m.evidence ? (
                                <span className="mt-0.5 inline-block text-[11px] text-navy-700">
                                  📄 {m.evidence}
                                </span>
                              ) : null}
                            </td>
                            <td className="px-6 py-4 text-slate-500">{m.program}</td>
                            <td className="px-6 py-4 tabular-nums text-slate-600">{m.due}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadgeClass[m.status]}`}>
                                {m.status} ({m.progressPct}%)
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </article>

                {/* Audit Log / Recent Activity Feed */}
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-extrabold text-navy-950">Aktivitas Terbaru</h2>
                    <span className="text-xs font-bold text-slate-400">Audit Trail</span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {activityList.map((act, idx) => (
                      <div key={act.id || idx} className="relative flex gap-3 text-xs leading-relaxed">
                        <div className="mt-1 flex flex-col items-center">
                          <span
                            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                              idx === 0 ? 'bg-yellow-500' : 'bg-navy-950'
                            }`}
                            aria-hidden="true"
                          />
                          {idx < activityList.length - 1 ? (
                            <span className="mt-1 h-full w-px bg-slate-200" aria-hidden="true" />
                          ) : null}
                        </div>
                        <div className="pb-3">
                          <p className="font-bold text-slate-500">{act.time}</p>
                          <p className="mt-0.5 text-slate-800">{act.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </div>
          ) : null}

          {/* VIEW 2: Program & WBS Management (FR-INT-02, FR-INT-03, F-INT-01) */}
          {activeTab === 'program' ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">
                    Program & Work Breakdown Structure (WBS)
                  </h1>
                  <p className="text-xs text-slate-500">
                    Kelola workstream transformasi PNBP, penanggung jawab pokja, serta alur deliverable.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex h-9 items-center text-xs font-bold text-navy-700 hover:text-navy-950"
                >
                  ← Kembali ke Dashboard
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {programsList.map((prog) => (
                  <article key={prog.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          {prog.id.toUpperCase()}
                        </span>
                        <h2 className="mt-1 text-base font-extrabold text-navy-950">{prog.name}</h2>
                        <p className="mt-1 text-xs text-slate-500 font-medium">Owner: {prog.owner}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass[prog.status]}`}>
                        {prog.status}
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Capaian Deliverable WBS</span>
                        <span>{prog.progress}%</span>
                      </div>
                      <div className="mt-2 h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${prog.status === 'At risk' ? 'bg-yellow-500' : 'bg-eco-600'}`}
                          style={{ width: `${prog.progress}%` }}
                        />
                      </div>
                    </div>

                    <p className="mt-4 text-xs leading-relaxed text-slate-600">{prog.description}</p>

                    <div className="mt-5 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>Workstream Aktif: {prog.activeWorkstreams}</span>
                      <span>Target: {prog.targetDate}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {/* VIEW 3: Milestone Management (FR-INT-04, F-INT-01) */}
          {activeTab === 'milestone' ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">
                    Jadwal & Verifikasi Milestone
                  </h1>
                  <p className="text-xs text-slate-500">
                    Pemantauan tenggat waktu deliverable, evidence resmi, dan pembaruan progres kerja.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex h-9 items-center text-xs font-bold text-navy-700 hover:text-navy-950"
                >
                  ← Kembali ke Dashboard
                </button>
              </div>

              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Nama Milestone</th>
                        <th className="px-6 py-4">Program</th>
                        <th className="px-6 py-4">Owner / PIC</th>
                        <th className="px-6 py-4">Tenggat</th>
                        <th className="px-6 py-4">Progres</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {milestoneList.map((m) => (
                        <tr key={m.id} className="transition hover:bg-slate-50/70">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-900">{m.title}</p>
                            {m.evidence ? (
                              <span className="text-[11px] text-navy-700 font-medium">📄 {m.evidence}</span>
                            ) : null}
                          </td>
                          <td className="px-6 py-4 text-slate-500">{m.program}</td>
                          <td className="px-6 py-4 font-semibold text-slate-700">{m.owner}</td>
                          <td className="px-6 py-4 tabular-nums text-slate-600">{m.due}</td>
                          <td className="px-6 py-4 font-bold text-navy-950 tabular-nums">{m.progressPct}%</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadgeClass[m.status]}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {isEditor ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMilestone(m)
                                  setMilestoneNewStatus(m.status)
                                  setMilestoneNewProgress(m.progressPct)
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-navy-950 hover:border-navy-700"
                              >
                                Edit Status
                              </button>
                            ) : (
                              <span className="text-slate-400 italic">Lihat</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>
          ) : null}

          {/* VIEW 4: Isu & Risiko Management (FR-INT-05, FR-INT-06, F-INT-02) */}
          {activeTab === 'risk' ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">
                    Isu & Risiko Transformasi
                  </h1>
                  <p className="text-xs text-slate-500">
                    Katalog isu teknis, dampak regulasi, serta langkah mitigasi terkoordinasi.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="inline-flex h-9 items-center text-xs font-bold text-navy-700 hover:text-navy-950"
                  >
                    ← Dashboard
                  </button>
                  {isEditor ? (
                    <button
                      type="button"
                      onClick={() => {
                        setNewTaskType('Isu Kritis')
                        setModalOpen(true)
                      }}
                      className="inline-flex h-10 items-center rounded-xl bg-yellow-500 px-4 text-xs font-extrabold text-navy-950 hover:bg-yellow-400"
                    >
                      + Catat Isu Baru
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {priorityList.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[11px] font-extrabold uppercase text-slate-400">{item.type}</span>
                        <h2 className="mt-1 text-sm font-bold text-navy-950">{item.title}</h2>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass[item.status]}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-3 text-xs leading-relaxed text-slate-600">
                      <p className="font-semibold text-slate-700">Rencana Mitigasi:</p>
                      <p className="mt-1 text-slate-600">{item.mitigation}</p>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>PIC: <span className="font-bold text-slate-700">{item.owner}</span></span>
                      <span>Batas: <span className="font-bold text-slate-700">{item.dueDate}</span></span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {/* VIEW 5: Masukan Publik Triage (FR-INT-07, F-INT-03) */}
          {activeTab === 'feedback' ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">
                    Triage & Disposisi Masukan Publik
                  </h1>
                  <p className="text-xs text-slate-500">
                    Klasifikasikan aspirasi tarif, tentukan penanggung jawab, dan kirimkan respons resmi.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleDownloadCsv('masukan')}
                    className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:border-navy-700"
                  >
                    Ekspor CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="inline-flex h-9 items-center text-xs font-bold text-navy-700 hover:text-navy-950"
                  >
                    ← Dashboard
                  </button>
                </div>
              </div>

              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Nomor Referensi</th>
                        <th className="px-6 py-4">Instansi & Layanan</th>
                        <th className="px-6 py-4">Ringkasan Masukan</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4">PIC Ditugaskan</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feedbackList.map((fb) => (
                        <tr key={fb.id} className="transition hover:bg-slate-50/70">
                          <td className="px-6 py-4 font-bold text-navy-950">
                            {fb.id}
                            <span className="block text-[11px] font-normal text-slate-400">{fb.date}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800">{fb.agency}</span>
                            <span className="block text-[11px] text-slate-500">{fb.service}</span>
                          </td>
                          <td className="px-6 py-4 max-w-sm text-slate-700 leading-relaxed">
                            {fb.summary}
                          </td>
                          <td className="px-6 py-4 uppercase font-semibold text-slate-500">
                            {fb.category}
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700">
                            {fb.assignedTo}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadgeClass[fb.status]}`}>
                              {fb.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFeedback(fb)
                                setTriageCategory(fb.category)
                                setTriagePic(fb.assignedTo === 'Belum ditugaskan' ? user?.name?.split(',')[0] || '' : fb.assignedTo)
                                setTriageInternalNote(fb.internalNote || '')
                                setTriageResponse(fb.response || '')
                              }}
                              className="rounded-lg bg-navy-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-900"
                            >
                              {isEditor ? 'Triage / Respon' : 'Detail'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>
          ) : null}

          {/* VIEW 6: Pertanyaan Tarif Triage (FR-INT-08, F-INT-04) */}
          {activeTab === 'question' ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">
                    Triage Pertanyaan Tarif
                  </h1>
                  <p className="text-xs text-slate-500">
                    Jawab pertanyaan regulasi tarif dari masyarakat dan tandai sebagai calon FAQ publik.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex h-9 items-center text-xs font-bold text-navy-700 hover:text-navy-950"
                >
                  ← Dashboard
                </button>
              </div>

              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4">Nomor Tiket</th>
                        <th className="px-6 py-4">Instansi & Layanan</th>
                        <th className="px-6 py-4">Isi Pertanyaan</th>
                        <th className="px-6 py-4">Knowledge Match</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {questionList.map((q) => (
                        <tr key={q.id} className="transition hover:bg-slate-50/70">
                          <td className="px-6 py-4 font-bold text-navy-950">
                            {q.id}
                            <span className="block text-[11px] font-normal text-slate-400">{q.date}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-800">{q.agency}</span>
                            <span className="block text-[11px] text-slate-500">{q.service}</span>
                          </td>
                          <td className="px-6 py-4 max-w-sm text-slate-700 leading-relaxed">
                            {q.question}
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {q.matchedFaq ? (
                              <span className="text-eco-700 font-semibold">✓ {q.matchedFaq}</span>
                            ) : (
                              <span className="text-slate-400 italic">Belum ada match</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${statusBadgeClass[q.status]}`}>
                              {q.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedQuestion(q)
                                setQuestionAnswerText(q.answer || '')
                                setCandidateFaq(!!q.candidateFaq)
                              }}
                              className="rounded-lg bg-navy-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-navy-900"
                            >
                              {isEditor ? 'Beri Jawaban' : 'Detail'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>
          ) : null}

          {/* VIEW 7: Laporan & Export (FR-INT-10) */}
          {activeTab === 'report' ? (
            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-navy-950 sm:text-3xl">
                    Laporan Transformasi & Ekspor Data
                  </h1>
                  <p className="text-xs text-slate-500">
                    Unduh rekapitulasi data masukan, isu risiko, dan pencapaian milestone untuk evaluasi pimpinan.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="inline-flex h-9 items-center text-xs font-bold text-navy-700 hover:text-navy-950"
                >
                  ← Dashboard
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-xs font-extrabold text-navy-950">
                      Publik
                    </span>
                    <h2 className="mt-3 text-lg font-extrabold text-navy-950">Laporan Masukan Tarif</h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      Rekap data seluruh aspirasi masyarakat, status triage, dan waktu respon rata-rata per instansi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadCsv('masukan')}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-navy-950 text-xs font-bold text-white hover:bg-navy-900"
                  >
                    Unduh CSV Masukan ({feedbackList.length} Baris)
                  </button>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-extrabold text-red-700">
                      Manajemen Risiko
                    </span>
                    <h2 className="mt-3 text-lg font-extrabold text-navy-950">Daftar Isu & Mitigasi</h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      Katalog isu kritis, tindak lanjut jatuh tempo, dan peta probabilitas risiko transformasi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadCsv('isu')}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-navy-950 text-xs font-bold text-white hover:bg-navy-900"
                  >
                    Unduh CSV Isu ({priorityList.length} Baris)
                  </button>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="rounded-full bg-eco-100 px-2.5 py-0.5 text-xs font-extrabold text-eco-700">
                      Deliverable
                    </span>
                    <h2 className="mt-3 text-lg font-extrabold text-navy-950">Capaian Milestone WBS</h2>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      Jadwal target dan realisasi persentase deliverable pada 4 program transformasi aktif.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownloadCsv('milestone')}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-navy-950 text-xs font-bold text-white hover:bg-navy-900"
                  >
                    Unduh CSV Milestone ({milestoneList.length} Baris)
                  </button>
                </article>
              </div>
            </div>
          ) : null}
        </main>
      </div>

      {/* MODAL 1: Tambah Tindak Lanjut Baru */}
      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-navy-950">Tambah Tindak Lanjut Baru</h3>
                <p className="text-xs text-slate-500">Catat task baru untuk pemantauan proyek transformasi.</p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block mb-1.5 font-bold text-slate-700">Tipe Entitas</label>
                <select
                  value={newTaskType}
                  onChange={(e) => setNewTaskType(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold"
                >
                  <option value="Tindak Lanjut">Tindak Lanjut (Task)</option>
                  <option value="Isu Kritis">Isu Kritis (Issue)</option>
                  <option value="Risiko">Risiko Transformasi (Risk)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-slate-700">Uraian Tugas / Isu</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Contoh: Rapat koordinasi teknis harmonisasi tarif perkeretaapian..."
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1.5 font-bold text-slate-700">Penanggung Jawab (PIC)</label>
                  <input
                    type="text"
                    value={newTaskOwner}
                    onChange={(e) => setNewTaskOwner(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-bold text-slate-700">Prioritas</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs font-semibold"
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-slate-700">Target Tanggal (Due Date)</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-10 rounded-xl border border-slate-200 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-navy-950 px-5 text-xs font-bold text-white transition hover:bg-navy-900"
                >
                  Simpan Tindak Lanjut
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL 2: Triage Masukan Publik (FR-INT-07, F-INT-03) */}
      {selectedFeedback ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-soft max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-navy-950">
                  {selectedFeedback.id}
                </span>
                <h3 className="mt-1 text-base font-extrabold text-navy-950">Triage Masukan Publik</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs space-y-2">
              <p><span className="font-bold text-slate-600">Instansi:</span> {selectedFeedback.agency}</p>
              <p><span className="font-bold text-slate-600">Layanan:</span> {selectedFeedback.service}</p>
              <p><span className="font-bold text-slate-600">Uraian Aspirasi:</span> {selectedFeedback.summary}</p>
              <p><span className="font-bold text-slate-600">Pelapor:</span> {selectedFeedback.submitter}</p>
            </div>

            <form onSubmit={handleSaveFeedbackTriage} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Klasifikasi Kategori</label>
                  <select
                    value={triageCategory}
                    onChange={(e) => setTriageCategory(e.target.value)}
                    disabled={!isEditor}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs"
                  >
                    <option value="tarif">Tarif</option>
                    <option value="layanan">Layanan</option>
                    <option value="mekanisme">Mekanisme</option>
                    <option value="kejelasan informasi">Kejelasan Informasi</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-bold text-slate-700">Tugaskan ke PIC</label>
                  <input
                    type="text"
                    value={triagePic}
                    onChange={(e) => setTriagePic(e.target.value)}
                    disabled={!isEditor}
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs"
                  />
                </div>
              </div>

              {/* Private Internal Note (Separation Rule) */}
              <div>
                <label className="block mb-1 font-bold text-red-700 flex items-center gap-1.5">
                  <span>🔒 Catatan Internal (Tidak Terlihat oleh Publik)</span>
                </label>
                <textarea
                  value={triageInternalNote}
                  onChange={(e) => setTriageInternalNote(e.target.value)}
                  disabled={!isEditor}
                  placeholder="Tuliskan catatan kajian atau disposisi internal..."
                  className="min-h-20 w-full rounded-xl border border-slate-200 p-3 text-xs"
                />
              </div>

              {/* Official Response to Citizen */}
              <div>
                <label className="block mb-1 font-bold text-slate-700">
                  Respons Resmi untuk Pelapor
                </label>
                <textarea
                  value={triageResponse}
                  onChange={(e) => setTriageResponse(e.target.value)}
                  disabled={!isEditor}
                  placeholder="Tuliskan penjelasan atau tindak lanjut resmi yang akan dikirim ke pemohon..."
                  className="min-h-20 w-full rounded-xl border border-slate-200 p-3 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedFeedback(null)}
                  className="h-10 rounded-xl border border-slate-200 px-4 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Tutup
                </button>
                {isEditor ? (
                  <button
                    type="submit"
                    className="h-10 rounded-xl bg-navy-950 px-5 font-bold text-white transition hover:bg-navy-900"
                  >
                    Simpan & Disposisi
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL 3: Jawab Pertanyaan Tarif (FR-INT-08, F-INT-04) */}
      {selectedQuestion ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-[10px] font-bold text-navy-950">
                  {selectedQuestion.id}
                </span>
                <h3 className="mt-1 text-base font-extrabold text-navy-950">Jawab Tiket Pertanyaan</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs space-y-1.5">
              <p><span className="font-bold text-slate-700">Pertanyaan:</span> {selectedQuestion.question}</p>
              <p><span className="font-bold text-slate-700">Instansi:</span> {selectedQuestion.agency}</p>
            </div>

            <form onSubmit={handleSaveQuestionResponse} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block mb-1 font-bold text-slate-700">
                  Jawaban Resmi (Wajib mencantumkan dasar hukum terverifikasi)
                </label>
                <textarea
                  value={questionAnswerText}
                  onChange={(e) => setQuestionAnswerText(e.target.value)}
                  disabled={!isEditor}
                  placeholder="Tuliskan jawaban resmi beserta nomor PP/PMK terkait..."
                  className="min-h-28 w-full rounded-xl border border-slate-200 p-3 text-xs"
                  required
                />
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                <input
                  id="faq-candidate"
                  type="checkbox"
                  checked={candidateFaq}
                  onChange={(e) => setCandidateFaq(e.target.checked)}
                  disabled={!isEditor}
                  className="h-4 w-4 rounded border-slate-300 accent-navy-900"
                />
                <label htmlFor="faq-candidate" className="text-xs font-semibold text-slate-700">
                  Tandai sebagai kandidat FAQ resmi publik (candidate_for_faq)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="h-10 rounded-xl border border-slate-200 px-4 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                {isEditor ? (
                  <button
                    type="submit"
                    className="h-10 rounded-xl bg-navy-950 px-5 font-bold text-white transition hover:bg-navy-900"
                  >
                    Kirim Jawaban
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* MODAL 4: Edit Status Milestone (FR-INT-04, F-INT-01) */}
      {selectedMilestone ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-navy-950">Update Status Milestone</h3>
              <button
                type="button"
                onClick={() => setSelectedMilestone(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="mt-4 space-y-4 text-xs">
              <p className="font-bold text-slate-800">{selectedMilestone.title}</p>
              <div>
                <label className="block mb-1 font-bold text-slate-700">Status Capaian</label>
                <select
                  value={milestoneNewStatus}
                  onChange={(e) => setMilestoneNewStatus(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 bg-white text-xs"
                >
                  <option value="Not started">Not started</option>
                  <option value="In progress">In progress</option>
                  <option value="At risk">At risk</option>
                  <option value="On track">On track</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-bold text-slate-700">Persentase Selesai (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={milestoneNewProgress}
                  onChange={(e) => setMilestoneNewProgress(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  className="h-10 rounded-xl border border-slate-200 px-4 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-navy-950 px-5 font-bold text-white transition hover:bg-navy-900"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
