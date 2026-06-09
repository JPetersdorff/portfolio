import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.eyebrow}>AI &amp; Data Engineer · Göttingen</div>

        <h1 className={styles.name}>
          Jakob
          <span className={styles.von}>von Petersdorff</span>
        </h1>

        <p className={styles.tagline}>
          Designing, building &amp; running
          <br />
          AI products in production.
        </p>

        <div className={styles.actions}>
          <a href="#experience" className={styles.btnPrimary}>
            Mein Weg
          </a>
          <a href="#contact" className={styles.btnGhost}>
            Kontakt
          </a>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span />
      </div>
    </section>
  )
}
