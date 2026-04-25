import styles from './BenefitCard.module.scss'

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </div>
  )
}
