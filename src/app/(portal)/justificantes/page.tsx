'use client'

import { useState } from 'react'
import { FileText, Upload, CheckCircle, AlertCircle, Loader2, Search } from 'lucide-react'
import { curpIsValid } from '@/lib/utils'

type Step = 'form' | 'success'

export default function JustificantesPage() {
  const [step, setStep] = useState<Step>('form')
  const [folio, setFolio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [folioConsulta, setFolioConsulta] = useState('')
  const [estadoConsulta, setEstadoConsulta] = useState<{ estado: string; folio: string } | null>(null)
  const [loadingConsulta, setLoadingConsulta] = useState(false)

  const [form, setForm] = useState({
    curp: '',
    nombre_padre: '',
    telefono: '',
    fecha_inicio: '',
    fecha_fin: '',
    motivo: '',
    archivo: null as File | null,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setForm(prev => ({ ...prev, archivo: file }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!curpIsValid(form.curp)) {
      setError('El CURP no tiene un formato válido.')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null) fd.append(k, v instanceof File ? v : String(v))
      })

      const res = await fetch('/api/justificantes', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al enviar')
      setFolio(data.folio)
      setStep('success')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  async function handleConsulta(e: React.FormEvent) {
    e.preventDefault()
    setEstadoConsulta(null)
    setLoadingConsulta(true)
    try {
      const res = await fetch(`/api/justificantes?folio=${folioConsulta.trim()}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setEstadoConsulta(data)
    } catch {
      setEstadoConsulta(null)
      setError('No se encontró ningún justificante con ese folio.')
    } finally {
      setLoadingConsulta(false)
    }
  }

  const ESTADO_STYLES: Record<string, string> = {
    'En revisión': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Aprobado': 'bg-green-100 text-green-800 border-green-300',
    'Rechazado': 'bg-red-100 text-red-800 border-red-300',
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-5" />
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">¡Solicitud Enviada!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Tu solicitud de justificante ha sido recibida. Puedes darle seguimiento con tu número de folio.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-green-600 font-semibold mb-1">Número de Folio</p>
            <p className="text-2xl font-black text-green-800 font-mono tracking-wider">{folio}</p>
          </div>
          <p className="text-xs text-gray-400 mb-6">
            Guarda este folio. Lo necesitarás para consultar el estado de tu solicitud.
          </p>
          <button
            onClick={() => { setStep('form'); setForm({ curp:'',nombre_padre:'',telefono:'',fecha_inicio:'',fecha_fin:'',motivo:'',archivo:null }) }}
            className="text-green-700 font-semibold text-sm hover:underline"
          >
            Enviar otra solicitud
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-7 h-7 text-blue-700" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Justificantes de Inasistencia</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Completa el formulario y adjunta la receta médica o documento de justificación.
          </p>
        </div>

        {/* Consulta de estado */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
          <h2 className="font-bold text-gray-800 mb-3 text-sm">Consultar estado de solicitud</h2>
          <form onSubmit={handleConsulta} className="flex gap-2">
            <input
              value={folioConsulta}
              onChange={e => setFolioConsulta(e.target.value.toUpperCase())}
              placeholder="JUS-202412-0001"
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm font-mono outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loadingConsulta || !folioConsulta.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {loadingConsulta ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Consultar
            </button>
          </form>
          {estadoConsulta && (
            <div className={`mt-3 px-4 py-3 rounded-xl border text-sm font-semibold ${ESTADO_STYLES[estadoConsulta.estado] ?? ''}`}>
              Folio <span className="font-mono">{estadoConsulta.folio}</span>: {estadoConsulta.estado}
            </div>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <h2 className="font-bold text-gray-800">Nueva solicitud de justificante</h2>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">CURP del Alumno *</label>
              <input
                name="curp"
                value={form.curp}
                onChange={handleChange}
                placeholder="XXXX000000XXXXXXXX"
                maxLength={18}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-mono uppercase tracking-widest outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del Padre/Tutor *</label>
              <input
                name="nombre_padre"
                value={form.nombre_padre}
                onChange={handleChange}
                placeholder="Nombre completo"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teléfono de Contacto</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="(777) 000-0000"
                type="tel"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-all"
              />
            </div>

            <div />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha de inicio de inasistencia *</label>
              <input
                name="fecha_inicio"
                type="date"
                value={form.fecha_inicio}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Fecha de regreso *</label>
              <input
                name="fecha_fin"
                type="date"
                value={form.fecha_fin}
                onChange={handleChange}
                required
                min={form.fecha_inicio}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Motivo de la inasistencia *</label>
              <textarea
                name="motivo"
                value={form.motivo}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Describe el motivo de la inasistencia..."
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Documento de justificación (receta, carta, etc.)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {form.archivo ? form.archivo.name : 'Haz clic o arrastra tu archivo aquí'}
                </span>
                <span className="text-xs text-gray-400 mt-1">JPG, PNG, PDF — máx. 5 MB</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  )
}
