'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SITE_PASSWORD = 'golfisfun'
const ADMIN_PASSWORD = 'WBI26'
const AUTH_KEY = 'wheelbarrow_auth'
const ADMIN_KEY = 'wheelbarrow_admin'

interface AuthContextValue {
  isAuthenticated: boolean
  isAdmin: boolean
  login: (password: string) => boolean
  loginAdmin: (password: string) => boolean
  logout: () => void
  logoutAdmin: () => void
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isAdmin: false,
  login: () => false,
  loginAdmin: () => false,
  logout: () => {},
  logoutAdmin: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem(AUTH_KEY) === 'true')
    setIsAdmin(localStorage.getItem(ADMIN_KEY) === 'true')
    setMounted(true)
  }, [])

  const login = useCallback((password: string): boolean => {
    if (password === SITE_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true')
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  const loginAdmin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(ADMIN_KEY)
    setIsAuthenticated(false)
    setIsAdmin(false)
  }, [])

  const logoutAdmin = useCallback(() => {
    localStorage.removeItem(ADMIN_KEY)
    setIsAdmin(false)
  }, [])

  if (!mounted) return null

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, loginAdmin, logout, logoutAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
