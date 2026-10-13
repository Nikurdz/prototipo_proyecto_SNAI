# Prototipo SNAI · UZDI (Sprint inicial)

Prototipo navegable, **solo frontend con datos simulados**, del sistema de información para las Unidades Zonales de Desarrollo Integral. Base: `docs/grupo 1 requerimientos y diseño.md`.

## Cómo abrirlo
Doble clic en `index.html` (no requiere instalación, build ni servidor). Los datos se guardan en el `localStorage` del navegador; "Restablecer datos demo" los reinicia.

Las tipografías (Bricolage Grotesque y Atkinson Hyperlegible Next) se cargan desde Google Fonts; sin internet la interfaz usa las fuentes del sistema y sigue funcionando igual.

## Usuarios demo
Contraseña de todos: `Snai2026`. La pantalla de ingreso tiene botones de acceso rápido.

| Usuario | Perfil | UZDI |
|---|---|---|
| `superadmin` | Superadministrador | Todas |
| `admin` | Administrador | Quito |
| `coordinador` | Coordinador de Área | Quito |
| `tsocial` | Trabajador Social | Quito |
| `psicologo` | Psicólogo | Quito |
| `educador` | Educador | Quito |
| `juridico` | Jurídico | Quito |
| `tsocial.gye` | Trabajador Social | Guayaquil (demuestra el alcance por UZDI) |

## Qué incluye
| Requerimiento | Pantalla |
|---|---|
| RF-21 | Ingreso (bloqueo de 2 min tras 3 intentos fallidos) |
| RF-01, RF-11 | Usuarios (CRUD, asociación a UZDI) y consulta de UZDIs |
| RF-10, RF-12 | Permisos y perfiles (matriz módulo × acción editable; crear/editar/eliminar perfiles) |
| RF-02 | Adolescentes (CRUD, ficha, baja lógica, provincia→cantón) |
| RF-03 | Expedientes (CRUD, N° automático, estado activo/cerrado) |
| RF-04 | GDOs (CRUD; consulta para Trabajador Social) |
| RF-05 | Medidas socioeducativas (catálogo) |
| RF-09, 17, 18, 19, 20 | Catálogos de cantones, provincias, nacionalidad, estado civil y etnia (selectores) |
| RF-16 | Informes con tabla, gráfico de barras, exportación CSV e impresión / PDF |

**No incluido (próximo sprint):** RF-06 fichas, RF-07 representantes, RF-08 contexto familiar, RF-13 vínculos, RF-14/15 talleres y asistencia.

## Supuestos adoptados (preguntas pendientes del documento)
- Cada usuario ve solo los datos de su UZDI; el Superadministrador ve todas.
- Usuario ↔ UZDI es obligatorio salvo para el Superadministrador.
- Los expedientes cerrados son consultables (filtro de estado).
- En RF-04 el documento indica Administrador y Trabajador Social como actor: aquí el Administrador gestiona los GDOs y el Trabajador Social los consulta.
- Un expediente tiene una única medida socioeducativa.
- Informes exportables a CSV e imprimibles (PDF desde el navegador); cada perfil solo ve los informes de módulos que puede consultar.
- Sin recuperación de contraseña. Las contraseñas están en texto plano solo por ser un prototipo.
- Todos los datos son ficticios; las duraciones de las medidas son valores referenciales de demostración.

## Estructura
`js/data.js` (semilla) · `js/store.js` (mini-BD en localStorage) · `js/auth.js` (login y permisos) · `js/ui.js` (modal, formularios y CRUD genérico) · `js/views/*` (una pantalla por módulo) · `js/router.js`.
