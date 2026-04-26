import Link from 'next/link'
import { ArrowRight, BookOpen, FileText, Bell } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-700">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-400 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-white/80 text-sm font-medium">Ciclo Escolar 2024–2025</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
            Escuela Secundaria{' '}
            <span className="text-yellow-400 block sm:inline">Federal</span>
          </h1>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white/90 mb-6">
            "10 de Abril"
          </h2>

          <p className="text-green-100 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl">
            Formando estudiantes comprometidos con su comunidad, su futuro y con
            los valores de Emiliano Zapata, Morelos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/boletas"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-yellow-400/30 hover:-translate-y-0.5"
            >
              <BookOpen className="w-5 h-5" />
              Consultar Boleta
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/justificantes"
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/30 transition-all backdrop-blur-sm"
            >
              <FileText className="w-5 h-5" />
              Enviar Justificante
            </Link>
          </div>
        </div>

        {/* Stats cards */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
          {[
            { label: 'Grupos', value: '6', sub: '2do grado' },
            { label: 'Turno', value: 'Mat.', sub: '7:00 – 13:30' },
            { label: 'Alumnos', value: '~180', sub: 'por ciclo' },
            { label: 'Ubicación', value: 'E.Z.', sub: 'Morelos' },
          ].map(s => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-green-200 text-xs font-semibold uppercase tracking-wide">{s.label}</p>
              <p className="text-green-300 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 30C1200 70 900 10 720 30C540 50 240 0 0 30L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  )
}
