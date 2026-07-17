import { useState, useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import TechStack from './components/TechStack'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import ChatWidget from './components/ChatWidget'

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const sections = document.querySelectorAll('main section')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <>
      <Nav theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero />
        <About />
        <Experience />
        <TechStack />
        <Gallery />
        <Contact />
      </main>
      <ChatWidget />
    </>
  )
}

export default App
