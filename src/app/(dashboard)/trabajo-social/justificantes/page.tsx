import { createClient } from '@/lib/supabase/server'
import JustificantesPanel from '@/components/dashboard/JustificantesPanel'

async function getJustificantes() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('justificantes')
    .select('*, alumnos(nombre, apellido_paterno, apellido_materno, grupo, grado)')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function JustificantesTSPage() {
  const justificantes = await getJustificantes()
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Panel de Trabajo Social</h1>
        <p className="text-gray-500 text-sm mt-1">Revisa, aprueba o rechaza las solicitudes de justificante.</p>
      </div>
      <JustificantesPanel initialData={justificantes} />
    </div>
  )
}
