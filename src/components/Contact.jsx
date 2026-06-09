import styles from './Contact.module.css'

const links = [
  {
    label: 'E-Mail',
    value: 'JPetersdorffcampen@gmail.com',
    href: 'mailto:JPetersdorffcampen@gmail.com',
  },
  { label: 'GitHub', value: 'JPetersdorff', href: 'https://github.com/JPetersdorff' },
]

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <div className="section-label">Kontakt</div>

        <h2 className={styles.headline}>Lass uns reden.</h2>
        <p className={styles.sub}>
          Interessantes Projekt, eine Frage oder einfach Hallo — <br className={styles.br} />
          ich freue mich auf die Nachricht.
        </p>

        <div className={styles.links}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className={styles.link} target="_blank" rel="noreferrer">
              <span className={styles.linkLabel}>{l.label}</span>
              <span className={styles.linkValue}>{l.value}</span>
            </a>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <span>© {new Date().getFullYear()} Jakob von Petersdorff</span>
        <span>Göttingen, Deutschland</span>
      </div>
    </section>
  )
}
