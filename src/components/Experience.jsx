import styles from './Experience.module.css'

const jobs = [
  {
    company: 'MORE Holding GmbH',
    role: 'Data & AI Engineer',
    period: 'Dez 2024 – heute',
    tag: 'AI',
    bullets: [
      'Konzeption und Aufbau von RAG-basierten Produkten auf hybrider On-Prem/Cloud-Infrastruktur',
      'Entwicklung von LLM-Pipelines und Evaluationsframeworks für den Produktiveinsatz',
      'Implementierung von Datenplattform-Komponenten und MLOps-Workflows',
    ],
  },
  {
    company: 'Leibniz-Institut für Primatenforschung',
    role: 'Junior Wissenschaftler',
    period: '2022 – 2024',
    bullets: [
      'Statistische Modellierung von Verhaltens- und Biosignaldaten (R, Python)',
      'Automatisierte Auswertungspipelines für Langzeitmessungen',
      'Co-Autor zweier peer-reviewed Publikationen',
    ],
  },
  {
    company: 'Institute of Global Health',
    role: 'Junior Wissenschaftler',
    period: '2021 – 2022',
    bullets: [
      'Datenanalyse für epidemiologische Studien',
      'Visualisierungen und Reports für internationale Forschungspartner',
    ],
  },
  {
    company: 'Max-Planck-Institut für empirische Ästhetik',
    role: 'Junior Wissenschaftler',
    period: '2020 – 2021',
    bullets: [
      'Experimentdesign und Datenerhebung in der Wahrnehmungsforschung',
      'Auswertung und Präsentation von Studienergebnissen',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <div className="section-label">Berufserfahrung</div>

        <div className={styles.timeline}>
          {jobs.map((job, i) => (
            <div key={i} className={styles.job}>
              <div className={styles.dot} />
              <div className={styles.content}>
                <div className={styles.header}>
                  <div className={styles.company}>
                    {job.company}
                    {job.tag && <span className={styles.tag}>{job.tag}</span>}
                  </div>
                  <div className={styles.period}>{job.period}</div>
                </div>
                <div className={styles.role}>{job.role}</div>
                <ul className={styles.bullets}>
                  {job.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
