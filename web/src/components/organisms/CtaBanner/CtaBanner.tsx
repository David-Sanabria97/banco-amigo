'use client'

import { useRouter } from 'next/navigation'

import Button from '@/components/atoms/Button'
import styles from './CtaBanner.module.scss'

export default function CtaBanner() {
  const router = useRouter()

  return (
    <section className={styles.banner}>
      <div className={styles.left}>
        <h2 className={styles.title}>
          ¿Listo para lograr
          <br />
          lo que quieres?
        </h2>
        <p className={styles.description}>
          Solicita tu crédito de libre destino ahora y recibe una respuesta rápida.
        </p>
      </div>
      <Button variant="white" size="lg" onClick={() => router.push('/solicitudes/nueva')}>
        Solicitar crédito ahora →
      </Button>
    </section>
  )
}
