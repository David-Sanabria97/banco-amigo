import NavBar from '@/components/organisms/NavBar'
import Spinner from '@/components/atoms/Spinner'
import styles from './withPageLayout.module.scss'

interface PageLayoutOptions {
  showNav?: boolean
  loadingText?: string
  fullHeight?: boolean
}

interface WithLoadingProps {
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  onRetry?: () => void
  children: React.ReactNode
}

function PageLayout({
  isLoading,
  isError,
  errorMessage,
  onRetry,
  children,
  showNav = true,
  loadingText = 'Cargando...',
  fullHeight = true,
}: WithLoadingProps & PageLayoutOptions) {
  return (
    <div className={`${styles.page} ${fullHeight ? styles.fullHeight : ''}`}>
      {showNav && <NavBar />}
      <main className={styles.main} id="main-content">
        {isLoading ? (
          <div className={styles.center}>
            <Spinner size="md" text={loadingText} />
          </div>
        ) : isError ? (
          <div className={styles.center}>
            <div className={styles.errorIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <p className={styles.errorMsg}>{errorMessage ?? 'Ocurrió un error inesperado.'}</p>
            {onRetry && (
              <button className={styles.retryBtn} onClick={onRetry}>
                Intentar de nuevo
              </button>
            )}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}

export function withPageLayout(options: PageLayoutOptions = {}) {
  return function HOC({ isLoading, isError, errorMessage, onRetry, children }: WithLoadingProps) {
    return (
      <PageLayout
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        onRetry={onRetry}
        {...options}
      >
        {children}
      </PageLayout>
    )
  }
}

export default PageLayout
