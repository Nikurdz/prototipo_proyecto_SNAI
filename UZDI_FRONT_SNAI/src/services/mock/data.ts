// Datos ficticios del modo demo (VITE_USE_MOCK=true). No representan personas reales.
// Las formas coinciden con los DTO de src/services/*.service.ts.
type Row = Record<string, any>

export const DEMO_PASSWORD = 'Snai2026'

export const nacionalidades: Row[] = ['Ecuatoriana', 'Colombiana', 'Venezolana', 'Peruana', 'Cubana', 'Otra']
  .map((nombre, i) => ({ id: i + 1, nombre }))
export const estadosCiviles: Row[] = ['Soltero/a', 'Casado/a', 'Unión de hecho', 'Divorciado/a', 'Viudo/a']
  .map((nombre, i) => ({ id: i + 1, nombre }))
export const etnias: Row[] = ['Mestizo/a', 'Indígena', 'Afroecuatoriano/a', 'Montubio/a', 'Blanco/a', 'Otra']
  .map((nombre, i) => ({ id: i + 1, nombre }))
export const gdos: Row[] = ['GDO Alfa', 'GDO Bravo', 'GDO Delta', 'GDO Sigma', 'GDO Omega']
  .map((nombre, i) => ({ id: i + 1, nombre }))
export const cantones: Row[] = [
  'Quito', 'Rumiñahui', 'Mejía', 'Cayambe', 'Guayaquil', 'Durán', 'Daule', 'Samborondón',
  'Cuenca', 'Gualaceo', 'Paute', 'Portoviejo', 'Manta', 'Ambato', 'Baños',
].map((nombre, i) => ({ id: i + 1, nombre }))

export const uzdis: Row[] = [
  { id: 1, nombre: 'UZDI Quito', zona: 'Zona 9', direccion: 'Av. Amazonas N24-15 y Colón', telefono: '022555101', correo: 'quito@uzdi.demo.ec', cntn_id: 1 },
  { id: 2, nombre: 'UZDI Guayaquil', zona: 'Zona 8', direccion: 'Av. 9 de Octubre 1204 y Boyacá', telefono: '042555202', correo: 'guayaquil@uzdi.demo.ec', cntn_id: 5 },
  { id: 3, nombre: 'UZDI Cuenca', zona: 'Zona 6', direccion: 'Calle Larga 7-35 y Hermano Miguel', telefono: '072555303', correo: 'cuenca@uzdi.demo.ec', cntn_id: 9 },
]

export const infracciones: Row[] = [
  { id: 1, nombre: 'Robo agravado', categoria: 'Contra la propiedad' },
  { id: 2, nombre: 'Hurto', categoria: 'Contra la propiedad' },
  { id: 3, nombre: 'Daño a bien ajeno', categoria: 'Contra la propiedad' },
  { id: 4, nombre: 'Tenencia ilegal de armas', categoria: 'Seguridad pública' },
  { id: 5, nombre: 'Tráfico ilícito de sustancias', categoria: 'Drogas' },
  { id: 6, nombre: 'Lesiones', categoria: 'Contra la integridad' },
  { id: 7, nombre: 'Extorsión', categoria: 'Contra la propiedad' },
]

export const medidas: Row[] = [
  ['Amonestación', 1], ['Imposición de reglas de conducta', 12], ['Orientación y apoyo psico-socio-familiar', 12],
  ['Servicio a la comunidad', 6], ['Libertad asistida', 12], ['Internamiento domiciliario', 12],
  ['Internamiento de fin de semana', 12], ['Internamiento con régimen semiabierto', 36], ['Internamiento institucional', 96],
].map(([nombre, duracion_meses], i) => ({ id: i + 1, nombre, duracion_meses }))

// nombre, apellido, nacimiento, sexo, nacionalidad, etnia, estado civil, cantón, uzdi, gdo
const ADOLESCENTES: [string, string, string, string, number, number, number, number, number, number | null][] = [
  ['Mateo', 'Andrade Pozo', '2010-03-14', 'Masculino', 1, 1, 1, 1, 1, 1],
  ['Sebastián', 'Cevallos Mora', '2009-11-02', 'Masculino', 1, 1, 1, 1, 1, null],
  ['Camila', 'Torres Vega', '2010-07-21', 'Femenino', 1, 2, 1, 2, 1, null],
  ['Daniel', 'Rueda Salas', '2009-05-30', 'Masculino', 2, 1, 1, 1, 1, 2],
  ['Valentina', 'Quispe León', '2011-01-18', 'Femenino', 1, 2, 1, 4, 1, null],
  ['Joel', 'Macías Zambrano', '2010-09-09', 'Masculino', 1, 4, 1, 3, 1, null],
  ['Kevin', 'Ortiz Barre', '2009-12-12', 'Masculino', 1, 3, 1, 5, 2, 3],
  ['Andrea', 'Franco Peña', '2010-04-04', 'Femenino', 1, 1, 1, 6, 2, null],
  ['Bryan', 'Villón Cedeño', '2010-02-27', 'Masculino', 1, 1, 1, 5, 2, 3],
  ['Génesis', 'Mero Alcívar', '2011-06-15', 'Femenino', 3, 4, 1, 7, 2, null],
  ['Anthony', 'Lema Guamán', '2009-08-08', 'Masculino', 1, 2, 1, 9, 3, null],
  ['Doménica', 'Sarmiento Ávila', '2010-10-23', 'Femenino', 1, 1, 1, 9, 3, null],
  ['Ismael', 'Pacheco Jara', '2010-01-30', 'Masculino', 1, 1, 1, 10, 3, 5],
]

export const adolescentes: Row[] = ADOLESCENTES.map((a, i) => ({
  id: i + 1,
  cedula: String(1750000000 + (i + 1) * 7331),
  nombre: a[0],
  apellido: a[1],
  fecha_nac: a[2],
  sexo: a[3],
  nacn_id: a[4],
  etna_id: a[5],
  etcv_id: a[6],
  cntn_id: a[7],
  uzdi_id: a[8],
  gdo_id: a[9],
  hijos: 0,
  reincide: i === 3 || i === 8,
  hijoPpl: false,
  nved_nombre: null,
  fecha_ingr: '2026-0' + (1 + (i % 6)) + '-1' + (i % 9),
  observaciones: '',
}))

function addMonths(iso: string, m: number): string {
  const d = new Date(iso + 'T00:00:00')
  d.setMonth(d.getMonth() + m)
  return d.toISOString().slice(0, 10)
}

// adolescente, infracción, medida, meses, inicio, fin (opcional), estado especial (si no, se calcula)
const EXPEDIENTES: [number, number, number, number, string, string | null, string | null][] = [
  [1, 1, 5, 12, '2026-01-12', null, null],
  [2, 4, 2, 6, '2026-02-03', null, null],
  [3, 2, 4, 4, '2026-02-20', null, null],
  [4, 5, 9, 24, '2026-03-15', null, 'Incomparecencia'],
  [5, 6, 3, 6, '2026-04-02', null, null],
  [6, 3, 1, 1, '2026-01-05', null, null],
  [7, 1, 8, 24, '2026-03-01', null, null],
  [8, 2, 4, 3, '2026-05-10', null, null],
  [9, 7, 5, 12, '2026-06-01', null, null],
  [11, 6, 2, 6, '2026-04-22', null, null],
  [13, 1, 7, 6, '2026-07-14', null, null],
]
const HOY = new Date().toISOString().slice(0, 10)

export const expedientes: Row[] = EXPEDIENTES.map((e, i) => {
  const fin = e[5] ?? addMonths(e[4], e[3])
  const estado = e[6] ?? (fin < HOY ? 'Atraso' : 'En proceso')
  return {
    id: i + 1,
    adlc_id: e[0],
    uzdi_id: adolescentes[e[0] - 1].uzdi_id,
    infc_id: e[1],
    mdso_id: e[2],
    estado,
    fecha_inicio_medida: e[4],
    fecha_fin_medida: fin,
  }
})

// login, nombres, apellidos, tppr_id, uzdi_id
const USUARIOS: [string, string, string, number, number][] = [
  ['superadmin', 'Sofía', 'Valarezo', 4, 1],
  ['admin', 'Andrés', 'Naranjo', 3, 1],
  ['coordinador', 'Paola', 'Cisneros', 2, 1],
  ['tsocial', 'Marta', 'Guerra', 1, 1],
  ['psicologo', 'Esteban', 'Lasso', 6, 1],
  ['educador', 'Raúl', 'Montalvo', 7, 1],
  ['juridico', 'Carolina', 'Ibarra', 8, 1],
  ['tsocial.gye', 'Diego', 'Salcedo', 1, 2],
]

export const ROLES: Row[] = [
  { id: 1, nombre: 'Trabajador Social' }, { id: 2, nombre: 'Coordinador de área' }, { id: 3, nombre: 'Administrador' },
  { id: 4, nombre: 'Superadministrador' }, { id: 5, nombre: 'Usuario' }, { id: 6, nombre: 'Psicólogo' },
  { id: 7, nombre: 'Educador' }, { id: 8, nombre: 'Jurídico' },
]

export const usuarios: Row[] = USUARIOS.map((u, i) => ({
  id: i + 1,
  login: u[0],
  nombres: u[1],
  apellidos: u[2],
  correo: u[0].replace('.', '_') + '@uzdi.demo.ec',
  telefono: '09' + String(81000000 + (i + 1) * 4219).slice(0, 8),
  tppr_id: u[3],
  uzdi_id: u[4],
  roles: [ROLES[u[3] - 1]],
  password: DEMO_PASSWORD,
}))
