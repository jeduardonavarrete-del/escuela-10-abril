import Link from 'next/link'
import { GraduationCap, LayoutDashboard, FileText, Bell, Users, ClipboardList, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Panel General' },
  { href: '/admin/calificaciones', icon: ClipboardList, label: 'Calificaciones' },
  { href: '/admin/alumnos', icon: Users, label: 'Alumnos' },
  { href: '/admin/avisos', icon: Bell, label: 'Avisos' },
  { href: '/trabajo-social/justificantes', icon: FileText, label: 'Justificantes' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-green-900 text-white flex flex-col">
        <div className="p-5 border-b border-green-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">ESF "10 de Abril"</p>
              <p className="text-green-300 text-xs">Dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-green-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-green-800">
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-green-200 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
