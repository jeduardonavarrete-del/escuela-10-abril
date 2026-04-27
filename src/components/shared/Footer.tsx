import { GraduationCap, MapPin, Phone, Clock } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Escuela Secundaria Federal</p>
                <p className="text-green-300 text-xs">"10 de Abril"</p>
              </div>
            </div>
            <p className="text-green-200 text-sm leading-relaxed">
              Formando ciudadanos comprometidos con su comunidad y su futuro.
              Ciclo escolar 2024–2025.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-green-300 uppercase tracking-wide">Contacto</h3>
            <ul className="space-y-3 text-sm text-green-100">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                Av. Temixco y No Reelección #1, Col. Centro,<br />
                Emiliano Zapata, Morelos
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                (777) 368-0092
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-400 flex-shrink-0" />
                Turno Matutino: 7:00 – 13:10 hrs
              </li>
            </ul>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-green-300 uppercase tracking-wide">Accesos rápidos</h3>
            <ul className="space-y-2 text-sm text-green-100">
              {[
                { href: '/boletas', label: 'Consultar Boleta' },
                { href: '/justificantes', label: 'Enviar Justificante' },
                { href: '/buzon', label: 'Buzón de Propuestas' },
                { href: '/calendario', label: 'Calendario Escolar' },
                { href: '/login', label: 'Acceso Administrativo' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-green-800 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-green-400">
          <p>© {new Date().getFullYear()} ESF "10 de Abril". Todos los derechos reservados.</p>
          <p>Emiliano Zapata, Morelos</p>
        </div>
      </div>
    </footer>
  )
}
