import { getPortfolio } from '@/lib/contentful';
import Nav from '@/components/Nav';
import ScrollProgress from '@/components/ScrollProgress';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default async function HomePage() {

  const { skills, projects, ...settings } = await getPortfolio();

  return (
    <>
      <ScrollProgress />
      <Nav
        name={settings.name}
        cvUrl={settings.cvUrl}
        showAbout={settings.showAbout}
        showSkills={settings.showSkills}
        showProjects={settings.showProjects}
        showContact={settings.showContact}
      />
      <main>
        <Hero settings={settings} />
        {settings.showAbout && <About summaryText={settings.summaryText} />}
        {settings.showSkills && <Skills skills={skills} />}
        {settings.showProjects && <Projects projects={projects} />}
        {settings.showContact && <Contact settings={settings} />}
      </main>
      <Footer name={settings.name} />
    </>
  );
}
