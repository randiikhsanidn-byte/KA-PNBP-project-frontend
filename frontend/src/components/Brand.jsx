import { Link } from 'react-router-dom'
import logoImg from '../assets/logo.png'

export default function Brand({ inverted = false, className = '' }) {
  if (inverted) {
    return (
      <Link
        to="/"
        className={`inline-flex items-center rounded-lg bg-white px-2 py-1 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${className}`}
        aria-label="KA PNBP Beranda"
      >
        <img
          src={logoImg}
          alt="KA PNBP"
          className="h-8 w-auto object-contain"
        />
      </Link>
    )
  }

  return (
    <Link
      to="/"
      className={`inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${className}`}
      aria-label="KA PNBP Beranda"
    >
      <img
        src={logoImg}
        alt="KA PNBP"
        className="h-10 w-auto object-contain"
      />
    </Link>
  )
}
