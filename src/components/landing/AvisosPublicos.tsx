import { Bell, AlertCircle } from 'lucide-react'
import type { Aviso } from '@/types'
import { formatDate } from '@/lib/utils'

interface Props {
  avisos: Aviso[]
}

export default function AvisosPublicos({ avisos }: Props) {
  return (
    <section id="avisos" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Comunicados
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Tablero de Avisos</h2>
          <p className="mt-3 text-gray-500 text-sm max-w-xl mx-auto">
            Mantente informado sobre las últimas noticias y comunicados oficiales de la escuela.
          </p>
        </div>

        {avisos.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p>No hay avisos publicados en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {avisos.map(aviso => (
              <article
                key={aviso.id}
                className={`rounded-2xl border p-6 bg-white shadow-sm hover:shadow-md transition-shadow ${aviso.importante ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    {aviso.importante && (
                      <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      {aviso.categoria}
                    </span>
                    {aviso.importante && (
                      <span className="text-xs font-bold text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded-full">
                        Importante
                      </span>
                    )}
                  </div>
                  <time className="text-xs text-gray-400 flex-shrink-0">
                    {formatDate(aviso.created_at)}
                  </time>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{aviso.titulo}</h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{aviso.contenido}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
