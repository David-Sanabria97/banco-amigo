import { useEffect } from 'react'
import { useAppDispatch } from '@/store/hooks'
import {
  setApplicationId,
  setDraftId,
  setStep,
  updateFormData,
} from '@/store/slices/solicitudSlice'
import solicitudesService from '@/services/solicitudesService'

export function useRetomarSolicitud(applicationId: string) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!applicationId) return

    const retomar = async () => {
      try {
        const { data } = await solicitudesService.obtener(applicationId)

        dispatch(setApplicationId(data.id))
        dispatch(setDraftId(data.id))
        dispatch(
          updateFormData({
            channel: data.channel,
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            fullName: data.fullName,
            phone: data.phone,
            email: data.email,
            city: data.city,
            monthlyIncome: data.monthlyIncome,
            monthlyExpenses: data.monthlyExpenses,
            requestedAmount: data.requestedAmount,
            termMonths: data.termMonths,
            loanPurpose: data.loanPurpose,
            dataConsentAccepted: data.dataConsentAccepted,
          })
        )

        if (data.monthlyIncome) {
          dispatch(setStep(2))
        } else {
          dispatch(setStep(1))
        }
      } catch {
        console.error('Error al retomar solicitud')
      }
    }

    retomar()
  }, [applicationId, dispatch])
}
