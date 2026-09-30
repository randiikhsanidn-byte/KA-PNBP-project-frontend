import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DasarHukumPage from './pages/DasarHukumPage'
import MasukanTarifPage from './pages/MasukanTarifPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { AuthProvider, useAuth } from './context/AuthContext'

function ProtectedDashboard() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login?reason=auth-required" replace />
  }
  return <DashboardPage />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dasar-hukum" element={<DasarHukumPage />} />
        <Route path="/masukan-tarif" element={<MasukanTarifPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
