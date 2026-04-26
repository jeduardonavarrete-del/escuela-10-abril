import { createClient } from '@/lib/supabase/server'
import { CalendarDays } from 'lucide-react'
import type { EventoCalendario } from '@/types'
import { formatDate } from '@/lib/utils'

const TIPO_COLORS: Record<string, string> = {
  Suspension:        'bg-red-100 text-red-700 border-red-200',
  'Consejo Tecnico': 'bg-purple-100 text-purple-700 border-purple-200',
  'Entrega Boletas': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Evento:            'bg-blue-100 text-blue-700 border-blue-200',
  Festivo:           'bg-orange-100 text-orange-700 border-orange-200',
  Examen:            'bg-rose-100 text-rose-700 border-rose-200',
}

export const revalidate = 60

async function getEventos(): Promise<EventoCalendario[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('eventos_calendario')
    .select('*')
    .gte('fecha_inicio', '2024-08-01')
    .order('fecha_inicio', { ascending: true })
  return data ?? []
}

export default async function CalendarioPage() {
  const eventos = await getEventos()

  const meses = [...new Set(
    eventos.map(e => {
      const d = new Date(e.fecha_inicio + 'T00:00:00')
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
  )]

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="w-7 h-7 text-green-700" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Calendario Escolar 2024–2025</h1>
          <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
            Fechas importantes: suspensiones, juntas de consejo técnico y entrega de boletas.
          </p>
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {Object.entries(TIPO_COLORS).map(([tipo, cls]) => (
            <span key={tipo} className={`text-xs font-semibold px-3 py-1 rounded-full border ${cls}`}>
              {tipo}
            </span>
          ))}
        </div>

        {/* Lista agrupada por mes */}
        <div className="space-y-8">
          {meses.map(mes => {
            const [year, month] = mes.split('-').map(Number)
            const nombre = new Date(year, month - 1, 1).toLocaleString('es-MX', { month: 'long', year: 'numeric' })
            const eventosDelMes = eventos.filter(e => e.fecha_inicio.startsWith(mes))

            return (
              <div key={mes}>
                <h2 className="text-lg font-bold text-gray-700 mb-3 capitalize">{nombre}</h2>
                <div className="space-y-3">
                  {eventosDelMes.map(evento => (
                    <div
                      key={evento.id}
                      className="flex gap-4 items-start bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <div
                        className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: evento.color }}
                      >
                        <span className="text-xl leading-none">
                          {new Date(evento.fecha_inicio + 'T00:00:00').getDate()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${TIPO_COLORS[evento.tipo] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {evento.tipo}
                          </span>
                          {evento.fecha_fin && evento.fecha_fin !== evento.fecha_inicio && (
                            <span className="text-xs text-gray-400">
                              hasta {formatDate(evento.fecha_fin)}
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-gray-800">{evento.titulo}</p>
                        {evento.descripcion && (
                          <p className="text-gray-500 text-sm mt-0.5">{evento.descripcion}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {eventos.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay eventos registrados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
