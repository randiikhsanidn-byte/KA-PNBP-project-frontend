# API SPEC — KA PNBP

**Status:** SOT v0.1  
**Style:** REST JSON, prefix `/api/v1`.  
**Auth internal:** Bearer/session token sesuai identity provider. Endpoint publik ditandai `PUBLIC`.

## 1. Envelope & Error
### Success
```json
{ "data": {}, "meta": { "request_id": "req_..." } }
```

### Error
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Permintaan belum dapat diproses.",
    "fields": { "service_id": "Wajib diisi" },
    "request_id": "req_..."
  }
}
```

## 2. Common Query
- pagination: `page`, `page_size` (default 20, max 100)
- search: `q`
- sorting: `sort=field,-field`
- filter spesifik resource: `status`, `owner_id`, `agency_id`, `period_from`, `period_to`

## 3. Public Reference Data
| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/agencies` | PUBLIC | daftar K/L |
| GET | `/services?agency_id=` | PUBLIC | layanan per K/L |
| GET | `/tariffs?service_id=&q=` | PUBLIC | tarif/referensi layanan |
| GET | `/faq?q=&agency_id=&service_id=` | PUBLIC | knowledge/FAQ tarif |

## 4. Public Feedback
### POST `/public/feedback` — PUBLIC
```json
{
  "name": "Budi Santoso",
  "nik": "3201234567890001",
  "ktp_file": { "name": "ktp_budi.jpg", "size": 102400 },
  "email": "budi.santoso@example.com",
  "phone": "081234567890",
  "agency_id": "agy_1",
  "service_id": "svc_1",
  "tariff_id": "trf_1",
  "category": "tarif",
  "message": "...",
  "supporting_file": { "name": "data_dukung.pdf", "size": 204800 },
  "consent": true
}
```
**201**
```json
{ "data": { "ticket_number": "TKT-FB-2026-000123", "reference": "FB-2026-000123", "status": "new" } }
```

### GET `/public/feedback/{reference}/status` — PUBLIC + verification rule
Return status yang aman untuk publik; jangan expose catatan internal.

## 5. Public Questions
### POST `/public/questions/search` — PUBLIC
Input: `question`, optional `agency_id`, `service_id`.  
Output: `matches[]` berisi `title`, `answer`, `source_label`, `source_url/metadata`, `confidence_band` bila dipakai.

### POST `/public/questions` — PUBLIC
Membuat tiket pertanyaan bila hasil knowledge belum memadai.

**201:** `reference`, `status=new`.

## 6. Authentication
| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/login` | local/mock fallback; production diarahkan ke SSO |
| POST | `/auth/logout` | akhiri session |
| GET | `/auth/me` | user + role + permission |
| POST | `/auth/refresh` | bila token flow membutuhkan refresh |

## 7. Dashboard
### GET `/dashboard/summary?period=2026`
Return:
```json
{
  "data": {
    "kpi": {
      "active_programs": 8,
      "milestone_completion_pct": 68,
      "open_issues": 12,
      "overdue_tasks": 5,
      "new_feedback": 34,
      "new_questions": 19
    },
    "program_progress": [],
    "priority_items": [],
    "public_queue": {},
    "recent_activity": []
  }
}
```

## 8. Programs / WBS / Milestones
| Method | Path | Notes |
|---|---|---|
| GET | `/programs` | list/filter |
| POST | `/programs` | Editor+ |
| GET | `/programs/{id}` | detail |
| PATCH | `/programs/{id}` | Editor+ |
| GET | `/programs/{id}/workstreams` | list |
| POST | `/programs/{id}/workstreams` | Editor+ |
| PATCH | `/workstreams/{id}` | Editor+ |
| GET | `/workstreams/{id}/milestones` | list |
| POST | `/workstreams/{id}/milestones` | Editor+ |
| PATCH | `/milestones/{id}` | Editor+; audit required |

Minimal milestone payload:
```json
{
  "title": "...",
  "owner_id": "usr_1",
  "target_date": "2026-10-31",
  "status": "in_progress",
  "progress_pct": 60,
  "evidence_url": "optional",
  "note": "optional"
}
```

## 9. Tasks / Issues & Risks
| Method | Path |
|---|---|
| GET/POST | `/tasks` |
| GET/PATCH | `/tasks/{id}` |
| GET/POST | `/issues-risks` |
| GET/PATCH | `/issues-risks/{id}` |

Issue/risk minimum: `type`, `title`, `program_id`, `owner_id`, `impact`, `probability`, `mitigation`, `due_date`, `status`.

## 10. Internal Public Queue
| Method | Path | Purpose |
|---|---|---|
| GET | `/feedback` | queue internal |
| GET | `/feedback/{id}` | detail internal |
| PATCH | `/feedback/{id}` | classify/assign/status |
| POST | `/feedback/{id}/responses` | kirim respons |
| GET | `/questions` | queue pertanyaan |
| GET | `/questions/{id}` | detail |
| PATCH | `/questions/{id}` | classify/assign/status |
| POST | `/questions/{id}/responses` | jawab |

## 11. Attachments
1. `POST /attachments/presign` atau upload endpoint terkontrol.
2. Validasi ekstensi, MIME, ukuran, malware scan pada backend/storage layer.
3. Attachment internal/private tidak boleh mendapat public URL permanen.

## 12. Audit & Admin
| Method | Path | Role |
|---|---|---|
| GET | `/audit-logs` | Admin/auditor |
| GET/POST/PATCH | `/admin/agencies` | Admin |
| GET/POST/PATCH | `/admin/services` | Admin |
| GET/POST/PATCH | `/admin/tariffs` | Admin |
| GET/POST/PATCH | `/admin/users` | Admin |

## 13. Security Contract
- Public POST wajib rate limit + anti-bot strategy.
- Semua write internal memerlukan permission check server-side.
- PII tidak ditaruh di log aplikasi.
- Error eksternal tidak membocorkan stack trace.
- Semua mutation penting menghasilkan `AuditLog`.
- Gunakan idempotency key untuk operasi submit publik bila diperlukan.
