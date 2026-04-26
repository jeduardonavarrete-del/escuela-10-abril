export type GradoEnum = '1ro' | '2do' | '3ro'
export type GrupoEnum = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
export type TurnoEnum = 'Matutino' | 'Vespertino'
export type TrimestreEnum = '1' | '2' | '3'
export type EstadoJustificante = 'En revisión' | 'Aprobado' | 'Rechazado'
export type RolEnum = 'admin' | 'trabajo_social' | 'publico'
export type TipoEvento = 'Suspension' | 'Consejo Tecnico' | 'Entrega Boletas' | 'Evento' | 'Festivo' | 'Examen'

export interface Alumno {
  id: string
  curp: string
  nombre: string
  apellido_paterno: string
  apellido_materno?: string
  grado: GradoEnum
  grupo: GrupoEnum
  turno: TurnoEnum
  numero_lista?: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface Materia {
  id: string
  nombre: string
  clave?: string
  grado?: GradoEnum
  orden: number
}

export interface Calificacion {
  id: string
  alumno_id: string
  materia_id: string
  trimestre: TrimestreEnum
  calificacion: number | null
  ciclo_escolar: string
  materias?: Materia
}

export interface BolетaAlumno extends Alumno {
  calificaciones: (Calificacion & { materias: Materia })[]
}

export interface Justificante {
  id: string
  folio: string
  alumno_id: string
  fecha_inicio: string
  fecha_fin: string
  motivo: string
  archivo_url?: string
  archivo_nombre?: string
  estado: EstadoJustificante
  observaciones?: string
  nombre_padre: string
  telefono?: string
  revisado_por?: string
  revisado_at?: string
  created_at: string
  updated_at: string
  alumnos?: Alumno
}

export interface Aviso {
  id: string
  titulo: string
  contenido: string
  categoria: string
  importante: boolean
  publicado: boolean
  fecha_expiracion?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface EventoCalendario {
  id: string
  titulo: string
  descripcion?: string
  fecha_inicio: string
  fecha_fin?: string
  tipo: TipoEvento
  color: string
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  rol: RolEnum
  nombre_completo?: string
  created_at: string
}
