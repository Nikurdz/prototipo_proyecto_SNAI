// Adaptador de axios para el modo demo: responde en memoria a las mismas rutas que usa el backend real.
// Se activa solo con VITE_USE_MOCK=true (ver services/api.ts). Los datos se reinician al recargar.
import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import * as db from './data'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

type Row = Record<string, any>
const find = (list: Row[], id: unknown) => list.find((x) => x.id === Number(id))
const ref = (list: Row[], id: unknown) => {
  const r = find(list, id)
  return r ? { id: r.id, nombre: r.nombre } : undefined
}

const hydrate: Record<string, (r: Row) => Row> = {
  '/adolescente': (a) => ({
    ...a,
    nacionalidad: ref(db.nacionalidades, a.nacn_id),
    estadoCivil: ref(db.estadosCiviles, a.etcv_id),
    etnia: ref(db.etnias, a.etna_id),
    canton: ref(db.cantones, a.cntn_id),
    gdo: a.gdo_id ? ref(db.gdos, a.gdo_id) : null,
  }),
  '/expediente': (e) => {
    const a = find(db.adolescentes, e.adlc_id)
    return {
      ...e,
      adolescente: a && { id: a.id, nombre: a.nombre, apellido: a.apellido, cedula: a.cedula },
      uzdi: ref(db.uzdis, e.uzdi_id),
      infraccion: ref(db.infracciones, e.infc_id),
      medida: ref(db.medidas, e.mdso_id),
    }
  },
  '/medida-socioeducativa': (m) => m,
}

const collections: Record<string, Row[]> = {
  '/adolescente': db.adolescentes,
  '/expediente': db.expedientes,
  '/medida-socioeducativa': db.medidas,
}

const catalogs: Record<string, Row[]> = {
  '/nacionalidad': db.nacionalidades,
  '/estado-civil': db.estadosCiviles,
  '/etnia': db.etnias,
  '/gdo': db.gdos,
  '/canton': db.cantones,
  '/uzdi': db.uzdis,
  '/infraccion': db.infracciones,
}

function publicUser(u: Row): Row {
  const { password: _password, ...rest } = u
  return rest
}

function reply(config: InternalAxiosRequestConfig, status: number, data: unknown): Promise<AxiosResponse> {
  const response: AxiosResponse = { data, status, statusText: String(status), headers: {}, config }
  if (status >= 200 && status < 300) return Promise.resolve(response)
  return Promise.reject(Object.assign(new Error(`Request failed with status code ${status}`), { response, config, isAxiosError: true }))
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((r) => setTimeout(r, 120)) // latencia mínima para que se vean los estados de carga
  const method = (config.method ?? 'get').toLowerCase()
  const url = (config.url ?? '').replace(/\?.*$/, '')
  const body: Row = typeof config.data === 'string' && config.data ? JSON.parse(config.data) : (config.data ?? {})
  const [, base, idPart] = url.match(/^(\/[^/]+)(?:\/(\d+))?$/) ?? []

  // Autenticación
  if (url === '/auth/login' && method === 'post') {
    const key = String(body.login ?? '').trim().toLowerCase()
    const u = db.usuarios.find((x) => x.login.toLowerCase() === key || x.correo.toLowerCase() === key)
    if (!u || u.password !== body.password) return reply(config, 401, { message: 'Credenciales inválidas' })
    return reply(config, 200, { message: 'Login correcto', token: `demo-token-${u.id}`, user: publicUser(u) })
  }
  if (url === '/auth/change-password' && method === 'post') {
    const u = find(db.usuarios, body.userId)
    if (!u || u.password !== body.currentPassword) return reply(config, 400, { message: 'La contraseña actual no es correcta' })
    u.password = body.newPassword
    return reply(config, 200, { message: 'Contraseña actualizada' })
  }

  // Usuarios (el backend envuelve la respuesta en { message, data })
  if (base === '/users') {
    if (method === 'get') return reply(config, 200, { message: 'ok', data: db.usuarios.map(publicUser) })
    if (method === 'post') {
      const ids: number[] = body.roles_ids ?? []
      const { roles_ids: _r, ...rest } = body
      const u: Row = { ...rest, id: Math.max(0, ...db.usuarios.map((x) => x.id)) + 1, uzdi_id: rest.uzdi_id ?? 1, tppr_id: ids[0] ?? 5,
        roles: db.ROLES.filter((r) => ids.includes(r.id)), password: rest.password || db.DEMO_PASSWORD }
      db.usuarios.push(u)
      return reply(config, 201, publicUser(u))
    }
    if (method === 'patch' && idPart) {
      const u = find(db.usuarios, idPart)
      if (!u) return reply(config, 404, { message: 'No encontrado' })
      const { roles_ids, ...rest } = body
      Object.assign(u, rest)
      if (Array.isArray(roles_ids) && roles_ids.length) {
        u.roles = db.ROLES.filter((r) => roles_ids.includes(r.id))
        u.tppr_id = roles_ids[0]
      }
      return reply(config, 200, { message: 'ok', data: publicUser(u) })
    }
  }

  // UZDI individual (Parámetros)
  if (base === '/uzdi' && idPart) {
    const z = find(db.uzdis, idPart)
    if (!z) return reply(config, 404, { message: 'No encontrado' })
    if (method === 'patch') Object.assign(z, body)
    return reply(config, 200, { data: z })
  }

  // CRUD de adolescentes, expedientes y medidas
  if (base && collections[base]) {
    const rows = collections[base], out = hydrate[base]
    if (method === 'get' && !idPart) return reply(config, 200, rows.map(out))
    if (method === 'post') {
      const rec: Row = { ...body, id: Math.max(0, ...rows.map((x) => x.id)) + 1 }
      if (base === '/adolescente' && !rec.uzdi_id) rec.uzdi_id = 1
      rows.push(rec)
      return reply(config, 201, out(rec))
    }
    const rec = idPart ? find(rows, idPart) : undefined
    if (!rec) return reply(config, 404, { message: 'No encontrado' })
    if (method === 'get') return reply(config, 200, out(rec))
    if (method === 'patch') { Object.assign(rec, body); return reply(config, 200, out(rec)) }
    if (method === 'delete') { rows.splice(rows.indexOf(rec), 1); return reply(config, 200, { message: 'Eliminado' }) }
  }

  // Catálogos de solo lectura
  if (base && catalogs[base] && method === 'get') return reply(config, 200, catalogs[base])

  return reply(config, 404, { message: `Ruta de demostración no disponible: ${method.toUpperCase()} ${url}` })
}
