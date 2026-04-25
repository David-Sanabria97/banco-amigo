import styles from './RequirementItem.module.scss'

interface RequirementItemProps {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: boolean
}

export default function RequirementItem({
  icon,
  title,
  description,
  highlight = false,
}: RequirementItemProps) {
  return (
    <div className={[styles.item, highlight ? styles.highlight : ''].join(' ')}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  )
}
