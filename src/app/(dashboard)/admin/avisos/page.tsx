import { createClient } from '@/lib/supabase/server'
import AvisosManager from '@/components/dashboard/AvisosManager'
import CalendarioAdmin from '@/components/dashboard/CalendarioAdmin'

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
        <h1 className="text-2xl font-extrabold text-gray-900">Gestión de Avisos y Calendario</h1>
        <p className="text-gray-500 text-sm mt-1">Crea comunicados y administra eventos del calendario escolar.</p>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Calendario Escolar</h2>
        <CalendarioAdmin />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Tablero de Avisos</h2>
        <AvisosManager initialAvisos={avisos} />
      </div>
    </div>
  )
}
