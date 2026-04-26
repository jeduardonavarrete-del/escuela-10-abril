import { NextRequest, NextResponse } from 'next/server'

const FAQ: [RegExp, string][] = [
  [/sal(ida|en)|termina|acaba/i, 'El turno matutino termina a las **13:30 hrs**.'],
  [/entra(da)?|empie(za|zan)|hora.*clase/i, 'El turno matutino inicia a las **7:00 hrs**.'],
  [/uniforme|suéter|color|ropa/i, 'El uniforme consiste en pants azul marino, playera blanca y suéter verde con el escudo de la escuela. El uniforme de educación física es pants azul marino con playera blanca.'],
  [/just(ificar|ificante)|falt(ó|o)|inasistencia/i, 'Puedes solicitar un justificante de inasistencia en la sección **Portal Padres → Justificantes** de esta página. Necesitas el CURP del alumno y una fotografía de la receta médica o documento.'],
  [/boleta|calificaci(ón|ones|on)/i, 'Consulta la boleta de calificaciones en **Portal Padres → Consultar Boleta**. Solo necesitas el CURP del alumno.'],
  [/buzón|queja|propuesta|sugerencia/i, 'Puedes enviar tus comentarios a la dirección a través del **Buzón de Propuestas** en el Portal Padres.'],
  [/calendari(o)?|suspend(ido|ido|idos)|fest(ivo|ivos)/i, 'Consulta el calendario escolar completo con fechas de suspensiones, juntas de consejo técnico y entrega de boletas en la sección **Calendario**.'],
  [/consejo técnico|junta|reunión/i, 'Las juntas de Consejo Técnico Escolar se realizan mensualmente. Puedes consultar las fechas exactas en el **Calendario Escolar** de esta página.'],
  [/telé(fono|fono)|contacto|llamar/i, 'Puedes contactar a la escuela al **(777) 000-0000** en horario de turno matutino (7:00–13:30 hrs).'],
  [/hola|buenos|buenas|saludos/i, '¡Hola! Soy el asistente virtual de la ESF "10 de Abril". ¿En qué puedo ayudarte hoy?'],
  [/gracias|thank/i, '¡Con gusto! Si tienes otra pregunta, aquí estaré.'],
  [/director|directora|nombre/i, 'Para conocer al personal directivo, te invitamos a visitar la escuela directamente o llamar al (777) 000-0000.'],
]

export async function POST(request: NextRequest) {
  const { message } = await request.json()

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ reply: 'No entendí tu mensaje. ¿Puedes intentarlo de nuevo?' })
  }

  for (const [pattern, response] of FAQ) {
    if (pattern.test(message)) {
      return NextResponse.json({ reply: response })
    }
  }

  return NextResponse.json({
    reply:
      'No tengo esa información en este momento. Te recomiendo llamar directamente a la escuela al **(777) 000-0000** o visitar la sección correspondiente del portal. ¿Puedo ayudarte con algo más?',
  })
}
