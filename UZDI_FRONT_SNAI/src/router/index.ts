import { createRouter, createWebHistory } from 'vue-router'
import LoginView        from '../views/LoginView.vue'
import AppShell         from '../layouts/AppShell.vue'
import DashboardView    from '../views/DashboardView.vue'
import AdolescentesView from '../views/AdolescentesView.vue'
import ExpedientesView  from '../views/ExpedientesView.vue'
import MedidasView      from '../views/MedidasView.vue'
import ReportesView     from '../views/ReportesView.vue'
import PerfilView       from '../views/PerfilView.vue'
import UsuariosView     from '../views/UsuariosView.vue'
import ParametrosView   from '../views/ParametrosView.vue'

import { ROUTE_MIN_LEVEL, levelFor } from './access'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginView },
    {
      path: '/app',
      component: AppShell,
      redirect: '/app/dashboard',
      children: [
        { path: 'dashboard',    component: DashboardView },
        { path: 'adolescentes', component: AdolescentesView },
        { path: 'expedientes',  component: ExpedientesView },
        { path: 'medidas',      component: MedidasView },
        { path: 'reportes',     component: ReportesView },
        { path: 'perfil',       component: PerfilView },
        { path: 'usuarios',     component: UsuariosView },
        { path: 'parametros',   component: ParametrosView },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const isLoggedIn = !!localStorage.getItem('uzdi_token')

  if (to.path.startsWith('/app') && !isLoggedIn) return '/login'
  if (to.path === '/login' && isLoggedIn) return '/app/dashboard'

  if (isLoggedIn) {
    const user = JSON.parse(localStorage.getItem('uzdi_user') ?? 'null') as Record<string, unknown> | null
    const level = levelFor(user?.tppr_id as number | undefined)

    const entry = Object.entries(ROUTE_MIN_LEVEL).find(([path]) => to.path.startsWith(path))
    if (entry && level < entry[1]) return '/app/dashboard'
  }
})

export default router
