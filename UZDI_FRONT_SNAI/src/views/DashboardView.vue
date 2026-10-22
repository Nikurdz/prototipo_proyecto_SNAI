<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { adolescenteService } from '../services/adolescente.service'
import { expedienteService } from '../services/expediente.service'
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton.vue'
import DashBarChart      from '../components/dashboard/DashBarChart.vue'
import DashDonut         from '../components/dashboard/DashDonut.vue'
import RevisionListCard  from '../components/dashboard/RevisionListCard.vue'
import QuickAccessCard   from '../components/dashboard/QuickAccessCard.vue'

const router = useRouter()
const { user } = useAuth()
const loading = ref(true)

type AdolRow = Awaited<ReturnType<typeof adolescenteService.getAll>>[number]
type ExpeRow = Awaited<ReturnType<typeof expedienteService.getAll>>[number]

const adolescentes = ref<AdolRow[]>([])
const expedientes  = ref<ExpeRow[]>([])

onMounted(async () => {
  try {
    ;[adolescentes.value, expedientes.value] = await Promise.all([
      adolescenteService.getAll(),
      expedienteService.getAll(),
    ])
  } catch {
    // sin datos
  } finally {
    loading.value = false
  }
})

// Saludo dinámico
const saludo = computed(() => {
  const h = new Date().getHours()
  return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'
})

const userName = computed(() => {
  if (!user.value) return ''
  return (user.value['nombres'] as string) ?? (user.value['prsnnmbr'] as string) ?? 'usuario'
})

const fechaHoy = computed(() => {
  const d = new Date()
  const dias = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
})

// Contadores reales
const totalAdolescentes = computed(() => adolescentes.value.length)
const enProceso         = computed(() => expedientes.value.filter(e => e.estado === 'En proceso').length)
const conAlerta         = computed(() => expedientes.value.filter(e => e.estado === 'Atraso' || e.estado === 'Incomparecencia').length)
const totalExpedientes  = computed(() => expedientes.value.length)

const stats = computed(() => [
  {
    color: 'blue', num: String(totalAdolescentes.value), label: 'Adolescentes registrados',
    delta: '', dtone: 'flat', to: '/app/adolescentes',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  },
  {
    color: 'green', num: String(enProceso.value), label: 'Expedientes en proceso',
    delta: '', dtone: 'flat', to: '/app/expedientes',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="m5 7-3 6h6l-3-6Z"/><path d="m19 7-3 6h6l-3-6Z"/><path d="M7 21h10"/></svg>`,
  },
  {
    color: 'amber', num: String(conAlerta.value), label: 'Con alerta (atraso / incomparecencia)',
    delta: conAlerta.value > 0 ? `${conAlerta.value} urgentes` : '', dtone: conAlerta.value > 0 ? 'flat' : 'flat', to: '/app/expedientes',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  },
  {
    color: 'slate', num: String(totalExpedientes.value), label: 'Total expedientes',
    delta: '', dtone: 'flat', to: '/app/expedientes',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`,
  },
])

// Bar chart: expedientes agrupados por tipo de medida
const barData = computed(() => {
  const counts: Record<string, number> = {}
  for (const e of expedientes.value) {
    const name = e.medida || 'Sin medida'
    counts[name] = (counts[name] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([l, v]) => ({ l: l.length > 16 ? l.substring(0, 14) + '…' : l, v }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 5)
})

// Donut: expedientes por estado
const donutData = computed(() => [
  { l: 'En proceso',      v: expedientes.value.filter(e => e.estado === 'En proceso').length,      c: '#1b6e4f' },
  { l: 'Atraso',          v: expedientes.value.filter(e => e.estado === 'Atraso').length,          c: '#c9930d' },
  { l: 'Incomparecencia', v: expedientes.value.filter(e => e.estado === 'Incomparecencia').length, c: '#b0203f' },
].filter(d => d.v > 0))

// Revisiones: expedientes con fecha_fin_medida, ordenados por fecha más próxima
const revisionData = computed(() =>
  [...expedientes.value]
    .filter(e => e._raw.fecha_fin_medida)
    .sort((a, b) =>
      new Date(a._raw.fecha_fin_medida!).getTime() - new Date(b._raw.fecha_fin_medida!).getTime()
    )
    .slice(0, 5)
    .map(e => ({
      adol:   e.adol,
      medida: e.medida,
      fin:    e.fin,
      estado: e.estado,
      tono:   e.tono,
    }))
)
</script>

<template>
  <DashboardSkeleton v-if="loading" />

  <template v-else>
    <!-- Hero -->
    <div class="hero">
      <p class="hero-eyebrow">Panel principal</p>
      <div class="hero-row">
        <div>
          <h1>{{ saludo }}, {{ userName }}</h1>
          <p>Resumen operativo — {{ fechaHoy }}</p>
        </div>
      </div>
    </div>

    <!-- 4 stat cards -->
    <div class="stat-grid">
      <div
        v-for="s in stats" :key="s.label"
        class="stat stat--link"
        role="link"
        tabindex="0"
        @click="router.push(s.to)"
        @keydown.enter="router.push(s.to)"
      >
        <div class="stat-top">
          <div :class="['stat-ico', s.color]">
            <!-- eslint-disable-next-line vue/no-v-html -->
            <span v-html="s.icon" style="display:contents" />
          </div>
          <span v-if="s.delta" :class="['stat-delta', s.dtone]">{{ s.delta }}</span>
        </div>
        <div class="stat-num">{{ s.num }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>

    <!-- Bar chart + Donut -->
    <div class="grid-2" style="margin-bottom:16px;">
      <DashBarChart :items="barData" />
      <DashDonut    :items="donutData" />
    </div>

    <!-- Revisiones + Quick access -->
    <div class="grid-2">
      <RevisionListCard :items="revisionData" />
      <QuickAccessCard />
    </div>
  </template>
</template>
