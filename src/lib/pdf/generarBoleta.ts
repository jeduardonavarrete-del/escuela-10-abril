import jsPDF from 'jspdf'
import type { BolетaAlumno } from '@/types'

export function generarBoletaPDF(alumno: BolетaAlumno) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
  const W = 215.9
  const margin = 15

  // --- Header verde ---
  doc.setFillColor(21, 128, 61)
  doc.rect(0, 0, W, 40, 'F')

  // Escudo placeholder (círculo blanco)
  doc.setFillColor(255, 255, 255)
  doc.circle(margin + 10, 20, 10, 'F')
  doc.setTextColor(21, 128, 61)
  doc.setFontSize(7)
  doc.text('SEP', margin + 6, 21)

  // Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Escuela Secundaria Federal "10 de Abril"', W / 2, 15, { align: 'center' })
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Emiliano Zapata, Morelos  |  Turno Matutino', W / 2, 22, { align: 'center' })
  doc.text('BOLETA DE CALIFICACIONES — Ciclo Escolar 2025–2026', W / 2, 30, { align: 'center' })

  // --- Datos del alumno ---
  let y = 50
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DEL ALUMNO', margin, y)
  y += 6

  doc.setDrawColor(21, 128, 61)
  doc.setLineWidth(0.5)
  doc.line(margin, y, W - margin, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  const nombreCompleto = `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno ?? ''}`
  doc.text(`Nombre: ${nombreCompleto}`, margin, y)
  doc.text(`Grado: ${alumno.grado}   Grupo: ${alumno.grupo}   Turno: ${alumno.turno}`, W / 2, y)
  y += 6
  doc.text(`CURP: ${alumno.curp}`, margin, y)
  if (alumno.numero_lista) doc.text(`No. Lista: ${alumno.numero_lista}`, W / 2, y)
  y += 10

  // --- Tabla calificaciones ---
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('CALIFICACIONES', margin, y)
  y += 6
  doc.line(margin, y, W - margin, y)
  y += 5

  // Encabezado tabla
  const col1 = margin
  const colT1 = 130
  const colT2 = 155
  const colT3 = 180

  doc.setFillColor(240, 253, 244)
  doc.rect(col1, y - 4, W - margin * 2, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(21, 128, 61)
  doc.text('Asignatura', col1 + 2, y + 1)
  doc.text('T1', colT1, y + 1, { align: 'center' })
  doc.text('T2', colT2, y + 1, { align: 'center' })
  doc.text('T3', colT3, y + 1, { align: 'center' })
  y += 8

  // Filas
  const materias = [...new Map(
    alumno.calificaciones.map(c => [c.materia_id, c.materias])
  ).values()].sort((a, b) => (a?.orden ?? 0) - (b?.orden ?? 0))

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 30, 30)

  materias.forEach((materia, idx) => {
    if (!materia) return
    if (idx % 2 === 0) {
      doc.setFillColor(249, 250, 251)
      doc.rect(col1, y - 4, W - margin * 2, 7, 'F')
    }
    doc.setFontSize(8)
    doc.text(materia.nombre, col1 + 2, y)

    const TRIMESTRES = ['1', '2', '3'] as const
    TRIMESTRES.forEach((t, ti) => {
      const cal = alumno.calificaciones.find(
        c => c.materia_id === materia.id && c.trimestre === t
      )
      const colX = [colT1, colT2, colT3][ti]
      const val = cal?.calificacion?.toString() ?? '—'
      if (cal?.calificacion !== undefined && cal.calificacion !== null) {
        if (cal.calificacion < 6) doc.setTextColor(220, 38, 38)
        else if (cal.calificacion >= 9) doc.setTextColor(21, 128, 61)
        else doc.setTextColor(30, 30, 30)
      } else {
        doc.setTextColor(156, 163, 175)
      }
      doc.text(val, colX, y, { align: 'center' })
      doc.setTextColor(30, 30, 30)
    })
    y += 7
  })

  // --- Firma ---
  y += 15
  doc.setDrawColor(150)
  doc.line(margin, y, margin + 60, y)
  doc.line(W - margin - 60, y, W - margin, y)
  doc.setFontSize(7)
  doc.setTextColor(100)
  doc.text('Vo.Bo. Director(a)', margin + 30, y + 4, { align: 'center' })
  doc.text('Trabajo Social', W - margin - 30, y + 4, { align: 'center' })

  // --- Folio y fecha ---
  y += 12
  doc.setFontSize(6.5)
  doc.setTextColor(150)
  doc.text(
    `Generado el ${new Date().toLocaleDateString('es-MX')} | ESF "10 de Abril" Emiliano Zapata, Morelos`,
    W / 2,
    y,
    { align: 'center' }
  )

  doc.save(`Boleta_${alumno.curp}_2025-2026.pdf`)
}
