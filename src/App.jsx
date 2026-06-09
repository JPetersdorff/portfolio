import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import TechStack from './components/TechStack'
import Gallery from './components/Gallery'
import Contact from './components/Contact'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <TechStack />
        <Gallery />
        <Contact />
      </main>
    </>
  )
}

export default App
