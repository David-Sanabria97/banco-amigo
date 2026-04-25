import styles from './Spinner.module.scss'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function Spinner({ size = 'md', text }: SpinnerProps) {
  return (
    <div className={styles.wrapper}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  )
}
