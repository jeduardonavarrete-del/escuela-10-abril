import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const fd = await request.formData()

  const curp = (fd.get('curp') as string)?.toUpperCase().trim()
  const nombre_padre = fd.get('nombre_padre') as string
  const telefono = fd.get('telefono') as string
  const fecha_inicio = fd.get('fecha_inicio') as string
  const fecha_fin = fd.get('fecha_fin') as string
  const motivo = fd.get('motivo') as string
  const archivo = fd.get('archivo') as File | null

  if (!curp || !nombre_padre || !fecha_inicio || !fecha_fin || !motivo) {
    return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
  }

  // Verificar que el alumno exista
  const { data: alumno, error: alumnoErr } = await supabase
    .from('alumnos')
    .select('id')
    .eq('curp', curp)
    .eq('activo', true)
    .single()

  if (alumnoErr || !alumno) {
    return NextResponse.json({ error: 'No se encontró un alumno activo con ese CURP.' }, { status: 404 })
  }

  let archivo_url: string | undefined
  let archivo_nombre: string | undefined

  // Subir archivo a Supabase Storage
  if (archivo && archivo.size > 0) {
    if (archivo.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'El archivo no debe superar 5 MB.' }, { status: 400 })
    }
    const ext = archivo.name.split('.').pop()
    const fileName = `${curp}_${Date.now()}.${ext}`
    const arrayBuffer = await archivo.arrayBuffer()

    const { data: uploadData, error: uploadErr } = await supabase.storage
      .from('justificantes')
      .upload(fileName, arrayBuffer, { contentType: archivo.type, upsert: false })

    if (uploadErr) {
      return NextResponse.json({ error: 'Error al subir el archivo.' }, { status: 500 })
    }

    const { data: urlData } = supabase.storage.from('justificantes').getPublicUrl(uploadData.path)
    archivo_url = urlData.publicUrl
    archivo_nombre = archivo.name
  }

  const { data: justificante, error: justErr } = await supabase
    .from('justificantes')
    .insert({
      alumno_id: alumno.id,
      nombre_padre,
      telefono: telefono || null,
      fecha_inicio,
      fecha_fin,
      motivo,
      archivo_url,
      archivo_nombre,
    })
    .select('folio')
    .single()

  if (justErr || !justificante) {
    return NextResponse.json({ error: 'Error al guardar la solicitud.' }, { status: 500 })
  }

  return NextResponse.json({ folio: justificante.folio }, { status: 201 })
}

export async function GET(request: NextRequest) {
  const folio = request.nextUrl.searchParams.get('folio')

  if (!folio) {
    return NextResponse.json({ error: 'Folio requerido' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('justificantes')
    .select('folio, estado, created_at')
    .eq('folio', folio.trim().toUpperCase())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No se encontró el folio.' }, { status: 404 })
  }

  return NextResponse.json(data)
}
