'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/atoms/Button'
import styles from './NavBar.module.scss'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Requisitos', href: '#requisitos' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Preguntas frecuentes', href: '#faq' },
]

export default function NavBar() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className={styles.nav} aria-label="Navegación principal">
        <span className={styles.logo} onClick={() => router.push('/')}>
          Banco Amigo
        </span>
        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <Button variant="primary" size="sm" onClick={() => router.push('/solicitudes/nueva')}>
          Solicitar crédito
        </Button>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(true)}>
          <svg viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </nav>

      <div
        className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <div className={styles.mobileMenuHeader}>
          <span className={styles.logo}>Banco Amigo</span>
          <button className={styles.menuBtn} onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className={styles.mobileLinks}>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => {
            setMenuOpen(false)
            router.push('/solicitudes/nueva')
          }}
        >
          Solicitar crédito
        </Button>
      </div>
    </>
  )
}
