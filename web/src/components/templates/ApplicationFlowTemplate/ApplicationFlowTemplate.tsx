import NavBar from '@/components/organisms/NavBar'
import styles from './ApplicationFlowTemplate.module.scss'

interface ApplicationFlowTemplateProps {
  children: React.ReactNode
}

export default function ApplicationFlowTemplate({ children }: ApplicationFlowTemplateProps) {
  return (
    <div className={styles.page}>
      <NavBar />
      <main className={styles.main} id="main-content">
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  )
}
