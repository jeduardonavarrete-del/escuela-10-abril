import Link from 'next/link'
import { CalendarDays, ChevronRight } from 'lucide-react'
import type { EventoCalendario } from '@/types'
import { formatDate } from '@/lib/utils'

const TIPO_COLORS: Record<string, string> = {
  Suspension:       'bg-red-100 text-red-700 border-red-200',
  'Consejo Tecnico':'bg-purple-100 text-purple-700 border-purple-200',
  'Entrega Boletas':'bg-yellow-100 text-yellow-700 border-yellow-200',
  Evento:           'bg-blue-100 text-blue-700 border-blue-200',
  Festivo:          'bg-orange-100 text-orange-700 border-orange-200',
  Examen:           'bg-rose-100 text-rose-700 border-rose-200',
}

interface Props {
  eventos: EventoCalendario[]
}

export default function CalendarioPreview({ eventos }: Props) {
  return (
    <section id="calendario" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <span className="inline-block bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Próximas fechas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Calendario Escolar</h2>
          </div>
          <Link
            href="/calendario"
            className="inline-flex items-center gap-1 text-green-700 font-semibold text-sm hover:text-green-900 transition-colors"
          >
            Ver calendario completo <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {eventos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay eventos próximos registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventos.map(evento => (
              <div
                key={evento.id}
                className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white flex gap-4"
              >
                {/* Date box */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white font-bold"
                  style={{ backgroundColor: evento.color }}
                >
                  <span className="text-xl leading-none">
                    {new Date(evento.fecha_inicio + 'T00:00:00').getDate()}
                  </span>
                  <span className="text-xs uppercase opacity-80">
                    {new Date(evento.fecha_inicio + 'T00:00:00').toLocaleString('es-MX', { month: 'short' })}
                  </span>
                </div>

                <div className="min-w-0">
                  <span
                    className={`inline-block text-xs px-2 py-0.5 rounded-full border font-medium mb-1 ${TIPO_COLORS[evento.tipo] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}
                  >
                    {evento.tipo}
                  </span>
                  <p className="font-semibold text-gray-800 text-sm leading-snug">{evento.titulo}</p>
                  {evento.descripcion && (
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{evento.descripcion}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
