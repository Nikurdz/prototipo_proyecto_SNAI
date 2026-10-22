import api from './api'

export interface RolDto {
  id: number
  nombre: string
}

export interface UsuarioDto {
  id?: number
  uzdi_id?: number
  tppr_id?: number
  tppr_ids?: number[]
  nombres: string
  apellidos: string
  login: string
  correo?: string
  telefono?: string
  password?: string
}

export interface UsuarioRow {
  id: number
  nombre: string
  login: string
  correo: string
  roles: RolDto[]
  estado: string
  tono: string
  _raw: UsuarioDto
}

interface ApiUser {
  id: number
  uzdi_id?: number
  tppr_id?: number
  nombres: string
  apellidos: string
  correo?: string
  login: string
  telefono?: string
  roles?: RolDto[]
}

export const usuarioService = {
  async getAll(): Promise<UsuarioRow[]> {
    try {
      const { data: res } = await api.get<{ message: string; data: ApiUser[] }>('/users')
      const list: ApiUser[] = Array.isArray(res) ? res as unknown as ApiUser[] : res.data
      return list.map(u => ({
        id: u.id,
        nombre: `${u.nombres} ${u.apellidos}`,
        login: u.login,
        correo: u.correo ?? '—',
        roles: u.roles ?? [],
        estado: 'Activo',
        tono: 'green',
        _raw: {
          id:       u.id,
          uzdi_id:  u.uzdi_id,
          tppr_id:  u.tppr_id,
          tppr_ids: u.roles?.map(r => r.id) ?? (u.tppr_id ? [u.tppr_id] : []),
          nombres:  u.nombres,
          apellidos: u.apellidos,
          login:    u.login,
          correo:   u.correo,
          telefono: u.telefono,
        },
      }))
    } catch {
      return []
    }
  },

  async create(dto: Omit<UsuarioDto, 'id'>): Promise<UsuarioDto> {
    const { tppr_ids, tppr_id, ...rest } = dto
    const payload = { ...rest, roles_ids: tppr_ids }
    const { data } = await api.post<UsuarioDto>('/users', payload)
    return data
  },

  async update(id: number, dto: Partial<UsuarioDto>): Promise<UsuarioDto> {
    const { id: _id, tppr_ids, ...rest } = dto
    const payload = { ...rest, roles_ids: tppr_ids }
    const { data: res } = await api.patch<{ message: string; data: UsuarioDto }>(`/users/${id}`, payload)
    return (res as { data: UsuarioDto }).data ?? (res as unknown as UsuarioDto)
  },
}
