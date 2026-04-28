import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const year = request.nextUrl.searchParams.get('year')
  const month = request.nextUrl.searchParams.get('month')

  const supabase = createAdminClient()

  let query = supabase
    .from('eventos_calendario')
    .select('*')
    .order('fecha_inicio', { ascending: true })

  if (year && month) {
    const m = month.padStart(2, '0')
    const start = `${year}-${m}-01`
    const lastDay = new Date(Number(year), Number(month), 0).getDate()
    const end = `${year}-${m}-${lastDay}`
    query = query.gte('fecha_inicio', start).lte('fecha_inicio', end)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { titulo, descripcion, fecha_inicio, fecha_fin, tipo, color } = body

  if (!titulo || !fecha_inicio) {
    return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('eventos_calendario')
    .insert({
      titulo,
      descripcion: descripcion || null,
      fecha_inicio,
      fecha_fin: fecha_fin || fecha_inicio,
      tipo: tipo || 'Evento',
      color: color || '#15803d',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
