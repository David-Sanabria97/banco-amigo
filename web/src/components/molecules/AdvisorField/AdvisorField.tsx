import styles from './AdvisorField.module.scss'

interface AdvisorFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export default function AdvisorField({ value, onChange, error }: AdvisorFieldProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.icon}>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="8" cy="6" r="3" />
            <path d="M2 14c0-3 2.7-5 6-5s6 2 6 5" />
          </svg>
        </div>
        <span className={styles.title}>Identificador del asesor</span>
      </div>

      <div className={styles.field}>
        <label htmlFor="advisorId" className={styles.label}>
          Código del asesor <span className={styles.required}>*</span>
        </label>
        <input
          id="advisorId"
          type="text"
          placeholder="Ej: ASE-001234"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className={[styles.input, value ? styles.filled : '', error ? styles.error : ''].join(
            ' '
          )}
          aria-describedby={error ? 'advisorId-error' : undefined}
          aria-invalid={!!error}
        />
        {error && (
          <span id="advisorId-error" className={styles.errorMsg} role="alert">
            {error}
          </span>
        )}
      </div>

      {value && !error && (
        <div className={styles.badge}>
          <svg
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 6l2.5 2.5L10 3" />
          </svg>
          Asesor {value} asociado a la sesión
        </div>
      )}

      {!value && (
        <span className={styles.hint}>Ingresa el código del asesor que te está atendiendo.</span>
      )}
    </div>
  )
}
