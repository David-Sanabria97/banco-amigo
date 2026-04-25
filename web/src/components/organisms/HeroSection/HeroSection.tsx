'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import styles from './HeroSection.module.scss'
import { MAX_LOAN_AMOUNT, MIN_LOAN_AMOUNT } from '@/constants/application.constants'

const bullets = [
  {
    title: 'Respuesta rápida',
    description: 'Recibe una respuesta preliminar en minutos.',
    icon: (
      <svg viewBox="0 0 16 16">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 2" />
      </svg>
    ),
  },
  {
    title: 'Seguro y confiable',
    description: 'Tus datos protegidos con los más altos estándares.',
    icon: (
      <svg viewBox="0 0 16 16">
        <path d="M8 2l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" />
      </svg>
    ),
  },
  {
    title: 'Fácil y 100% digital',
    description: 'Solicita, simula y confirma desde donde estés.',
    icon: (
      <svg viewBox="0 0 16 16">
        <rect x="2" y="3" width="12" height="10" rx="2" />
        <path d="M5 7h6M5 10h4" />
      </svg>
    ),
  },
]

export default function HeroSection() {
  const router = useRouter()

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <Badge variant="default">100% digital</Badge>
        <h1 className={styles.title}>
          Haz realidad <br />
          <span className={styles.highlight}>lo que quieres</span>
        </h1>
        <p className={styles.description}>
          Solicita tu crédito 100% digital, rápido, seguro y sin salir de casa.
        </p>
        <ul className={styles.bullets}>
          {bullets.map((bullet) => (
            <li key={bullet.title} className={styles.bullet}>
              <div className={styles.bulletIcon}>{bullet.icon}</div>
              <div>
                <div className={styles.bulletTitle}>{bullet.title}</div>
                <div className={styles.bulletDesc}>{bullet.description}</div>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <Button variant="primary" size="lg" onClick={() => router.push('/solicitudes/nueva')}>
            Solicitar crédito ahora →
          </Button>
          <Button variant="ghost" size="lg">
            Conoce más ▾
          </Button>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Simula tu crédito</div>
          <div className={styles.cardRow}>
            <span className={styles.cardKey}>Desde</span>
            <span className={styles.cardValue}>${MIN_LOAN_AMOUNT}</span>
          </div>
          <div className={styles.cardRow}>
            <span className={styles.cardKey}>Hasta</span>
            <span className={styles.cardValue}>${MAX_LOAN_AMOUNT} </span>
          </div>
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => router.push('/solicitudes/nueva')}
          >
            Simular ahora
          </Button>
        </div>
      </div>
    </section>
  )
}
