'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Plus, Trash2, X, Loader2 } from 'lucide-react'

interface Evento {
  id: string
  titulo: string
  descripcion?: string
  fecha_inicio: string
  fecha_fin: string
  tipo: string
  color: string
}

const TIPOS = [
  { label: 'Suspension',      display: 'Suspensión',     color: '#dc2626' },
  { label: 'Consejo Tecnico', display: 'CTE',            color: '#2563eb' },
  { label: 'Festivo',         display: 'Festivo',        color: '#ea580c' },
  { label: 'Evento',          display: 'Evento',         color: '#15803d' },
  { label: 'Entrega Boletas', display: 'Entrega Boletas', color: '#7c3aed' },
]

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DIAS  = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom']

function diasEnMes(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}
function primerDia(year: number, month: number) {
  const d = new Date(year, month - 1, 1).getDay()
  return d === 0 ? 7 : d // 1=Lun … 7=Dom
}
function padDate(n: number) { return String(n).padStart(2, '0') }

export default function CalendarioAdmin() {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal]   = useState<{ date: string; eventos: Evento[] } | null>(null)
  const [form, setForm]     = useState({ titulo: '', descripcion: '', tipo: 'Evento' as string, multiDay: false, fecha_fin: '' })
  const [saving, setSaving] = useState(false)

  const fetchEventos = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/eventos?year=${year}&month=${month}`)
    const data = await res.json()
    setEventos(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [year, month])

  useEffect(() => { fetchEventos() }, [fetchEventos])

  function navMonth(dir: 1 | -1) {
    let m = month + dir
    let y = year
    if (m < 1) { m = 12; y-- }
    if (m > 12) { m = 1; y++ }
    setMonth(m); setYear(y)
  }

  function openDay(day: number) {
    const date = `${year}-${padDate(month)}-${padDate(day)}`
    const ev = eventos.filter(e => e.fecha_inicio <= date && e.fecha_fin >= date)
    setForm({ titulo: '', descripcion: '', tipo: 'Evento', multiDay: false, fecha_fin: date })
    setModal({ date, eventos: ev })
  }

  async function guardar() {
    if (!form.titulo.trim() || !modal) return
    setSaving(true)
    const color = TIPOS.find(t => t.label === form.tipo || t.display === form.tipo)?.color ?? '#15803d'
    await fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: form.titulo,
        descripcion: form.descripcion || undefined,
        fecha_inicio: modal.date,
        fecha_fin: form.multiDay ? form.fecha_fin : modal.date,
        tipo: form.tipo,
        color,
      }),
    })
    setModal(null)
    setSaving(false)
    fetchEventos()
  }

  async function eliminar(id: string) {
    await fetch(`/api/eventos/${id}`, { method: 'DELETE' })
    fetchEventos()
    setModal(null)
  }

  // Build calendar grid
  const totalDias = diasEnMes(year, month)
  const startDow  = primerDia(year, month) // 1=Lun
  const cells: (number | null)[] = [
    ...Array(startDow - 1).fill(null),
    ...Array.from({ length: totalDias }, (_, i) => i + 1),
  ]
  const rows = Math.ceil(cells.length / 7)
  while (cells.length < rows * 7) cells.push(null)

  const todayStr = `${now.getFullYear()}-${padDate(now.getMonth()+1)}-${padDate(now.getDate())}`

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Nav */}
      <div className="flex items-center justify-between px-6 py-4 bg-green-800 text-white">
        <button onClick={() => navMonth(-1)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-bold text-lg tracking-wide">{MESES[month - 1]} {year}</h3>
        <button onClick={() => navMonth(1)} className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DIAS.map(d => (
          <div key={d} className="text-center text-xs font-bold text-gray-500 uppercase py-2 tracking-widest">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Cargando…
        </div>
      ) : (
        <div className="grid grid-cols-7 divide-x divide-gray-100">
          {cells.map((day, idx) => {
            if (!day) return (
              <div key={`e-${idx}`} className="min-h-[100px] bg-gray-50/50 border-b border-gray-100" />
            )
            const dateStr = `${year}-${padDate(month)}-${padDate(day)}`
            const evDay = eventos.filter(e => e.fecha_inicio <= dateStr && e.fecha_fin >= dateStr)
            const isToday = dateStr === todayStr
            const isSat = (startDow - 1 + day - 1) % 7 === 5
            const isSun = (startDow - 1 + day - 1) % 7 === 6

            return (
              <div
                key={day}
                onClick={() => openDay(day)}
                className={`min-h-[100px] border-b border-gray-100 p-1.5 cursor-pointer group transition-colors
                  ${isToday ? 'bg-green-50' : isSat || isSun ? 'bg-gray-50/60' : 'hover:bg-gray-50'}`}
              >
                <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold mb-1
                  ${isToday ? 'bg-green-700 text-white' : isSat || isSun ? 'text-gray-400' : 'text-gray-700'}`}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {evDay.slice(0, 3).map(ev => (
                    <div
                      key={ev.id}
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded truncate text-white leading-tight"
                      style={{ backgroundColor: ev.color }}
                    >
                      {ev.titulo}
                    </div>
                  ))}
                  {evDay.length > 3 && (
                    <div className="text-[10px] text-gray-400 pl-1">+{evDay.length - 3} más</div>
                  )}
                </div>
                <div className="hidden group-hover:flex items-center gap-0.5 mt-1">
                  <Plus className="w-3 h-3 text-green-600" />
                  <span className="text-[10px] text-green-600 font-semibold">Añadir</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 px-6 py-3 border-t border-gray-100 bg-gray-50">
        {TIPOS.map(t => (
          <div key={t.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.color }} />
            <span className="text-xs text-gray-600">{t.display}</span>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            {/* Header modal */}
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">
                {new Date(modal.date + 'T12:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h4>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Eventos existentes */}
            {modal.eventos.length > 0 && (
              <div className="mb-5 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Eventos del día</p>
                {modal.eventos.map(ev => (
                  <div key={ev.id} className="flex items-center justify-between rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: ev.color + '18' }}>
                    <div>
                      <span className="font-semibold" style={{ color: ev.color }}>{ev.titulo}</span>
                      <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 rounded">{ev.tipo}</span>
                      {ev.descripcion && <p className="text-xs text-gray-500 mt-0.5">{ev.descripcion}</p>}
                    </div>
                    <button
                      onClick={() => eliminar(ev.id)}
                      className="p-1 rounded hover:bg-red-50 text-red-400 ml-2 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Formulario nuevo evento */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Nuevo evento</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Título del evento *"
                value={form.titulo}
                onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
              />
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 bg-white"
              >
                {TIPOS.map(t => <option key={t.label} value={t.label}>{t.display}</option>)}
              </select>
              <textarea
                placeholder="Descripción (opcional)"
                value={form.descripcion}
                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                rows={2}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 resize-none"
              />
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.multiDay}
                  onChange={e => setForm(f => ({ ...f, multiDay: e.target.checked }))}
                  className="rounded"
                />
                Evento de varios días
              </label>
              {form.multiDay && (
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Fecha fin</label>
                  <input
                    type="date"
                    value={form.fecha_fin}
                    min={modal.date}
                    onChange={e => setForm(f => ({ ...f, fecha_fin: e.target.value }))}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
                  />
                </div>
              )}
              <button
                onClick={guardar}
                disabled={saving || !form.titulo.trim()}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Guardar evento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
