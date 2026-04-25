import styles from './ChannelCard.module.scss'

interface ChannelCardProps {
  title: string
  description: string
  selected: boolean
  onClick: () => void
}

export default function ChannelCard({ title, description, selected, onClick }: ChannelCardProps) {
  return (
    <div
      className={[styles.card, selected ? styles.selected : ''].join(' ')}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-pressed={selected}
    >
      <div className={styles.indicator}>
        <div className={[styles.dot, selected ? styles.dotActive : ''].join(' ')} />
      </div>
      <div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  )
}
