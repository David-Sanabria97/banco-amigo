'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  updateFormData,
  setStep,
  setDraftId,
  setApplicationId,
} from '@/store/slices/solicitudSlice'
import solicitudesService from '@/services/solicitudesService'
import FormField from '@/components/molecules/FormField'
import ChannelCard from '@/components/molecules/ChannelCard'
import StepIndicator from '@/components/molecules/StepIndicator'
import Button from '@/components/atoms/Button'
import Label from '@/components/atoms/Label'
import Select from '@/components/atoms/Select'

import { DOCUMENT_TYPES, CITIES } from '@/constants/application.constants'

import styles from './BasicDataForm.module.scss'

const schema = z.object({
  channel: z.enum(['SELF_SERVICE', 'ASSISTED'] as const, {
    message: 'Selecciona un canal de atención',
  }),
  documentType: z.enum(['CC', 'CE', 'PA'] as const, {
    message: 'Selecciona el tipo de documento',
  }),
  documentNumber: z
    .string()
    .min(5, 'Mínimo 5 caracteres')
    .max(15, 'Máximo 15 caracteres')
    .regex(/^\d+$/, 'Solo se permiten números'),
  fullName: z.string().min(3, 'Ingresa tu nombre completo').max(100, 'Nombre demasiado largo'),
  phone: z
    .string()
    .length(10, 'El celular debe tener 10 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  city: z.string().min(1, 'Selecciona una ciudad'),
})

type BasicDataFormValues = z.infer<typeof schema>

export default function BasicDataForm() {
  const dispatch = useAppDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const savedData = useAppSelector((state) => state.solicitud.formData)
  const applicationId = useAppSelector((state) => state.solicitud.applicationId)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BasicDataFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      channel: (savedData.channel as 'SELF_SERVICE' | 'ASSISTED') ?? 'SELF_SERVICE',
      documentType: (savedData.documentType as 'CC' | 'CE' | 'PA') ?? undefined,
      documentNumber: savedData.documentNumber ?? '',
      fullName: savedData.fullName ?? '',
      phone: savedData.phone ?? '',
      email: savedData.email ?? '',
      city: savedData.city ?? '',
    },
  })

  const selectedChannel = watch('channel')
  const selectedDocType = watch('documentType')
  const selectedCity = watch('city')

  const onSubmit = async (data: BasicDataFormValues) => {
    setIsSubmitting(true)
    setApiError(null)

    try {
      if (applicationId) {
        await solicitudesService.actualizar(applicationId, {
          channel: data.channel,
          documentType: data.documentType,
          documentNumber: data.documentNumber,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          city: data.city,
        })
        dispatch(updateFormData(data))
        dispatch(setStep(2))
      } else {
        const { data: application } = await solicitudesService.crear({
          channel: data.channel,
          documentType: data.documentType,
          documentNumber: data.documentNumber,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email,
          city: data.city,
        })
        dispatch(updateFormData(data))
        dispatch(setApplicationId(application.id))
        dispatch(setDraftId(application.id))
        dispatch(setStep(2))
      }
    } catch {
      setApiError('Ocurrió un error. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.header}>
        <span className={styles.tag}>Solicitud de crédito</span>
        <h1 className={styles.title}>Comencemos con tus datos</h1>
        <p className={styles.subtitle}>
          Selecciona el canal de atención e ingresa tu información básica.
        </p>
      </div>

      <StepIndicator currentStep={1} totalSteps={4} stepLabel="Canal y datos básicos" />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Canal de atención</span>
        <div className={styles.channels}>
          <ChannelCard
            title="Autoservicio"
            description="Completa tu solicitud de forma independiente."
            selected={selectedChannel === 'SELF_SERVICE'}
            onClick={() => setValue('channel', 'SELF_SERVICE')}
          />
          <ChannelCard
            title="Asistido"
            description="Un asesor te acompañará en el proceso."
            selected={selectedChannel === 'ASSISTED'}
            onClick={() => setValue('channel', 'ASSISTED')}
          />
        </div>
        {errors.channel && <span className={styles.errorMsg}>{errors.channel.message}</span>}
      </div>

      <hr className={styles.divider} />

      <div className={styles.section}>
        <span className={styles.sectionLabel}>Datos personales</span>

        <div className={styles.fieldDocRow}>
          <div className={styles.fieldGroup}>
            <Label htmlFor="documentType" required>
              Tipo de documento
            </Label>
            <Select
              id="documentType"
              options={DOCUMENT_TYPES}
              value={selectedDocType}
              onChange={(e) => setValue('documentType', e.target.value as 'CC' | 'CE' | 'PA')}
              error={!!errors.documentType}
              placeholder="Selecciona"
            />
            {errors.documentType && (
              <span className={styles.errorMsg}>{errors.documentType.message}</span>
            )}
          </div>
          <FormField
            id="documentNumber"
            label="Número de documento"
            placeholder="Ej: 1234567890"
            error={errors.documentNumber?.message}
            required
            {...register('documentNumber')}
          />
        </div>

        <FormField
          id="fullName"
          label="Nombres y apellidos completos"
          placeholder="Ej: Carlos Andrés Ruiz"
          error={errors.fullName?.message}
          required
          autoComplete="name"
          {...register('fullName')}
        />

        <div className={styles.fieldRow}>
          <FormField
            id="phone"
            label="Celular"
            placeholder="Ej: 3001234567"
            error={errors.phone?.message}
            required
            autoComplete="tel"
            {...register('phone')}
          />
          <div className={styles.fieldGroup}>
            <Label htmlFor="city" required>
              Ciudad
            </Label>
            <Select
              id="city"
              options={CITIES}
              value={selectedCity}
              onChange={(e) => setValue('city', e.target.value)}
              error={!!errors.city}
              placeholder="Selecciona"
            />
            {errors.city && <span className={styles.errorMsg}>{errors.city.message}</span>}
          </div>
        </div>

        <FormField
          id="email"
          label="Correo electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          error={errors.email?.message}
          required
          autoComplete="email"
          {...register('email')}
        />
      </div>

      {apiError && <div className={styles.apiError}>{apiError}</div>}

      <div className={styles.actions}>
        <Button variant="ghost" type="button">
          ← Volver
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Continuar →'}
        </Button>
      </div>
    </form>
  )
}
