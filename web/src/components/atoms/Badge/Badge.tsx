import styles from './Badge.module.scss'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return <span className={[styles.badge, styles[variant]].join(' ')}>{children}</span>
}
