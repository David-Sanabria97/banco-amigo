'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { resetSolicitud } from '@/store/slices/solicitudSlice'
import solicitudesService from '@/services/solicitudesService'
import StepIndicator from '@/components/molecules/StepIndicator'
import Button from '@/components/atoms/Button'

import { formatCurrency } from '@/utils/formatters'

import styles from './ApplicationSummary.module.scss'
import { ApplicationChannel } from '@/types/application'

interface SummaryItemProps {
  label: string
  value: string
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className={styles.summaryItem}>
      <div className={styles.siLabel}>{label}</div>
      <div className={styles.siValue}>{value}</div>
    </div>
  )
}

export default function ApplicationSummary() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { applicationId, formData } = useAppSelector((state) => state.solicitud)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAbandoning, setIsAbandoning] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleFinalizar = async () => {
    if (!applicationId) return
    setIsSubmitting(true)
    setApiError(null)

    try {
      await solicitudesService.finalizar(applicationId)
      dispatch(resetSolicitud())
      router.push(`/solicitudes/${applicationId}?finalizada=true`)
    } catch {
      setApiError('Ocurrió un error al finalizar la solicitud. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAbandonar = async () => {
    if (!applicationId) return
    setIsAbandoning(true)
    setApiError(null)

    try {
      await solicitudesService.abandonar(applicationId, 'El cliente no continuó el proceso')
      dispatch(resetSolicitud())
      router.push('/')
    } catch {
      setApiError('Ocurrió un error al abandonar la solicitud.')
    } finally {
      setIsAbandoning(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.tag}>Solicitud de crédito</span>
        <h1 className={styles.title}>Resumen de tu solicitud</h1>
        <p className={styles.subtitle}>Revisa y confirma los datos antes de finalizar.</p>
      </div>

      <StepIndicator currentStep={4} totalSteps={4} stepLabel="Resumen y confirmación" />

      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <span className={styles.summaryTitle}>
            Solicitud #{applicationId?.slice(0, 8).toUpperCase()}
          </span>
          <span className={styles.badge}>Pend. validación</span>
        </div>
        <div className={styles.summaryBody}>
          <div className={styles.summaryGrid}>
            <SummaryItem
              label="Canal"
              value={
                formData.channel === ApplicationChannel.SELF_SERVICE ? 'Autoservicio' : 'Asistido'
              }
            />
            {formData.channel === ApplicationChannel.ASSISTED && (
              <SummaryItem label="Asesor" value={formData.advisorId ?? '—'} />
            )}
            <SummaryItem label="Nombre" value={formData.fullName ?? '—'} />
            <SummaryItem
              label="Documento"
              value={`${formData.documentType} ${formData.documentNumber}`}
            />
            <SummaryItem label="Celular" value={formData.phone ?? '—'} />
            <SummaryItem label="Correo" value={formData.email ?? '—'} />
            <SummaryItem label="Ciudad" value={formData.city ?? '—'} />
            <SummaryItem
              label="Canal"
              value={
                formData.channel === ApplicationChannel.SELF_SERVICE ? 'Autoservicio' : 'Asistido'
              }
            />
            <SummaryItem label="Ingresos" value={formatCurrency(formData.monthlyIncome)} />
            <SummaryItem label="Egresos" value={formatCurrency(formData.monthlyExpenses)} />
            <SummaryItem
              label="Monto solicitado"
              value={formatCurrency(formData.requestedAmount)}
            />
            <SummaryItem
              label="Plazo"
              value={formData.termMonths ? `${formData.termMonths} meses` : '—'}
            />
          </div>
        </div>
      </div>

      <div className={styles.disclaimer}>
        Al confirmar aceptas las condiciones preliminares de la oferta. Esta solicitud será enviada
        a validación final y recibirás una respuesta en los próximos días hábiles.
      </div>

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <div className={styles.actions}>
        <Button variant="outline" onClick={handleAbandonar} disabled={isAbandoning}>
          {isAbandoning ? 'Abandonando...' : 'Abandonar proceso'}
        </Button>
        <Button variant="primary" onClick={handleFinalizar} disabled={isSubmitting}>
          {isSubmitting ? 'Finalizando...' : 'Confirmar y finalizar →'}
        </Button>
      </div>
    </div>
  )
}
