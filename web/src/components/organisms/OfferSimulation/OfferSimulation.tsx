'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setStep } from '@/store/slices/solicitudSlice'
import { useSimulacion } from '@/hooks/useSimulacion'
import StepIndicator from '@/components/molecules/StepIndicator'
import Button from '@/components/atoms/Button'

import { formatCurrency } from '@/utils/formatters'

import styles from './OfferSimulation.module.scss'

export default function OfferSimulation() {
  const dispatch = useAppDispatch()
  const { draftId } = useAppSelector((state) => state.solicitud)
  const { estado, resultado, correlationId, simular, reintentar, setEstado } = useSimulacion()

  useEffect(() => {
    if (!draftId) {
      setEstado('error')
      return
    }
    simular(draftId)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.tag}>Solicitud de crédito</span>
        <h1 className={styles.title}>
          {estado === 'success' && '¡Tu oferta está lista!'}
          {estado === 'not_viable' && 'Simulación no viable'}
          {estado === 'error' && 'Error técnico'}
          {(estado === 'loading' || estado === 'idle') && 'Consultando tu oferta'}
        </h1>
        <p className={styles.subtitle}>
          {estado === 'success' && 'Revisa las condiciones preliminares de tu crédito.'}
          {estado === 'not_viable' && 'No fue posible generar una oferta con los datos ingresados.'}
          {estado === 'error' && 'No pudimos procesar tu solicitud en este momento.'}
          {(estado === 'loading' || estado === 'idle') && 'Estamos procesando tu información.'}
        </p>
      </div>

      <StepIndicator currentStep={3} totalSteps={4} stepLabel="Simulación de oferta" />

      {(estado === 'loading' || estado === 'idle') && (
        <div className={styles.loadingCard}>
          <div className={styles.spinner} />
          <span className={styles.loadingText}>Consultando tu oferta preliminar...</span>
        </div>
      )}

      {estado === 'success' && resultado && (
        <div className={styles.successCard}>
          <span className={styles.cardTag}>Oferta preliminar</span>
          <div className={styles.offerGrid}>
            <div className={styles.offerKv}>
              <span className={styles.k}>Cuota mensual</span>
              <span className={styles.v}>{formatCurrency(resultado.monthlyPayment ?? 0)}</span>
              <span className={styles.vsub}>por mes</span>
            </div>
            <div className={styles.offerKv}>
              <span className={styles.k}>Tasa mensual</span>
              <span className={styles.v}>{((resultado.monthlyRate ?? 0) * 100).toFixed(1)}%</span>
              <span className={styles.vsub}>mes vencido</span>
            </div>
            <div className={styles.offerKv}>
              <span className={styles.k}>Total a pagar</span>
              <span className={styles.v}>{formatCurrency(resultado.totalAmount ?? 0)}</span>
              <span className={styles.vsub}>en el plazo</span>
            </div>
          </div>
          <hr className={styles.divider} />
          <p className={styles.disclaimer}>
            Esta es una oferta preliminar sujeta a validación final. No constituye un desembolso.
          </p>
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => dispatch(setStep(4))}>
              Continuar con esta oferta →
            </Button>
            <Button variant="outline" onClick={() => dispatch(setStep(2))}>
              Modificar datos
            </Button>
          </div>
        </div>
      )}

      {estado === 'not_viable' && (
        <div className={styles.failCard}>
          <span className={styles.cardTagFail}>Solicitud no viable</span>
          <div className={styles.failIcon}>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4M10 14h.01" />
            </svg>
          </div>
          <h2 className={styles.failTitle}>No cumples los requisitos mínimos</h2>
          <p className={styles.failDesc}>
            {resultado?.message ??
              'La capacidad de pago no es suficiente para el monto y plazo solicitados. Puedes ajustar los datos e intentarlo nuevamente.'}
          </p>
          <div className={styles.actions}>
            <Button variant="outline" onClick={() => dispatch(setStep(2))}>
              Ajustar datos
            </Button>
            <Button variant="ghost">Abandonar proceso</Button>
          </div>
        </div>
      )}

      {estado === 'error' && (
        <div className={styles.errorCard}>
          <span className={styles.cardTagError}>Error temporal</span>
          <div className={styles.errorIcon}>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v4M10 14h.01" />
            </svg>
          </div>
          <h2 className={styles.errorTitle}>Servicio no disponible</h2>
          <p className={styles.errorDesc}>
            Ocurrió un error técnico al consultar tu oferta. Por favor intenta nuevamente en unos
            minutos.
          </p>
          {correlationId && (
            <span className={styles.correlationId}>ID de correlación: {correlationId}</span>
          )}
          <div className={styles.actions}>
            <Button variant="primary" onClick={() => draftId && reintentar(draftId)}>
              Reintentar
            </Button>
            <Button variant="ghost">Contactar soporte</Button>
          </div>
        </div>
      )}
    </div>
  )
}
