'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setStep, updateFormData } from '@/store/slices/solicitudSlice'
import solicitudesService from '@/services/solicitudesService'
import { useCapacidadPago } from '@/hooks/useCapacidadPago'
import FormField from '@/components/molecules/FormField'
import ConsentCheckbox from '@/components/molecules/ConsentCheckbox'
import StepIndicator from '@/components/molecules/StepIndicator'
import Button from '@/components/atoms/Button'
import Label from '@/components/atoms/Label'
import Select from '@/components/atoms/Select'

import {
  TERM_OPTIONS,
  LOAN_PURPOSE_OPTIONS,
  MONTHLY_RATE,
  MAX_LOAN_AMOUNT,
  MIN_LOAN_AMOUNT,
} from '@/constants/application.constants'
import { formatCurrency } from '@/utils/formatters'

import styles from './FinancialDataForm.module.scss'

const schema = z
  .object({
    monthlyIncome: z
      .number({ message: 'Ingresa tus ingresos mensuales' })
      .min(100000, 'Los ingresos deben ser mayores a $100.000'),
    monthlyExpenses: z
      .number({ message: 'Ingresa tus egresos mensuales' })
      .min(0, 'Los egresos no pueden ser negativos'),
    requestedAmount: z
      .number({ message: 'Ingresa el monto solicitado' })
      .min(MIN_LOAN_AMOUNT, 'El monto mínimo es $1.000.000')
      .max(MAX_LOAN_AMOUNT, 'El monto máximo es $50.000.000'),
    termMonths: z.number({ message: 'Selecciona el plazo' }).min(12).max(60),
    loanPurpose: z.string().min(1, 'Selecciona el destino del crédito'),
    dataConsentAccepted: z
      .boolean()
      .refine((val) => val === true, 'Debes aceptar el tratamiento de datos'),
  })
  .refine((data) => data.monthlyExpenses < data.monthlyIncome, {
    message: 'Los egresos no pueden superar los ingresos',
    path: ['monthlyExpenses'],
  })

type FinancialDataFormValues = z.infer<typeof schema>

export default function FinancialDataForm() {
  const dispatch = useAppDispatch()
  const applicationId = useAppSelector((state) => state.solicitud.applicationId)
  const savedData = useAppSelector((state) => state.solicitud.formData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FinancialDataFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      monthlyIncome: savedData.monthlyIncome,
      monthlyExpenses: savedData.monthlyExpenses,
      requestedAmount: savedData.requestedAmount,
      termMonths: savedData.termMonths ?? 36,
      loanPurpose: savedData.loanPurpose,
      dataConsentAccepted: savedData.dataConsentAccepted ?? false,
    },
  })

  const monthlyIncome = watch('monthlyIncome') ?? 0
  const monthlyExpenses = watch('monthlyExpenses') ?? 0
  const requestedAmount = watch('requestedAmount') ?? 0
  const termMonths = watch('termMonths') ?? 36
  const dataConsentAccepted = watch('dataConsentAccepted')

  const { capacidad, advertencia } = useCapacidadPago({
    monthlyIncome,
    monthlyExpenses,
  })

  // Fórmula de amortización francesa para cuota estimada
  const monthlyRate = MONTHLY_RATE
  const estimatedMonthlyPayment =
    requestedAmount > 0 && termMonths > 0
      ? Math.round(
          (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
            (Math.pow(1 + monthlyRate, termMonths) - 1)
        )
      : 0

  const onSubmit = async (data: FinancialDataFormValues) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      await solicitudesService.actualizar(applicationId!, {
        monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses,
        requestedAmount: data.requestedAmount,
        termMonths: data.termMonths,
        loanPurpose: data.loanPurpose,
        dataConsentAccepted: data.dataConsentAccepted,
      })

      dispatch(updateFormData(data))
      dispatch(setStep(3))
    } catch {
      setApiError('Ocurrió un error al guardar los datos. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.header}>
        <span className={styles.tag}>Solicitud de crédito</span>
        <h1 className={styles.title}>Información financiera</h1>
        <p className={styles.subtitle}>Cuéntanos sobre tus ingresos y el crédito que necesitas.</p>
      </div>

      <StepIndicator currentStep={2} totalSteps={4} stepLabel="Datos financieros" />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Ingresos y egresos</span>

        <div className={styles.fieldRow}>
          <FormField
            id="monthlyIncome"
            label="Ingresos mensuales"
            placeholder="Ej: 3500000"
            error={errors.monthlyIncome?.message}
            required
            {...register('monthlyIncome', { valueAsNumber: true })}
          />
          <div className={styles.fieldGroup}>
            <FormField
              id="monthlyExpenses"
              label="Egresos mensuales"
              placeholder="Ej: 1200000"
              error={errors.monthlyExpenses?.message}
              required
              {...register('monthlyExpenses', { valueAsNumber: true })}
            />
            {advertencia && !errors.monthlyExpenses && (
              <span className={styles.warnMsg}>Los egresos son muy cercanos a los ingresos</span>
            )}
          </div>
        </div>

        {monthlyIncome > 0 && (
          <div className={styles.capacityBar}>
            <span className={styles.capacityLabel}>Capacidad de pago estimada</span>
            <span
              className={[styles.capacityValue, capacidad <= 0 ? styles.capacityNegative : ''].join(
                ' '
              )}
            >
              {formatCurrency(capacidad)} / mes
            </span>
          </div>
        )}
      </div>

      <hr className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Detalle del crédito</span>

        <div className={styles.fieldRow}>
          <FormField
            id="requestedAmount"
            label="Monto solicitado"
            placeholder="Ej: 18000000"
            error={errors.requestedAmount?.message}
            required
            {...register('requestedAmount', { valueAsNumber: true })}
          />
          <div className={styles.fieldGroup}>
            <Label htmlFor="termMonths" required>
              Plazo deseado
            </Label>
            <Select
              id="termMonths"
              options={TERM_OPTIONS}
              value={String(termMonths)}
              onChange={(e) => setValue('termMonths', Number(e.target.value))}
              error={!!errors.termMonths}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <Label htmlFor="loanPurpose" required>
            Destino del crédito
          </Label>
          <Select
            id="loanPurpose"
            options={LOAN_PURPOSE_OPTIONS}
            value={watch('loanPurpose')}
            onChange={(e) => setValue('loanPurpose', e.target.value)}
            error={!!errors.loanPurpose}
            placeholder="Selecciona el destino"
          />
          {errors.loanPurpose && (
            <span className={styles.errorMsg}>{errors.loanPurpose.message}</span>
          )}
        </div>

        {estimatedMonthlyPayment > 0 && (
          <div className={styles.hint}>
            La cuota mensual estimada sería de{' '}
            <strong>{formatCurrency(estimatedMonthlyPayment)}</strong> según el plazo seleccionado.
          </div>
        )}
      </div>

      <hr className={styles.divider} />

      <ConsentCheckbox
        checked={dataConsentAccepted ?? false}
        onChange={(val) => setValue('dataConsentAccepted', val)}
        error={errors.dataConsentAccepted?.message}
      />

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <div className={styles.actions}>
        <Button variant="ghost" type="button" onClick={() => dispatch(setStep(1))}>
          ← Volver
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Continuar →'}
        </Button>
      </div>
    </form>
  )
}
