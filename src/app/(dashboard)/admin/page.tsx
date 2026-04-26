import { createClient } from '@/lib/supabase/server'
import { Users, FileText, Bell, ClipboardList } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()
  const [
    { count: totalAlumnos },
    { count: justPendientes },
    { count: totalAvisos },
    { count: totalCalificaciones },
  ] = await Promise.all([
    supabase.from('alumnos').select('*', { count: 'exact', head: true }).eq('activo', true),
    supabase.from('justificantes').select('*', { count: 'exact', head: true }).eq('estado', 'En revisión'),
    supabase.from('avisos').select('*', { count: 'exact', head: true }).eq('publicado', true),
    supabase.from('calificaciones').select('*', { count: 'exact', head: true }),
  ])
  return { totalAlumnos, justPendientes, totalAvisos, totalCalificaciones }
}

export default async function AdminPage() {
  const stats = await getStats()

  const CARDS = [
    { label: 'Alumnos Activos', value: stats.totalAlumnos ?? 0, icon: Users, color: 'bg-blue-50 text-blue-700 border-blue-200', iconBg: 'bg-blue-100' },
    { label: 'Justificantes Pendientes', value: stats.justPendientes ?? 0, icon: FileText, color: 'bg-yellow-50 text-yellow-700 border-yellow-200', iconBg: 'bg-yellow-100' },
    { label: 'Avisos Publicados', value: stats.totalAvisos ?? 0, icon: Bell, color: 'bg-green-50 text-green-700 border-green-200', iconBg: 'bg-green-100' },
    { label: 'Registros de Calificaciones', value: stats.totalCalificaciones ?? 0, icon: ClipboardList, color: 'bg-purple-50 text-purple-700 border-purple-200', iconBg: 'bg-purple-100' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Panel General</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen del sistema — Ciclo 2024–2025</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {CARDS.map(card => (
          <div key={card.label} className={`border rounded-2xl p-5 ${card.color}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.iconBg}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-black">{card.value}</p>
            <p className="text-sm font-semibold opacity-80 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/admin/calificaciones', label: 'Gestionar Calificaciones', desc: 'Importar CSV/Excel' },
            { href: '/admin/avisos', label: 'Gestionar Avisos', desc: 'CRUD de comunicados' },
            { href: '/trabajo-social/justificantes', label: 'Revisar Justificantes', desc: 'Aprobar o rechazar' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              className="block p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
