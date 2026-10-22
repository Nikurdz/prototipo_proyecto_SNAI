<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { user } = useAuth()
const tppr = computed(() => (user.value?.['tppr_id'] as number) ?? 1)

const allItems = [
  { label: 'Adolescentes', sub: 'Registro y seguimiento', to: '/app/adolescentes', minRol: 1, icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>` },
  { label: 'Expedientes',  sub: 'Gestión documental',     to: '/app/expedientes',  minRol: 1, icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>` },
  { label: 'Medidas',      sub: 'Socioeducativas',        to: '/app/medidas',      minRol: 1, icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="m5 7-3 6h6l-3-6Z"/><path d="m19 7-3 6h6l-3-6Z"/><path d="M7 21h10"/></svg>` },
  { label: 'Reportes',     sub: 'Indicadores UZDI',       to: '/app/reportes',     minRol: 2, icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-7"/></svg>` },
  { label: 'Usuarios',     sub: 'Gestión de cuentas',     to: '/app/usuarios',     minRol: 3, icon: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>` },
]

const items = computed(() => allItems.filter(i => i.minRol <= tppr.value))
</script>

<template>
  <div class="card">
    <div class="card-head">
      <h3>Accesos rápidos</h3>
    </div>
    <div class="card-body qa-grid">
      <div v-for="it in items" :key="it.label" class="qa-item" style="cursor:pointer;" @click="router.push(it.to)">
        <div class="stat-ico blue" style="width:38px;height:38px;">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <span v-html="it.icon" style="display:contents" />
        </div>
        <div class="qa-item-text">
          <div class="qa-item-label">{{ it.label }}</div>
          <div class="qa-item-sub">{{ it.sub }}</div>
        </div>
        <svg class="qa-item-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </div>
    </div>
  </div>
</template>
