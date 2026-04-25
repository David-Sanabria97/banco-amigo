import RequirementItem from '@/components/molecules/RequirementItem'
import styles from './RequirementsSection.module.scss'

const requirements = [
  {
    title: 'Ser mayor de edad',
    description: '18 años en adelante.',
    highlight: false,
    icon: (
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
    ),
  },
  {
    title: 'Documento de identidad',
    description: 'Cédula de ciudadanía vigente.',
    highlight: false,
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="2" y="3" width="12" height="10" rx="1" />
        <path d="M5 7h6M5 10h4" />
      </svg>
    ),
  },
  {
    title: 'Ingresos comprobables',
    description: 'Demuestra tu capacidad de pago.',
    highlight: false,
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M3 12l3-3 3 3 4-6" />
      </svg>
    ),
  },
  {
    title: 'Información básica',
    description: 'Datos personales, laborales y financieros.',
    highlight: false,
    icon: (
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
    ),
  },
  {
    title: 'Tu seguridad es nuestra prioridad',
    description: 'Usamos tecnología de punta para proteger tu información.',
    highlight: true,
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="4" y="7" width="8" height="7" rx="1" />
        <path d="M6 7V5a2 2 0 014 0v2" />
      </svg>
    ),
  },
]

export default function RequirementsSection() {
  return (
    <section className={styles.section} id="requisitos">
      <h2 className={styles.title}>
        <span className={styles.highlight}>Requisitos</span> mínimos
      </h2>
      <div className={styles.list}>
        {requirements.map((req) => (
          <RequirementItem
            key={req.title}
            icon={req.icon}
            title={req.title}
            description={req.description}
            highlight={req.highlight}
          />
        ))}
      </div>
    </section>
  )
}
