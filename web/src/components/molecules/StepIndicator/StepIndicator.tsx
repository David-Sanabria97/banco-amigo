import styles from './StepIndicator.module.scss'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabel: string
}

export default function StepIndicator({ currentStep, totalSteps, stepLabel }: StepIndicatorProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <span className={styles.step}>
          Paso {currentStep} de {totalSteps}
        </span>
        <span className={styles.label}>{stepLabel}</span>
      </div>
      <div className={styles.bar}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={[
              styles.pip,
              i < currentStep ? styles.done : '',
              i === currentStep - 1 ? styles.active : '',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
