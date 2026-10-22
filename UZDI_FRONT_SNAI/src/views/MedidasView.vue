<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { FilePlus2, Pencil, Ban, Save, X as XIcon } from '@lucide/vue'
import { medidaService } from '../services/medida.service'
import { useToast } from '../composables/useToast'

type ModalMode = 'new' | 'edit' | 'delete' | null

const toast = useToast()
const modal = ref<ModalMode>(null)
const selectedId = ref<number>(0)
const search = ref('')
const page = ref(1)
const PAGE_SIZE = 8
const cargando = ref(false)

const rows = ref<Awaited<ReturnType<typeof medidaService.getAll>>>([])

async function cargarMedidas() {
  cargando.value = true
  try {
    rows.value = await medidaService.getAll()
  } catch {
    // error de carga
  } finally {
    cargando.value = false
  }
}

onMounted(cargarMedidas)

const selectedCodigo = computed(() => {
  const row = rows.value.find(r => r.id === selectedId.value)
  return row?.codigo ?? ''
})

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return rows.value.filter(r => !q || r.nombre.toLowerCase().includes(q) || r.codigo.toLowerCase().includes(q))
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paged = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

const defaultForm = { nombre: '', duracion: '' as number | '' }
const form = reactive({ ...defaultForm })

function openNew() {
  Object.assign(form, { ...defaultForm })
  modal.value = 'new'
}
function openEdit(id: number) {
  const row = rows.value.find(r => r.id === id)!
  Object.assign(form, {
    nombre: row.nombre,
    duracion: row.duracion ?? '',
  })
  selectedId.value = id
  modal.value = 'edit'
}
function openDelete(id: number) {
  selectedId.value = id
  modal.value = 'delete'
}

async function handleSave() {
  const payload = {
    nombre: form.nombre,
    duracion_meses: form.duracion === '' ? undefined : Number(form.duracion),
  }
  try {
    if (modal.value === 'edit') {
      await medidaService.update(selectedId.value, payload)
      toast.success('Medida actualizada correctamente')
    } else {
      await medidaService.create(payload)
      toast.success('Medida guardada correctamente')
    }
    await cargarMedidas()
    modal.value = null
  } catch {
    toast.error('No se pudo guardar. Intenta nuevamente.')
  }
}

async function handleDelete() {
  if (!selectedId.value) return
  try {
    await medidaService.remove(selectedId.value)
    await cargarMedidas()
    toast.success('Medida eliminada correctamente')
    modal.value = null
  } catch {
    toast.error('No se pudo eliminar. Intenta nuevamente.')
  }
}

function onSearchInput() { page.value = 1 }

const selectedRow = () => rows.value.find(r => r.id === selectedId.value)
</script>

<template>
  <!-- Hero -->
  <div class="hero">
    <p class="hero-eyebrow">Catálogo</p>
    <div class="hero-row">
      <div>
        <h1>Medidas socioeducativas</h1>
        <p>Catálogo de tipos de medida socioeducativa que pueden aplicarse en un expediente</p>
      </div>
    </div>
  </div>

  <!-- Toolbar -->
  <div class="toolbar">
    <div class="tool-search">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      <input v-model="search" placeholder="Buscar por nombre o ID…" @input="onSearchInput" />
    </div>
    <div class="spacer" />
    <button class="btn btn-primary" type="button" @click="openNew">
      <FilePlus2 :size="17" />
      Nueva medida
    </button>
  </div>

  <!-- Tabla -->
  <div class="tbl-card">
    <table class="tbl">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tipo de medida</th>
          <th>Duración (meses)</th>
          <th style="text-align:right;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in paged" :key="m.id">
          <td><span class="pill">{{ m.codigo }}</span></td>
          <td><div class="td-name"><b>{{ m.nombre }}</b></div></td>
          <td>{{ m.duracion ?? '—' }}</td>
          <td class="td-actions">
            <div class="row">
              <button class="ico-btn" type="button" title="Editar" @click="openEdit(m.id)">
                <Pencil :size="16" />
              </button>
              <button class="ico-btn danger" type="button" title="Eliminar" @click="openDelete(m.id)">
                <Ban :size="16" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="paged.length === 0">
          <td colspan="4" style="text-align:center;padding:32px;color:var(--color-text-muted);">Sin resultados para la búsqueda</td>
        </tr>
      </tbody>
    </table>
    <div class="pag">
      <div class="pag-info">Mostrando <b>{{ filtered.length === 0 ? 0 : (page-1)*PAGE_SIZE+1 }}–{{ Math.min(page*PAGE_SIZE, filtered.length) }}</b> de <b>{{ filtered.length }}</b> registros</div>
      <div class="pag-ctrl">
        <button class="pag-btn" :class="{ 'is-disabled': page === 1 }" :disabled="page === 1" type="button" @click="page--">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          v-for="p in totalPages" :key="p"
          class="pag-btn" :class="{ 'is-active': p === page }"
          type="button" @click="page = p"
        >{{ p }}</button>
        <button class="pag-btn" :class="{ 'is-disabled': page === totalPages }" :disabled="page === totalPages" type="button" @click="page++">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Modal crear / editar medida -->
  <div v-if="modal === 'new' || modal === 'edit'" class="backdrop">
    <div class="modal md">
      <div class="modal-head">
        <div>
          <p class="eyebrow">Catálogo · Medidas</p>
          <h3>{{ modal === 'new' ? 'Registrar tipo de medida' : `Editar medida · ${selectedCodigo}` }}</h3>
        </div>
        <button class="x" type="button" @click="modal = null">
          <XIcon :size="18" />
        </button>
      </div>
      <div class="modal-body">
        <div class="fsec">
          <div class="fsec-title">Datos del catálogo</div>
          <div class="frow" >
            <div class="f" style="grid-column:1/-1;">
              <div class="f-label">Nombre de la medida <span class="req">*</span></div>
              <input class="f-ctl" v-model="form.nombre" placeholder="Ej: Libertad asistida" />
            </div>
          </div>
          <div class="frow" style="margin-top:16px;">
            <div class="f" style="grid-column:1/-1;">
              <div class="f-label">Duración (meses)</div>
              <input class="f-ctl" type="number" min="1" v-model="form.duracion" placeholder="Opcional. Ej: 12" />
            </div>
          </div>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" @click="modal = null">
          <XIcon :size="15" /> Cancelar
        </button>
        <button class="btn btn-primary" type="button" @click="handleSave">
          <Save :size="15" />
          {{ modal === 'new' ? 'Guardar medida' : 'Guardar cambios' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Modal eliminar -->
  <div v-if="modal === 'delete'" class="backdrop">
    <div class="modal sm">
      <div class="modal-head">
        <h3>Eliminar medida</h3>
        <button class="x" type="button" @click="modal = null">
          <XIcon :size="18" />
        </button>
      </div>
      <div class="modal-body">
        <div class="confirm">
          <div class="confirm-ico">
            <Ban :size="30" />
          </div>
          <h3>¿Eliminar este tipo de medida?</h3>
          <p>Esta acción eliminará permanentemente el tipo de medida del catálogo. No podrá eliminarse si está en uso por algún expediente.</p>
          <span v-if="selectedRow()" class="name">{{ selectedRow()!.nombre }} · {{ selectedCodigo }}</span>
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-ghost" type="button" @click="modal = null">
          <XIcon :size="15" /> Cancelar
        </button>
        <button class="btn btn-danger-solid" type="button" @click="handleDelete">
          <Ban :size="15" />
          Eliminar registro
        </button>
      </div>
    </div>
  </div>
</template>
