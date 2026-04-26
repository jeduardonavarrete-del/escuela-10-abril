'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError || !data.user) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
      return
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('rol')
      .eq('user_id', data.user.id)
      .single()

    const rol = roleData?.rol
    if (rol === 'admin') {
      router.push('/admin')
    } else if (rol === 'trabajo_social') {
      router.push('/trabajo-social/justificantes')
    } else {
      setError('No tienes permisos para acceder al panel.')
      await supabase.auth.signOut()
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Acceso Administrativo</h1>
          <p className="text-green-200 text-sm mt-1">ESF "10 de Abril" · Panel de Control</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Correo institucional</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@escuela.edu.mx"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {loading ? 'Ingresando...' : 'Ingresar al Panel'}
          </button>

          <p className="text-center text-xs text-gray-400 pt-2">
            ¿Problemas para acceder? Contacta al administrador del sistema.
          </p>
        </form>

        <p className="text-center text-green-300 text-xs mt-6">
          <a href="/" className="hover:text-white transition-colors">← Regresar al portal público</a>
        </p>
      </div>
    </div>
  )
}
