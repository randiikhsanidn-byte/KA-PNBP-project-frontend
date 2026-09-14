import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Brand from '../components/Brand'
import { Field, inputClass } from '../components/Field'
import heroImage from '../assets/Background.png'
import { useAuth } from '../context/AuthContext'
import { mockUsers } from '../data/mock'

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()

  const reason = searchParams.get('reason')
  const [email, setEmail] = useState('budi.santoso@kemenkeu.go.id')
  const [password, setPassword] = useState('kemenkeu2026')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(
    reason === 'session-expired' ? 'Sesi Anda telah berakhir. Silakan login kembali.' : ''
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email / User ID dan kata sandi wajib diisi.')
      return
    }

    setLoading(true)

    try {
      const matched = mockUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      const role = matched ? matched.role : 'Internal Editor'
      await login(email, password, role)
      navigate('/dashboard')
    } catch (err) {
      setErrorMessage(err.message || 'Kredensial tidak valid. Silakan periksa kembali.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-navy-950">
      {/* Background Image from Landing Page */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          src={heroImage}
          alt="Lanskap perkeretaapian Indonesia"
          className="h-full w-full object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-navy-950/65 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/40" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Brand />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 transition hover:text-navy-950 focus:outline-none"
          >
            ← Kembali
          </Link>
        </div>
      </header>

      {/* Centered Login Box */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/25 bg-white/95 p-7 shadow-soft backdrop-blur-md sm:p-9">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
                Login
              </h1>
            </div>

            {errorMessage ? (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700" role="alert">
                {errorMessage}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Email / User ID" required>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@kemenkeu.go.id"
                  className={inputClass}
                  required
                  autoComplete="username"
                />
              </Field>

              <Field label="Kata Sandi" required>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={inputClass}
                  required
                  autoComplete="current-password"
                />
              </Field>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-6 text-sm font-extrabold text-white transition hover:bg-navy-900 disabled:opacity-60 focus:outline-none focus-visible:ring-4 focus-visible:ring-navy-700/20 shadow-md"
              >
                {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
                <ArrowIcon />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}


