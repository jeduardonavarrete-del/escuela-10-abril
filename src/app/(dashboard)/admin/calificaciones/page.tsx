import CalificacionesManager from '@/components/dashboard/CalificacionesManager'

export default function CalificacionesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Gestión de Calificaciones</h1>
        <p className="text-gray-500 text-sm mt-1">
          Importa calificaciones desde un archivo CSV. Formato: CURP, materia_clave, trimestre, calificacion.
        </p>
      </div>
      <CalificacionesManager />
    </div>
  )
}
