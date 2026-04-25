'use client'

import { useAppSelector } from '@/store/hooks'
import { useRouter } from 'next/navigation'
import Button from '@/components/atoms/Button'
import styles from './DraftBanner.module.scss'

export default function DraftBanner() {
  const router = useRouter()
  const { draftId, currentStep } = useAppSelector((state) => state.solicitud)

  if (!draftId) return null

  return (
    <div className={styles.banner}>
      <span className={styles.text}>
        Tienes una solicitud en borrador — Paso {currentStep} de 4
      </span>
      <Button
        size="sm"
        variant="primary"
        onClick={() => router.push(`/solicitudes/nueva?step=${currentStep}`)}
      >
        Continuar →
      </Button>
    </div>
  )
}
