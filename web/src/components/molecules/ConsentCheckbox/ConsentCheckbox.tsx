import styles from './ConsentCheckbox.module.scss'

interface ConsentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
}

export default function ConsentCheckbox({ checked, onChange, error }: ConsentCheckboxProps) {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.row}
        onClick={() => onChange(!checked)}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onChange(!checked)}
      >
        <div className={[styles.checkbox, checked ? styles.checked : ''].join(' ')}>
          {checked && (
            <svg viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2.5 2.5L8 3"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className={styles.text}>
          Autorizo el tratamiento de mis datos personales según la{' '}
          <a href="#" className={styles.link} onClick={(e) => e.stopPropagation()}>
            política de privacidad
          </a>{' '}
          de Banco Amigo.
        </span>
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  )
}
