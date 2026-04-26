'use client'

import { useState } from 'react'
import { Search, FileDown, AlertCircle, Loader2, BookOpen } from 'lucide-react'
import { curpIsValid, getCalificacionColor } from '@/lib/utils'
import type { BolетaAlumno } from '@/types'

export default function BoletasPage() {
  const [curp, setCurp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alumno, setAlumno] = useState<BolетaAlumno | null>(null)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const curpUpper = curp.trim().toUpperCase()
    if (!curpIsValid(curpUpper)) {
      setError('El formato del CURP no es válido. Verifica que sean 18 caracteres.')
      return
    }
    setError('')
    setAlumno(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/boletas?curp=${curpUpper}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'No encontrado')
      setAlumno(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No se encontró ningún alumno con ese CURP.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDownloadPDF() {
    if (!alumno) return
    setGeneratingPdf(true)
    try {
      const { generarBoletaPDF } = await import('@/lib/pdf/generarBoleta')
      generarBoletaPDF(alumno)
    } finally {
      setGeneratingPdf(false)
    }
  }

  const TRIMESTRES = ['1', '2', '3'] as const

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-green-700" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Consulta de Boleta</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
            Ingresa el CURP del alumno para consultar y descargar su boleta de calificaciones.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6"
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CURP del Alumno
          </label>
          <div className="flex gap-3">
            <input
              value={curp}
              onChange={e => setCurp(e.target.value.toUpperCase())}
              placeholder="XXXX000000XXXXXXXX"
              maxLength={18}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono uppercase tracking-widest outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
            />
            <button
              type="submit"
              disabled={loading || curp.length < 18}
              className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Buscar
            </button>
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </form>

        {/* Resultado */}
        {alumno && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Encabezado alumno */}
            <div className="bg-gradient-to-r from-green-700 to-green-800 p-6 text-white">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="text-green-200 text-xs font-semibold uppercase tracking-wide mb-1">Alumno</p>
                  <h2 className="text-xl font-bold">
                    {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}
                  </h2>
                  <p className="text-green-200 text-sm mt-1">
                    {alumno.grado} — Grupo {alumno.grupo} | Turno {alumno.turno}
                  </p>
                  <p className="text-green-300 text-xs mt-1 font-mono">{alumno.curp}</p>
                </div>
                <button
                  onClick={handleDownloadPDF}
                  disabled={generatingPdf}
                  className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                >
                  {generatingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileDown className="w-4 h-4" />
                  )}
                  Descargar PDF
                </button>
              </div>
            </div>

            {/* Calificaciones */}
            <div className="p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-700">Materia</th>
                    {TRIMESTRES.map(t => (
                      <th key={t} className="text-center py-3 px-2 font-semibold text-gray-700 w-24">
                        Trimestre {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const materias = [...new Map(
                      alumno.calificaciones.map(c => [c.materia_id, c.materias])
                    ).values()].sort((a, b) => (a?.orden ?? 0) - (b?.orden ?? 0))

                    return materias.map(materia => {
                      if (!materia) return null
                      return (
                        <tr key={materia.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 pr-4 font-medium text-gray-800">{materia.nombre}</td>
                          {TRIMESTRES.map(t => {
                            const cal = alumno.calificaciones.find(
                              c => c.materia_id === materia.id && c.trimestre === t
                            )
                            return (
                              <td key={t} className={`text-center py-3 px-2 font-semibold ${getCalificacionColor(cal?.calificacion ?? null)}`}>
                                {cal?.calificacion ?? '—'}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })
                  })()}
                </tbody>
              </table>
            </div>

            <div className="px-6 pb-4 text-xs text-gray-400">
              Calificaciones del Ciclo Escolar 2024–2025 · ESF "10 de Abril"
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
