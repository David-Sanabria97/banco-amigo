'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/hooks'
import {
  setDraftId,
  setApplicationId,
  setStep,
  updateFormData,
} from '@/store/slices/solicitudSlice'
import solicitudesService from '@/services/solicitudesService'
import Button from '@/components/atoms/Button'
import AbandonModal from '@/components/molecules/ModalAbandono'

import { APPLICATION_STATUS_MESSAGES } from '@/constants/application.constants'

import styles from './ApplicationActions.module.scss'
import { ApplicationStatus } from '@/types/application'

interface ApplicationData {
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

interface ApplicationActionsProps {
  applicationId: string
  status: string
  application?: ApplicationData
  onAbandoned?: () => void
}

const canEdit = (status: string) => status === ApplicationStatus.DRAFT
const canAbandon = (status: string) =>
  status !== ApplicationStatus.FINALIZED && status !== ApplicationStatus.ABANDONED

export default function ApplicationActions({
  applicationId,
  status,
  application,
  onAbandoned,
}: ApplicationActionsProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = useState(false)
  const [isAbandoning, setIsAbandoning] = useState(false)
  const [isContinuing, setIsContinuing] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleContinue = async () => {
    setIsContinuing(true)
    try {
      dispatch(setApplicationId(applicationId))
      dispatch(setDraftId(applicationId))

      if (application) {
        dispatch(updateFormData(application))
      }

      dispatch(setStep(application?.monthlyIncome ? 2 : 1))
      router.push('/solicitudes/nueva')
    } finally {
      setIsContinuing(false)
    }
  }

  const handleAbandon = async (reason: string) => {
    setIsAbandoning(true)
    setApiError(null)

    try {
      await solicitudesService.abandonar(applicationId, reason)
      setShowModal(false)
      onAbandoned?.()
    } catch {
      setApiError('Ocurrió un error al abandonar la solicitud.')
    } finally {
      setIsAbandoning(false)
    }
  }

  if (!canEdit(status) && !canAbandon(status)) return null

  return (
    <>
      <div className={styles.actionBar}>
        <span className={styles.statusMsg}>{APPLICATION_STATUS_MESSAGES[status] ?? status}</span>
        <div className={styles.actions}>
          {canEdit(status) ? (
            <Button variant="primary" size="sm" onClick={handleContinue} disabled={isContinuing}>
              {isContinuing ? 'Cargando...' : 'Continuar solicitud'}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" disabled>
              Editar
            </Button>
          )}
          {canAbandon(status) && (
            <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
              Abandonar
            </Button>
          )}
        </div>
      </div>

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      {showModal && (
        <AbandonModal
          onConfirm={handleAbandon}
          onCancel={() => setShowModal(false)}
          isLoading={isAbandoning}
        />
      )}
    </>
  )
}
