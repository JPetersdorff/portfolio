import styles from './Gallery.module.css'

const placeholders = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  aspectRatio: i % 3 === 1 ? 'tall' : 'wide',
}))

export default function Gallery() {
  return (
    <section id="gallery">
      <div className="container">
        <div className="section-label">Naturfotografie</div>

        <p className={styles.intro}>Neben dem Code: Licht einfangen, bevor es verschwindet.</p>

        <div className={styles.grid}>
          {placeholders.map((p) => (
            <div key={p.id} className={`${styles.item} ${styles[p.aspectRatio]}`}>
              <div className={styles.placeholder}>
                <span className={styles.placeholderText}>Foto {p.id}</span>
              </div>
            </div>
          ))}
        </div>

        <p className={styles.note}>Fotos folgen — in Bearbeitung.</p>
      </div>
    </section>
  )
}
