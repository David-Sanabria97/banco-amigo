import styles from './MetricsBar.module.scss'

const metrics = [
  {
    value: '+25 años',
    label: 'Acompañando sueños y proyectos',
  },
  {
    value: '+1M',
    label: 'Clientes que confían en nosotros',
  },
  {
    value: '4.8/5',
    label: 'Calificación de nuestros clientes',
  },
  {
    value: '100%',
    label: 'Proceso digital, seguro y confiable',
  },
]

export default function MetricsBar() {
  return (
    <section className={styles.bar}>
      {metrics.map((metric) => (
        <div key={metric.value} className={styles.metric}>
          <div className={styles.value}>{metric.value}</div>
          <div className={styles.label}>{metric.label}</div>
        </div>
      ))}
    </section>
  )
}
