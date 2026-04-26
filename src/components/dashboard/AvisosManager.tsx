'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, AlertCircle, Loader2, X, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Aviso } from '@/types'

const CATEGORIAS = ['General', 'Académico', 'Administrativo', 'Eventos', 'Urgente']

interface Props {
  initialAvisos: Aviso[]
}

const EMPTY_FORM = { titulo: '', contenido: '', categoria: 'General', importante: false, publicado: true }

export default function AvisosManager({ initialAvisos }: Props) {
  const [avisos, setAvisos] = useState<Aviso[]>(initialAvisos)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Aviso | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  function openEdit(aviso: Aviso) {
    setEditing(aviso)
    setForm({
      titulo: aviso.titulo,
      contenido: aviso.contenido,
      categoria: aviso.categoria,
      importante: aviso.importante,
      publicado: aviso.publicado,
    })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError('Título y contenido son requeridos.')
      return
    }
    setLoading(true)
    setError('')
    const supabase = createClient()
    try {
      if (editing) {
        const { data, error: err } = await supabase
          .from('avisos')
          .update({ ...form, updated_at: new Date().toISOString() })
          .eq('id', editing.id)
          .select()
          .single()
        if (err) throw err
        setAvisos(prev => prev.map(a => (a.id === editing.id ? data : a)))
      } else {
        const { data, error: err } = await supabase
          .from('avisos')
          .insert(form)
          .select()
          .single()
        if (err) throw err
        setAvisos(prev => [data, ...prev])
      }
      setShowForm(false)
    } catch {
      setError('Error al guardar el aviso.')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(aviso: Aviso) {
    const supabase = createClient()
    const { data } = await supabase
      .from('avisos')
      .update({ publicado: !aviso.publicado })
      .eq('id', aviso.id)
      .select()
      .single()
    if (data) setAvisos(prev => prev.map(a => (a.id === aviso.id ? data : a)))
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este aviso permanentemente?')) return
    const supabase = createClient()
    await supabase.from('avisos').delete().eq('id', id)
    setAvisos(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div>
      {/* Actions bar */}
      <div className="flex justify-end mb-5">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo Aviso
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900">{editing ? 'Editar Aviso' : 'Nuevo Aviso'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Título *</label>
                <input
                  value={form.titulo}
                  onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Contenido *</label>
                <textarea
                  value={form.contenido}
                  onChange={e => setForm(p => ({ ...p, contenido: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Categoría</label>
                  <select
                    value={form.categoria}
                    onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 bg-white"
                  >
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2 pt-7">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.importante}
                      onChange={e => setForm(p => ({ ...p, importante: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Marcar importante</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.publicado}
                      onChange={e => setForm(p => ({ ...p, publicado: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Publicar ahora</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de avisos */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {avisos.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No hay avisos creados.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Título</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600 hidden md:table-cell">Categoría</th>
                <th className="text-left px-3 py-3 font-semibold text-gray-600 hidden lg:table-cell">Fecha</th>
                <th className="text-center px-3 py-3 font-semibold text-gray-600">Estado</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {avisos.map(aviso => (
                <tr key={aviso.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-gray-800 line-clamp-1">{aviso.titulo}</p>
                    {aviso.importante && (
                      <span className="text-xs text-yellow-700 font-medium">⚠ Importante</span>
                    )}
                  </td>
                  <td className="px-3 py-4 hidden md:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{aviso.categoria}</span>
                  </td>
                  <td className="px-3 py-4 text-gray-500 hidden lg:table-cell">{formatDate(aviso.created_at)}</td>
                  <td className="px-3 py-4 text-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${aviso.publicado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {aviso.publicado ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleToggle(aviso)} title={aviso.publicado ? 'Ocultar' : 'Publicar'} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                        {aviso.publicado ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(aviso)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(aviso.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
