<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Users2, UserPlus, Pencil, X as XIcon, Save, Search } from '@lucide/vue'
import { usuarioService, type UsuarioDto, type UsuarioRow } from '../services/usuario.service'
import { useToast } from '../composables/useToast'

const ROLES = [
  { id: 1, nombre: 'Trabajador Social' },
  { id: 2, nombre: 'Coordinador de área' },
  { id: 3, nombre: 'Administrador' },
  { id: 4, nombre: 'Superadministrador' },
  { id: 5, nombre: 'Usuario' },
  { id: 6, nombre: 'Psicólogo' },
  { id: 7, nombre: 'Educador' },
  { id: 8, nombre: 'Jurídico' },
]

const toast = useToast()
const PAGE_SIZE = 8

const rows        = ref<UsuarioRow[]>([])
const loadingData = ref(false)
const search      = ref('')
const page        = ref(1)

type Modal = { mode: 'new' | 'edit'; form: UsuarioDto; saving: boolean; error: string } | null
const modal = ref<Modal>(null)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return rows.value.filter(r =>
    r.nombre.toLowerCase().includes(q) ||
    r.login.toLowerCase().includes(q) ||
    r.correo.toLowerCase().includes(q)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const paged      = computed(() => filtered.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

async function cargar() {
  loadingData.value = true
  try { rows.value = await usuarioService.getAll() }
  finally { loadingData.value = false }
}

onMounted(cargar)

function openNew() {
  modal.value = {
    mode: 'new',
    form: { nombres: '', apellidos: '', login: '', correo: '', telefono: '', password: '', tppr_ids: [] },
    saving: false,
    error: '',
  }
}

function openEdit(row: UsuarioRow) {
  modal.value = {
    mode: 'edit',
    form: { ...row._raw },
    saving: false,
    error: '',
  }
}

function closeModal() { modal.value = null }

async function handleSave() {
  if (!modal.value) return
  if (!modal.value.form.nombres || !modal.value.form.apellidos || !modal.value.form.login) {
    modal.value.error = 'Nombres, apellidos y login son obligatorios.'
    return
  }
  if (!modal.value.form.tppr_ids?.length) {
    modal.value.error = 'Debe seleccionar al menos un rol.'
    return
  }
  modal.value.saving = true
  modal.value.error = ''
  try {
    if (modal.value.mode === 'edit' && modal.value.form.id) {
      await usuarioService.update(modal.value.form.id, modal.value.form)
      toast.success('Usuario actualizado correctamente')
    } else {
      await usuarioService.create(modal.value.form)
      toast.success('Usuario creado correctamente')
    }
    await cargar()
    closeModal()
  } catch {
    modal.value.error = 'No se pudo guardar. Verifica que el backend esté corriendo.'
    modal.value.saving = false
    toast.error('No se pudo guardar. Intenta nuevamente.')
  }
}
</script>

<template>
  <div class="page">
    <div class="hero">
      <div class="hero-content">
        <p class="hero-eyebrow">Configuración</p>
        <h1 class="hero-title">Usuarios</h1>
        <p class="hero-desc">Gestión de cuentas y accesos al sistema UZDI.</p>
      </div>
      <div class="hero-actions">
        <button class="btn btn-primary" type="button" @click="openNew">
          <UserPlus :size="16" /> Nuevo usuario
        </button>
      </div>
    </div>

    <div class="tool-bar">
      <div class="tool-search">
        <Search :size="16" class="tool-search-icon" />
        <input v-model="search" placeholder="Buscar por nombre, login o correo…" @input="page = 1" />
      </div>
    </div>

    <div class="tbl-wrap">
      <div v-if="loadingData" class="tbl-empty">Cargando usuarios…</div>
      <div v-else-if="filtered.length === 0" class="tbl-empty">
        <Users2 :size="36" style="opacity:0.3;margin-bottom:8px" />
        <p>No se encontraron usuarios.</p>
      </div>
      <div v-else class="tbl-card">
        <table class="tbl">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Login</th>
              <th>Correo</th>
              <th>Estado</th>
              <th class="tbl-actions-hd">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in paged" :key="row.id">
              <td class="tbl-name">{{ row.nombre }}</td>
              <td><code class="tbl-code">{{ row.login }}</code></td>
              <td>{{ row.correo }}</td>
              <td><span class="badge" :class="row.tono">{{ row.estado }}</span></td>
              <td class="tbl-actions">
                <button class="btn btn-sm btn-ghost" title="Editar" @click="openEdit(row)">
                  <Pencil :size="15" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="totalPages > 1" class="tbl-pag">
          <button class="btn btn-sm btn-ghost" :disabled="page === 1" @click="page--">Anterior</button>
          <span class="tbl-pag-info">{{ page }} / {{ totalPages }}</span>
          <button class="btn btn-sm btn-ghost" :disabled="page === totalPages" @click="page++">Siguiente</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="modal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">
          <div class="modal-hd">
            <h2 class="modal-title">{{ modal.mode === 'new' ? 'Nuevo usuario' : 'Editar usuario' }}</h2>
            <button class="btn btn-sm btn-ghost" type="button" @click="closeModal"><XIcon :size="18" /></button>
          </div>

          <div v-if="modal.error" class="modal-error">{{ modal.error }}</div>

          <form id="modal-user-form" @submit.prevent="handleSave" class="modal-form">
            <div class="f2col">
              <div>
                <label class="f-label">Nombres <span class="f-req">*</span></label>
                <input v-model="modal.form.nombres" class="f-ctl" placeholder="Nombres completos" required />
              </div>
              <div>
                <label class="f-label">Apellidos <span class="f-req">*</span></label>
                <input v-model="modal.form.apellidos" class="f-ctl" placeholder="Apellidos completos" required />
              </div>
            </div>
            <div>
              <label class="f-label">Login <span class="f-req">*</span></label>
              <input v-model="modal.form.login" class="f-ctl" placeholder="usuario.apellido" required />
            </div>
            <div>
              <label class="f-label">Roles <span class="f-req">*</span></label>
              <div class="roles-grid">
                <label v-for="r in ROLES" :key="r.id" class="role-chk">
                  <input type="checkbox" :value="r.id" v-model="modal.form.tppr_ids" />
                  {{ r.nombre }}
                </label>
              </div>
            </div>
            <div>
              <label class="f-label">Correo electrónico</label>
              <input v-model="modal.form.correo" type="email" class="f-ctl" placeholder="correo@uzdi.gob.ec" />
            </div>
            <div>
              <label class="f-label">Teléfono</label>
              <input v-model="modal.form.telefono" class="f-ctl" placeholder="0999999999" />
            </div>
            <div v-if="modal.mode === 'new'">
              <label class="f-label">Contraseña <span class="f-req">*</span></label>
              <input v-model="modal.form.password" type="password" class="f-ctl" placeholder="Mínimo 8 caracteres" />
            </div>
          </form>

          <div class="modal-foot">
            <button type="button" class="btn btn-ghost" @click="closeModal">
              <XIcon :size="15" /> Cancelar
            </button>
            <button type="submit" form="modal-user-form" class="btn btn-primary" :disabled="modal.saving">
              <Save :size="15" />
              {{ modal.saving ? 'Guardando…' : modal.mode === 'new' ? 'Crear usuario' : 'Guardar cambios' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.tbl-wrap { padding: 0 0 28px; }

.tbl-empty {
  padding: 48px 24px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
  display: flex; flex-direction: column; align-items: center;
}

.tbl-name {
  font-weight: 500; color: var(--color-text-primary);
  max-width: 220px; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
}

.tbl-code {
  font-family: var(--font-mono, monospace);
  font-size: 12.5px;
  background: var(--color-surface-mute);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  display: inline-block;
  max-width: 170px; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
  vertical-align: middle;
}

.tbl-actions-hd { text-align: right; }
.tbl-actions    { text-align: right; }

.tbl-pag {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
}
.tbl-pag-info { font-size: 13px; color: var(--color-text-muted); flex: 1; text-align: center; }

.tool-bar { display: flex; gap: 10px; padding: 0 0 16px; }

.tool-search { position: relative; flex: 1; max-width: 360px; }

.tool-search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--color-text-muted); pointer-events: none;
}

.tool-search input {
  width: 100%; min-height: 42px; padding: 9px 12px 9px 36px;
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-md);
  font-size: 14px; background: var(--color-surface);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.tool-search input:focus {
  outline: 3px solid var(--color-brand-blue); outline-offset: 0;
  border-color: var(--color-brand-blue);
}

.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 20px;
}

.modal-box {
  background: transparent;
  width: min(540px, calc(100vw - 40px));
  display: flex; flex-direction: column;
}

.modal-hd {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  width: fit-content; max-width: 100%;
  padding: 10px 10px 10px 22px;
  background: var(--color-brand-yellow);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  flex-shrink: 0;
  animation: tab-in .18s ease-out;
}

.modal-title {
  font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin: 0;
  color: var(--color-text-primary);
  display: flex; align-items: center; gap: 8px;
}

.modal-error {
  margin: 0;
  background: var(--color-error-bg);
  color: var(--color-error);
  border: 0; border-left: 5px solid var(--color-error);
  border-radius: 0;
  padding: 10px 14px; font-size: 13.5px;
  flex-shrink: 0;
}

.modal-form {
  padding: 22px 24px;
  background: var(--color-surface);
  display: flex; flex-direction: column; gap: 16px;
  overflow-y: auto; overflow-x: hidden;
  max-height: 60vh;
}

.f2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.f2col > * { min-width: 0; }

.f-req { color: var(--color-error); }

.modal-foot {
  display: flex; justify-content: flex-end; gap: 8px;
  border-top: 1px solid var(--color-border);
  padding: 14px 24px;
  background: var(--color-surface);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  flex-shrink: 0;
}

.roles-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 6px 12px; padding: 10px 0;
}
.role-chk {
  display: flex; align-items: center; gap: 6px;
  font-size: 13.5px; color: var(--color-text-primary);
  cursor: pointer; user-select: none;
}
.role-chk input[type="checkbox"] {
  accent-color: var(--color-brand-blue);
  width: 15px; height: 15px; cursor: pointer; flex-shrink: 0;
}

@media (max-width: 600px) {
  .f2col { grid-template-columns: 1fr; }
  .roles-grid { grid-template-columns: 1fr; }
  .tbl-wrap { padding: 0 16px 20px; }
  .tool-bar { padding: 0 16px 16px; }
  .tool-search { max-width: 100%; }
}
</style>
