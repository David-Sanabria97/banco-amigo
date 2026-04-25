import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SolicitudState {
  currentStep: number
  draftId: string | null
  applicationId: string | null
  formData: {
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
    advisorId?: string
  }
}

const initialState: SolicitudState = {
  currentStep: 1,
  draftId: null,
  applicationId: null,
  formData: {},
}

const solicitudSlice = createSlice({
  name: 'solicitud',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setDraftId: (state, action: PayloadAction<string>) => {
      state.draftId = action.payload
    },
    setApplicationId: (state, action: PayloadAction<string>) => {
      state.applicationId = action.payload
    },
    updateFormData: (state, action: PayloadAction<Partial<SolicitudState['formData']>>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    resetSolicitud: () => initialState,
  },
})

export const { setStep, setDraftId, updateFormData, resetSolicitud, setApplicationId } =
  solicitudSlice.actions
export default solicitudSlice.reducer
