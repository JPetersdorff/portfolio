import { useState, useEffect } from 'react'
import styles from './Nav.module.css'

const links = [
  { label: 'Profil', href: '#about' },
  { label: 'Erfahrung', href: '#experience' },
  { label: 'Stack', href: '#stack' },
  { label: 'Galerie', href: '#gallery' },
  { label: 'Kontakt', href: '#contact' },
]

export default function Nav({ theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo}>
          JP
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button className={styles.themeToggle} onClick={onToggleTheme} aria-label="Theme wechseln">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>

        <button className={styles.burger} onClick={() => setMenuOpen((o) => !o)} aria-label="Menü">
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
