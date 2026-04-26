'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/#informacion', label: 'Nosotros' },
  { href: '/#galeria', label: 'Galería' },
  { href: '/calendario', label: 'Calendario' },
  { href: '/#avisos', label: 'Avisos' },
]

const PORTAL_LINKS = [
  { href: '/boletas', label: 'Consultar Boleta' },
  { href: '/justificantes', label: 'Justificantes' },
  { href: '/buzon', label: 'Buzón de Propuestas' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [portalOpen, setPortalOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-green-800">
            <div className="w-9 h-9 bg-green-700 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block text-sm leading-tight">
              ESF <br />
              <span className="text-xs font-normal text-gray-500">10 de Abril</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 hover:text-green-700 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}

            {/* Portal dropdown */}
            <div className="relative" onMouseLeave={() => setPortalOpen(false)}>
              <button
                onMouseEnter={() => setPortalOpen(true)}
                className="text-sm font-semibold text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition-colors"
              >
                Portal Padres ▾
              </button>
              {portalOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {PORTAL_LINKS.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2.5 text-sm text-gray-700 hover:text-green-700 font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-0 pb-1">
              Portal Padres
            </p>
            {PORTAL_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2.5 text-sm text-green-700 font-semibold"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
