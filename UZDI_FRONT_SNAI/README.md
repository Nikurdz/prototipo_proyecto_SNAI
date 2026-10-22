# UZDI_FRONT — Frontend Vue 3

Aplicación frontend del Sistema de Gestión Integral UZDI. Construida con Vue 3, TypeScript y Vite.

---

## Stack

| Dependencia | Rol |
| --- | --- |
| Vue 3.5 + TypeScript | Framework reactivo con `<script setup>` y Composition API |
| Vite 8 | Bundler y servidor de desarrollo con HMR |
| Vue Router 4 | Enrutamiento SPA con guards de autenticación |
| axios | Cliente HTTP con interceptor JWT automático |
| @lucide/vue | Íconos SVG como componentes Vue |

---

## Estructura

```text
src/
├── main.ts                     # Punto de entrada
├── App.vue                     # Componente raíz (RouterView)
├── design-system.css           # Tokens CSS y clases globales
│
├── router/
│   └── index.ts                # 10 rutas + guard de autenticación
│
├── layouts/
│   └── AppShell.vue            # Layout principal: sidebar, topbar, búsqueda global
│
├── views/
│   ├── LoginView.vue           # Autenticación
│   ├── DashboardView.vue       # Panel principal con métricas
│   ├── AdolescentesView.vue    # CRUD de adolescentes
│   ├── ExpedientesView.vue     # CRUD de expedientes
│   ├── MedidasView.vue         # CRUD de medidas socioeducativas
│   ├── ReportesView.vue        # Generación de reportes (5 tipos)
│   ├── PerfilView.vue          # Perfil del usuario logueado
│   ├── UsuariosView.vue        # Gestión de usuarios del sistema
│   └── ParametrosView.vue      # Configuración institucional
│
├── components/
│   ├── dashboard/              # DashBarChart, DashDonut, DashboardSkeleton, QuickAccessCard, RevisionListCard
│   ├── ui/                     # ConfirmModal, EmptyState, FormPanel, PageHeader, SearchBar, StatusBadge
│   ├── adolescentes/           # AdolescenteForm
│   ├── expedientes/            # ExpedienteForm
│   ├── medidas/                # MedidaForm
│   └── reportes/               # ReportChartResult, ReportParams, ReportSummary, ReportTableResult
│
├── services/
│   ├── api.ts                  # Instancia axios + interceptor Bearer token
│   ├── auth.service.ts         # POST /api/v1/auth/login
│   ├── adolescente.service.ts  # CRUD /api/v1/adolescentes
│   ├── expediente.service.ts   # CRUD /api/v1/expedientes
│   ├── medida.service.ts       # CRUD /api/v1/medidas-socioeducativas
│   ├── usuario.service.ts      # CRUD /api/v1/users
│   ├── uzdi.service.ts         # GET/PATCH /api/v1/uzdi/:id
│   └── catalogo.service.ts     # Catálogos de referencia (etnias, estados civiles, UZDIs)
│
└── composables/
    ├── useAuth.ts              # Estado global de sesión (token + user en localStorage)
    └── useCatalogos.ts         # Carga perezosa de catálogos de referencia
```

---

## Rutas

```text
/                   → redirect /login
/login              → LoginView
/app/dashboard      → DashboardView    (default tras login)
/app/adolescentes   → AdolescentesView
/app/expedientes    → ExpedientesView
/app/medidas        → MedidasView
/app/reportes       → ReportesView
/app/perfil         → PerfilView
/app/usuarios       → UsuariosView
/app/parametros     → ParametrosView
```

El guard `router.beforeEach` redirige a `/login` si no hay `uzdi_token` en `localStorage`, y al dashboard si ya hay sesión activa e intenta acceder a `/login`. Además aplica RBAC: verifica `tppr_id` del usuario y redirige al dashboard si el rol no alcanza el mínimo requerido para la ruta solicitada.

---

## Control de acceso (RBAC)

El sistema usa el campo `tppr_id` de la sesión para determinar el rol del usuario logueado:

| tppr_id | Rol | Rutas disponibles |
| --- | --- | --- |
| 1 | Técnico | Dashboard, Adolescentes, Expedientes, Medidas, Perfil |
| 2 | Coordinador | Todo lo anterior + Reportes |
| 3 | Administrador | Todo + Usuarios, Parámetros |

El guard del router aplica estos mínimos en `/app/reportes` (min 2), `/app/usuarios` (min 3) y `/app/parametros` (min 3). El sidebar y la tarjeta de accesos rápidos del Dashboard se filtran con la misma lógica para que el usuario nunca vea enlaces a rutas sin acceso.

---

## Design System

`design-system.css` define todas las variables CSS y clases globales. No usa ningún framework de UI externo.

**Variables principales:**

```css
--color-brand-blue
--color-brand-blue-light
--color-surface / --color-surface-mute / --color-surface-soft
--color-text-primary / --color-text-secondary / --color-text-muted
--color-border
--color-success / --color-success-bg
--color-error / --color-error-bg
--radius-sm / --radius-md / --radius-lg / --radius-xl / --radius-full
```

**Clases globales de uso frecuente:**

| Clase | Uso |
| --- | --- |
| `.page` | Contenedor raíz de cada vista |
| `.hero` | Cabecera de página con eyebrow, título y descripción |
| `.card` | Panel con borde, radio y sombra suave |
| `.tbl` | Tabla con cabecera, hover por fila y badges |
| `.badge` + tono | Pill coloreado: `green`, `amber`, `red`, `slate`, `blue` |
| `.btn` / `.btn-primary` / `.btn-ghost` | Botones con variantes y `:active` |
| `.btn-sm` | Variante compacta para acciones en tabla |
| `.f-ctl` / `.f-label` / `.f-err` | Inputs, selects y textareas del sistema de formularios |
| `.modal` `.sm/.md/.lg` | Modal con backdrop oscuro |
| `.sk` | Skeleton shimmer para estados de carga |
| `.tool-search` / `.tool-select` | Barra de herramientas de filtros |

---

## Autenticación

El token JWT se guarda en `localStorage` bajo la clave `uzdi_token`. El composable `useAuth()` expone:

- `token` — ref con el token actual
- `user` — ref con los datos del usuario logueado
- `isLoggedIn` — computed boolean
- `setSession(token, user)` — guarda sesión
- `logout()` — limpia localStorage y refs

El servicio `api.ts` añade automáticamente `Authorization: Bearer <token>` a todas las peticiones axios.

---

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5174
npm run build     # Compilación de producción en dist/
npm run preview   # Sirve el build localmente
npx vue-tsc --noEmit  # Verificación de tipos TypeScript
```

El backend debe estar corriendo en `http://localhost:3000` para que los servicios funcionen. Si no está disponible, las vistas muestran tablas vacías sin errores visibles al usuario.
