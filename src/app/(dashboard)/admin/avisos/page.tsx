import { createClient } from '@/lib/supabase/server'
import AvisosManager from '@/components/dashboard/AvisosManager'

async function getAvisos() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('avisos')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function AvisosAdminPage() {
  const avisos = await getAvisos()
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Gestión de Avisos</h1>
        <p className="text-gray-500 text-sm mt-1">Crea, edita y elimina comunicados del tablero público.</p>
      </div>
      <AvisosManager initialAvisos={avisos} />
    </div>
  )
}
