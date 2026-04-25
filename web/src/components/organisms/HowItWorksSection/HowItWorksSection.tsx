import styles from './HowItWorksSection.module.scss'

const steps = [
  {
    number: 1,
    title: 'Inicia tu solicitud',
    description: 'Diligencia tus datos básicos y selecciona el canal de atención.',
  },
  {
    number: 2,
    title: 'Completa tu información',
    description: 'Ingresa tus datos personales, financieros y el destino del crédito.',
  },
  {
    number: 3,
    title: 'Recibe tu simulación',
    description: 'Consulta tu oferta preliminar en minutos.',
  },
  {
    number: 4,
    title: 'Confirma y listo',
    description: 'Acepta las condiciones y finaliza tu solicitud. Te notificaremos el resultado.',
  },
]

export default function HowItWorksSection() {
  return (
    <section className={styles.section} id="como-funciona">
      <h2 className={styles.title}>
        ¿<span className={styles.highlight}>Cómo funciona</span>?
      </h2>
      <div className={styles.steps}>
        {steps.map((step, index) => (
          <div key={step.number} className={styles.step}>
            <div className={styles.left}>
              <div className={styles.number}>{step.number}</div>
              {index < steps.length - 1 && <div className={styles.line} />}
            </div>
            <div className={styles.content}>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDesc}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.link}>Conocer más del proceso →</div>
    </section>
  )
}
