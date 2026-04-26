import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function getEstadoBadgeColor(estado: string) {
  switch (estado) {
    case 'Aprobado':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'Rechazado':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  }
}

export function getCalificacionColor(cal: number | null) {
  if (cal === null) return 'text-gray-400'
  if (cal >= 9) return 'text-green-600 font-bold'
  if (cal >= 7) return 'text-blue-600 font-semibold'
  if (cal >= 6) return 'text-yellow-600'
  return 'text-red-600 font-bold'
}

export function curpIsValid(curp: string) {
  const regex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/
  return regex.test(curp.toUpperCase())
}
