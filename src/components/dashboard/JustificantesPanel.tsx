'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Eye, ExternalLink, Loader2, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate, getEstadoBadgeColor } from '@/lib/utils'
import type { Justificante, EstadoJustificante } from '@/types'

interface Props {
  initialData: (Justificante & { alumnos?: { nombre: string; apellido_paterno: string; apellido_materno?: string; grupo: string; grado: string } })[]
}

type FiltroEstado = 'Todos' | EstadoJustificante

export default function JustificantesPanel({ initialData }: Props) {
  const [justificantes, setJustificantes] = useState(initialData)
  const [filtro, setFiltro] = useState<FiltroEstado>('Todos')
  const [selected, setSelected] = useState<typeof initialData[0] | null>(null)
  const [observaciones, setObservaciones] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const filtered = filtro === 'Todos'
    ? justificantes
    : justificantes.filter(j => j.estado === filtro)

  async function updateEstado(id: string, estado: EstadoJustificante) {
    setLoadingId(id)
    const supabase = createClient()
    const { data } = await supabase
      .from('justificantes')
      .update({
        estado,
        observaciones: observaciones || null,
        revisado_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    if (data) {
      setJustificantes(prev => prev.map(j => (j.id === id ? { ...j, ...data } : j)))
    }
    setSelected(null)
    setObservaciones('')
    setLoadingId(null)
  }

  const ESTADOS: FiltroEstado[] = ['Todos', 'En revisión', 'Aprobado', 'Rechazado']
  const counts = {
    'En revisión': justificantes.filter(j => j.estado === 'En revisión').length,
    Aprobado: justificantes.filter(j => j.estado === 'Aprobado').length,
    Rechazado: justificantes.filter(j => j.estado === 'Rechazado').length,
  }

  return (
    <div>
      {/* Stats pills */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-xl px-4 py-2 text-sm font-semibold">
          {counts['En revisión']} pendientes
        </div>
        <div className="bg-green-100 text-green-800 border border-green-200 rounded-xl px-4 py-2 text-sm font-semibold">
          {counts['Aprobado']} aprobados
        </div>
        <div className="bg-red-100 text-red-800 border border-red-200 rounded-xl px-4 py-2 text-sm font-semibold">
          {counts['Rechazado']} rechazados
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        {ESTADOS.map(e => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${filtro === e ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No hay solicitudes en esta categoría.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Folio</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600">Alumno</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600 hidden md:table-cell">Fechas</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Estado</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(j => {
                const alumno = j.alumnos
                return (
                  <tr key={j.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-mono text-xs text-gray-700 font-semibold">{j.folio}</td>
                    <td className="px-3 py-4">
                      {alumno ? (
                        <>
                          <p className="font-semibold text-gray-800">
                            {alumno.nombre} {alumno.apellido_paterno}
                          </p>
                          <p className="text-xs text-gray-500">{alumno.grado} — Grupo {alumno.grupo}</p>
                        </>
                      ) : (
                        <p className="text-gray-400 text-xs">Alumno no encontrado</p>
                      )}
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <p className="text-gray-600 text-xs">{formatDate(j.fecha_inicio)}</p>
                      <p className="text-gray-400 text-xs">al {formatDate(j.fecha_fin)}</p>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getEstadoBadgeColor(j.estado)}`}>
                        {j.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelected(j); setObservaciones(j.observaciones ?? '') }}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {j.estado === 'En revisión' && (
                          <>
                            <button
                              onClick={() => updateEstado(j.id, 'Aprobado')}
                              disabled={loadingId === j.id}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 disabled:opacity-40"
                              title="Aprobar"
                            >
                              {loadingId === j.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => updateEstado(j.id, 'Rechazado')}
                              disabled={loadingId === j.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 disabled:opacity-40"
                              title="Rechazar"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-black text-gray-900">{selected.folio}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getEstadoBadgeColor(selected.estado)}`}>
                  {selected.estado}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 text-lg font-bold">×</button>
            </div>

            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Alumno</dt>
                <dd className="font-semibold text-gray-800">
                  {selected.alumnos?.nombre} {selected.alumnos?.apellido_paterno} {selected.alumnos?.apellido_materno}
                  {' '}&mdash; {selected.alumnos?.grado} Grupo {selected.alumnos?.grupo}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Padre/Tutor</dt>
                <dd className="text-gray-700">{selected.nombre_padre} {selected.telefono && `· ${selected.telefono}`}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Período de inasistencia</dt>
                <dd className="text-gray-700">{formatDate(selected.fecha_inicio)} → {formatDate(selected.fecha_fin)}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Motivo</dt>
                <dd className="text-gray-700 leading-relaxed">{selected.motivo}</dd>
              </div>
              {selected.archivo_url && (
                <div>
                  <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Documento adjunto</dt>
                  <dd>
                    <a
                      href={selected.archivo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 font-semibold hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {selected.archivo_nombre ?? 'Ver documento'}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            {selected.estado === 'En revisión' && (
              <div className="mt-5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Observaciones (opcional)
                </label>
                <textarea
                  value={observaciones}
                  onChange={e => setObservaciones(e.target.value)}
                  rows={3}
                  placeholder="Razón del rechazo o comentarios para el padre..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 resize-none"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => updateEstado(selected.id, 'Rechazado')}
                    disabled={!!loadingId}
                    className="flex-1 flex items-center justify-center gap-1.5 border border-red-300 text-red-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    <XCircle className="w-4 h-4" /> Rechazar
                  </button>
                  <button
                    onClick={() => updateEstado(selected.id, 'Aprobado')}
                    disabled={!!loadingId}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                  >
                    {loadingId ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Aprobar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
