export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'CC - Cédula de ciudadanía' },
  { value: 'CE', label: 'CE - Cédula de extranjería' },
  { value: 'PA', label: 'PA - Pasaporte' },
]

export const CITIES = [
  { value: 'bogota', label: 'Bogotá' },
  { value: 'medellin', label: 'Medellín' },
  { value: 'cali', label: 'Cali' },
  { value: 'barranquilla', label: 'Barranquilla' },
  { value: 'bucaramanga', label: 'Bucaramanga' },
  { value: 'cartagena', label: 'Cartagena' },
]

export const TERM_OPTIONS = [
  { value: '12', label: '12 meses' },
  { value: '24', label: '24 meses' },
  { value: '36', label: '36 meses' },
  { value: '48', label: '48 meses' },
  { value: '60', label: '60 meses' },
]

export const LOAN_PURPOSE_OPTIONS = [
  { value: 'viaje', label: 'Viaje familiar' },
  { value: 'educacion', label: 'Educación' },
  { value: 'salud', label: 'Salud' },
  { value: 'hogar', label: 'Mejoras del hogar' },
  { value: 'vehiculo', label: 'Vehículo' },
  { value: 'otro', label: 'Otro' },
]

export const APPLICATION_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Borrador', className: 'draft' },
  PENDING_VALIDATION: { label: 'Pend. validación', className: 'pending' },
  FINALIZED: { label: 'Finalizada', className: 'done' },
  ABANDONED: { label: 'Abandonada', className: 'abandoned' },
}

export const APPLICATION_STATUS_MESSAGES: Record<string, string> = {
  DRAFT: 'Borrador — puedes continuar o abandonar',
  PENDING_VALIDATION: 'Pendiente validación — no se puede editar',
  FINALIZED: 'Finalizada — no hay acciones disponibles',
  ABANDONED: 'Abandonada — no hay acciones disponibles',
}

export const MONTHLY_RATE = 0.018

export const MIN_LOAN_AMOUNT = 1000000
export const MAX_LOAN_AMOUNT = 50000000
