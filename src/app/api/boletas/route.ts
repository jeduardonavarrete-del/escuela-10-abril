import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const curp = request.nextUrl.searchParams.get('curp')

  if (!curp) {
    return NextResponse.json({ error: 'CURP requerido' }, { status: 400 })
  }

  const curpUpper = curp.toUpperCase().trim()
  const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/
  if (!curpRegex.test(curpUpper)) {
    return NextResponse.json({ error: 'Formato de CURP inválido' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: alumno, error: alumnoError } = await supabase
    .from('alumnos')
    .select('*')
    .eq('curp', curpUpper)
    .eq('activo', true)
    .single()

  if (alumnoError || !alumno) {
    return NextResponse.json(
      { error: 'No se encontró un alumno activo con ese CURP.' },
      { status: 404 }
    )
  }

  const { data: calificaciones, error: calError } = await supabase
    .from('calificaciones')
    .select('*, materias(*)')
    .eq('alumno_id', alumno.id)
    .eq('ciclo_escolar', '2024-2025')

  if (calError) {
    return NextResponse.json({ error: 'Error al obtener calificaciones.' }, { status: 500 })
  }

  return NextResponse.json({ ...alumno, calificaciones: calificaciones ?? [] })
}
