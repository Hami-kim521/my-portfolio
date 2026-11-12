import SkillsSection from '../components/skills/skills-section.jsx'
import HomeHero from '../components/HomeHero.jsx'
import Marquee from '../components/Marquee.jsx'
import Reveal from '../components/Reveal.jsx'
import ContactSection from '../components/contact/contact-section.jsx'
import ProjectsSection from '../components/projects/projects-section.jsx'
import HomeAboutSection from '../components/about/home-about-section.jsx'

export default function Home() {
  return (
    <>
      <HomeHero />
      <Marquee />
      <Reveal>
        <HomeAboutSection />
      </Reveal>
      <Reveal>
        <SkillsSection />
      </Reveal>
      <Reveal>
        <ProjectsSection />
      </Reveal>
      <Reveal>
        <ContactSection />
      </Reveal>
    </>
  )
}
