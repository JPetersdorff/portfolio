import styles from './TechStack.module.css'

const categories = [
  {
    label: 'AI / ML',
    tags: [
      { name: 'LLMs / GenAI', highlight: true },
      { name: 'RAG', highlight: true },
      { name: 'LangChain / LlamaIndex', highlight: true },
      { name: 'Prompt Engineering' },
      { name: 'Fine-Tuning' },
      { name: 'Embeddings' },
    ],
  },
  {
    label: 'Data Engineering',
    tags: [
      { name: 'Python', highlight: true },
      { name: 'SQL' },
      { name: 'dbt' },
      { name: 'Airflow' },
      { name: 'Pandas / Polars' },
      { name: 'R' },
    ],
  },
  {
    label: 'Infrastruktur',
    tags: [
      { name: 'Docker' },
      { name: 'Linux / On-Prem' },
      { name: 'Azure' },
      { name: 'Git / CI/CD' },
      { name: 'REST APIs' },
    ],
  },
  {
    label: 'Sonstiges',
    tags: [
      { name: 'Statistik' },
      { name: 'Wissenschaftliches Schreiben' },
      { name: 'React' },
      { name: 'JavaScript' },
    ],
  },
]

export default function TechStack() {
  return (
    <section id="stack">
      <div className="container">
        <div className="section-label">Tech Stack</div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <div key={cat.label} className={styles.category}>
              <div className={styles.catLabel}>{cat.label}</div>
              <div className={styles.tags}>
                {cat.tags.map((t) => (
                  <span key={t.name} className={`${styles.tag} ${t.highlight ? styles.hi : ''}`}>
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
