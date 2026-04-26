-- ============================================================
-- ESCUELA SECUNDARIA FEDERAL "10 DE ABRIL"
-- Schema SQL para Supabase — Emiliano Zapata, Morelos
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------
CREATE TYPE grado_enum AS ENUM ('1ro', '2do', '3ro');
CREATE TYPE grupo_enum AS ENUM ('A', 'B', 'C', 'D', 'E', 'F');
CREATE TYPE turno_enum AS ENUM ('Matutino', 'Vespertino');
CREATE TYPE trimestre_enum AS ENUM ('1', '2', '3');
CREATE TYPE estado_justificante AS ENUM ('En revisión', 'Aprobado', 'Rechazado');
CREATE TYPE rol_enum AS ENUM ('admin', 'trabajo_social', 'publico');
CREATE TYPE tipo_evento AS ENUM ('Suspension', 'Consejo Tecnico', 'Entrega Boletas', 'Evento', 'Festivo', 'Examen');

-- -----------------------------------------------------------
-- TABLA: alumnos
-- Alcance actual: 2do grado, turno matutino, grupos A-F
-- -----------------------------------------------------------
CREATE TABLE alumnos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  curp             VARCHAR(18) NOT NULL UNIQUE,
  nombre           VARCHAR(100) NOT NULL,
  apellido_paterno VARCHAR(100) NOT NULL,
  apellido_materno VARCHAR(100),
  grado            grado_enum NOT NULL DEFAULT '2do',
  grupo            grupo_enum NOT NULL,
  turno            turno_enum NOT NULL DEFAULT 'Matutino',
  numero_lista     SMALLINT,
  activo           BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- TABLA: materias
-- -----------------------------------------------------------
CREATE TABLE materias (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre     VARCHAR(150) NOT NULL,
  clave      VARCHAR(20),
  grado      grado_enum,
  orden      SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- TABLA: calificaciones
-- -----------------------------------------------------------
CREATE TABLE calificaciones (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alumno_id     UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  materia_id    UUID NOT NULL REFERENCES materias(id) ON DELETE CASCADE,
  trimestre     trimestre_enum NOT NULL,
  calificacion  NUMERIC(4,1) CHECK (calificacion >= 0 AND calificacion <= 10),
  ciclo_escolar VARCHAR(9) NOT NULL DEFAULT '2024-2025',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (alumno_id, materia_id, trimestre, ciclo_escolar)
);

-- -----------------------------------------------------------
-- TABLA: justificantes
-- -----------------------------------------------------------
CREATE SEQUENCE folio_seq START 1;

CREATE TABLE justificantes (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  folio            VARCHAR(20) UNIQUE,
  alumno_id        UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
  fecha_inicio     DATE NOT NULL,
  fecha_fin        DATE NOT NULL,
  motivo           TEXT NOT NULL,
  archivo_url      TEXT,
  archivo_nombre   VARCHAR(255),
  estado           estado_justificante NOT NULL DEFAULT 'En revisión',
  observaciones    TEXT,
  nombre_padre     VARCHAR(200) NOT NULL,
  telefono         VARCHAR(15),
  revisado_por     UUID REFERENCES auth.users(id),
  revisado_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-genera folio JUS-YYYYMM-0001
CREATE OR REPLACE FUNCTION fn_set_folio()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.folio := 'JUS-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(nextval('folio_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_folio
  BEFORE INSERT ON justificantes
  FOR EACH ROW EXECUTE FUNCTION fn_set_folio();

-- -----------------------------------------------------------
-- TABLA: avisos
-- -----------------------------------------------------------
CREATE TABLE avisos (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo           VARCHAR(255) NOT NULL,
  contenido        TEXT NOT NULL,
  categoria        VARCHAR(50) NOT NULL DEFAULT 'General',
  importante       BOOLEAN NOT NULL DEFAULT false,
  publicado        BOOLEAN NOT NULL DEFAULT true,
  fecha_expiracion TIMESTAMPTZ,
  created_by       UUID REFERENCES auth.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- TABLA: eventos_calendario
-- -----------------------------------------------------------
CREATE TABLE eventos_calendario (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo      VARCHAR(255) NOT NULL,
  descripcion TEXT,
  fecha_inicio DATE NOT NULL,
  fecha_fin    DATE,
  tipo         tipo_evento NOT NULL DEFAULT 'Evento',
  color        VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
  created_by   UUID REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- TABLA: user_roles  (extiende auth.users de Supabase)
-- -----------------------------------------------------------
CREATE TABLE user_roles (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  rol            rol_enum NOT NULL DEFAULT 'publico',
  nombre_completo VARCHAR(200),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------
-- FUNCIÓN auxiliar para obtener rol del usuario autenticado
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS rol_enum LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT rol FROM user_roles WHERE user_id = auth.uid();
$$;

-- -----------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------
ALTER TABLE alumnos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE materias         ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones   ENABLE ROW LEVEL SECURITY;
ALTER TABLE justificantes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE avisos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_calendario ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles       ENABLE ROW LEVEL SECURITY;

-- alumnos
CREATE POLICY "alumnos_select_public" ON alumnos FOR SELECT USING (true);
CREATE POLICY "alumnos_all_admin"     ON alumnos FOR ALL   USING (get_my_role() = 'admin');

-- materias
CREATE POLICY "materias_select_public" ON materias FOR SELECT USING (true);
CREATE POLICY "materias_all_admin"     ON materias FOR ALL   USING (get_my_role() = 'admin');

-- calificaciones
CREATE POLICY "calificaciones_select_public" ON calificaciones FOR SELECT USING (true);
CREATE POLICY "calificaciones_all_admin"     ON calificaciones FOR ALL   USING (get_my_role() = 'admin');

-- justificantes
CREATE POLICY "justificantes_insert_anyone" ON justificantes FOR INSERT WITH CHECK (true);
CREATE POLICY "justificantes_select_staff"  ON justificantes FOR SELECT USING (get_my_role() IN ('admin', 'trabajo_social'));
CREATE POLICY "justificantes_update_staff"  ON justificantes FOR UPDATE USING (get_my_role() IN ('admin', 'trabajo_social'));
CREATE POLICY "justificantes_delete_admin"  ON justificantes FOR DELETE USING (get_my_role() = 'admin');

-- avisos
CREATE POLICY "avisos_select_public"  ON avisos FOR SELECT USING (publicado = true);
CREATE POLICY "avisos_all_admin"      ON avisos FOR ALL   USING (get_my_role() = 'admin');

-- eventos_calendario
CREATE POLICY "eventos_select_public" ON eventos_calendario FOR SELECT USING (true);
CREATE POLICY "eventos_all_admin"     ON eventos_calendario FOR ALL   USING (get_my_role() = 'admin');

-- user_roles
CREATE POLICY "roles_select_own"   ON user_roles FOR SELECT USING (user_id = auth.uid() OR get_my_role() = 'admin');
CREATE POLICY "roles_all_admin"    ON user_roles FOR ALL   USING (get_my_role() = 'admin');

-- -----------------------------------------------------------
-- ÍNDICES
-- -----------------------------------------------------------
CREATE INDEX idx_alumnos_curp          ON alumnos(curp);
CREATE INDEX idx_alumnos_grupo         ON alumnos(grado, grupo, turno);
CREATE INDEX idx_calificaciones_alumno ON calificaciones(alumno_id);
CREATE INDEX idx_justificantes_alumno  ON justificantes(alumno_id);
CREATE INDEX idx_justificantes_estado  ON justificantes(estado);
CREATE INDEX idx_avisos_publicado      ON avisos(publicado, created_at DESC);

-- -----------------------------------------------------------
-- DATOS INICIALES — Materias 2do grado
-- -----------------------------------------------------------
INSERT INTO materias (nombre, clave, grado, orden) VALUES
  ('Español',                          'ESP2', '2do', 1),
  ('Matemáticas',                      'MAT2', '2do', 2),
  ('Ciencias (Física)',                'FIS2', '2do', 3),
  ('Historia',                         'HIS2', '2do', 4),
  ('Geografía',                        'GEO2', '2do', 5),
  ('Formación Cívica y Ética',         'FCE2', '2do', 6),
  ('Inglés',                           'ING2', '2do', 7),
  ('Educación Física',                 'EDF2', '2do', 8),
  ('Tecnología',                       'TEC2', '2do', 9),
  ('Artes',                            'ART2', '2do', 10);

-- -----------------------------------------------------------
-- DATOS INICIALES — Avisos de ejemplo
-- -----------------------------------------------------------
INSERT INTO avisos (titulo, contenido, categoria, importante) VALUES
  ('Bienvenidos al Ciclo Escolar 2024-2025',
   'La escuela da la bienvenida a todos los alumnos y padres de familia al nuevo ciclo escolar.',
   'General', true),
  ('Horario de entrega de boletas',
   'La entrega de boletas del primer trimestre será el próximo viernes en el salón de usos múltiples.',
   'Académico', false);

-- -----------------------------------------------------------
-- DATOS INICIALES — Eventos de calendario
-- -----------------------------------------------------------
INSERT INTO eventos_calendario (titulo, descripcion, fecha_inicio, fecha_fin, tipo, color) VALUES
  ('Inicio de clases',          'Inicio oficial del ciclo escolar',          '2024-08-26', NULL,         'Evento',           '#10B981'),
  ('Consejo Técnico Escolar',   'Reunión mensual de consejo técnico',        '2024-09-06', NULL,         'Consejo Tecnico',  '#8B5CF6'),
  ('Día de la Independencia',   'Suspensión por día festivo',                '2024-09-16', NULL,         'Festivo',          '#EF4444'),
  ('Entrega de Boletas T1',     'Entrega de boletas del primer trimestre',   '2024-11-15', NULL,         'Entrega Boletas',  '#F59E0B'),
  ('Vacaciones de Invierno',    'Período vacacional de invierno',            '2024-12-20', '2025-01-05', 'Suspension',       '#6B7280');
