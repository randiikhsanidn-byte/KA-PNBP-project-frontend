// Unified API Client for KA PNBP
// Conforms to docs/SOT/04-API-SPEC.md envelopes and contracts

import {
  agencies,
  faqs,
  dashboardKpis,
  programs,
  priorityItems,
  milestones,
  mockFeedbackQueue,
  mockQuestionsQueue,
  activity,
  mockUsers,
} from '../data/mock'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'
const AUTH_MODE = import.meta.env.VITE_AUTH_MODE || 'mock'

// Helper for realistic random request ID
function generateRequestId() {
  return 'req_' + Math.random().toString(36).substring(2, 11)
}

// Wrap successful response envelope: { "data": {}, "meta": { "request_id": "req_..." } }
function successEnvelope(data) {
  return {
    data,
    meta: {
      request_id: generateRequestId(),
      timestamp: new Date().toISOString(),
    },
  }
}

// Wrap error envelope: { "error": { "code": "...", "message": "...", "fields": {}, "request_id": "..." } }
function errorEnvelope(code, message, fields = {}) {
  const err = new Error(message)
  err.code = code
  err.fields = fields
  err.requestId = generateRequestId()
  return err
}

// Simulate latency for async state validation
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  // Public Reference Data (04-API-SPEC.md Section 3)
  async getAgencies() {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/agencies`)
      return res.json()
    }
    await delay(120)
    return successEnvelope(agencies)
  },

  async getServices(agencyId) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/services?agency_id=${agencyId}`)
      return res.json()
    }
    await delay(100)
    const agency = agencies.find((a) => a.id === agencyId)
    return successEnvelope(agency ? agency.services : [])
  },

  async getTariffs(serviceId, query = '') {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/tariffs?service_id=${serviceId}&q=${encodeURIComponent(query)}`)
      return res.json()
    }
    await delay(100)
    for (const agency of agencies) {
      const service = agency.services.find((s) => s.id === serviceId)
      if (service) {
        const filtered = query
          ? service.tariffs.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
          : service.tariffs
        return successEnvelope(filtered)
      }
    }
    return successEnvelope([])
  },

  // Public Feedback (04-API-SPEC.md Section 4)
  async submitFeedback(payload) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/public/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return res.json()
    }

    await delay(350)
    // Server-side validation simulation
    const errors = {}
    if (!payload.name || !payload.name.trim()) errors.name = 'Nama lengkap wajib diisi.'
    if (!payload.nik || !/^\d{16}$/.test(payload.nik)) errors.nik = 'NIK wajib 16 digit angka.'
    if (!payload.ktp_file) errors.ktp_file = 'Upload KTP wajib diisi.'
    if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.email = 'Format email tidak valid.'
    if (!payload.agency_id) errors.agency_id = 'Kementerian/Lembaga wajib dipilih.'
    if (!payload.category) errors.category = 'Jenis masukan wajib dipilih.'
    if (!payload.message || !payload.message.trim()) errors.message = 'Detail masukan wajib diisi.'
    if (!payload.consent) errors.consent = 'Persetujuan privasi wajib dicentang.'

    if (Object.keys(errors).length > 0) {
      throw errorEnvelope('VALIDATION_ERROR', 'Permintaan belum dapat diproses.', errors)
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const reference = `FB-2026-00${randomSuffix}`
    const ticketNumber = `TKT-${reference}`

    const newRecord = {
      id: reference,
      ticket_number: ticketNumber,
      agency: payload.agency_name || 'Kementerian Terkait',
      service: payload.service_name || 'Layanan Umum PNBP',
      tariff: payload.tariff_name || 'Tarif Terkait',
      category: payload.category,
      date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
      submitter: payload.name,
      nik: payload.nik,
      email: payload.email,
      phone: payload.phone || '-',
      ktp_file: payload.ktp_file?.name || 'KTP.pdf',
      supporting_file: payload.supporting_file?.name || null,
      summary: payload.message,
      status: 'new',
      priority: 'Sedang',
      assignedTo: 'Belum ditugaskan',
    }
    mockFeedbackQueue.unshift(newRecord)

    return successEnvelope({
      ticket_number: ticketNumber,
      reference,
      status: 'new',
      status_label: 'Baru (Menunggu Triage)',
      submitted_at: new Date().toISOString(),
      item: newRecord,
    })
  },

  async getFeedbackStatus(reference) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/public/feedback/${reference}/status`)
      return res.json()
    }
    await delay(150)
    const found = mockFeedbackQueue.find((f) => f.id === reference)
    if (found) {
      return successEnvelope({
        reference: found.id,
        category: found.category,
        status: found.status,
        date: found.date,
      })
    }
    throw errorEnvelope('NOT_FOUND', 'Nomor referensi masukan tidak ditemukan.')
  },

  // Public Questions & Knowledge Search (04-API-SPEC.md Section 5)
  async searchQuestions(query, agencyId = null, serviceId = null) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/public/questions/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query, agency_id: agencyId, service_id: serviceId }),
      })
      return res.json()
    }

    await delay(250)
    const qLower = query.toLowerCase()
    const targetAgency = agencies.find((a) => a.id === agencyId)

    const matches = faqs.filter((faq) => {
      const keywordMatch = faq.keywords.some((kw) => qLower.includes(kw))
      const titleMatch = faq.title.toLowerCase().includes(qLower)
      const answerMatch = faq.answer.toLowerCase().includes(qLower)
      const agencyMatch = !agencyId || faq.agency.toLowerCase().includes(targetAgency?.name.toLowerCase() || '')
      return (keywordMatch || titleMatch || answerMatch) && agencyMatch
    })

    return successEnvelope(matches)
  },

  async submitQuestionTicket(payload) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/public/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return res.json()
    }

    await delay(300)
    if (!payload.question || !payload.question.trim()) {
      throw errorEnvelope('VALIDATION_ERROR', 'Isi pertanyaan wajib diisi.', { question: 'Wajib diisi' })
    }
    if (!payload.consent) {
      throw errorEnvelope('VALIDATION_ERROR', 'Persetujuan privasi wajib dicentang.', { consent: 'Wajib dicentang' })
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const reference = `Q-2026-00${randomSuffix}`

    return successEnvelope({
      reference,
      status: 'new',
      status_label: 'Tiket Diterima',
      submitted_at: new Date().toISOString(),
    })
  },

  // Authentication (04-API-SPEC.md Section 6)
  async login(email, password, role = 'Internal Editor') {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      return res.json()
    }

    await delay(300)
    if (!email || !password) {
      throw errorEnvelope('INVALID_CREDENTIALS', 'Email/User ID dan kata sandi wajib diisi.')
    }

    const matched = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
      id: 'usr_custom',
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role: role || 'Internal Editor',
      agency: 'Staf Ahli Menkeu Bidang PNBP',
      avatarInitials: email.substring(0, 2).toUpperCase(),
    }

    return successEnvelope({
      user: matched,
      token: 'mock_bearer_token_' + Math.random().toString(36).substring(2),
    })
  },

  // Dashboard (04-API-SPEC.md Section 7)
  async getDashboardSummary(period = 2026) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/dashboard/summary?period=${period}`)
      return res.json()
    }

    await delay(200)
    return successEnvelope({
      kpi: dashboardKpis,
      programs,
      priority_items: priorityItems,
      milestones,
      public_queue: {
        feedback: mockFeedbackQueue,
        questions: mockQuestionsQueue,
      },
      recent_activity: activity,
    })
  },

  // Internal Task & Priority Mutations (04-API-SPEC.md Section 9)
  async createTask(payload) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      return res.json()
    }
    await delay(200)
    const newItem = {
      id: `task_${Date.now()}`,
      type: payload.type || 'Tindak Lanjut',
      category: payload.category || 'Operasional',
      title: payload.title,
      owner: payload.owner,
      dueDate: payload.dueDate || '2026-10-15',
      priority: payload.priority || 'Sedang',
      status: 'Open',
      mitigation: payload.mitigation || 'Ditambahkan via antarmuka internal KA PNBP.',
    }
    return successEnvelope(newItem)
  },

  // Internal Feedback Triage (04-API-SPEC.md Section 10)
  async updateFeedbackTriage(id, updates) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return res.json()
    }
    await delay(200)
    const item = mockFeedbackQueue.find((f) => f.id === id)
    if (item) {
      Object.assign(item, updates)
      return successEnvelope(item)
    }
    throw errorEnvelope('NOT_FOUND', 'Item masukan tidak ditemukan.')
  },

  // Internal Question Triage (04-API-SPEC.md Section 10)
  async answerQuestion(id, updates) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/questions/${id}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return res.json()
    }
    await delay(200)
    const item = mockQuestionsQueue.find((q) => q.id === id)
    if (item) {
      Object.assign(item, updates, { status: 'answered' })
      return successEnvelope(item)
    }
    throw errorEnvelope('NOT_FOUND', 'Tiket pertanyaan tidak ditemukan.')
  },

  // Internal Milestone Update (04-API-SPEC.md Section 8)
  async updateMilestone(id, updates) {
    if (AUTH_MODE === 'live') {
      const res = await fetch(`${API_BASE_URL}/milestones/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      return res.json()
    }
    await delay(200)
    const item = milestones.find((m) => m.id === id)
    if (item) {
      Object.assign(item, updates)
      return successEnvelope(item)
    }
    throw errorEnvelope('NOT_FOUND', 'Milestone tidak ditemukan.')
  },
}
