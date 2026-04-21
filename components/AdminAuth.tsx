'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export default function AdminAuth() {
  const { isAdmin, loginAdmin, logoutAdmin } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = loginAdmin(password)
    if (ok) {
      setOpen(false)
      setPassword('')
    } else {
      setError(true)
      setPassword('')
    }
  }

  return null
}
