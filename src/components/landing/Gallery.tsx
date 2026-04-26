import { ImageIcon } from 'lucide-react'

const PLACEHOLDERS = [
  { label: 'Fachada Principal', aspect: 'aspect-video col-span-2' },
  { label: 'Biblioteca', aspect: 'aspect-square' },
  { label: 'Laboratorio de Ciencias', aspect: 'aspect-square' },
  { label: 'Cancha Deportiva', aspect: 'aspect-square' },
  { label: 'Salón de Usos Múltiples', aspect: 'aspect-square' },
  { label: 'Patio Central', aspect: 'aspect-video col-span-2' },
]

export default function Gallery() {
  return (
    <section id="galeria" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Instalaciones
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Nuestra Galería</h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm">
            Conoce los espacios que hacen del "10 de Abril" un lugar para crecer.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PLACEHOLDERS.map((item, i) => (
            <div
              key={i}
              className={`${item.aspect} bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl overflow-hidden relative group border-2 border-dashed border-gray-300 hover:border-green-400 transition-all`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                <div className="w-12 h-12 bg-white/70 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-xs font-semibold text-center">{item.label}</p>
                <p className="text-gray-400 text-xs text-center">Fotografía próximamente</p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-green-900/0 group-hover:bg-green-900/10 transition-colors rounded-2xl" />
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Las fotografías serán actualizadas por la administración del plantel.
        </p>
      </div>
    </section>
  )
}
