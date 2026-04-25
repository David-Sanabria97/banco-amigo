import styles from './StatsBar.module.scss'

const stats = [
  {
    title: 'Montos flexibles',
    description: 'Desde $1M hasta $50M',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M2 10h3v4H2zM6 6h3v8H6zM10 2h3v12h-3z" />
      </svg>
    ),
  },
  {
    title: 'Plazos cómodos',
    description: 'Elige entre 12 y 60 meses',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <rect x="2" y="3" width="12" height="11" rx="1" />
        <path d="M2 7h12M5 2v2M11 2v2" />
      </svg>
    ),
  },
  {
    title: 'Cuotas fijas',
    description: 'Planea tus finanzas con cuotas fijas mensuales',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 2" />
      </svg>
    ),
  },
  {
    title: 'Acompañamiento',
    description: 'Te acompañamos en todo el proceso',
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M8 2C5 2 3 4 3 6c0 3 5 8 5 8s5-5 5-8c0-2-2-4-5-4z" />
      </svg>
    ),
  },
]

export default function StatsBar() {
  return (
    <div className={styles.bar}>
      {stats.map((stat) => (
        <div key={stat.title} className={styles.stat}>
          <div className={styles.icon}>{stat.icon}</div>
          <div className={styles.title}>{stat.title}</div>
          <div className={styles.description}>{stat.description}</div>
        </div>
      ))}
    </div>
  )
}
