// Fallback content — used only if Contentful env vars are missing or a fetch
// fails, so the site never breaks. Mirrors the shape returned by lib/contentful.js.
// Once Contentful is seeded (see scripts/seed-contentful.mjs) this is not used
// in production, but keeps local dev working without credentials.

export const fallbackPortfolio = {
  isDefault: true,
  siteTitle: 'Gopikrishnan - SDE',
  metaDescription:
    'As a passionate software engineer with expertise in JavaScript frameworks like React and Next.js, I specialize in crafting interactive web applications that deliver engaging user experiences.',
  ogImageUrl: '/images/profile_picture.jpg',
  name: 'GOPIKRISHNAN',
  role: 'FRONT END DEVELOPER',
  phoneNo: '+917736531276',
  email: 'gopikrishnanrk1999@gmail.com',
  linkedinUrl: 'https://www.linkedin.com/in/gopikrishnan-rk-051999/',
  cvUrl: 'https://www.canva.com/design/DAGDDAccZMc/5GJLBkkA0PwQBMgQKuHxWQ/edit',
  profileImageUrl: '/images/profile_picture.jpg',
  summaryText:
    'As a Software Engineer with nearly three years of experience, specializing in JavaScript frameworks like React.js, Next.js, I am passionate about creating engaging and dynamic web experiences that thrive on the internet. I focus on the intersection of design and code to achieve a seamless online presence and am committed to continuously refining my skills to deliver cutting-edge web solutions that meet modern standards.',

  // Drives the hero pill's color (green/yellow/red) and label.
  availabilityStatus: 'green',
  availabilityText: 'Building web experiences',

  // The contact section's subtitle — kept in sync with availabilityText
  // when switching between "actively looking" / "not actively looking".
  contactSubtitle: "Always happy to connect and talk about web development — reach out anytime.",

  // Per-section visibility toggles — set any to false in Contentful to hide
  // that section (and its nav link) without touching code.
  showAbout: true,
  showSkills: true,
  showProjects: true,
  showContact: true,

  // Array order is display order — no separate "order" field needed.
  skills: [
    'HTML', 'CSS', 'Sass', 'JavaScript', 'TypeScript', 'Next.js', 'React.js',
    'Redux', 'React Query', 'Zustand', 'CI/CD', 'Git', 'Stripe Integration',
  ],

  projects: [
    {
      title: 'VISION TRADING APP',
      imageUrl: '/images/projects/vision_project.jpeg',
      url: '',
      description:
        'Vision is a trading assistance platform which fetches data from polygon.io to plot charts using svg rendering. Users can draw shapes and tools on the chart for better understanding about the chart trends.',
      technologies: ['React', 'Redux', 'React Stockcharts', 'Enhancement', 'Troubleshooting'],
      points: [
        'Added infinity scroll functionality for stock searches, allowing for continuous data fetching and storage.',
        'Conducted research and development on Renko chart types.',
        'Addressed bug fixes, including issues with displaying invalid chat times and the color picker.',
      ],
    },
    {
      title: 'PROJECT MANAGEMENT TOOL',
      imageUrl: '/images/projects/clickup_pms.png',
      url: '',
      description:
        'The Project Management Tool is specifically crafted to aid individuals or teams in efficiently managing their projects and tasks. Its intuitive interface and comprehensive features ensure streamlined project oversight and task organization for enhanced productivity and project success.',
      technologies: ['React', 'Redux', 'Thunk', 'Enhancement', 'Troubleshooting'],
      points: [
        'Tool constructed with React.js',
        'Implemented CRUD operations for cron jobs at various intervals (hourly, daily, monthly, yearly)',
        'Developed CRUD functionality for users, clients, and project documents.',
      ],
    },
    {
      title: 'ORMA PROJECT',
      imageUrl: '/images/projects/orma_app.png',
      url: 'https://www.orma.app',
      description:
        'The project encompasses distinct administrative and user interfaces. The administrative interface facilitates the management of user payments, user accounts, and website links, while the user interface allows users to select their preferred plan.',
      technologies: ['React', 'Redux', 'Payment Integration', 'Build from scratch'],
      points: [
        'Utilized Redux for state management, enabling predictable and efficient state handling.',
        'Integrated Apple Pay, Google Pay and card payments, using Stripe, improving transaction efficiency and user experience.',
        'Managed VIP user roles, handling specific requirements and privileges for enhanced user differentiation.',
        'Implemented the profile details section, ensuring accurate user information management.',
        'Developed a transaction list page, including functionality for invoice downloads to improve user transaction tracking.',
      ],
    },
    {
      title: 'ENTERPRISE RESOURCE PLANNING (ERP) TOOL',
      imageUrl: '/images/projects/erpv2_dashboard.png',
      url: '',
      description: 'An ERP tool designed to manage employees, interviews, leaves, and other HR-related tasks.',
      technologies: ['Revamp', 'React', 'Zustand'],
      points: [
        'Oversaw the Interview section, including the administration of interview processes and result management.',
        'Implemented a comprehensive permission module to control access and enhance security across the project.',
        'Managed the asset module, overseeing asset allocation and optimizing asset tracking processes.',
        'Leveraged Zustand for state management, ensuring efficient and scalable application state handling.',
      ],
    },
    {
      title: "HERO'S SAVINGS VAULT",
      imageUrl: '/images/projects/military_app.png',
      url: 'https://herossavingsvault.com',
      description:
        "Hero's Savings Vault provides a robust administrative interface for managing customer accounts and implementing exclusive offers and partnerships for military personnel. It serves as a dedicated platform for current and former military employees to access savings opportunities.",
      technologies: ['Build from scratch', 'React', 'Redux', 'Optimization'],
      points: [
        'Worked on the login page and admin profile view.',
        'Completed the initial setup of the project, including routing and layout settings.',
        'Created common listing components and a common modal structure.',
      ],
    },
    {
      title: 'PROPOSAL MANAGEMENT TOOL',
      imageUrl: '/images/projects/proposal_portfolio_pms.png',
      url: '',
      description:
        'The Proposal Management Tool enhances the efficiency of project proposal creation by providing advanced features for editing each project feature. Additionally, it empowers users with the capability to generate downloadable final documents in PDF format.',
      technologies: ['React', 'Redux', 'Enhancement', 'Maintenance'],
      points: [
        'Established a connection with the project management tool. Each feature from a proposal, along with its technology category and estimation hours, was added to the project management tool as a ticket.',
        'Implemented proposal feature editing, including moving features between modules and adjusting estimation hours.',
      ],
    },
  ],
};
