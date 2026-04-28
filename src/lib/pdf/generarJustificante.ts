import jsPDF from 'jspdf'

export interface DatosJustificante {
  folio: string
  alumno: {
    nombre: string
    apellido_paterno: string
    apellido_materno?: string
    grado: string
    grupo: string
    curp: string
    numero_lista?: number
  }
  nombre_padre: string
  telefono?: string
  fecha_inicio: string
  fecha_fin: string
  motivo: string
  estado: string
  created_at: string
}

function fmtFecha(iso: string) {
  const [y, m, d] = iso.split('-')
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`
}

export function generarJustificantePDF(datos: DatosJustificante) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
  const W = 215.9
  const margin = 18

  // ── HEADER VERDE ───────────────────────────────────────────────
  doc.setFillColor(20, 100, 50)
  doc.rect(0, 0, W, 45, 'F')

  // Línea de acento
  doc.setFillColor(255, 255, 255, 0.15)
  doc.rect(0, 42, W, 3, 'F')

  // Escudo placeholder
  doc.setFillColor(255, 255, 255)
  doc.circle(margin + 8, 22, 9, 'F')
  doc.setTextColor(20, 100, 50)
  doc.setFontSize(6)
  doc.setFont('helvetica', 'bold')
  doc.text('SEP', margin + 5, 23)

  // Textos del header
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Escuela Secundaria Federal "10 de Abril"', W / 2, 14, { align: 'center' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Emiliano Zapata, Morelos  ·  Turno Matutino  ·  Tel. (777) 368-0092', W / 2, 21, { align: 'center' })

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text('JUSTIFICANTE DE INASISTENCIA', W / 2, 31, { align: 'center' })

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Ciclo Escolar 2025–2026', W / 2, 38, { align: 'center' })

  // Folio y fecha (esquina derecha del header)
  doc.setFontSize(7.5)
  doc.setTextColor(200, 255, 200)
  doc.text(`Folio: ${datos.folio}`, W - margin, 10, { align: 'right' })
  doc.text(`Fecha: ${fmtFecha(datos.created_at.split('T')[0])}`, W - margin, 16, { align: 'right' })

  // ── ESTADO BADGE ───────────────────────────────────────────────
  let y = 55
  const badgeColor = datos.estado === 'Aprobado' ? [22, 163, 74] : datos.estado === 'Rechazado' ? [220, 38, 38] : [202, 138, 4]
  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2])
  doc.roundedRect(W / 2 - 22, y - 5, 44, 8, 2, 2, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text(`● ${datos.estado.toUpperCase()}`, W / 2, y, { align: 'center' })
  y += 12

  // ── DATOS DEL ALUMNO ───────────────────────────────────────────
  doc.setTextColor(20, 100, 50)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('DATOS DEL ALUMNO', margin, y)
  y += 2
  doc.setDrawColor(20, 100, 50)
  doc.setLineWidth(0.4)
  doc.line(margin, y, W - margin, y)
  y += 6

  doc.setTextColor(40, 40, 40)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  const nombre = `${datos.alumno.apellido_paterno} ${datos.alumno.apellido_materno ?? ''} ${datos.alumno.nombre}`.trim()
  doc.setFont('helvetica', 'bold')
  doc.text('Nombre:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(nombre, margin + 18, y)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.text('CURP:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(datos.alumno.curp, margin + 14, y)
  doc.setFont('helvetica', 'bold')
  doc.text('Grado / Grupo:', W / 2, y)
  doc.setFont('helvetica', 'normal')
  doc.text(`${datos.alumno.grado}  –  Grupo ${datos.alumno.grupo}`, W / 2 + 28, y)
  y += 6

  if (datos.alumno.numero_lista) {
    doc.setFont('helvetica', 'bold')
    doc.text('No. Lista:', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(datos.alumno.numero_lista), margin + 19, y)
    y += 6
  }

  y += 4

  // ── MOTIVO DE INASISTENCIA ─────────────────────────────────────
  doc.setTextColor(20, 100, 50)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('PERÍODO Y MOTIVO DE INASISTENCIA', margin, y)
  y += 2
  doc.line(margin, y, W - margin, y)
  y += 6

  doc.setTextColor(40, 40, 40)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Del:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(fmtFecha(datos.fecha_inicio), margin + 9, y)
  doc.setFont('helvetica', 'bold')
  doc.text('al:', W / 2, y)
  doc.setFont('helvetica', 'normal')
  doc.text(fmtFecha(datos.fecha_fin), W / 2 + 8, y)
  y += 7

  doc.setFont('helvetica', 'bold')
  doc.text('Motivo:', margin, y)
  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  const lines = doc.splitTextToSize(datos.motivo, W - margin * 2)
  doc.text(lines, margin, y)
  y += lines.length * 5 + 6

  // ── DATOS DEL PADRE / TUTOR ────────────────────────────────────
  doc.setTextColor(20, 100, 50)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('DATOS DEL PADRE / TUTOR', margin, y)
  y += 2
  doc.line(margin, y, W - margin, y)
  y += 6

  doc.setTextColor(40, 40, 40)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('Nombre:', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.text(datos.nombre_padre, margin + 18, y)
  if (datos.telefono) {
    doc.setFont('helvetica', 'bold')
    doc.text('Tel.:', W * 0.65, y)
    doc.setFont('helvetica', 'normal')
    doc.text(datos.telefono, W * 0.65 + 10, y)
  }
  y += 16

  // ── FIRMAS ─────────────────────────────────────────────────────
  const firmaW = 70
  const leftX = margin + 5
  const rightX = W - margin - firmaW + 5

  doc.setDrawColor(80, 80, 80)
  doc.setLineWidth(0.3)
  doc.line(leftX, y, leftX + firmaW, y)
  doc.line(rightX, y, rightX + firmaW, y)
  y += 4

  doc.setTextColor(30, 30, 30)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text('Mtra. Martha Leticia Sandoval Peralta', leftX + firmaW / 2, y, { align: 'center' })
  doc.text('Lic. Natividad Adán Urueta', rightX + firmaW / 2, y, { align: 'center' })
  y += 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(90, 90, 90)
  doc.text('Subdirectora — Turno Matutino', leftX + firmaW / 2, y, { align: 'center' })
  doc.text('Trabajadora Social', rightX + firmaW / 2, y, { align: 'center' })

  // ── FOOTER ─────────────────────────────────────────────────────
  y += 20
  doc.setFillColor(245, 245, 245)
  doc.rect(0, y, W, 12, 'F')
  doc.setTextColor(120, 120, 120)
  doc.setFontSize(6.5)
  doc.text('Av. Temixco y No Reelección #1, Col. Centro, Emiliano Zapata, Morelos  ·  Tel. (777) 368-0092', W / 2, y + 5, { align: 'center' })
  doc.text(`Documento generado el ${new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}  ·  Folio: ${datos.folio}`, W / 2, y + 9, { align: 'center' })

  doc.save(`Justificante_${datos.folio}.pdf`)
}
