import { formatDate } from '@/utils/formatters'

import styles from './EventsTimeLine.module.scss'

interface ApplicationEvent {
  id: string
  type: string
  description: string
  metadata?: Record<string, unknown>
  createdAt: string
}

interface EventsTimeLineProps {
  events: ApplicationEvent[]
}

const eventColors: Record<string, string> = {
  CREATED: '#2196F3',
  UPDATED: '#9C27B0',
  SIMULATION_SUCCESS: '#4CAF50',
  SIMULATION_FAILED: '#FF9800',
  SIMULATION_ERROR: '#F44336',
  FINALIZED: '#D32F2F',
  ABANDONED: '#757575',
}

export default function EventsTimeLine({ events }: EventsTimeLineProps) {
  if (events.length === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>Línea de tiempo de eventos</div>
        <div className={styles.empty}>No hay eventos registrados.</div>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>Línea de tiempo de eventos</div>
      <div className={styles.cardBody}>
        <div className={styles.events}>
          {events.map((event, index) => (
            <div key={event.id} className={styles.event}>
              <div className={styles.eventLeft}>
                <div
                  className={styles.eventDot}
                  style={{ background: eventColors[event.type] ?? '#9E9E9E' }}
                />
                {index < events.length - 1 && <div className={styles.eventLine} />}
              </div>
              <div className={styles.eventContent}>
                <div className={styles.evTitle}>{event.description}</div>
                <div className={styles.evTime}>{formatDate(event.createdAt)}</div>
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className={styles.evMeta}>
                    {Object.entries(event.metadata)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' · ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
