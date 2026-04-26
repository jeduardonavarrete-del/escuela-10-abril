import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { nombre, telefono, categoria, mensaje } = body

  if (!mensaje || mensaje.trim().length < 10) {
    return NextResponse.json({ error: 'El mensaje es requerido (mín. 10 caracteres).' }, { status: 400 })
  }

  const supabase = await createClient()

  // Guardamos el mensaje del buzón como un aviso interno (no publicado)
  const { error } = await supabase.from('avisos').insert({
    titulo: `[Buzón] ${categoria ?? 'Propuesta'} — ${nombre ?? 'Anónimo'}`,
    contenido: `${mensaje}\n\n— ${nombre ?? 'Anónimo'} · ${telefono ?? 'sin teléfono'}`,
    categoria: categoria ?? 'Propuesta',
    importante: false,
    publicado: false,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar el mensaje.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
