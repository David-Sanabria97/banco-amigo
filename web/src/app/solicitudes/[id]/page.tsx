'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useSolicitud, useSolicitudEventos } from '@/hooks/useSolicitud'
import EventsTimeLine from '@/components/organisms/EventsTimeLine'
import ApplicationActions from '@/components/organisms/ApplicationActions'
import PageLayout from '@/components/templates/withPageLayout'
import NavBar from '@/components/organisms/NavBar'

import { APPLICATION_STATUS_LABELS } from '@/constants/application.constants'

import { formatCurrency } from '@/utils/formatters'

import styles from './page.module.scss'

export default function DetalleSolicitudPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const finalizada = searchParams.get('finalizada') === 'true'

  const { data: application, isLoading: loadingApp, isError: errorApp, refetch } = useSolicitud(id)

  const {
    data: events = [],
    isLoading: loadingEvents,
    refetch: refetchEvents,
  } = useSolicitudEventos(id)

  if (loadingApp) {
    return (
      <div className={styles.page}>
        <NavBar />
        <div className={styles.loading}>Cargando solicitud...</div>
      </div>
    )
  }

  if (errorApp || !application) {
    return (
      <div className={styles.page}>
        <NavBar />
        <div className={styles.error}>No se pudo cargar la solicitud.</div>
      </div>
    )
  }

  const status = APPLICATION_STATUS_LABELS[application.status] ?? {
    label: application.status,
    className: 'draft',
  }

  const handleAbandoned = () => {
    refetch()
    refetchEvents()
  }

  return (
    <PageLayout
      isLoading={loadingApp}
      isError={errorApp}
      errorMessage="No se pudo cargar la solicitud."
      onRetry={refetch}
      loadingText="Cargando solicitud..."
    >
      <div className={styles.container}></div>
      <div className={styles.page}>
        <main className={styles.main} id="main-content">
          <div className={styles.container}>
            <button className={styles.back} onClick={() => router.push('/solicitudes')}>
              ← Volver al listado
            </button>

            {finalizada && (
              <div className={styles.successBanner}>
                <div className={styles.sbIcon}>
                  <svg
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l4 4 8-8" />
                  </svg>
                </div>
                <div>
                  <div className={styles.sbTitle}>¡Solicitud enviada exitosamente!</div>
                  <div className={styles.sbSub}>
                    Recibirás una respuesta en los próximos días hábiles.
                  </div>
                </div>
              </div>
            )}

            <div className={styles.headerRow}>
              <div>
                <h1 className={styles.title}>Detalle de solicitud</h1>
                <div className={styles.idLabel}>
                  ID: {application.id.slice(0, 13).toUpperCase()}
                </div>
              </div>
              <span className={`${styles.badge} ${styles[status.className]}`}>{status.label}</span>
            </div>

            <ApplicationActions
              applicationId={application.id}
              status={application.status}
              application={application}
              onAbandoned={handleAbandoned}
            />

            <div className={styles.twoCol}>
              <div className={styles.card}>
                <div className={styles.cardHeader}>Datos personales</div>
                <div className={styles.cardBody}>
                  {[
                    { label: 'Nombre', value: application.fullName },
                    {
                      label: 'Documento',
                      value: `${application.documentType} ${application.documentNumber}`,
                    },
                    { label: 'Celular', value: application.phone },
                    { label: 'Correo', value: application.email },
                    { label: 'Ciudad', value: application.city },
                    {
                      label: 'Canal',
                      value: application.channel === 'SELF_SERVICE' ? 'Autoservicio' : 'Asistido',
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className={styles.dataRow}>
                      <span className={styles.dk}>{label}</span>
                      <span className={styles.dv}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>Datos financieros</div>
                <div className={styles.cardBody}>
                  {[
                    { label: 'Ingresos', value: formatCurrency(application.monthlyIncome) },
                    { label: 'Egresos', value: formatCurrency(application.monthlyExpenses) },
                    { label: 'Monto', value: formatCurrency(application.requestedAmount) },
                    {
                      label: 'Plazo',
                      value: application.termMonths ? `${application.termMonths} meses` : '—',
                    },
                    { label: 'Destino', value: application.loanPurpose ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className={styles.dataRow}>
                      <span className={styles.dk}>{label}</span>
                      <span className={styles.dv}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {loadingEvents ? (
              <div className={styles.loading}>Cargando eventos...</div>
            ) : (
              <EventsTimeLine events={events} />
            )}
          </div>
        </main>
      </div>
    </PageLayout>
  )
}
