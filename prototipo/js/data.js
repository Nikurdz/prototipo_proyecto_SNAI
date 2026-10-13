/* Datos semilla del prototipo SNAI-UZDI.
   TODOS los datos son ficticios. Los nombres de colecciones se inspiran en el modelo
   del documento de requerimientos (seguridad.prsn/prfl/sesn/pms, adolescente.*). */
window.SEED = (function () {
  var ALL = ['ver', 'crear', 'editar', 'eliminar'];

  var provincias = [
    { id: 1, nombre: 'Pichincha' }, { id: 2, nombre: 'Guayas' }, { id: 3, nombre: 'Azuay' },
    { id: 4, nombre: 'Manabí' }, { id: 5, nombre: 'Tungurahua' }
  ];

  var cantones = [
    [1, 'Quito', 1], [2, 'Rumiñahui', 1], [3, 'Mejía', 1], [4, 'Cayambe', 1],
    [5, 'Guayaquil', 2], [6, 'Durán', 2], [7, 'Daule', 2], [8, 'Samborondón', 2],
    [9, 'Cuenca', 3], [10, 'Gualaceo', 3], [11, 'Paute', 3],
    [12, 'Portoviejo', 4], [13, 'Manta', 4], [14, 'Ambato', 5], [15, 'Baños', 5]
  ].map(function (c) { return { id: c[0], nombre: c[1], provinciaId: c[2] }; });

  var nacionalidades = ['Ecuatoriana', 'Colombiana', 'Venezolana', 'Peruana', 'Cubana', 'Otra']
    .map(function (n, i) { return { id: i + 1, nombre: n }; });
  var estadosCiviles = ['Soltero/a', 'Casado/a', 'Unión de hecho', 'Divorciado/a', 'Viudo/a']
    .map(function (n, i) { return { id: i + 1, nombre: n }; });
  var etnias = ['Mestizo/a', 'Indígena', 'Afroecuatoriano/a', 'Montubio/a', 'Blanco/a', 'Otra']
    .map(function (n, i) { return { id: i + 1, nombre: n }; });

  var uzdis = [
    { id: 1, nombre: 'UZDI Quito', provinciaId: 1, cantonId: 1, direccion: 'Av. Amazonas N24-15 y Colón', responsable: 'Dra. Patricia Almeida (ficticia)' },
    { id: 2, nombre: 'UZDI Guayaquil', provinciaId: 2, cantonId: 5, direccion: 'Av. 9 de Octubre 1204 y Boyacá', responsable: 'Lic. Marcelo Quinde (ficticio)' },
    { id: 3, nombre: 'UZDI Cuenca', provinciaId: 3, cantonId: 9, direccion: 'Calle Larga 7-35 y Hermano Miguel', responsable: 'Dra. Lucía Paredes (ficticia)' }
  ];

  var perfiles = [
    [1, 'Superadministrador', 'Máximo control: configuración general, usuarios, permisos y reportes globales.'],
    [2, 'Administrador', 'Administración operativa: usuarios, perfiles, permisos y datos de apoyo.'],
    [3, 'Coordinador de Área', 'Supervisa al equipo técnico, consulta información consolidada y reportes.'],
    [4, 'Trabajador Social', 'Registra información de adolescentes, contexto familiar y datos sociofamiliares.'],
    [5, 'Psicólogo', 'Registra y consulta información psicológica del adolescente.'],
    [6, 'Educador', 'Registra información educativa, talleres y asistencia.'],
    [7, 'Jurídico', 'Gestiona expedientes, medidas socioeducativas y estado jurídico del proceso.']
  ].map(function (p) { return { id: p[0], nombre: p[1], descripcion: p[2], sistema: true }; });

  var permisos = {
    1: { usuarios: ALL, permisos: ALL, adolescentes: ALL, expedientes: ALL, gdos: ALL, medidas: ALL, uzdis: ['ver'], informes: ['ver'] },
    2: { usuarios: ALL, permisos: ['ver', 'crear', 'editar'], gdos: ALL, medidas: ALL, uzdis: ['ver'], informes: ['ver'] },
    3: { adolescentes: ['ver'], expedientes: ['ver'], gdos: ['ver'], medidas: ['ver'], uzdis: ['ver'], informes: ['ver'] },
    4: { adolescentes: ALL, expedientes: ['ver'], gdos: ['ver'], medidas: ['ver'], informes: ['ver'] },
    5: { adolescentes: ['ver'], expedientes: ['ver'], medidas: ['ver'], informes: ['ver'] },
    6: { adolescentes: ['ver'], medidas: ['ver'], informes: ['ver'] },
    7: { adolescentes: ['ver'], expedientes: ALL, medidas: ALL, informes: ['ver'] }
  };

  // Contraseña de todos los usuarios demo: Snai2026
  var usuarios = [
    [1, 'Sofía', 'Valarezo', 'superadmin', 1, null],
    [2, 'Andrés', 'Naranjo', 'admin', 2, 1],
    [3, 'Paola', 'Cisneros', 'coordinador', 3, 1],
    [4, 'Marta', 'Guerra', 'tsocial', 4, 1],
    [5, 'Esteban', 'Lasso', 'psicologo', 5, 1],
    [6, 'Raúl', 'Montalvo', 'educador', 6, 1],
    [7, 'Carolina', 'Ibarra', 'juridico', 7, 1],
    [8, 'Diego', 'Salcedo', 'tsocial.gye', 4, 2]
  ].map(function (u, i) {
    return {
      id: u[0], nombres: u[1], apellidos: u[2], usuario: u[3],
      correo: u[3].replace('.', '_') + '@uzdi.demo.ec',
      cedula: String(1710000000 + (i + 1) * 4219), clave: 'Snai2026',
      perfilId: u[4], uzdiId: u[5], activo: true
    };
  });

  var gdos = [
    [1, 'GDO Alfa', 'Grupo con presencia en el norte urbano; actividades de extorsión menor.', 'Quito norte', 'Alto'],
    [2, 'GDO Bravo', 'Grupo vinculado a microtráfico en entornos educativos.', 'Quito centro-sur', 'Medio'],
    [3, 'GDO Delta', 'Grupo con presencia en puerto y zonas periféricas.', 'Guayaquil sur', 'Alto'],
    [4, 'GDO Sigma', 'Grupo de reciente identificación; información en verificación.', 'Durán', 'Bajo'],
    [5, 'GDO Omega', 'Grupo con actividad en zonas rurales cercanas.', 'Cuenca / Gualaceo', 'Medio']
  ].map(function (g) { return { id: g[0], nombre: g[1], descripcion: g[2], ambito: g[3], nivelRiesgo: g[4], activo: true }; });

  // Valores referenciales para la demo (no sustituyen la normativa vigente).
  var medidas = [
    [1, 'Amonestación', 'No privativa de libertad', 1, 'Llamado de atención verbal con orientación al adolescente y su familia.'],
    [2, 'Imposición de reglas de conducta', 'No privativa de libertad', 12, 'Obligaciones y prohibiciones fijadas por el juez para la convivencia.'],
    [3, 'Orientación y apoyo psico-socio-familiar', 'No privativa de libertad', 12, 'Acompañamiento técnico al adolescente y a su núcleo familiar.'],
    [4, 'Servicio a la comunidad', 'No privativa de libertad', 6, 'Actividades de beneficio comunitario sin remuneración.'],
    [5, 'Libertad asistida', 'No privativa de libertad', 12, 'Seguimiento y orientación del adolescente en libertad.'],
    [6, 'Internamiento domiciliario', 'Privativa de libertad', 12, 'Restricción de libertad en el domicilio del adolescente.'],
    [7, 'Internamiento de fin de semana', 'Privativa de libertad', 12, 'Permanencia en centro durante los fines de semana.'],
    [8, 'Internamiento con régimen semiabierto', 'Privativa de libertad', 36, 'Internamiento con salidas controladas para actividades educativas.'],
    [9, 'Internamiento institucional', 'Privativa de libertad', 96, 'Internamiento en centro de adolescentes infractores.']
  ].map(function (m) { return { id: m[0], nombre: m[1], tipo: m[2], duracionMaxMeses: m[3], descripcion: m[4], activo: true }; });

  // id, nombres, apellidos, nacimiento, sexo, nac, etnia, ec, provincia, canton, direccion, uzdi, gdo, estado
  var adolescentes = [
    [1, 'Mateo', 'Andrade Pozo', '2010-03-14', 'Masculino', 1, 1, 1, 1, 1, 'Cdla. La Delicia, calle 5 y Oe3', 1, 1, 'activo'],
    [2, 'Sebastián', 'Cevallos Mora', '2009-11-02', 'Masculino', 1, 1, 1, 1, 1, 'Cotocollao, Av. Occidental S/N', 1, null, 'activo'],
    [3, 'Camila', 'Torres Vega', '2010-07-21', 'Femenino', 1, 2, 1, 1, 2, 'Sangolquí, barrio El Colibrí', 1, null, 'activo'],
    [4, 'Daniel', 'Rueda Salas', '2009-05-30', 'Masculino', 2, 1, 1, 1, 1, 'Solanda, Mz 12 casa 8', 1, 2, 'activo'],
    [5, 'Valentina', 'Quispe León', '2011-01-18', 'Femenino', 1, 2, 1, 1, 4, 'Cayambe, barrio San Pablo', 1, null, 'activo'],
    [6, 'Joel', 'Macías Zambrano', '2010-09-09', 'Masculino', 1, 4, 1, 1, 3, 'Machachi, calle Bolívar', 1, null, 'baja'],
    [7, 'Kevin', 'Ortiz Barre', '2009-12-12', 'Masculino', 1, 3, 1, 2, 5, 'Guasmo Sur, Coop. Nueva Prosperina', 2, 3, 'activo'],
    [8, 'Andrea', 'Franco Peña', '2010-04-04', 'Femenino', 1, 1, 1, 2, 6, 'Durán, Ciudadela El Recreo', 2, null, 'activo'],
    [9, 'Bryan', 'Villón Cedeño', '2010-02-27', 'Masculino', 1, 1, 1, 2, 5, 'Bastión Popular, bloque 3', 2, 3, 'activo'],
    [10, 'Génesis', 'Mero Alcívar', '2011-06-15', 'Femenino', 3, 4, 1, 2, 7, 'Daule, recinto Los Lojas', 2, null, 'activo'],
    [11, 'Anthony', 'Lema Guamán', '2009-08-08', 'Masculino', 1, 2, 1, 3, 9, 'Sayausí, vía a Chaucha', 3, null, 'activo'],
    [12, 'Doménica', 'Sarmiento Ávila', '2010-10-23', 'Femenino', 1, 1, 1, 3, 9, 'El Batán, calle Los Pinos', 3, null, 'activo'],
    [13, 'Ismael', 'Pacheco Jara', '2010-01-30', 'Masculino', 1, 1, 1, 3, 10, 'Gualaceo, barrio Jadán', 3, 5, 'activo']
  ].map(function (a, i) {
    return {
      id: a[0], cedula: String(1750000000 + (i + 1) * 7331), nombres: a[1], apellidos: a[2],
      fechaNacimiento: a[3], sexo: a[4], nacionalidadId: a[5], etniaId: a[6], estadoCivilId: a[7],
      provinciaId: a[8], cantonId: a[9], direccion: a[10], telefono: '09' + String(80000000 + (i + 1) * 31337).slice(0, 8),
      uzdiId: a[11], gdoId: a[12], estado: a[13], observaciones: ''
    };
  });

  var JUZ = { 1: 'Unidad Judicial de Adolescentes Infractores - Quito', 2: 'Unidad Judicial de Adolescentes Infractores - Guayaquil', 3: 'Unidad Judicial de Adolescentes Infractores - Cuenca' };
  // id, adolescente, infracción, medida, meses, ingreso, estado, cierre
  var expedientes = [
    [1, 1, 'Robo agravado', 5, 12, '2026-01-12', 'activo', null],
    [2, 2, 'Tenencia ilegal de armas', 2, 6, '2026-02-03', 'activo', null],
    [3, 3, 'Hurto', 4, 4, '2026-02-20', 'cerrado', '2026-06-20'],
    [4, 4, 'Tráfico ilícito de sustancias', 9, 24, '2026-03-15', 'activo', null],
    [5, 5, 'Lesiones', 3, 6, '2026-04-02', 'activo', null],
    [6, 6, 'Daño a bien ajeno', 1, 1, '2026-01-05', 'cerrado', '2026-02-05'],
    [7, 7, 'Robo', 8, 24, '2026-03-01', 'activo', null],
    [8, 8, 'Hurto', 4, 3, '2026-05-10', 'activo', null],
    [9, 9, 'Extorsión', 5, 12, '2026-06-01', 'activo', null],
    [10, 11, 'Lesiones', 2, 6, '2026-04-22', 'activo', null],
    [11, 13, 'Robo agravado', 7, 6, '2026-07-14', 'activo', null]
  ].map(function (e) {
    var ad = adolescentes.filter(function (a) { return a.id === e[1]; })[0];
    return {
      id: e[0], numero: 'EXP-2026-' + String(e[0]).padStart(3, '0'), adolescenteId: e[1], uzdiId: ad.uzdiId,
      infraccion: e[2], unidadJudicial: JUZ[ad.uzdiId], medidaId: e[3], duracionMeses: e[4],
      fechaIngreso: e[5], estado: e[6], fechaCierre: e[7], observaciones: ''
    };
  });

  var sesiones = [];

  return {
    version: 1,
    provincias: provincias, cantones: cantones, nacionalidades: nacionalidades,
    estadosCiviles: estadosCiviles, etnias: etnias, uzdis: uzdis,
    perfiles: perfiles, permisos: permisos, usuarios: usuarios, gdos: gdos,
    medidas: medidas, adolescentes: adolescentes, expedientes: expedientes, sesiones: sesiones
  };
})();
