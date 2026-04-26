'use client'

import { useState } from 'react'
import { Inbox, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

const CATEGORIAS = ['Propuesta', 'Queja', 'Sugerencia', 'Agradecimiento', 'Otro']

export default function BuzonPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    categoria: 'Propuesta',
    mensaje: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.mensaje.trim().length < 10) {
      setError('El mensaje debe tener al menos 10 caracteres.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/avisos/buzon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('Error al enviar el mensaje. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">¡Mensaje Enviado!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Gracias por comunicarte con nosotros. La administración revisará tu mensaje a la brevedad.
          </p>
          <button
            onClick={() => { setSent(false); setForm({ nombre: '', telefono: '', categoria: 'Propuesta', mensaje: '' }) }}
            className="text-green-700 font-semibold text-sm hover:underline"
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-7 h-7 text-purple-700" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Buzón de Propuestas</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Envía tus comentarios, propuestas o quejas directamente a la administración de la escuela.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nombre (opcional)
              </label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="(777) 000-0000"
                type="tel"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoría *</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 transition-all bg-white"
              >
                {CATEGORIAS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mensaje *</label>
              <textarea
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Escribe aquí tu propuesta, queja o comentario..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">{form.mensaje.length} caracteres</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Enviar Mensaje
          </button>
        </form>
      </div>
    </div>
  )
}
