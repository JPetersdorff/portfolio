import styles from './About.module.css'

const stats = [
  { num: '6+', label: 'Jahre Daten' },
  { num: '2', label: 'Publikationen' },
  { num: '1,3', label: 'M.Sc.' },
]

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-label">Profil</div>

        <div className={styles.grid}>
          <div className={styles.text}>
            <p>
              M.Sc. Neuro- &amp; Verhaltensbiologie (Göttingen, 1,3). Ich brenne für{' '}
              <strong>komplexe Datenprobleme</strong> und bin tief begeistert von{' '}
              <strong>Künstlicher Intelligenz</strong> – nicht als Hype, sondern als echtes Werkzeug
              zur Vereinfachung meiner eigenen Arbeit und zur Wertschöpfung für Kunden und Teams.
            </p>
            <p>
              Mein Kernfokus:{' '}
              <strong>AI-Produkte entwerfen, implementieren und im laufenden Betrieb halten</strong>{' '}
              – in hybrider On-Prem/Cloud-Infrastruktur.
            </p>
            <p>
              Neben dem Code finde ich meinen Ausgleich in der Natur — mit der Kamera unterwegs,
              Momente festhalten, die meistens niemand sonst sieht.
            </p>
          </div>

          <div className={styles.sidebar}>
            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
