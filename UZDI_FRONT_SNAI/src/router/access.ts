// Fuente única de los niveles de acceso (antes duplicada en router y AppShell).
// Nivel por tppr_id: 1 = básico, 2 = coordinador (+ Reportes), 3 = administrador (+ Usuarios, Parámetros).
export const ACCESS_LEVEL: Record<number, number> = {
  1: 1, // Trabajador Social
  2: 2, // Coordinador de área
  3: 3, // Administrador
  4: 3, // Superadministrador (igual que administrador por ahora)
  5: 1, // Usuario
  6: 1, // Psicólogo
  7: 1, // Educador
  8: 1, // Jurídico
}

export const ROLE_LABEL: Record<number, string> = {
  1: 'Trabajador Social',
  2: 'Coordinador de área',
  3: 'Administrador',
  4: 'Superadministrador',
  5: 'Usuario',
  6: 'Psicólogo',
  7: 'Educador',
  8: 'Jurídico',
}

// Nivel mínimo requerido por ruta
export const ROUTE_MIN_LEVEL: Record<string, number> = {
  '/app/reportes': 2,
  '/app/usuarios': 3,
  '/app/parametros': 3,
}

export function levelFor(tppr: number | undefined): number {
  return ACCESS_LEVEL[tppr ?? 5] ?? 1
}
