export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  FINALIZED = 'FINALIZED',
  ABANDONED = 'ABANDONED',
}

export enum ApplicationChannel {
  SELF_SERVICE = 'SELF_SERVICE',
  ASSISTED = 'ASSISTED',
}

export enum EventType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  SIMULATION_SUCCESS = 'SIMULATION_SUCCESS',
  SIMULATION_FAILED = 'SIMULATION_FAILED',
  SIMULATION_ERROR = 'SIMULATION_ERROR',
  FINALIZED = 'FINALIZED',
  ABANDONED = 'ABANDONED',
}

export interface Application {
  id: string
  status: ApplicationStatus
  channel: ApplicationChannel
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
  advisorId?: string
  createdAt: string
  updatedAt: string
}

export interface ApplicationEvent {
  id: string
  applicationId: string
  type: EventType
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export interface SimulationResult {
  viable: boolean
  monthlyPayment?: number
  monthlyRate?: number
  totalAmount?: number
  message?: string
}
