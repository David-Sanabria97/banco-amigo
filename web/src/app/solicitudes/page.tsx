'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSolicitudes } from '@/hooks/useSolicitudes'
import PageLayout from '@/components/templates/withPageLayout'
import Button from '@/components/atoms/Button'

import { APPLICATION_STATUS_LABELS } from '@/constants/application.constants'
import { formatCurrency, formatDate } from '@/utils/formatters'

import styles from './page.module.scss'

export default function ListadoSolicitudesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [channelFilter, setChannelFilter] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const {
    data: applications = [],
    isLoading,
    isError,
    refetch,
  } = useSolicitudes({
    status: statusFilter || undefined,
    channel: channelFilter || undefined,
    search: search || undefined,
  })

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setSearch(searchInput)
  }

  return (
    <PageLayout
      isLoading={isLoading}
      isError={isError}
      errorMessage="No se pudo cargar el listado de solicitudes."
      onRetry={refetch}
      loadingText="Cargando solicitudes..."
    >
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>Solicitudes de crédito</h1>
          <Button variant="primary" size="sm" onClick={() => router.push('/solicitudes/nueva')}>
            + Nueva solicitud
          </Button>
        </div>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className={styles.searchInput}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los estados</option>
            <option value="DRAFT">Borrador</option>
            <option value="PENDING_VALIDATION">Pend. validación</option>
            <option value="FINALIZED">Finalizada</option>
            <option value="ABANDONED">Abandonada</option>
          </select>
          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Todos los canales</option>
            <option value="SELF_SERVICE">Autoservicio</option>
            <option value="ASSISTED">Asistido</option>
          </select>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div className={styles.th}>Cliente</div>
            <div className={styles.th}>Monto</div>
            <div className={styles.th}>Canal</div>
            <div className={styles.th}>Estado</div>
            <div className={styles.th}>Fecha</div>
          </div>

          {applications.length === 0 ? (
            <div className={styles.empty}>No hay solicitudes que coincidan con los filtros.</div>
          ) : (
            applications.map((app) => {
              const status = APPLICATION_STATUS_LABELS[app.status] ?? {
                label: app.status,
                className: 'draft',
              }
              return (
                <div
                  key={app.id}
                  className={styles.tableRow}
                  onClick={() => router.push(`/solicitudes/${app.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalle de solicitud de ${app.fullName}`}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(`/solicitudes/${app.id}`)}
                >
                  <div className={styles.td}>{app.fullName}</div>
                  <div className={styles.td}>{formatCurrency(app.requestedAmount)}</div>
                  <div className={styles.td}>
                    {app.channel === 'SELF_SERVICE' ? 'Auto' : 'Asistido'}
                  </div>
                  <div className={styles.td}>
                    <span className={`${styles.badge} ${styles[status.className]}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className={styles.td}>{formatDate(app.createdAt)}</div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </PageLayout>
  )
}
