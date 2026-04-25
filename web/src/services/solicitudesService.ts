import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  config.headers['x-correlation-id'] = crypto.randomUUID()
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      correlationId: error.config?.headers['x-correlation-id'],
    })
    return Promise.reject(error)
  }
)

export interface CreateApplicationPayload {
  channel: string
  documentType: string
  documentNumber: string
  fullName: string
  phone: string
  email: string
  city: string
}
export interface UpdateApplicationPayload {
  channel?: string
  documentType?: string
  documentNumber?: string
  fullName?: string
  phone?: string
  email?: string
  city?: string
  monthlyIncome?: number
  monthlyExpenses?: number
  requestedAmount?: number
  termMonths?: number
  loanPurpose?: string
  dataConsentAccepted?: boolean
}

export interface SimulationResult {
  viable: boolean
  monthlyPayment?: number
  monthlyRate?: number
  totalAmount?: number
  message?: string
}

export interface Application {
  id: string
  status: string
  channel: string
  documentType: string
  documentNumber: string
  fullName: string
  phone: string
  email: string
  city: string
  monthlyIncome?: number
  monthlyExpenses?: number
  requestedAmount?: number
  termMonths?: number
  loanPurpose?: string
  dataConsentAccepted?: boolean
  createdAt: string
  updatedAt: string
}

export interface ApplicationEvent {
  id: string
  applicationId: string
  type: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

const solicitudesService = {
  crear: (payload: CreateApplicationPayload) => api.post<Application>('/applications', payload),

  listar: (params?: { status?: string; channel?: string; search?: string }) =>
    api.get<Application[]>('/applications', { params }),

  obtener: (id: string) => api.get<Application>(`/applications/${id}`),

  actualizar: (id: string, payload: UpdateApplicationPayload) =>
    api.patch<Application>(`/applications/${id}`, payload),

  simularOferta: (id: string) => api.post<SimulationResult>(`/applications/${id}/simulate-offer`),

  finalizar: (id: string) => api.post<Application>(`/applications/${id}/finalize`),

  abandonar: (id: string, reason: string) =>
    api.post<Application>(`/applications/${id}/abandon`, { reason }),

  obtenerEventos: (id: string) => api.get<ApplicationEvent[]>(`/applications/${id}/events`),
}

export default solicitudesService
