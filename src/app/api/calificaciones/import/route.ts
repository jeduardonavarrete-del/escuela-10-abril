import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import Papa from 'papaparse'

interface CsvRow {
  CURP: string
  materia_clave: string
  trimestre: string
  calificacion: string
}

interface RowResult {
  row: number
  curp: string
  status: 'ok' | 'error'
  message?: string
}

export async function POST(request: NextRequest) {
  const supabase = await createAdminClient()
  const fd = await request.formData()
  const file = fd.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'Archivo requerido.' }, { status: 400 })
  }

  const text = await file.text()
  const { data: rows, errors } = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim(),
  })

  if (errors.length > 0) {
    return NextResponse.json({ error: 'El CSV tiene errores de formato.' }, { status: 400 })
  }

  // Cargar catálogos en memoria para evitar N+1
  const { data: alumnos } = await supabase.from('alumnos').select('id, curp')
  const { data: materias } = await supabase.from('materias').select('id, clave')

  const alumnoMap = new Map((alumnos ?? []).map(a => [a.curp, a.id]))
  const materiaMap = new Map((materias ?? []).map(m => [m.clave, m.id]))

  const results: RowResult[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2 // +2 por encabezado y base 1
    const curp = row.CURP?.trim().toUpperCase()
    const clave = row.materia_clave?.trim()
    const trimestre = row.trimestre?.trim()
    const calRaw = parseFloat(row.calificacion)

    if (!curp || !clave || !trimestre || isNaN(calRaw)) {
      results.push({ row: rowNum, curp: curp ?? '', status: 'error', message: 'Datos incompletos o inválidos.' })
      continue
    }

    if (!['1', '2', '3'].includes(trimestre)) {
      results.push({ row: rowNum, curp, status: 'error', message: 'Trimestre debe ser 1, 2 o 3.' })
      continue
    }

    if (calRaw < 0 || calRaw > 10) {
      results.push({ row: rowNum, curp, status: 'error', message: 'Calificación fuera del rango 0-10.' })
      continue
    }

    const alumnoId = alumnoMap.get(curp)
    if (!alumnoId) {
      results.push({ row: rowNum, curp, status: 'error', message: 'Alumno no encontrado en la base de datos.' })
      continue
    }

    const materiaId = materiaMap.get(clave)
    if (!materiaId) {
      results.push({ row: rowNum, curp, status: 'error', message: `Clave de materia '${clave}' no existe.` })
      continue
    }

    const { error } = await supabase
      .from('calificaciones')
      .upsert(
        {
          alumno_id: alumnoId,
          materia_id: materiaId,
          trimestre: trimestre as '1' | '2' | '3',
          calificacion: calRaw,
          ciclo_escolar: '2024-2025',
        },
        { onConflict: 'alumno_id,materia_id,trimestre,ciclo_escolar' }
      )

    if (error) {
      results.push({ row: rowNum, curp, status: 'error', message: error.message })
    } else {
      results.push({ row: rowNum, curp, status: 'ok' })
    }
  }

  return NextResponse.json({ results })
}
