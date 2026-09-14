import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ka_pnbp_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('ka_pnbp_session', JSON.stringify(user))
      } else {
        localStorage.removeItem('ka_pnbp_session')
      }
    } catch {
      // ignore storage errors
    }
  }, [user])

  const login = async (email, password = 'password', role = 'Internal Editor') => {
    const res = await api.login(email, password, role)
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
