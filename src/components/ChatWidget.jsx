import { useState, useRef, useEffect } from 'react'
import { getSessionToken } from '../utils/chatSession'
import styles from './ChatWidget.module.css'

const UNAVAILABLE_MESSAGE =
  'Der Chatbot macht gerade eine Pause. Schau später nochmal vorbei oder schreib mir direkt eine Nachricht.'
const RATE_LIMITED_MESSAGE =
  'Du hast das Tageslimit an Nachrichten erreicht. Versuch es morgen nochmal.'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [notice, setNotice] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, notice])

  async function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || pending) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setNotice(null)
    setPending(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: getSessionToken(), messages: nextMessages }),
      })

      if (response.status === 429) {
        setNotice(RATE_LIMITED_MESSAGE)
        return
      }
      if (!response.ok) {
        setNotice(UNAVAILABLE_MESSAGE)
        return
      }

      const data = await response.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setNotice(UNAVAILABLE_MESSAGE)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className={styles.widget}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <span>Frag mich etwas</span>
            <button
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Chat schließen"
            >
              ×
            </button>
          </div>

          <div className={styles.list} ref={listRef}>
            {messages.length === 0 && !notice && (
              <p className={styles.hint}>
                Frag mich etwas über meine Karriere, meine Skills oder Projekte.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? styles.userMsg : styles.botMsg}>
                {m.content}
              </div>
            ))}
            {notice && <div className={styles.notice}>{notice}</div>}
            {pending && <div className={styles.botMsg}>…</div>}
          </div>

          <form className={styles.form} onSubmit={sendMessage}>
            <input
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Deine Frage..."
              disabled={pending}
            />
            <button className={styles.send} type="submit" disabled={pending || !input.trim()}>
              Senden
            </button>
          </form>
        </div>
      )}

      <button
        className={styles.bubble}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Chat schließen' : 'Chat öffnen'}
      >
        {open ? '×' : '💬'}
      </button>
    </div>
  )
}
