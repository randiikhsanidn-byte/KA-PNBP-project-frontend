import { Link } from 'react-router-dom'
import Brand from './Brand'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-300 py-6 border-t border-navy-900">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand logo in white box + brief text */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <Brand inverted />
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            KA PNBP Prototype v0.1 — Portal layanan masukan tarif, pencarian pertanyaan tarif, dan monitoring proyek transformasi PNBP.
          </p>
        </div>

        {/* Right: Simple inline links */}
        <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
          <Link to="/dasar-hukum" className="hover:text-white transition">
            Dasar Hukum
          </Link>
          <span className="text-slate-600">•</span>
          <Link to="/masukan-tarif" className="hover:text-white transition">
            Masukan Tarif
          </Link>
          <span className="text-slate-600">•</span>
          <a href="/#tanya-nita" className="hover:text-white transition">
            Pertanyaan
          </a>
          <span className="text-slate-600">•</span>
          <Link to="/login" className="hover:text-white transition">
            Login Internal
          </Link>
        </div>
      </div>
    </footer>
  )
}
