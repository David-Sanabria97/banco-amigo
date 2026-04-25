'use client'

import { useState } from 'react'
import Button from '@/components/atoms/Button'
import styles from './ModalAbandono.module.scss'

interface ModalAbandonoProps {
  onConfirm: (reason: string) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function ModalAbandono({
  onConfirm,
  onCancel,
  isLoading = false,
}: ModalAbandonoProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (reason.trim().length < 5) {
      setError('El motivo debe tener al menos 5 caracteres')
      return
    }
    onConfirm(reason.trim())
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <h2 id="modal-title" className={styles.title}>
          ¿Abandonar esta solicitud?
        </h2>
        <p className={styles.desc}>
          Esta acción no se puede deshacer. Por favor indica el motivo del abandono.
        </p>
        <div className={styles.fieldGroup}>
          <textarea
            className={[styles.textarea, error ? styles.textareaError : ''].join(' ')}
            placeholder="Motivo del abandono..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setError('')
            }}
            rows={3}
            aria-label="Motivo del abandono"
            aria-describedby={error ? 'reason-error' : undefined}
          />
          {error && (
            <span id="reason-error" className={styles.error} role="alert">
              {error}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Abandonando...' : 'Confirmar abandono'}
          </Button>
        </div>
      </div>
    </div>
  )
}
