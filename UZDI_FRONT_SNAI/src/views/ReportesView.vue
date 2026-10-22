<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useCatalogos } from '../composables/useCatalogos'
import { adolescenteService } from '../services/adolescente.service'
import { expedienteService } from '../services/expediente.service'

const { uzdis, cargarCatalogos } = useCatalogos()

type AdolRow = Awaited<ReturnType<typeof adolescenteService.getAll>>[number]
type ExpeRow = Awaited<ReturnType<typeof expedienteService.getAll>>[number]

const adolescentes = ref<AdolRow[]>([])
const expedientes  = ref<ExpeRow[]>([])
const loadingData  = ref(true)
const generated    = ref(false)

onMounted(async () => {
  await cargarCatalogos()
  try {
    ;[adolescentes.value, expedientes.value] = await Promise.all([
      adolescenteService.getAll(),
      expedienteService.getAll(),
    ])
  } catch { /* sin datos */ }
  finally { loadingData.value = false }
})

const defaultForm = { tipo: '', periodo: 'Mensual', zona: '', fechaDesde: '', fechaHasta: '', formato: 'PDF' }
const form = reactive({ ...defaultForm })

const uzdiOptions = computed(() => uzdis.value.map(u => u.nombre))

function limpiar() { Object.assign(form, { ...defaultForm }); generated.value = false }
function descargarPDF() { window.print() }
function exportarExcel() { alert('Exportación Excel requiere integración backend de reportes.') }

function diasHasta(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

const reporteData = computed(() => {
  const adols = adolescentes.value
  const expes = expedientes.value
  const enProceso = expes.filter(e => e.estado === 'En proceso').length
  const conAlerta = expes.filter(e => e.estado === 'Atraso' || e.estado === 'Incomparecencia').length
  const atrasos   = expes.filter(e => e.estado === 'Atraso').length
  const inconpar  = expes.filter(e => e.estado === 'Incomparecencia').length
  const conFin    = expes.filter(e => !!e._raw.fecha_fin_medida)

  const tipo = form.tipo || 'Estadístico general'

  if (tipo === 'Estadístico general') {
    return {
      stats: [
        { color: 'blue',  num: String(adols.length),  label: 'Adolescentes registrados' },
        { color: 'green', num: String(enProceso),     label: 'Expedientes en proceso'   },
        { color: 'amber', num: String(conAlerta),     label: 'Con alerta'               },
        { color: 'slate', num: String(expes.length),  label: 'Total expedientes'        },
      ],
      filas: [
        { indicador: 'Adolescentes registrados',      valor: adols.length         },
        { indicador: 'Total expedientes',             valor: expes.length         },
        { indicador: 'En proceso',                    valor: enProceso            },
        { indicador: 'Con alerta (Atraso / Incomparecencia)', valor: conAlerta   },
        { indicador: 'Con fecha de vencimiento',      valor: conFin.length        },
      ],
    }
  }

  if (tipo === 'Adolescentes activos') {
    const reincidentes = adols.filter(a => a._raw.reincide === true).length
    const edad14_15    = adols.filter(a => a.edad >= 14 && a.edad <= 15).length
    const edad16_17    = adols.filter(a => a.edad >= 16 && a.edad <= 17).length
    return {
      stats: [
        { color: 'blue',  num: String(adols.length),  label: 'Total registrados'  },
        { color: 'amber', num: String(reincidentes),  label: 'Reincidentes'       },
        { color: 'green', num: String(edad14_15),     label: 'Edades 14–15 años'  },
        { color: 'slate', num: String(edad16_17),     label: 'Edades 16–17 años'  },
      ],
      filas: [
        { indicador: 'Total adolescentes',   valor: adols.length                      },
        { indicador: 'Reincidentes',         valor: reincidentes                      },
        { indicador: 'Rango 14–15 años',     valor: edad14_15                         },
        { indicador: 'Rango 16–17 años',     valor: edad16_17                         },
        { indicador: 'Otras edades',         valor: adols.length - edad14_15 - edad16_17 },
      ],
    }
  }

  if (tipo === 'Medidas socioeducativas') {
    const counts: Record<string, number> = {}
    for (const e of expes) { const m = e.medida || 'Sin medida'; counts[m] = (counts[m] ?? 0) + 1 }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
    return {
      stats: [
        { color: 'green', num: String(expes.length), label: 'Total expedientes'  },
        { color: 'blue',  num: String(enProceso),    label: 'En proceso'         },
        { color: 'amber', num: String(atrasos),      label: 'En atraso'          },
        { color: 'red',   num: String(inconpar),     label: 'Incomparecencia'    },
      ],
      filas: top.map(([indicador, valor]) => ({ indicador, valor })),
    }
  }

  if (tipo === 'Expedientes') {
    const vencen7  = conFin.filter(e => { const d = diasHasta(e._raw.fecha_fin_medida!); return d >= 0 && d <= 7 }).length
    const vencen30 = conFin.filter(e => { const d = diasHasta(e._raw.fecha_fin_medida!); return d >= 0 && d <= 30 }).length
    const vencidos = conFin.filter(e => diasHasta(e._raw.fecha_fin_medida!) < 0).length
    return {
      stats: [
        { color: 'green', num: String(expes.length), label: 'Total expedientes'   },
        { color: 'blue',  num: String(enProceso),    label: 'En proceso'          },
        { color: 'amber', num: String(vencen7),      label: 'Vencen en 7 días'    },
        { color: 'red',   num: String(vencidos),     label: 'Vencidos'            },
      ],
      filas: [
        { indicador: 'Total expedientes',           valor: expes.length  },
        { indicador: 'En proceso',                  valor: enProceso     },
        { indicador: 'Con alerta',                  valor: conAlerta     },
        { indicador: 'Vencen próximos 7 días',      valor: vencen7       },
        { indicador: 'Vencen próximos 30 días',     valor: vencen30      },
        { indicador: 'Ya vencidos',                 valor: vencidos      },
      ],
    }
  }

  // Revisiones y seguimiento
  const vencen7  = conFin.filter(e => { const d = diasHasta(e._raw.fecha_fin_medida!); return d >= 0 && d <= 7 }).length
  const vencen30 = conFin.filter(e => { const d = diasHasta(e._raw.fecha_fin_medida!); return d >= 0 && d <= 30 }).length
  const vencidos = conFin.filter(e => diasHasta(e._raw.fecha_fin_medida!) < 0).length
  return {
    stats: [
      { color: 'amber', num: String(vencen7),       label: 'Vencen en 7 días'      },
      { color: 'red',   num: String(vencidos),      label: 'Ya vencidos'            },
      { color: 'green', num: String(enProceso),     label: 'En proceso activo'      },
      { color: 'blue',  num: String(conFin.length), label: 'Con fecha de venc.'     },
    ],
    filas: [
      { indicador: 'Con fecha de vencimiento',             valor: conFin.length             },
      { indicador: 'Vencen próximos 7 días',               valor: vencen7                   },
      { indicador: 'Vencen próximos 30 días',              valor: vencen30                  },
      { indicador: 'Ya vencidos',                          valor: vencidos                  },
      { indicador: 'Sin fecha de vencimiento registrada',  valor: expes.length - conFin.length },
    ],
  }
})

const fechaRangoLabel = computed(() => {
  if (form.fechaDesde && form.fechaHasta) return `${form.fechaDesde} – ${form.fechaHasta}`
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `01/${m}/${d.getFullYear()} – ${String(d.getDate()).padStart(2, '0')}/${m}/${d.getFullYear()}`
})
</script>

<template>
  <!-- Hero -->
  <div class="hero">
    <p class="hero-eyebrow">Análisis</p>
    <div class="hero-row">
      <div>
        <h1>Reportes</h1>
        <p>Generación de informes estadísticos y operativos de la UZDI</p>
      </div>
    </div>
  </div>

  <!-- Filtros -->
  <div class="card" style="margin-bottom:16px;">
    <div class="card-head">
      <h3>Configuración del reporte</h3>
      <p style="font-size:13px;color:var(--color-text-secondary);margin:0;">
        Seleccione los parámetros para generar el informe
      </p>
    </div>
    <div class="card-body">
      <div class="frow c3" style="margin-bottom:16px;">
        <div class="f">
          <div class="f-label">Tipo de reporte <span class="req">*</span></div>
          <select class="f-ctl" v-model="form.tipo">
            <option value="">Seleccione el tipo…</option>
            <option>Estadístico general</option>
            <option>Adolescentes activos</option>
            <option>Medidas socioeducativas</option>
            <option>Expedientes</option>
            <option>Revisiones y seguimiento</option>
          </select>
        </div>
        <div class="f">
          <div class="f-label">Período</div>
          <select class="f-ctl" v-model="form.periodo">
            <option>Mensual</option>
            <option>Trimestral</option>
            <option>Semestral</option>
            <option>Anual</option>
          </select>
        </div>
        <div class="f">
          <div class="f-label">Zona / UZDI</div>
          <select class="f-ctl" v-model="form.zona">
            <option value="">Todas las zonas</option>
            <option v-for="z in uzdiOptions" :key="z" :value="z">{{ z }}</option>
          </select>
        </div>
      </div>
      <div class="frow c2">
        <div class="f">
          <div class="f-label">Fecha desde</div>
          <input class="f-ctl" type="date" v-model="form.fechaDesde" />
        </div>
        <div class="f">
          <div class="f-label">Fecha hasta</div>
          <input class="f-ctl" type="date" v-model="form.fechaHasta" />
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px;padding-top:18px;border-top:1px solid var(--color-border);">
        <button class="btn btn-ghost" type="button" @click="limpiar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
          Limpiar
        </button>
        <button class="btn btn-primary" type="button" :disabled="loadingData" @click="generated = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-7"/></svg>
          {{ loadingData ? 'Cargando datos…' : 'Generar reporte' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <div v-if="!generated" class="card">
    <div class="card-body">
      <div class="empty">
        <div class="empty-ico">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-7"/></svg>
        </div>
        <h3>Configure los parámetros para generar el reporte</h3>
        <p>Seleccione el tipo de reporte y haga clic en <b>Generar reporte</b>.</p>
      </div>
    </div>
  </div>

  <!-- Reporte con datos reales -->
  <div v-else class="card">
    <div class="card-head" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h3>{{ form.tipo || 'Estadístico general' }}</h3>
        <p style="font-size:13px;color:var(--color-text-secondary);margin:0;">
          {{ form.zona || 'Todas las zonas' }} · {{ form.periodo }} · {{ fechaRangoLabel }}
        </p>
      </div>
      <div class="no-print" style="display:flex;gap:8px;">
        <button class="btn btn-sm" type="button" @click="exportarExcel">Exportar Excel</button>
        <button class="btn btn-sm btn-primary" type="button" @click="descargarPDF">Imprimir o guardar PDF</button>
      </div>
    </div>
    <div class="card-body">
      <!-- Stats reales -->
      <div class="stat-grid" style="margin-bottom:20px;">
        <div v-for="s in reporteData.stats" :key="s.label" class="stat">
          <div class="stat-top">
            <div :class="['stat-ico', s.color]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-7"/></svg>
            </div>
          </div>
          <div class="stat-num">{{ s.num }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>

      <!-- Tabla de indicadores reales -->
      <div v-if="reporteData.filas.length" class="tbl-card">
        <table class="tbl">
          <thead>
            <tr>
              <th>Indicador</th>
              <th style="text-align:right;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in reporteData.filas" :key="f.indicador">
              <td>{{ f.indicador }}</td>
              <td style="text-align:right;font-weight:600;">{{ f.valor }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty" style="padding:24px;">
        <p>Sin datos para mostrar. Registre adolescentes y expedientes primero.</p>
      </div>
    </div>
  </div>
</template>
