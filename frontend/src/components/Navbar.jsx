import { useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from './Brand'

export default function Navbar({ onOpenStatusModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <Brand />
          </div>

          {/* Clean 3 Menus exactly like Photo 2 */}
          <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi publik">
            <Link
              to="/masukan-tarif"
              className="text-sm font-semibold text-slate-600 transition hover:text-navy-950 focus:outline-none focus-visible:text-navy-950"
            >
              Masukan Tarif
            </Link>
            <a
              href="/#tanya-nita"
              className="text-sm font-semibold text-slate-600 transition hover:text-navy-950 focus:outline-none focus-visible:text-navy-950"
            >
              Pertanyaan Tarif
            </a>
            {onOpenStatusModal && (
              <button
                type="button"
                onClick={onOpenStatusModal}
                className="text-sm font-semibold text-slate-600 transition hover:text-navy-950 focus:outline-none focus-visible:text-navy-950"
              >
                Lacak Status
              </button>
            )}
          </nav>
        </div>

        {/* Right Action: Clean "Login ->" Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy-950 px-5 text-sm font-bold text-white transition hover:bg-navy-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-navy-700/20 shadow-xs"
          >
            <span>Login</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
            aria-label="Buka menu navigasi"
            aria-expanded={mobileMenuOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 md:hidden shadow-lg animate-in fade-in duration-150">
          <div className="flex flex-col space-y-3">
            <Link
              to="/masukan-tarif"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              Masukan Tarif
            </Link>
            <a
              href="/#tanya-nita"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              Pertanyaan Tarif
            </a>
            {onOpenStatusModal && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenStatusModal()
                }}
                className="text-left rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Lacak Status
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
