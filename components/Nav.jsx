import styles from './Nav.module.css';
import ThemeToggle from './ThemeToggle';

const ALL_LINKS = [
  { href: '#about', label: 'About', show: 'showAbout' },
  { href: '#skills', label: 'Skills', show: 'showSkills' },
  { href: '#work', label: 'Work', show: 'showProjects' },
  { href: '#contact', label: 'Contact', show: 'showContact' },
];

export default function Nav({
  name,
  cvUrl,
  showAbout = true,
  showSkills = true,
  showProjects = true,
  showContact = true,
}) {
  const visibility = { showAbout, showSkills, showProjects, showContact };
  const links = ALL_LINKS.filter((link) => visibility[link.show]);

  const initials = (name || 'GK')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  return (
    <header className={styles.nav}>
      <div className="container">
        <nav className={styles.inner}>
          <a href="#top" className={styles.logo}>
            <span>{initials.slice(0, 1)}</span>
            {initials.slice(1)}
          </a>
          <div className={styles.links}>
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div className={styles.actions}>
            <ThemeToggle />
            <a href={cvUrl} target="_blank" rel="noopener noreferrer" className={styles.cta}>
              Resume
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
